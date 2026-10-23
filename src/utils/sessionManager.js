/**
 * Verilog Quest 2026 - Single Active Session Manager
 * 
 * Enforces strict single-device / single-tab authentication per team.
 * No multiple logins are permitted at any instance.
 * 
 * Architecture:
 * - Tab ID: Unique per browser tab/window (sessionStorage)
 * - Device ID: Unique per browser client/profile (localStorage)
 * - Session ID: Unique token generated per login instance
 * - Real-Time Inter-Tab Sync: BroadcastChannel API + Window Storage Events
 * - Cross-Device Real-Time Sync: Cloud PubSub Relay (EventSource / SSE)
 * - Heartbeat Verifier: Periodically monitors active token validity
 * - Immediate Cleanup: beforeunload event listener
 */

const STORAGE_KEY_ACTIVE_SESSION = 'vq_active_session';
const STORAGE_KEY_TEAM_SESSIONS = 'vq_team_sessions';
const STORAGE_KEY_DEVICE_ID = 'vq_device_id';
const CHANNEL_NAME = 'vq_session_integrity_channel';
const CLOUD_SYNC_URL = 'https://ntfy.sh/vidxengi_vq26_security_stream';

import { getCachedClientIp, getCachedNetworkOrg } from './networkIp';

// Generate or retrieve persistent Device ID
export const getDeviceId = () => {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
  if (!deviceId) {
    deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY_DEVICE_ID, deviceId);
  }
  return deviceId;
};

// Generate or retrieve Tab ID (scoped strictly to this tab/window)
export const getTabId = () => {
  if (typeof window === 'undefined') return 'server';
  let tabId = sessionStorage.getItem('vq_tab_id');
  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem('vq_tab_id', tabId);
  }
  return tabId;
};

// Friendly device label
export const getDeviceLabel = () => {
  if (typeof window === 'undefined') return 'Unknown Client';
  const ua = navigator.userAgent;
  let browser = 'Browser';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Desktop';
  if (navigator.platform.includes('Mac') || ua.includes('Macintosh')) os = 'macOS';
  else if (navigator.platform.includes('Win')) os = 'Windows';
  else if (navigator.platform.includes('Linux')) os = 'Linux';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';

  return `${browser} on ${os}`;
};

class SessionManager {
  constructor() {
    this.tabId = getTabId();
    this.deviceId = getDeviceId();
    this.deviceLabel = getDeviceLabel();
    this.currentSessionId = null;
    this.currentTeamId = null;
    this.listeners = new Set();
    this.channel = null;
    this.eventSource = null;
    this.heartbeatTimer = null;
    this.concurrencyCollisionCount = 0;
    this.remoteSessions = {};

    if (typeof window !== 'undefined') {
      this.initChannel();
      this.initCloudSync();
      this.initStorageListener();
      this.initUnloadListener();
      this.startHeartbeat();
    }
  }

  initChannel() {
    try {
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.handleChannelMessage(event.data);
        };
      }
    } catch (e) {
      console.warn('[SessionManager] BroadcastChannel unavailable, relying on storage events', e);
    }
  }

  initCloudSync() {
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        this.eventSource = new EventSource(`${CLOUD_SYNC_URL}/sse`);
        this.eventSource.onmessage = (event) => {
          try {
            if (!event.data) return;
            const parsed = JSON.parse(event.data);
            // ntfy wraps message payload inside event.message or directly
            const payload = parsed.message ? JSON.parse(parsed.message) : parsed;
            this.handleNetworkMessage(payload);
          } catch {}
        };
        this.eventSource.onerror = () => {
          // Graceful fallback: local BroadcastChannel continues to enforce single-tab
        };
      }
    } catch (e) {
      console.warn('[SessionManager] Cloud sync SSE unavailable', e);
    }
  }

  initStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY_ACTIVE_SESSION || e.key === STORAGE_KEY_TEAM_SESSIONS) {
        this.verifyCurrentSession();
      }
    });
  }

  initUnloadListener() {
    window.addEventListener('beforeunload', () => {
      if (this.currentTeamId && this.currentSessionId) {
        this.releaseSession(this.currentTeamId);
      }
    });
  }

  broadcastNetwork(data) {
    try {
      if (typeof window !== 'undefined' && typeof fetch === 'function') {
        fetch(CLOUD_SYNC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          mode: 'no-cors'
        }).catch(() => {});
      }
    } catch {}
  }

  handleNetworkMessage(data) {
    if (!data || !data.teamId) return;

    if (data.type === 'SESSION_CLAIMED') {
      // Record remote active session
      this.remoteSessions[data.teamId] = {
        ...data,
        lastHeartbeat: Date.now()
      };

      // If another terminal claimed OUR active team profile:
      if (this.currentTeamId && data.teamId === this.currentTeamId) {
        if (data.deviceId !== this.deviceId || data.sessionId !== this.currentSessionId) {
          this.concurrencyCollisionCount++;
          this.notifyTerminated({
            reason: 'CONCURRENT_LOGIN_DETECTED',
            bySessionId: data.sessionId,
            byTabId: data.tabId,
            byDevice: data.deviceLabel || 'Another Device',
            timestamp: data.timestamp || Date.now()
          });
        }
      }
    } else if (data.type === 'SESSION_RELEASED' || data.type === 'SESSION_RESET') {
      delete this.remoteSessions[data.teamId];
    } else if (data.type === 'HEARTBEAT') {
      if (this.remoteSessions[data.teamId]) {
        this.remoteSessions[data.teamId].lastHeartbeat = Date.now();
      }
    }
  }

  handleChannelMessage(data) {
    if (!data) return;

    // Another tab/device has claimed the session for our team!
    if (data.type === 'SESSION_CLAIMED' && data.teamId === this.currentTeamId) {
      if (data.tabId !== this.tabId || data.sessionId !== this.currentSessionId) {
        this.concurrencyCollisionCount++;
        this.notifyTerminated({
          reason: 'CONCURRENT_LOGIN_DETECTED',
          bySessionId: data.sessionId,
          byTabId: data.tabId,
          byDevice: data.deviceLabel || 'Another Browser Tab',
          timestamp: data.timestamp || Date.now()
        });
      }
    } else if (data.type === 'SESSION_RELEASED' && data.teamId === this.currentTeamId) {
      // Local tab released
    } else if (data.type === 'QUERY_ACTIVE_SESSION' && data.teamId === this.currentTeamId) {
      if (this.currentSessionId && this.channel) {
        this.channel.postMessage({
          type: 'SESSION_ALIVE',
          teamId: this.currentTeamId,
          sessionId: this.currentSessionId,
          tabId: this.tabId,
          deviceId: this.deviceId,
          deviceLabel: this.deviceLabel,
          timestamp: Date.now()
        });
      }
    }
  }

  // Check if session in localStorage is still ours
  verifyCurrentSession() {
    if (!this.currentTeamId || !this.currentSessionId) return;

    try {
      const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
      if (allSessionsRaw) {
        const allSessions = JSON.parse(allSessionsRaw);
        const teamSession = allSessions[this.currentTeamId];

        if (teamSession && teamSession.sessionId !== this.currentSessionId) {
          // Token mismatch: someone took over our session!
          this.concurrencyCollisionCount++;
          this.notifyTerminated({
            reason: 'SESSION_SUPERSEDED',
            bySessionId: teamSession.sessionId,
            byTabId: teamSession.tabId,
            byDevice: teamSession.deviceLabel || 'Another Terminal',
            timestamp: teamSession.loginTime || Date.now()
          });
        }
      }
    } catch (e) {
      console.error('[SessionManager] Error verifying session', e);
    }
  }

  startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.currentTeamId && this.currentSessionId) {
        this.updateHeartbeat();
        this.verifyCurrentSession();
      }
    }, 2000);
  }

  updateHeartbeat() {
    if (!this.currentTeamId || !this.currentSessionId) return;
    try {
      const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
      const allSessions = allSessionsRaw ? JSON.parse(allSessionsRaw) : {};
      if (allSessions[this.currentTeamId] && allSessions[this.currentTeamId].sessionId === this.currentSessionId) {
        allSessions[this.currentTeamId].lastHeartbeat = Date.now();
        localStorage.setItem(STORAGE_KEY_TEAM_SESSIONS, JSON.stringify(allSessions));
      }
    } catch {}

    // Network heartbeat every ~6 seconds
    if (Math.random() < 0.35) {
      this.broadcastNetwork({
        type: 'HEARTBEAT',
        teamId: this.currentTeamId,
        sessionId: this.currentSessionId,
        deviceId: this.deviceId,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Register a new active login session on this tab.
   * Enforces single active session across all tabs and devices.
   */
  registerSession(teamId) {
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const clientIp = getCachedClientIp();
    const networkOrg = getCachedNetworkOrg();

    const sessionData = {
      teamId,
      sessionId: newSessionId,
      tabId: this.tabId,
      deviceId: this.deviceId,
      deviceLabel: this.deviceLabel,
      clientIp,
      networkOrg,
      loginTime: Date.now(),
      lastHeartbeat: Date.now()
    };

    this.currentTeamId = teamId;
    this.currentSessionId = newSessionId;

    // Save to tab session storage
    sessionStorage.setItem('vq_current_session_id', newSessionId);
    sessionStorage.setItem('vq_current_team_id', teamId);

    // Save to global localStorage
    localStorage.setItem(STORAGE_KEY_ACTIVE_SESSION, JSON.stringify(sessionData));

    try {
      const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
      const allSessions = allSessionsRaw ? JSON.parse(allSessionsRaw) : {};
      allSessions[teamId] = sessionData;
      localStorage.setItem(STORAGE_KEY_TEAM_SESSIONS, JSON.stringify(allSessions));
    } catch (e) {
      console.error('[SessionManager] Failed to update team sessions registry', e);
    }

    // Broadcast CLAIM locally to any other tab immediately
    if (this.channel) {
      this.channel.postMessage({
        type: 'SESSION_CLAIMED',
        ...sessionData
      });
    }

    // Broadcast CLAIM over network to other devices
    this.broadcastNetwork({
      type: 'SESSION_CLAIMED',
      ...sessionData
    });

    return sessionData;
  }

  /**
   * Query if an active session already exists for this team in another tab or device.
   */
  getActiveSession(teamId) {
    if (!teamId) return null;
    const now = Date.now();

    // 1. Local session check (inter-tab on this machine)
    try {
      const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
      if (allSessionsRaw) {
        const allSessions = JSON.parse(allSessionsRaw);
        const session = allSessions[teamId];
        if (session) {
          // Heartbeat timeout: if inactive for > 15 seconds, consider expired
          const isAlive = (now - (session.lastHeartbeat || session.loginTime)) < 15000;
          if (isAlive) return session;
        }
      }
    } catch {}

    // 2. Remote session check (cross-device across the network)
    const remote = this.remoteSessions[teamId];
    if (remote) {
      const isAlive = (now - (remote.lastHeartbeat || remote.loginTime || remote.timestamp || 0)) < 25000;
      if (isAlive) return remote;
      delete this.remoteSessions[teamId];
    }

    return null;
  }

  /**
   * Check if this tab is the authorized owner of the session.
   */
  isCurrentTabOwner(teamId) {
    if (!teamId) return false;
    const session = this.getActiveSession(teamId);
    if (!session) return true; // No session exists yet
    return session.tabId === this.tabId && session.sessionId === this.currentSessionId;
  }

  /**
   * Disconnect / Logout session
   */
  releaseSession(teamId) {
    if (this.currentTeamId === teamId || !teamId) {
      const idToRelease = teamId || this.currentTeamId;
      this.currentTeamId = null;
      this.currentSessionId = null;
      sessionStorage.removeItem('vq_current_session_id');
      sessionStorage.removeItem('vq_current_team_id');

      try {
        const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
        if (allSessionsRaw) {
          const allSessions = JSON.parse(allSessionsRaw);
          delete allSessions[idToRelease];
          localStorage.setItem(STORAGE_KEY_TEAM_SESSIONS, JSON.stringify(allSessions));
        }
      } catch {}

      if (this.channel) {
        this.channel.postMessage({
          type: 'SESSION_RELEASED',
          teamId: idToRelease,
          tabId: this.tabId,
          deviceId: this.deviceId
        });
      }

      this.broadcastNetwork({
        type: 'SESSION_RELEASED',
        teamId: idToRelease,
        tabId: this.tabId,
        deviceId: this.deviceId
      });
    }
  }

  /**
   * Admin Force Reset: Clears session locks for a team everywhere
   */
  forceResetTeamSession(teamId) {
    try {
      const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
      if (allSessionsRaw) {
        const allSessions = JSON.parse(allSessionsRaw);
        delete allSessions[teamId];
        localStorage.setItem(STORAGE_KEY_TEAM_SESSIONS, JSON.stringify(allSessions));
      }
    } catch {}

    delete this.remoteSessions[teamId];

    if (this.channel) {
      this.channel.postMessage({
        type: 'SESSION_RESET',
        teamId,
        byAdmin: true
      });
    }

    this.broadcastNetwork({
      type: 'SESSION_RESET',
      teamId,
      byAdmin: true
    });
  }

  /**
   * Subscribe to session termination / displacement events.
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyTerminated(payload) {
    this.currentSessionId = null;
    this.currentTeamId = null;
    sessionStorage.removeItem('vq_current_session_id');
    sessionStorage.removeItem('vq_current_team_id');
    this.listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error(err);
      }
    });
  }

  getMetrics() {
    return {
      tabId: this.tabId,
      deviceId: this.deviceId,
      deviceLabel: this.deviceLabel,
      currentSessionId: this.currentSessionId,
      collisionCount: this.concurrencyCollisionCount
    };
  }
}

export const sessionManager = new SessionManager();
