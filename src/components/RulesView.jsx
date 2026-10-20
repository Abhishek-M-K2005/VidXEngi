import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  Sparkles,
  Lock
} from 'lucide-react';
import { ArcesiumLogo } from './BrandLogos';

export const RulesView = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-left">
      
      {/* ── Header ── */}
      <div className="p-6 rounded-2xl bg-[#141517] border border-[#232529]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            COMPETITION HANDBOOK &bull; EDITION 2026
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Hackathon Rubric &amp; Rules
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Tournament guidelines for VERILOG QUEST (RTL × FPGA Challenge) presented by ACM NITK Vidyut × Engineer NITK '26, sponsored by Arcesium.
        </p>
      </div>

      {/* ── Arcesium Title Sponsor Section ── */}
      <div className="p-6 rounded-2xl bg-[#121316] border border-[#26282e] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-wider">
              TITLE SPONSOR
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#1e2025] text-white font-bold font-mono border border-[#2f323a]">
              ARCESIUM
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Engineering High-Throughput Financial Systems
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Arcesium provides post-trade technology, asset servicing, and unified data platforms for the world’s most sophisticated investment managers. We are thrilled to empower student hardware innovators at NITK Surathkal to engineer zero-latency compute cores.
          </p>
        </div>

        <a
          href="https://www.arcesium.com"
          target="_blank"
          rel="noreferrer"
          className="btn-matte-primary shrink-0"
        >
          <span>Explore Arcesium</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* ── Rules Breakdown ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Phase 1 */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Phase 1: 10 Statement Puzzles
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span><strong>Sequential Progression:</strong> Teams must decrypt each stage sequentially (Stage N requires Stage N-1 to be verified).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span><strong>Blueprint Compilation:</strong> Each puzzle unlocks 1 of 10 architectural fragments of the master <em>Project Neura-Core</em> problem statement.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span><strong>Scoring &amp; Penalties:</strong> Each stage awards points (100 to 600 pts). Requesting hints incurs a timing penalty on the leaderboard.</span>
            </li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4" />
            Phase 2: Master FPGA Implementation
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Target Hardware:</strong> Xilinx Artix-7 (xc7a100tcsg324-2) simulated and synthesized in Vivado ML.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Frequency Metric:</strong> F_MAX target is 250 MHz (4.0 ns period) with strictly non-negative Worst Negative Slack (WNS &gt; 0).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Submission Format:</strong> Verilog RTL files, testbench simulation log, and Vivado timing report.</span>
            </li>
          </ul>
        </div>

        {/* Leaderboard Tie-Breakers */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Live Leaderboard Standings
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Rankings on the live dashboard are determined strictly by:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 font-mono">
            <li>Number of Decrypted Stages (Descending)</li>
            <li>Cumulative Score Points (Descending)</li>
            <li>Effective Solve Timestamp + Penalty Minutes (Ascending)</li>
          </ol>
        </div>

        {/* Host Chapters */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00e5ff]" />
            Host Chapters &amp; Portals
          </h4>
          <div className="space-y-2 text-xs">
            <a 
              href="https://engineer.nitk.ac.in" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-[#0e0f11] hover:bg-[#16171b] border border-[#23252a] text-zinc-300 flex items-center justify-between transition"
            >
              <span>Engineer '26 NITK Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
            <div className="p-2.5 rounded-lg bg-[#0e0f11] border border-[#23252a] text-zinc-400 flex items-center justify-between">
              <span>ACM NITK Student Chapter &bull; Vidyut SIG</span>
              <span className="text-[11px] font-mono text-[#00e5ff]">Hardware &amp; Systems</span>
            </div>
          </div>
        </div>

        {/* Anti-Cheat & Single Instance Policy */}
        <div className="md:col-span-2 matte-card p-5 space-y-3 border-amber-500/30 bg-amber-950/10">
          <h4 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Anti-Cheat &amp; Single Active Session Policy (Directive 4.1)
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            To preserve fair competition, integrity of live decryption flags, and telemetry audits:
          </p>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Strict 1 Device / 1 Tab Limit:</strong> A team login can only be active on exactly ONE device or browser tab at any instance.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Automatic Disconnect &amp; Collision Lockout:</strong> Authenticating on another device or tab immediately terminates and locks the previous session in real time.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Session Re-Claiming:</strong> If an active terminal is disconnected, team members can re-claim the session with their passcode or continue in public spectator mode.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
