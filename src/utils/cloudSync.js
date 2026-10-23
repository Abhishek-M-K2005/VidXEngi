/**
 * Verilog Quest 2026 - Real-Time Cloud Team Synchronization
 * 
 * Ensures teams added/deleted by Admin on Render are instantly 
 * reflected across ALL participant devices and browser tabs in real time.
 */

const SYNC_TOPIC = 'vidxengi_vq26_teams_hub';
const SYNC_URL = `https://ntfy.sh/${SYNC_TOPIC}`;

export const normalizeTeam = (t) => {
  if (!t || typeof t !== 'object') return null;
  return {
    id: t.id || `team_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: t.name || 'Team Profile',
    callsign: t.callsign || t.name || 'T00',
    college: t.college || 'Engineering Institute',
    members: Array.isArray(t.members) ? t.members : [],
    passcode: t.passcode ? String(t.passcode) : '',
    solvedPuzzles: Array.isArray(t.solvedPuzzles) ? t.solvedPuzzles : [],
    puzzleSolveTimestamps: (t.puzzleSolveTimestamps && typeof t.puzzleSolveTimestamps === 'object') ? t.puzzleSolveTimestamps : {},
    penaltyMinutes: typeof t.penaltyMinutes === 'number' ? t.penaltyMinutes : 0,
    score: typeof t.score === 'number' ? t.score : 0,
    avatarSeed: t.avatarSeed || 'CORE',
    lastActive: typeof t.lastActive === 'number' ? t.lastActive : Date.now(),
    completedAllAt: t.completedAllAt || null,
    lastIp: t.lastIp || null,
    networkOrg: t.networkOrg || null,
    ipHistory: Array.isArray(t.ipHistory) ? t.ipHistory : [],
    isAdmin: Boolean(t.isAdmin)
  };
};

export const normalizeTeams = (teams) => {
  if (!Array.isArray(teams)) return [];
  return teams.map(normalizeTeam).filter(Boolean);
};

class CloudSyncManager {
  constructor() {
    this.eventSource = null;
    this.listeners = new Set();
    this.lastSyncTimestamp = 0;
    this.lastTeamsHash = '';
    this.isConnected = false;
  }

  /**
   * Compute a simple hash/signature of the teams array to prevent redundant re-renders
   */
  getTeamsSignature(teams) {
    if (!Array.isArray(teams)) return '';
    return teams.map((t) => `${t.id}:${t.name}:${t.passcode || ''}:${(t.solvedPuzzles || []).length}`).join('|');
  }

  /**
   * Publish updated teams to the cloud so all other devices receive them
   */
  async publishTeams(teams) {
    const cleanTeams = normalizeTeams(teams);
    const now = Date.now();
    this.lastSyncTimestamp = now;
    this.lastTeamsHash = this.getTeamsSignature(cleanTeams);

    const payload = {
      type: 'TEAMS_UPDATE',
      source: 'ADMIN_PROVISION',
      timestamp: now,
      teams: cleanTeams
    };

    try {
      if (typeof window !== 'undefined' && typeof fetch === 'function') {
        await fetch(SYNC_URL, {
          method: 'POST',
          headers: {
            'Title': 'Verilog Quest Teams Update',
            'Priority': 'urgent'
          },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.warn('[CloudSync] Publish to cloud relay failed, saved to local storage:', err);
    }
  }

  /**
   * Fetch the latest teams list from the cloud cache on initial load
   */
  async fetchLatestTeams() {
    try {
      if (typeof window === 'undefined' || typeof fetch !== 'function') return null;

      const response = await fetch(`${SYNC_URL}/json?poll=1&since=all`, {
        cache: 'no-cache'
      });

      if (!response.ok) return null;

      const text = await response.text();
      if (!text || !text.trim()) return null;

      // ntfy /json returns newline-delimited JSON messages (JSON Lines)
      const lines = text.trim().split('\n').filter(Boolean);
      // Process newest messages first
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          if (item && item.message) {
            const body = JSON.parse(item.message);
            if (body && body.type === 'TEAMS_UPDATE' && Array.isArray(body.teams)) {
              const cleanTeams = normalizeTeams(body.teams);
              this.lastSyncTimestamp = body.timestamp || Date.now();
              this.lastTeamsHash = this.getTeamsSignature(cleanTeams);
              return cleanTeams;
            }
          }
        } catch {
          // ignore corrupted lines
        }
      }
    } catch (err) {
      console.warn('[CloudSync] Fetching cloud teams failed, using local storage cache:', err);
    }
    return null;
  }

  /**
   * Subscribe to real-time team additions and modifications via Server-Sent Events (SSE)
   */
  subscribe(onTeamsUpdated) {
    this.listeners.add(onTeamsUpdated);

    if (!this.eventSource && typeof window !== 'undefined' && 'EventSource' in window) {
      try {
        this.eventSource = new EventSource(`${SYNC_URL}/sse?since=all`);
        
        this.eventSource.onopen = () => {
          this.isConnected = true;
        };

        this.eventSource.onmessage = (event) => {
          try {
            if (!event.data) return;
            const item = JSON.parse(event.data);
            if (item && item.message) {
              const body = JSON.parse(item.message);
              if (body && body.type === 'TEAMS_UPDATE' && Array.isArray(body.teams)) {
                const incomingClean = normalizeTeams(body.teams);
                const incomingHash = this.getTeamsSignature(incomingClean);
                // Avoid redundant updates if hash matches what we already published
                if (incomingHash !== this.lastTeamsHash) {
                  this.lastTeamsHash = incomingHash;
                  this.lastSyncTimestamp = body.timestamp || Date.now();
                  this.listeners.forEach((callback) => {
                    try {
                      callback(incomingClean);
                    } catch (e) {
                      console.error('[CloudSync] Listener error:', e);
                    }
                  });
                }
              }
            }
          } catch {
            // ignore malformed messages
          }
        };

        this.eventSource.onerror = () => {
          this.isConnected = false;
        };
      } catch (err) {
        console.warn('[CloudSync] Real-time SSE subscription failed:', err);
      }
    }

    return () => {
      this.listeners.delete(onTeamsUpdated);
      if (this.listeners.size === 0 && this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
        this.isConnected = false;
      }
    };
  }
}

export const cloudSync = new CloudSyncManager();
