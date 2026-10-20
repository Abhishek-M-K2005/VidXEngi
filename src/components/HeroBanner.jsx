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
import { AcmNitkLogo, ArcesiumLogo, EngineerNitkLogo } from './BrandLogos';
import { DynamicElectricTitle } from './DynamicElectricTitle';

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
      
      {/* ── BACKGROUND LAYER: Dark Matte Circuit Accent ── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0f13] via-[#0a0b0d] to-[#0a0b0d]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00e5ff]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-14 text-center">

        {/* ── HEADER STACK: TITLE SPONSOR & CO-HOST PRESENTERS ── */}
        <div className="flex flex-col items-center justify-center mb-8 gap-4">

          {/* 1. TITLE SPONSOR ROW */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111215]/80 border border-[#1e2026] backdrop-blur-md">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-medium">
              Title Sponsor
            </span>
            <div className="h-3 w-px bg-[#26282e]" />
            <a
              href="https://www.arcesium.com"
              target="_blank"
              rel="noreferrer"
              title="Arcesium Title Sponsor"
              className="hover:opacity-90 transition flex items-center"
            >
              <ArcesiumLogo className="h-5 sm:h-6" />
            </a>
          </div>

          {/* 2. ACM LOGO X ENGINEER LOGO NITK PRESENTS */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-[#111215]/90 border border-[#22242a] backdrop-blur-md shadow-xl shadow-black/50">
            <a
              href="https://acm.nitk.ac.in"
              target="_blank"
              rel="noreferrer"
              title="ACM NITK Student Chapter"
              className="hover:opacity-95 transition flex items-center shrink-0"
            >
              <AcmNitkLogo size="normal" />
            </a>

            <span className="text-zinc-500 font-light text-2xl sm:text-3xl select-none shrink-0 leading-none px-0.5">
              ✕
            </span>

            <a
              href="https://engineer.nitk.ac.in"
              target="_blank"
              rel="noreferrer"
              title="Engineer '26 NITK"
              className="hover:opacity-95 transition flex items-center shrink-0"
            >
              <EngineerNitkLogo size="normal" />
            </a>

            <div className="h-6 w-px bg-[#26282e] hidden sm:block shrink-0 mx-1" />

            <span className="text-xs sm:text-sm font-mono tracking-[0.16em] text-zinc-300 font-medium uppercase shrink-0">
              NITK presents
            </span>
          </div>

        </div>

        {/* 3. ELECTRICALLY DYNAMIC HERO HEADLINE */}
        <div className="mb-2 select-none">
          <DynamicElectricTitle />
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
            <span>Authorized Team Access Only</span>
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
            
            <div className="p-8 bg-black/60 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#18191d] border border-[#2b2d35] flex items-center justify-center text-3xl">
                ⚡
              </div>
              <div>
                <h4 className="text-xl font-bold font-display text-white">VERILOG QUEST '26</h4>
                <p className="text-sm text-zinc-400 font-mono mt-1">RTL × FPGA Hardware Challenge</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-300 pt-2">
                <span>Date: 25/10/2026</span>
                <span>&bull;</span>
                <span>NITK Surathkal</span>
                <span>&bull;</span>
                <span className="text-amber-400">17.5K INR</span>
              </div>
            </div>

            <div className="p-3 bg-[#111215] border-t border-[#1e2025] flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>25 Oct 2026 · NITK Surathkal</span>
              </div>
              <span className="text-[#00e5ff] font-semibold font-mono">
                ACM Vidyut × Engineer '26
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
