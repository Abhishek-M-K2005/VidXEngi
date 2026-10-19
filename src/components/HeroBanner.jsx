import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/sound';
import {
  ArrowRight,
  Trophy,
  Eye,
  Calendar,
  MapPin,
  Sparkles,
  QrCode,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const HeroBanner = ({
  activeTeam,
  solvedCount,
  totalPuzzles,
  onSelectTab,
  onOpenAuthModal,
  onJumpToCurrentPuzzle
}) => {
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-10-25T09:00:00+05:30').getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days:    Math.floor(diff / 86400000),
          hours:   Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const progress = Math.round((solvedCount / totalPuzzles) * 100);

  return (
    <section className="relative overflow-hidden bg-[#0a0b0d] border-b border-[#1a1b1f]">
      
      {/* ── BACKGROUND LAYER: Clean Circuit Chip Art ── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div
          className="absolute inset-0 bg-cover bg-top opacity-35 filter contrast-125"
          style={{ backgroundImage: "url('/assets/clean_circuit_chip.png')" }}
        />
        {/* Matte Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0d]/70 via-[#0a0b0d]/50 to-[#0a0b0d]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d]/90 via-transparent to-[#0a0b0d]/90" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-14 text-center">

        {/* 1. OFFICIAL LOGO ROW MATCHING POSTER */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 sm:px-6 sm:py-3 rounded-2xl bg-[#111215]/85 border border-[#1f2127] mb-8 backdrop-blur-md">
          {/* Left: IIC & ACM NITK Chapter */}
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="https://www.mic.gov.in" target="_blank" rel="noreferrer" title="Institution's Innovation Council">
              <img src="/assets/iic_nav.png" alt="IIC Logo" className="h-6 sm:h-7 object-contain" />
            </a>
            <div className="h-5 w-px bg-[#26282e] hidden sm:block" />
            <a href="https://acm.nitk.ac.in" target="_blank" rel="noreferrer" title="ACM NITK Student Chapter">
              <img src="/assets/acm_nitk_nav.png" alt="ACM NITK Student Chapter" className="h-6 sm:h-7 object-contain" />
            </a>
          </div>

          {/* Right: Arcesium & Engineer '26 */}
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="https://www.arcesium.com" target="_blank" rel="noreferrer" title="Arcesium Title Sponsor">
              <img src="/assets/arcesium_nav.png" alt="Arcesium" className="h-6 sm:h-7 object-contain" />
            </a>
            <div className="h-5 w-px bg-[#26282e] hidden sm:block" />
            <a href="https://engineer.nitk.ac.in" target="_blank" rel="noreferrer" title="Engineer '26 NITK">
              <img src="/assets/vidyut_crest_nav.png" alt="Engineer '26 NITK" className="h-7 sm:h-8 object-contain" />
            </a>
          </div>
        </div>

        {/* 2. OVER-TITLE BADGE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131417] border border-[#22242a] text-zinc-300 text-xs sm:text-sm font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
          <span>ACM NITK Vidyuth × Engineer NITK '26 presents</span>
        </div>

        {/* 3. HERO HEADLINE */}
        <div className="mb-3 select-none">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white leading-none">
            VERILOG <span className="text-[#00e5ff]">QUEST</span>
          </h1>
        </div>

        {/* 4. SUBTITLE */}
        <div className="text-sm sm:text-lg font-bold font-mono tracking-[0.25em] text-zinc-400 uppercase mb-4">
          RTL × FPGA Challenge
        </div>

        {/* 5. PRIZE POOL CALLOUT */}
        <div className="inline-block px-5 py-2 rounded-xl bg-[#131417] border border-[#22242a] mb-5">
          <span className="text-base sm:text-lg font-bold font-mono text-zinc-300">
            Prize Pool : <span className="text-[#fbbf24] font-black">17.5 K INR</span>
          </span>
        </div>

        {/* 6. MISSION SUMMARY */}
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed mb-6">
          Decode the 10 cryptic statement puzzles sequentially to assemble the master FPGA co-processor bitstream. Live leaderboard tracking by ACM Vidyut × Engineer NITK '26.
        </p>

        {/* 7. POSTER SPECS ROW */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-mono text-zinc-300 mb-7">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111215] border border-[#1e2025]">
            <Calendar className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Date: 25/10/2026</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111215] border border-[#1e2025]">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Venue: NITK Surathkal</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111215] border border-[#1e2025] text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Register before the 23rd!</span>
          </div>
        </div>

        {/* 8. PRIMARY ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => {
              soundFx.playZap();
              onJumpToCurrentPuzzle();
            }}
            className="btn-matte-primary"
          >
            <span>{solvedCount > 0 ? `Resume Stage 0${solvedCount + 1}` : 'Start Decryption Quest'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onSelectTab('leaderboard');
            }}
            className="btn-matte-ghost"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Live Standings</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setShowPosterModal(true);
            }}
            className="btn-matte-ghost text-zinc-400"
          >
            <Eye className="w-4 h-4" />
            <span>View Poster &amp; QR</span>
          </button>
        </div>

        {/* 9. BOTTOM COMPACT STATUS CARD */}
        <div className="max-w-2xl mx-auto matte-card spotlight-card p-4 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            
            {/* Team Progress */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#16171b] border border-[#24262d] flex items-center justify-center text-base text-amber-400 font-bold shrink-0">
                {activeTeam ? activeTeam.avatarSeed : '⚡'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                    {activeTeam ? activeTeam.name : 'GUEST PARTICIPANT'}
                  </span>
                  {activeTeam && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1c1d22] text-amber-400 border border-[#2a2c34]">
                      {activeTeam.score} pts
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                  {activeTeam
                    ? `Progress: ${solvedCount}/10 Solved (${progress}%)`
                    : 'Sign in to record your solve times on the live leaderboard'}
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5 shrink-0 font-mono text-center self-end sm:self-auto">
              {[
                { v: timeLeft.days, l: 'Days' },
                { v: timeLeft.hours, l: 'Hrs' },
                { v: timeLeft.minutes, l: 'Min' },
                { v: timeLeft.seconds, l: 'Sec' }
              ].map(({ v, l }) => (
                <div key={l} className="bg-[#141518] border border-[#202227] px-2 py-1 rounded-lg min-w-[38px]">
                  <div className="text-xs font-bold text-white leading-tight">{String(v).padStart(2, '0')}</div>
                  <div className="text-[7px] text-zinc-500 uppercase">{l}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ── POSTER & QR MODAL ── */}
      {showPosterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setShowPosterModal(false)}
        >
          <div
            className="relative max-w-md w-full matte-card border border-[#2c2f37] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-[#1f2126] bg-[#0e0f11]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00e5ff]" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Official Poster &bull; ACM NITK Vidyut
                </span>
              </div>
              <button
                onClick={() => setShowPosterModal(false)}
                className="text-zinc-500 hover:text-white px-2 py-0.5 rounded text-sm hover:bg-[#1a1b1f] transition"
              >
                &times; Close
              </button>
            </div>
            
            <div className="p-2 bg-black max-h-[75vh] overflow-y-auto flex items-center justify-center">
              <img
                src="/assets/poster_original.png"
                alt="Verilog Quest Official Poster"
                className="max-h-[68vh] object-contain rounded"
              />
            </div>

            <div className="p-3 bg-[#111215] border-t border-[#1e2025] flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Register before the 23rd!</span>
              </div>
              <a
                href="/assets/poster_original.png"
                download="VerilogQuest_NITK_Poster.png"
                className="text-[#00e5ff] hover:underline font-semibold"
              >
                Download Poster
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
