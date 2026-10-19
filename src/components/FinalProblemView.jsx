import React, { useState } from 'react';
import { FINAL_PROBLEM_STATEMENT } from '../data/puzzles';
import { soundFx } from '../utils/sound';
import { 
  Key, 
  Lock, 
  Download, 
  CheckCircle2, 
  Send, 
  FileCode, 
  ShieldCheck, 
  Copy, 
  Check 
} from 'lucide-react';

export const FinalProblemView = ({
  puzzles,
  activeTeam,
  onJumpToStage,
  onOpenAuth
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [timingSlack, setTimingSlack] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const solvedIds = activeTeam ? activeTeam.solvedPuzzles : [];
  const solvedCount = solvedIds.length;
  const isFullyUnlocked = solvedCount >= 10;
  const progressPercent = Math.round((solvedCount / 10) * 100);

  const starterVerilogCode = `\`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company: ACM Vidyut x Engineer '26 NITK & Arcesium
// Engineer: ${activeTeam ? activeTeam.name : 'Team Unknown'}
// Create Date: 25.10.2026
// Design Name: PROJECT NEURA-CORE
// Module Name: neura_core_top
// Target Devices: Xilinx Artix-7 (xc7a100tcsg324-2)
// Tool Versions: Vivado 2024.1+
// Description: Zero-Latency FPGA Triangular Arbitrage Co-Processor
//////////////////////////////////////////////////////////////////////////////////

module neura_core_top (
    // Primary System Clocks
    input  wire        clk_250m,          // 250 MHz Core Processing Clock
    input  wire        clk_156m_phy,      // 156.25 MHz Ethernet PHY Clock
    input  wire        rst_n,             // Synchronous Active-Low Reset

    // AXI4-Stream Ingress Market Data (64-bit @ 156.25 MHz)
    input  wire [63:0] s_axis_tdata,
    input  wire [7:0]  s_axis_tkeep,
    input  wire        s_axis_tvalid,
    input  wire        s_axis_tlast,
    output wire        s_axis_tready,

    // Market Telemetry Outputs
    output wire [31:0] best_bid_price,
    output wire [31:0] best_ask_price,
    output wire [15:0] tick_sequence_id,

    // Arbitrage Execution Trigger Interface (Zero-Latency)
    output reg         order_fire,
    output reg  [63:0] order_token,
    output reg  [31:0] computed_profit_q16,

    // Status & Diagnostics
    output wire        crc32_pass,
    output wire [11:0] ring_buffer_depth,
    output wire        thermal_alarm
);

    // =========================================================================
    // 1. ASYNCHRONOUS CDC DUAL-CLOCK FIFO (PHY -> CORE)
    // =========================================================================
    // Pointer synchronization via Gray code to prevent multi-bit transit races
    // Gray Formula: G = B ^ (B >> 1)

    // =========================================================================
    // 2. ETHERNET & UDP PACKET HEADER DE-SERIALIZER
    // =========================================================================

    // =========================================================================
    // 3. 16-LEVEL L3 ORDER BOOK PARALLEL COMPARATOR ENGINE
    // =========================================================================

    // =========================================================================
    // 4. Q16.16 FIXED-POINT DSP48E1 ARBITRAGE ARITHMETIC UNIT
    //    Delta = (Bid_A * Bid_B) - Ask_C
    // =========================================================================

    // =========================================================================
    // 5. HARDWARE CRC32 INTEGRITY VERIFICATION (IEEE 802.3)
    // =========================================================================

endmodule`;

  const handleCopyStarter = () => {
    navigator.clipboard.writeText(starterVerilogCode);
    setCopiedCode(true);
    soundFx.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadStarter = () => {
    soundFx.playZap();
    const blob = new Blob([starterVerilogCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neura_core_top.v';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmitFinal = (e) => {
    e.preventDefault();
    if (!activeTeam) {
      onOpenAuth();
      return;
    }
    soundFx.playVictory();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#141518] via-[#121316] to-[#0e0f11] border border-[#282a30] p-6 sm:p-8 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/30">
                ACM VIDYUT &times; ENGINEER &apos;26
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                GRAND HACKATHON MISSION
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono text-[#00e5ff] bg-cyan-950/80 border border-cyan-800">
                SPONSORED BY ARCESIUM
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {FINAL_PROBLEM_STATEMENT.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {FINAL_PROBLEM_STATEMENT.overview}
            </p>
          </div>

          {/* Decryption Gauge Meter */}
          <div className="p-4 rounded-xl bg-[#0f1012]/80 border border-[#222429] text-center min-w-[200px] shrink-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              BLUEPRINT REVEALED
            </div>
            <div className="text-3xl font-black font-mono text-[#00e5ff] my-1">
              {progressPercent}%
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {solvedCount} of 10 Fragments Solved
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full mt-2 overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Specs Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Target Device</div>
          <div className="text-sm font-bold text-white font-mono mt-0.5">{FINAL_PROBLEM_STATEMENT.targetHardware}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Target Clock Period</div>
          <div className="text-sm font-bold text-[#00e5ff] font-mono mt-0.5">{FINAL_PROBLEM_STATEMENT.clockConstraint}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Prize Bounty</div>
          <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{FINAL_PROBLEM_STATEMENT.prizePool}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Title Sponsor</div>
          <div className="text-sm font-bold text-[#00e5ff] font-mono mt-0.5">Arcesium Tech</div>
        </div>
      </div>

      {/* 10 Statement Fragments Breakdown Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-[#00e5ff]" />
            10-Fragment Decryption Netlist
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Requires solving Puzzles 1 through 10
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {puzzles.map((p) => {
            const isUnlocked = solvedIds.includes(p.id);

            return (
              <div 
                key={p.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#141518]/80 border-[#282a30] shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      isUnlocked 
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.5)]' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {p.stageNumber}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {p.fragment.subsystemTag}: {p.fragment.title}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-mono text-[#00e5ff] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      DECRYPTED
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onJumpToStage(p.id);
                      }}
                      className="text-[10px] font-mono text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Solve P{p.stageNumber}
                    </button>
                  )}
                </div>

                {isUnlocked ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-300 leading-relaxed">
                      {p.fragment.content}
                    </p>
                    {p.fragment.verilogSignature && (
                      <div className="p-2 rounded bg-black/60 border border-[#1f2125] text-[#00e5ff] font-mono text-[11px] overflow-x-auto">
                        <code>{p.fragment.verilogSignature}</code>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded bg-slate-900/60 border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
                    [ENCRYPTED BITSTREAM BLOCK &bull; REQUIRES STAGE {p.stageNumber} KEY]
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Master Specification & Starter Kit */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isFullyUnlocked 
          ? 'bg-[#151619] border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.25)]' 
          : 'bg-[#111215] border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              {isFullyUnlocked ? (
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              ) : (
                <Lock className="w-4 h-4 text-amber-400" />
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isFullyUnlocked ? "Grand Problem Portal Unlocked!" : "Master Problem Specifications & Verilog Starter Kit"}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isFullyUnlocked 
                ? "Congratulations! Your team decrypted all 10 hardware fragments. Download the starter repo and submit your synthesized netlist below."
                : `Solve all 10 stages to unlock the full final submission portal. (${10 - solvedCount} remaining)`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyStarter}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium inline-flex items-center gap-1.5 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copied" : "Copy RTL"}</span>
            </button>
            <button
              onClick={handleDownloadStarter}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download neura_core_top.v</span>
            </button>
          </div>
        </div>

        {/* Requirements & Rubric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-wider">
              CORE HARDWARE ARCHITECTURE CRITERIA
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {FINAL_PROBLEM_STATEMENT.designRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5ff] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              REQUIRED DELIVERABLES &amp; EVALUATION RUBRIC
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {FINAL_PROBLEM_STATEMENT.deliverables.map((deliv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 mt-4">
              <strong className="font-semibold text-[#00e5ff]">Arcesium Industry Benchmarking: </strong>
              Judges will evaluate peak throughput, minimal pipeline bubble latency, and synthesizability on Xilinx Vivado ML Enterprise.
            </div>
          </div>
        </div>

        {/* Verilog Code Preview Box */}
        <div className="rounded-xl overflow-hidden border border-slate-700 bg-black/80">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>neura_core_top.v (Synthesizable RTL Skeleton)</span>
            <span className="text-[#00e5ff]">Verilog-2001</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-64 leading-relaxed">
            <code>{starterVerilogCode}</code>
          </pre>
        </div>

        {/* Submission Form */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#00e5ff]" />
            Final Problem Statement Submission Portal
          </h4>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h5 className="text-base font-bold text-white">Submission Successfully Received!</h5>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                Your RTL artifacts and timing constraints have been submitted to the ACM Vidyut x Arcesium jury queue. Live leaderboard score updated!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFinal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  GitHub Repository / Artifact ZIP Link *
                </label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/your-team/neura-core-rtl"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Reported Worst Negative Slack (WNS at 250 MHz)
                </label>
                <input
                  type="text"
                  value={timingSlack}
                  onChange={(e) => setTimingSlack(e.target.value)}
                  placeholder="+0.342 ns (Vivado Timing Report)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Architectural Notes &amp; Pipeline Latency Breakdown
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summarize your CDC queue depth, DSP pipeline stages, and testbench validation..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                ></textarea>
              </div>

              <div className="md:col-span-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {activeTeam ? `Submitting on behalf of ${activeTeam.name}` : "Please sign in to submit"}
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Final Artifacts</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
