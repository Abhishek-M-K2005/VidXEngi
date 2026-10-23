import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../utils/sound';
import { Cpu, Activity, Zap, Shield, Sparkles, Layers } from 'lucide-react';

export const InteractiveHoloCore = () => {
  const [rotate, setRotate] = useState({ x: 10, y: -15 });
  const [clockMhz, setClockMhz] = useState(250);
  const [activeLayer, setActiveLayer] = useState('ALL');
  const [isInspecting, setIsInspecting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Mouse distance from center
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      // Smooth tilt angles
      const rotY = Math.max(-25, Math.min(25, dx * 28));
      const rotX = Math.max(-25, Math.min(25, -dy * 28));

      setRotate({ x: rotX, y: rotY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleOverclock = () => {
    soundFx.playZap();
    setClockMhz((prev) => (prev === 250 ? 350 : prev === 350 ? 400 : 250));
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-6 rounded-3xl metamask-card spotlight-card overflow-hidden group select-none"
    >
      {/* Ambient background glow orb */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top telemetry status line */}
      <div className="w-full flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-cyan-300 font-bold uppercase tracking-wider">
            3D SILICON DIE ARCHITECTURE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOverclock}
            className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] hover:bg-cyan-900 transition flex items-center gap-1"
            title="Click to toggle clock frequency"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>F_CLK: {clockMhz} MHz</span>
          </button>
        </div>
      </div>

      {/* 3D Holographic Silicon Processor Container */}
      <div className="w-64 h-64 sm:w-72 sm:h-72 my-2 perspective-1000 flex items-center justify-center">
        <div
          className="relative w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-200 ease-out preserve-3d"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          }}
        >
          {/* Layer 1: Base Substrate BGA PCB (Dark Carbon & Gold Pins) */}
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0c1c38] via-[#09152b] to-[#040915] border-2 border-cyan-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.25)] flex items-center justify-center"
            style={{ transform: 'translateZ(0px)' }}
          >
            {/* Corner alignment markers */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400"></div>

            {/* Perimeter BGA Pins */}
            <div className="absolute inset-2 border border-dashed border-cyan-500/30 rounded-xl"></div>
          </div>

          {/* Layer 2: Intermediate Circuit Waveform Layer */}
          <div
            className="absolute inset-4 rounded-xl bg-gradient-to-tr from-cyan-950/60 to-purple-950/40 border border-cyan-400/60 pointer-events-none flex items-center justify-center shadow-inner"
            style={{ transform: 'translateZ(20px)' }}
          >
            {/* Concentric rotating clock rings */}
            <div className="absolute w-32 h-32 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}></div>
          </div>

          {/* Layer 3: Central Silicon Core Die (Elevated 45px in 3D Space!) */}
          <div
            className="absolute inset-8 rounded-lg bg-gradient-to-br from-[#0e274c] via-[#0b1c37] to-[#081224] border-2 border-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.6)] flex flex-col items-center justify-center p-3 text-center"
            style={{ transform: 'translateZ(45px)' }}
          >
            {/* Center Chip Icon */}
            <div className="relative">
              <Cpu className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
              <div className="absolute -inset-1 bg-cyan-400/20 rounded-full blur animate-pulse"></div>
            </div>

            <div className="text-[11px] font-black font-mono text-white tracking-wider mt-1">
              ARTIX-7 XC7A
            </div>
            <div className="text-[9px] font-mono text-cyan-400 tracking-tight font-semibold">
              GENOME-X RTL
            </div>

            {/* Micro gold pins indicator */}
            <div className="flex gap-1 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            </div>
          </div>

          {/* Layer 4: Floating Holographic Wireframe Top Cover */}
          <div
            className="absolute -inset-2 rounded-2xl border border-cyan-400/20 pointer-events-none"
            style={{ transform: 'translateZ(65px)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/50 text-[9px] font-mono text-cyan-300">
              SYNTHESIS: OPTIMIZED
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Micro-Inspectors */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[9px] font-mono text-slate-400 uppercase">Worst Slack</div>
          <div className="text-xs font-bold font-mono text-emerald-400">+0.342 ns</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[9px] font-mono text-slate-400 uppercase">LUT Usage</div>
          <div className="text-xs font-bold font-mono text-cyan-300">42.8%</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[9px] font-mono text-slate-400 uppercase">DSP Slices</div>
          <div className="text-xs font-bold font-mono text-amber-400">18 / 240</div>
        </div>
      </div>

      {/* User interactive tooltip */}
      <div className="text-[10px] text-slate-400 font-mono mt-3 text-center flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Move pointer to rotate 3D silicon core in perspective</span>
      </div>
    </div>
  );
};
