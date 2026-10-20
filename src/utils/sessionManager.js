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
 * - Heartbeat Verifier: Periodically monitors active token validity
 */

const STORAGE_KEY_ACTIVE_SESSION = 'vq_active_session';
const STORAGE_KEY_TEAM_SESSIONS = 'vq_team_sessions';
const STORAGE_KEY_DEVICE_ID = 'vq_device_id';
const CHANNEL_NAME = 'vq_session_integrity_channel';

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
    this.heartbeatTimer = null;
    this.concurrencyCollisionCount = 0;

    if (typeof window !== 'undefined') {
      this.initChannel();
      this.initStorageListener();
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

  initStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY_ACTIVE_SESSION || e.key === STORAGE_KEY_TEAM_SESSIONS) {
        this.verifyCurrentSession();
      }
    });
  }

  handleChannelMessage(data) {
    if (!data || !this.currentTeamId) return;

    // Another tab/device has claimed the session for our team!
    if (data.type === 'SESSION_CLAIMED' && data.teamId === this.currentTeamId) {
      // If the incoming session is NOT from this tab
      if (data.tabId !== this.tabId || data.sessionId !== this.currentSessionId) {
        this.concurrencyCollisionCount++;
        this.notifyTerminated({
          reason: 'CONCURRENT_LOGIN_DETECTED',
          bySessionId: data.sessionId,
          byTabId: data.tabId,
          byDevice: data.deviceLabel || 'Another Browser Tab / Device',
          timestamp: data.timestamp || Date.now()
        });
      }
    } else if (data.type === 'QUERY_ACTIVE_SESSION' && data.teamId === this.currentTeamId) {
      // Respond that this tab holds the active session
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
    } catch {
      // Ignore heartbeat storage errors
    }
  }

  /**
   * Register a new active login session on this tab.
   * Displaces any existing active session for this team across all tabs/devices.
   */
  registerSession(teamId) {
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const sessionData = {
      teamId,
      sessionId: newSessionId,
      tabId: this.tabId,
      deviceId: this.deviceId,
      deviceLabel: this.deviceLabel,
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

    // Broadcast CLAIM to displace any other tab immediately
    if (this.channel) {
      this.channel.postMessage({
        type: 'SESSION_CLAIMED',
        ...sessionData
      });
    }

    return sessionData;
  }

  /**
   * Query if an active session already exists for this team in another tab/device.
   */
  getActiveSession(teamId) {
    try {
      const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
      if (!allSessionsRaw) return null;
      const allSessions = JSON.parse(allSessionsRaw);
      const session = allSessions[teamId];
      if (!session) return null;

      // Heartbeat timeout: if inactive for > 15 seconds, consider expired
      const isAlive = (Date.now() - (session.lastHeartbeat || session.loginTime)) < 15000;
      if (!isAlive) return null;

      return session;
    } catch {
      return null;
    }
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
    if (this.currentTeamId === teamId) {
      this.currentTeamId = null;
      this.currentSessionId = null;
      sessionStorage.removeItem('vq_current_session_id');
      sessionStorage.removeItem('vq_current_team_id');

      try {
        const allSessionsRaw = localStorage.getItem(STORAGE_KEY_TEAM_SESSIONS);
        if (allSessionsRaw) {
          const allSessions = JSON.parse(allSessionsRaw);
          delete allSessions[teamId];
          localStorage.setItem(STORAGE_KEY_TEAM_SESSIONS, JSON.stringify(allSessions));
        }
      } catch {}

      if (this.channel) {
        this.channel.postMessage({
          type: 'SESSION_RELEASED',
          teamId,
          tabId: this.tabId
        });
      }
    }
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
