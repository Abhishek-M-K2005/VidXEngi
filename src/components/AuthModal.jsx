import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/sound';
import { sessionManager } from '../utils/sessionManager';
import { ADMIN_PASSCODE, ADMIN_TEAM } from '../data/teams';
import { 
  KeyRound, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Laptop, 
  Crown, 
  Users, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  teams,
  onLogin,
  initialMode = 'team'
}) => {
  const [mode, setMode] = useState(initialMode);
  
  // Participant teams filter (strictly non-admin)
  const participantTeams = teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut');

  // Team Sign In form state
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Admin Login form state
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Sync mode whenever initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'team');
      setLoginError('');
      setAdminError('');
    }
  }, [isOpen, initialMode]);

  // Keep selectedTeamId synced with available teams
  useEffect(() => {
    if (participantTeams.length > 0) {
      if (!selectedTeamId || !participantTeams.some((t) => t.id === selectedTeamId)) {
        setSelectedTeamId(participantTeams[0].id);
      }
    } else {
      setSelectedTeamId('');
    }
  }, [participantTeams, isOpen]);

  // Real-time passkey auto-detection across all competing teams
  const trimmedPass = loginPasscode.trim().toLowerCase();
  const matchedTeam = trimmedPass 
    ? participantTeams.find((t) => t.passcode && t.passcode.trim().toLowerCase() === trimmedPass)
    : null;
  const isAdminMasterMatch = trimmedPass && trimmedPass === ADMIN_PASSCODE.trim().toLowerCase();

  // If user types a passkey that matches a specific team, auto-sync selected dropdown
  useEffect(() => {
    if (matchedTeam && matchedTeam.id !== selectedTeamId) {
      setSelectedTeamId(matchedTeam.id);
    }
  }, [matchedTeam]);

  if (!isOpen) return null;

  // Handle Team Login
  const handleTeamLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanPass = loginPasscode.trim();

    // 1. Direct Master Admin check (in case organizer types key here)
    if (cleanPass && cleanPass.toLowerCase() === ADMIN_PASSCODE.trim().toLowerCase()) {
      soundFx.playVictory();
      onLogin(ADMIN_TEAM);
      onClose();
      return;
    }

    // 2. Direct match across ALL participant teams by passcode
    if (cleanPass) {
      const matchByPass = participantTeams.find(
        (t) => t.passcode && t.passcode.trim().toLowerCase() === cleanPass.toLowerCase()
      );
      if (matchByPass) {
        soundFx.playUnlock();
        onLogin(matchByPass);
        onClose();
        return;
      }
    }

    // 3. Fallback to currently selected dropdown team
    const currentTeam = participantTeams.find((t) => t.id === selectedTeamId);
    if (currentTeam) {
      if (!currentTeam.passcode || (cleanPass && currentTeam.passcode.trim().toLowerCase() === cleanPass.toLowerCase())) {
        soundFx.playUnlock();
        onLogin(currentTeam);
        onClose();
        return;
      }
    }

    // 4. Passkey did not match any team
    soundFx.playError();
    if (!cleanPass) {
      setLoginError('Please enter your assigned team passkey.');
    } else {
      setLoginError(`Incorrect team passkey. All participating teams are provisioned exclusively by ACM Vidyut contest coordinators.`);
    }
  };

  // Handle Admin Login (Requires master administrator passcode)
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPasscode.trim() === ADMIN_PASSCODE.trim()) {
      soundFx.playVictory();
      setAdminError('');
      onLogin(ADMIN_TEAM);
      onClose();
    } else {
      soundFx.playError();
      setAdminError('Invalid Admin Passcode. Unauthorized access attempt recorded.');
    }
  };

  const activeSelectedTeam = participantTeams.find((t) => t.id === selectedTeamId);

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
              {mode === 'admin' ? (
                <Crown className="w-4 h-4" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {mode === 'admin' 
                  ? 'Organizer / Admin Gateway' 
                  : 'Team Verification & Sign In'}
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

        {/* 2-Tab Switch: Participating Team Sign In vs Admin Access */}
        <div className="grid grid-cols-2 p-1.5 bg-[#0f1013] border-b border-[#1f2128] text-xs font-mono font-bold">
          <button
            onClick={() => {
              soundFx.playClick();
              setMode('team');
              setLoginError('');
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              mode === 'team'
                ? 'bg-[#1a1b22] text-cyan-300 border border-cyan-500/40 shadow-sm'
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

        {/* Modal Body */}
        <div className="p-6">
          
          {/* TAB 1: TEAM SIGN IN (PASSKEY-FIRST WITH AUTO-LOOKUP) */}
          {mode === 'team' && (
            <form onSubmit={handleTeamLoginSubmit} className="space-y-4">
              
              {/* Primary: Enter Team Passkey */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enter Team Passkey</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400/80 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    Auto-Matching Active
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showLoginPass ? "text" : "password"}
                    autoFocus
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    placeholder="Enter your assigned team passkey"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0c0d10] border border-[#252833] text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live Match Feedback Card */}
              {matchedTeam && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 animate-fadeIn">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                    {matchedTeam.avatarSeed || matchedTeam.name.substring(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-200 truncate">
                        {matchedTeam.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {matchedTeam.college} &bull; {matchedTeam.solvedPuzzles.length} Solved
                    </p>
                  </div>
                </div>
              )}

              {/* Master Admin Passcode Feedback Card */}
              {isAdminMasterMatch && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center gap-2.5 animate-fadeIn">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-[11px] text-amber-200">
                    Master Admin Passcode recognized! Submitting will unlock proctor mode.
                  </div>
                </div>
              )}

              {/* Secondary / Dropdown Selection (If teams exist) */}
              {participantTeams.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono text-zinc-400">
                      Or Select Team Profile
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {participantTeams.length} competing teams
                    </span>
                  </div>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#252833] text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {participantTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.college}) &mdash; {t.solvedPuzzles.length} Solved
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Single Active Session Warning */}
              {(() => {
                if (!selectedTeamId) return null;
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
                        <span>Device: {existingSession.deviceLabel || 'Another Tab / Device'}</span>
                      </div>
                      <div className="text-[10px] text-amber-300/80 leading-relaxed pt-0.5">
                        Logging in will claim and re-route the active session to this workstation.
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {loginError && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-600/60 text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(0,240,255,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>
                  {matchedTeam 
                    ? `Sign In as ${matchedTeam.name}` 
                    : selectedTeamId 
                      ? 'Confirm Passkey & Enter Dashboard' 
                      : 'Sign In With Passkey'}
                </span>
              </button>

              <div className="pt-2 border-t border-[#1e2028] text-center space-y-1">
                <p className="text-[11px] text-zinc-400">
                  All participating teams are provisioned exclusively by ACM Vidyut contest coordinators.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setMode('admin');
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-mono font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Organizer? Sign In to Admin Console</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ADMIN / ORGANIZER GATEWAY */}
          {mode === 'admin' && (
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
                <p className="text-[10px] text-zinc-500 font-mono flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-zinc-500" />
                  <span>Unauthorized access attempts are monitored and recorded.</span>
                </p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
