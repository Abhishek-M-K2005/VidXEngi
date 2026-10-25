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
    name: t.name || t.n || 'Team Profile',
    callsign: t.callsign || t.c || t.name || t.n || 'T00',
    college: t.college || t.col || 'Engineering Institute',
    members: Array.isArray(t.members || t.m) ? (t.members || t.m) : [],
    passcode: t.passcode ? String(t.passcode) : (t.p ? String(t.p) : ''),
    solvedPuzzles: Array.isArray(t.solvedPuzzles || t.s) ? (t.solvedPuzzles || t.s) : [],
    puzzleSolveTimestamps: (t.puzzleSolveTimestamps || t.ts) && typeof (t.puzzleSolveTimestamps || t.ts) === 'object' ? (t.puzzleSolveTimestamps || t.ts) : {},
    penaltyMinutes: typeof (t.penaltyMinutes ?? t.pen) === 'number' ? (t.penaltyMinutes ?? t.pen) : 0,
    score: typeof (t.score ?? t.sc) === 'number' ? (t.score ?? t.sc) : 0,
    avatarSeed: t.avatarSeed || t.a || 'CORE',
    lastActive: typeof t.lastActive === 'number' ? t.lastActive : Date.now(),
    completedAllAt: t.completedAllAt || t.fin || null,
    lastIp: t.lastIp || null,
    networkOrg: t.networkOrg || null,
    ipHistory: Array.isArray(t.ipHistory) ? t.ipHistory : [],
    isAdmin: Boolean(t.isAdmin)
  };
};

export const compactTeam = (t) => {
  if (!t || typeof t !== 'object') return null;
  const c = {
    id: t.id,
    n: t.name,
    c: t.callsign || t.name,
    col: t.college,
    p: t.passcode,
    a: t.avatarSeed || 'CORE'
  };
  if (Array.isArray(t.members) && t.members.length > 0) c.m = t.members;
  if (Array.isArray(t.solvedPuzzles) && t.solvedPuzzles.length > 0) c.s = t.solvedPuzzles;
  if (t.puzzleSolveTimestamps && Object.keys(t.puzzleSolveTimestamps).length > 0) c.ts = t.puzzleSolveTimestamps;
  if (t.penaltyMinutes) c.pen = t.penaltyMinutes;
  if (t.score) c.sc = t.score;
  if (t.completedAllAt) c.fin = t.completedAllAt;
  return c;
};

export const deduplicateTeamsByName = (teams) => {
  if (!Array.isArray(teams)) return [];
  const nameSeen = new Map();
  const deduplicated = [];
  for (const t of teams) {
    if (!t) continue;
    const normName = (t.name || '').trim().toLowerCase();
    if (!normName) {
      deduplicated.push(t);
      continue;
    }
    if (nameSeen.has(normName)) {
      const existing = nameSeen.get(normName);
      existing.solvedPuzzles = Array.from(new Set([...(existing.solvedPuzzles || []), ...(t.solvedPuzzles || [])])).sort((a, b) => a - b);
      existing.score = Math.max(existing.score || 0, t.score || 0);
      existing.penaltyMinutes = Math.max(existing.penaltyMinutes || 0, t.penaltyMinutes || 0);
      existing.puzzleSolveTimestamps = { ...(existing.puzzleSolveTimestamps || {}), ...(t.puzzleSolveTimestamps || {}) };
      existing.lastActive = Math.max(existing.lastActive || 0, t.lastActive || 0);
    } else {
      nameSeen.set(normName, t);
      deduplicated.push(t);
    }
  }
  return deduplicated;
};

export const normalizeTeams = (teams) => {
  if (!Array.isArray(teams)) return [];
  const normalized = teams.map(normalizeTeam).filter(Boolean);
  return deduplicateTeamsByName(normalized);
};

export const mergeTeams = (localTeams, incomingTeams, source = 'SYNC') => {
  if (!Array.isArray(incomingTeams) || incomingTeams.length === 0) {
    if (source === 'ADMIN_CLEAR') return [];
    return deduplicateTeamsByName(localTeams || []);
  }
  if (!Array.isArray(localTeams) || localTeams.length === 0) {
    return deduplicateTeamsByName(incomingTeams);
  }

  // 1. Strict Authoritative Deletions: Only explicit ADMIN_CLEAR or ADMIN_DELETE can reduce the roster
  if (source === 'ADMIN_CLEAR') {
    return [];
  }
  if (source === 'ADMIN_DELETE') {
    return deduplicateTeamsByName(incomingTeams);
  }

  // 2. Full Union Merge: For all other events (TEAM_SOLVE, TEAM_HINT, ADMIN_PROVISION, SYNC, INITIAL_FETCH),
  // NEVER drop any team! If a client with 12 teams sends a solve, the other 11 teams locally MUST be preserved!
  const localMap = new Map(localTeams.map((t) => [t.id, t]));
  const incomingMap = new Map(incomingTeams.map((t) => [t.id, t]));
  const allIds = new Set([...localMap.keys(), ...incomingMap.keys()]);
  const merged = [];

  for (const id of allIds) {
    const loc = localMap.get(id);
    const inc = incomingMap.get(id);

    if (loc && !inc) {
      // Team exists locally but missing in incoming message -> KEEP IT!
      merged.push(loc);
      continue;
    }

    if (!loc && inc) {
      // New team from peer or admin -> ADD IT!
      merged.push(inc);
      continue;
    }

    // Team exists in both: merge progress, scores, timestamps safely
    const locSolved = Array.isArray(loc.solvedPuzzles) ? loc.solvedPuzzles : [];
    const incSolved = Array.isArray(inc.solvedPuzzles) ? inc.solvedPuzzles : [];
    const combinedSolved = Array.from(new Set([...locSolved, ...incSolved])).sort((a, b) => a - b);

    const combinedTimestamps = {
      ...(loc.puzzleSolveTimestamps || {}),
      ...(inc.puzzleSolveTimestamps || {})
    };

    let completedAllAt = null;
    if (combinedSolved.length === 5) {
      const candidates = [loc.completedAllAt, inc.completedAllAt].filter(Boolean);
      completedAllAt = candidates.length > 0 ? Math.min(...candidates) : Date.now();
    }

    const maxScore = Math.max(loc.score || 0, inc.score || 0);
    const maxPenalty = Math.max(loc.penaltyMinutes || 0, inc.penaltyMinutes || 0);

    merged.push({
      ...inc,
      name: inc.name || loc.name,
      callsign: inc.callsign || loc.callsign || inc.name || loc.name,
      college: inc.college || loc.college,
      passcode: inc.passcode || loc.passcode,
      members: (inc.members && inc.members.length > 0) ? inc.members : (loc.members || []),
      avatarSeed: inc.avatarSeed || loc.avatarSeed || 'CORE',
      solvedPuzzles: combinedSolved,
      puzzleSolveTimestamps: combinedTimestamps,
      score: maxScore,
      penaltyMinutes: maxPenalty,
      completedAllAt: completedAllAt || inc.completedAllAt || loc.completedAllAt,
      lastActive: Math.max(loc.lastActive || 0, inc.lastActive || 0),
      lastIp: inc.lastIp || loc.lastIp,
      networkOrg: inc.networkOrg || loc.networkOrg,
      ipHistory: Array.from(new Set([...(loc.ipHistory || []), ...(inc.ipHistory || [])]))
    });
  }

  // Enforce global uniqueness across all merged records
  return deduplicateTeamsByName(merged);
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
    return teams.map((t) => 
      `${t.id}:${t.name}:${t.passcode || ''}:${(t.solvedPuzzles || []).join(',')}:${t.score || 0}:${t.penaltyMinutes || 0}:${t.completedAllAt || 0}`
    ).join('|');
  }

  /**
   * Helper to parse payload from either inline JSON message or ntfy attachment
   */
  async parseItemBody(item) {
    if (!item) return null;
    // 1. If payload was > 4KB, ntfy converts it to an attachment URL
    if (item.attachment && item.attachment.url) {
      try {
        const fileRes = await fetch(item.attachment.url, { cache: 'no-cache' });
        if (fileRes.ok) {
          const data = await fileRes.json();
          return data;
        }
      } catch (err) {
        console.warn('[CloudSync] Failed to fetch attachment payload:', err);
      }
    }
    // 2. Otherwise parse inline JSON message
    if (item.message && typeof item.message === 'string') {
      try {
        return JSON.parse(item.message);
      } catch {
        // Plain text notification or non-JSON
        return null;
      }
    }
    return null;
  }

  /**
   * Publish updated teams to the cloud so all other devices receive them
   */
  async publishTeams(teams, metadata = {}) {
    const cleanTeams = normalizeTeams(teams);
    const compactTeams = cleanTeams.map(compactTeam).filter(Boolean);
    const now = Date.now();
    this.lastSyncTimestamp = now;
    this.lastTeamsHash = this.getTeamsSignature(cleanTeams);

    const payload = {
      type: 'TEAMS_UPDATE',
      source: metadata.source || 'ADMIN_PROVISION',
      teamId: metadata.teamId || null,
      teamName: metadata.teamName || null,
      puzzleId: metadata.puzzleId || null,
      puzzleTitle: metadata.puzzleTitle || null,
      points: metadata.points || null,
      isAllSolved: Boolean(metadata.isAllSolved),
      timestamp: now,
      teams: compactTeams
    };

    try {
      if (typeof window !== 'undefined' && typeof fetch === 'function') {
        await fetch(SYNC_URL, {
          method: 'POST',
          headers: {
            'Title': metadata.source === 'TEAM_SOLVE' ? 'Contest Solve Event' : 'Verilog Quest Teams Update',
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
      let aggregatedTeams = [];
      let scanned = 0;

      // Process newest messages backwards and union them so outdated messages never mask the roster
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          const body = await this.parseItemBody(item);

          if (body && body.type === 'TEAMS_UPDATE' && Array.isArray(body.teams)) {
            const cleanTeams = normalizeTeams(body.teams);
            scanned++;

            // Explicit Admin clear stops backward merge
            if (body.source === 'ADMIN_CLEAR') {
              aggregatedTeams = [];
              break;
            }
            if (body.source === 'ADMIN_DELETE') {
              aggregatedTeams = cleanTeams;
              break;
            }

            // Union merge with aggregated snapshot
            aggregatedTeams = mergeTeams(aggregatedTeams, cleanTeams, body.source);

            // Once we have processed the latest authoritative snapshots, stop
            if (scanned >= 10 && aggregatedTeams.length > 0) {
              break;
            }
          }
        } catch {
          // ignore corrupted lines
        }
      }

      if (aggregatedTeams.length > 0) {
        this.lastSyncTimestamp = Date.now();
        this.lastTeamsHash = this.getTeamsSignature(aggregatedTeams);
        return aggregatedTeams;
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

        this.eventSource.onmessage = async (event) => {
          try {
            if (!event.data) return;
            const item = JSON.parse(event.data);
            const body = await this.parseItemBody(item);

            if (body && body.type === 'TEAMS_UPDATE' && Array.isArray(body.teams)) {
              const incomingClean = normalizeTeams(body.teams);
              const incomingHash = this.getTeamsSignature(incomingClean);
              // Avoid redundant updates if hash matches what we already published
              if (incomingHash !== this.lastTeamsHash) {
                this.lastTeamsHash = incomingHash;
                this.lastSyncTimestamp = body.timestamp || Date.now();
                this.listeners.forEach((callback) => {
                  try {
                    callback(incomingClean, body);
                  } catch (e) {
                    console.error('[CloudSync] Listener error:', e);
                  }
                });
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
