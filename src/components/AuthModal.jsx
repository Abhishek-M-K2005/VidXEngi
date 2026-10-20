import React, { useState } from 'react';
import { soundFx } from '../utils/sound';
import { sessionManager } from '../utils/sessionManager';
import { ADMIN_PASSCODE, ADMIN_TEAM } from '../data/teams';
import { 
  KeyRound, 
  Sparkles, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Laptop, 
  Crown, 
  Users, 
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  teams,
  onLogin,
  initialMode = 'team'
}) => {
  const [mode, setMode] = useState(initialMode);
  
  // Team Login form
  const participantTeams = teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut');
  const [selectedTeamId, setSelectedTeamId] = useState(participantTeams[0]?.id || '');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Login form
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  if (!isOpen) return null;

  // Handle Team Login
  const handleTeamLoginSubmit = (e) => {
    e.preventDefault();
    const team = participantTeams.find((t) => t.id === selectedTeamId);
    if (!team) {
      setLoginError('Team profile not found');
      return;
    }
    // Check passcode if provided or allow demo login
    if (loginPasscode && team.passcode !== loginPasscode) {
      soundFx.playError();
      setLoginError('Incorrect team passcode.');
      return;
    }

    soundFx.playUnlock();
    onLogin(team);
    onClose();
  };

  // Handle Admin Login (Requires master administrator passcode)
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPasscode === ADMIN_PASSCODE) {
      soundFx.playVictory();
      setAdminError('');
      onLogin(ADMIN_TEAM);
      onClose();
    } else {
      soundFx.playError();
      setAdminError('Invalid Admin Passcode. Unauthorized access attempt recorded.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-lg w-full bg-[#131418] border border-[#262832] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#20222a] bg-[#0d0e11]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${
              mode === 'admin'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-400'
                : 'bg-cyan-500/20 border-cyan-400/60 text-[#00e5ff]'
            }`}>
              {mode === 'admin' ? <Crown className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {mode === 'admin' ? 'Organizer / Admin Gateway' : 'Team Verification & Sign In'}
              </h3>
              <p className="text-xs text-zinc-400">ACM NITK Vidyut &times; Engineer &apos;26</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch: Team Login vs Admin Access */}
        <div className="grid grid-cols-2 p-1.5 bg-[#0f1013] border-b border-[#1f2128] text-xs font-mono font-bold">
          <button
            onClick={() => {
              soundFx.playClick();
              setMode('team');
              setLoginError('');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              mode === 'team'
                ? 'bg-[#1a1b22] text-white border border-[#2f323e] shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Participating Team</span>
          </button>
          
          <button
            onClick={() => {
              soundFx.playClick();
              setMode('admin');
              setAdminError('');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              mode === 'admin'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-700/60 shadow-sm'
                : 'text-zinc-500 hover:text-amber-400/80'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin / Organizer</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === 'team' ? (
            <div className="space-y-4">
              {participantTeams.length === 0 ? (
                /* Production Empty State for Teams */
                <div className="p-5 rounded-xl bg-[#16171d] border border-[#242733] text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      No Competing Teams Provisioned Yet
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      All participating teams are registered by the ACM Vidyut &amp; Engineer &apos;26 contest coordinators.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#20222b]">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setMode('admin');
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Organizer? Sign In as Admin</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Team Login Form */
                <form onSubmit={handleTeamLoginSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono text-zinc-300">
                        Select Your Team
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        1 Device / Tab Max
                      </span>
                    </div>
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#252833] text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    >
                      {participantTeams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.avatarSeed} {t.name} ({t.college}) &mdash; {t.solvedPuzzles.length} Solved
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Single Active Session Warning */}
                  {(() => {
                    const existingSession = sessionManager.getActiveSession(selectedTeamId);
                    const isAnotherInstance = existingSession && (
                      existingSession.tabId !== sessionManager.tabId || 
                      existingSession.sessionId !== sessionManager.currentSessionId
                    );

                    if (isAnotherInstance) {
                      return (
                        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Active Session Detected Elsewhere</span>
                          </div>
                          <div className="text-[11px] text-zinc-300 flex items-center gap-1 font-mono">
                            <Laptop className="w-3 h-3 text-zinc-500" />
                            <span>Logged in on: {existingSession.deviceLabel || 'Another Tab / Device'}</span>
                          </div>
                          <div className="text-[10px] text-amber-300/80 leading-relaxed pt-0.5">
                            Logging in will <strong>terminate that session immediately</strong>. Verilog Quest permits only 1 active tab/device at a time.
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                      Team Passcode
                    </label>
                    <input
                      type="password"
                      value={loginPasscode}
                      onChange={(e) => setLoginPasscode(e.target.value)}
                      placeholder="Enter your team passcode"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#252833] text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {loginError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-600/60 text-xs text-rose-300">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(0,240,255,0.3)] transition cursor-pointer"
                  >
                    {sessionManager.getActiveSession(selectedTeamId) 
                      ? 'Take Over & Authorize Single Session' 
                      : 'Confirm & Access Dashboard'}
                  </button>

                  <div className="text-center pt-2 border-t border-[#1e2028]">
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Need a team account?{' '}
                      <span className="text-zinc-300 font-medium">
                        Contact ACM Vidyut Organizers to provision credentials.
                      </span>
                    </p>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Admin Sign In Form */
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono tracking-wider">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Restricted Organizer Portal</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enter the administrative master key to access proctoring controls, live bitstream telemetry, and <strong>team provisioning</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Admin Passcode</span>
                  <span className="text-[10px] text-zinc-500 font-mono">CONFIDENTIAL</span>
                </label>
                <div className="relative">
                  <input
                    type={showAdminPass ? "text" : "password"}
                    required
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter admin passcode"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2d3a] text-white text-xs font-mono focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {adminError && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-600/60 text-xs text-rose-300">
                  {adminError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(245,158,11,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Verify &amp; Enter Admin Console</span>
              </button>

              <div className="text-center pt-1">
                <p className="text-[10px] text-zinc-500 font-mono">
                  🔒 Unauthorized access attempts are monitored and recorded.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
