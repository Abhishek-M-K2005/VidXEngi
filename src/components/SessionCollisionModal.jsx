import React from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  LogOut, 
  Laptop, 
  Clock, 
  Terminal, 
  AlertTriangle 
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export const SessionCollisionModal = ({
  isOpen,
  displacementInfo,
  team,
  onTakeOver,
  onSpectate,
  onSwitchTeam
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-lg w-full bg-[#111215] border border-amber-500/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)]">
        
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-amber-950/80 px-6 py-4 border-b border-amber-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                Security Policy 4.1
              </span>
              <span className="text-xs text-amber-200/70 font-mono">
                Single Instance Rule
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-wide mt-0.5">
              Concurrent Login Detected · Session Terminated
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm">
          <div className="p-3.5 rounded-xl bg-[#16171c] border border-[#252831] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Target Team Profile:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="text-amber-400">{team?.avatarSeed || '⚡'}</span>
                <span>{team?.name || 'Assigned Team'}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Authenticated Terminal:</span>
              <span className="font-mono text-amber-300 flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5 text-zinc-500" />
                <span>{displacementInfo?.byDevice || 'Another Device / Browser Tab'}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Termination Time:</span>
              <span className="font-mono text-zinc-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{new Date(displacementInfo?.timestamp || Date.now()).toLocaleTimeString()}</span>
              </span>
            </div>
            {displacementInfo?.bySessionId && (
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[#20222a] text-zinc-500">
                <span>Active Token:</span>
                <span className="text-zinc-400">#{displacementInfo.bySessionId.slice(0, 16)}...</span>
              </div>
            )}
          </div>

          {/* Regulatory explanation */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Only One Active Tab or Device Permitted:</strong>
              As per Verilog Quest 2026 regulations, a team login is strictly restricted to one single browser tab or device at any time. Parallel submissions or multi-terminal logins are blocked.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                soundFx.playUnlock();
                onTakeOver();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Claim &amp; Reconnect Active Session Here</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onSpectate();
                }}
                className="py-2 px-3 rounded-xl bg-[#18191e] border border-[#272932] hover:bg-[#202228] text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>View Public Board</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onSwitchTeam();
                }}
                className="py-2 px-3 rounded-xl bg-[#18191e] border border-[#272932] hover:bg-[#202228] text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                <span>Switch Team Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
