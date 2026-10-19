import React, { useState } from 'react';
import { soundFx } from '../utils/sound';
import {
  Cpu,
  Trophy,
  Key,
  BarChart3,
  FileText,
  Volume2,
  VolumeX,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export const Navbar = ({
  currentTab,
  onSelectTab,
  activeTeam,
  onOpenAuthModal,
  onLogout,
  soundEnabled,
  onToggleSound,
  solvedCount,
  totalPuzzles
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const percentDecrypted = Math.round((solvedCount / totalPuzzles) * 100);

  const NAV_ITEMS = [
    { id: 'puzzles',       label: '10 Puzzles',       icon: Cpu },
    { id: 'final-problem', label: 'Grand Problem',    icon: Key },
    { id: 'leaderboard',   label: 'Live Standings',   icon: Trophy, live: true },
    { id: 'analysis',      label: 'Telemetry',        icon: BarChart3 },
    { id: 'rules',         label: 'Event Rubric',     icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0b0d]/90 backdrop-blur-md border-b border-[#1a1b1f]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            soundFx.playClick();
            onSelectTab('puzzles');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#141518] border border-[#23252b] flex items-center justify-center text-[#00e5ff] group-hover:border-[#00e5ff]/50 transition">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white tracking-widest font-mono group-hover:text-[#00e5ff] transition">
                VERILOG QUEST
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#18191d] border border-[#25272e] text-zinc-400 font-mono">
                '26
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 font-medium">
              ACM Vidyut × Engineer NITK
            </div>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101114] p-1 rounded-xl border border-[#1c1e22]">
          {NAV_ITEMS.map(({ id, label, icon: Icon, live }) => {
            const isActive = currentTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectTab(id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? 'bg-[#1a1b20] text-white border border-[#2b2d35]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#141518]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00e5ff]' : 'text-zinc-500'}`} />
                <span>{label}</span>
                {live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                {id === 'final-problem' && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1 rounded border border-amber-800/40">
                    {percentDecrypted}%
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Team Profile & Audio */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSound}
            aria-label="Toggle sound"
            title={soundEnabled ? 'Sound FX: ON' : 'Sound FX: OFF'}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition ${
              soundEnabled
                ? 'bg-[#141518] border-[#25272d] text-zinc-300 hover:text-white'
                : 'bg-[#0f1012] border-[#18191c] text-zinc-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00e5ff]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {activeTeam ? (
            <div className="flex items-center gap-2 bg-[#121316] border border-[#202227] rounded-xl px-2.5 py-1">
              <div className="w-6 h-6 rounded-md bg-[#191a1e] flex items-center justify-center text-xs text-amber-400 font-bold border border-[#282a31]">
                {activeTeam.avatarSeed || '⚡'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                  {activeTeam.name}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono leading-tight">
                  {solvedCount}/10 · {activeTeam.score} pts
                </div>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onLogout();
                }}
                title="Switch team / Logout"
                className="ml-1 p-1 text-zinc-500 hover:text-rose-400 rounded transition"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenAuthModal();
              }}
              className="btn-matte-primary !py-1.5 !px-3.5 !text-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-[#1e2025] text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1a1b1f] bg-[#0c0d0f] px-4 py-2 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon, live }) => (
            <button
              key={id}
              onClick={() => {
                soundFx.playClick();
                onSelectTab(id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                currentTab === id
                  ? 'bg-[#18191e] text-white border border-[#282a32]'
                  : 'text-zinc-400 hover:bg-[#121316]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </div>
              {live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
