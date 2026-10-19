import React, { useState } from 'react';
import { soundFx } from '../utils/sound';
import { 
  KeyRound, 
  Sparkles, 
  X
} from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  teams,
  onLogin,
  onRegister
}) => {
  const [mode, setMode] = useState('login');
  
  // Login form
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regCollege, setRegCollege] = useState('NITK Surathkal');
  const [regMembers, setRegMembers] = useState('');
  const [regPasscode, setRegPasscode] = useState('');
  const [regAvatar, setRegAvatar] = useState('⚡');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const team = teams.find((t) => t.id === selectedTeamId);
    if (!team) {
      setLoginError('Team not found');
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

  const handleQuickDemoLogin = (team) => {
    soundFx.playUnlock();
    onLogin(team);
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPasscode.trim()) return;

    soundFx.playUnlock();
    onRegister({
      name: regName.trim(),
      college: regCollege.trim(),
      members: regMembers.split(',').map((m) => m.trim()).filter(Boolean),
      passcode: regPasscode.trim(),
      avatarSeed: regAvatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative max-w-lg w-full bg-[#141518] border border-cyan-500/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.25)]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1012]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[#00e5ff]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Team Verification &amp; Login</h3>
              <p className="text-xs text-slate-400">ACM Vidyut &times; Engineer &apos;26 Hackathon</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono font-bold">
          <button
            onClick={() => {
              soundFx.playClick();
              setMode('login');
            }}
            className={`py-2 rounded-lg transition ${
              mode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In Existing Team
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setMode('register');
            }}
            className={`py-2 rounded-lg transition ${
              mode === 'register'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register New Team
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {mode === 'login' ? (
            <div className="space-y-5">
              {/* Quick Demo Access Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950/60 border border-[#232529]">
                <div className="text-[11px] font-mono text-[#00e5ff] uppercase font-bold flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Demo Test Accounts (1-Click)
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Click any team profile below to test their decryption progress, submit solutions, and inspect live rankings:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {teams.slice(0, 3).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(t)}
                      className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-400 text-left transition group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{t.avatarSeed}</span>
                        <span className="text-xs font-bold text-white group-hover:text-[#00e5ff] truncate">
                          {t.name}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#00e5ff] mt-1">
                        {t.solvedPuzzles.length}/10 Solved
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Select Your Team
                  </label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.avatarSeed} {t.name} ({t.college}) &mdash; {t.solvedPuzzles.length} Solved
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Team Passcode
                  </label>
                  <input
                    type="password"
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    placeholder="Enter passcode (or leave blank for demo teams)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-600/60 text-xs text-rose-300">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(0,240,255,0.3)] transition"
                >
                  Confirm &amp; Access Dashboard
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. QuantumCircuits_NITK"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  College / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  placeholder="e.g. NITK Surathkal"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Team Members (comma separated)
                </label>
                <input
                  type="text"
                  value={regMembers}
                  onChange={(e) => setRegMembers(e.target.value)}
                  placeholder="e.g. Ramesh, Suresh, Priya"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Passcode *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPasscode}
                    onChange={(e) => setRegPasscode(e.target.value)}
                    placeholder="Secret key"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Avatar Crest
                  </label>
                  <select
                    value={regAvatar}
                    onChange={(e) => setRegAvatar(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="⚡">⚡ Lightning Core</option>
                    <option value="🔥">🔥 Thermal Overclock</option>
                    <option value="👾">👾 Bit Inverter</option>
                    <option value="🛡️">🛡️ Fault Tolerant</option>
                    <option value="🛰️">🛰️ Space Radiation</option>
                    <option value="💎">💎 Silicon Crystal</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(0,240,255,0.3)] transition"
              >
                Register Team &amp; Begin Quest
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
