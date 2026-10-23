import React, { useState, useEffect } from 'react';
import { FINAL_PROBLEM_STATEMENT } from '../data/puzzles';
import { soundFx } from '../utils/sound';
import { 
  Key, 
  Lock, 
  Unlock,
  Download, 
  CheckCircle2, 
  FileCode, 
  ShieldAlert,
  Copy, 
  Check,
  ArrowRight,
  Cpu,
  Dna,
  Binary,
  Layers,
  Sparkles,
  Info,
  Award,
  Terminal,
  FileText,
  ExternalLink
} from 'lucide-react';

export const FinalProblemView = ({
  puzzles,
  activeTeam,
  onJumpToStage,
  onOpenAuth
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [groupIdInput, setGroupIdInput] = useState(() => {
    if (activeTeam?.callsign) return activeTeam.callsign.toLowerCase();
    if (activeTeam?.name) {
      const clean = activeTeam.name.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 8);
      return clean ? clean.toLowerCase() : 't07';
    }
    return 't07';
  });
  const [activeModuleTab, setActiveModuleTab] = useState('ALL');

  useEffect(() => {
    if (activeTeam?.callsign) {
      setGroupIdInput(activeTeam.callsign.toLowerCase());
    } else if (activeTeam?.name) {
      const clean = activeTeam.name.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 8);
      if (clean) setGroupIdInput(clean.toLowerCase());
    }
  }, [activeTeam]);

  const solvedIds = activeTeam?.solvedPuzzles || [];
  const solvedCount = solvedIds.length;
  const totalPuzzlesCount = puzzles?.length || 5;
  const isFullyUnlocked = solvedCount >= totalPuzzlesCount;
  const progressPercent = Math.round((solvedCount / totalPuzzlesCount) * 100);
  const nextStageToSolve = solvedCount + 1;

  const gid = groupIdInput.trim().toLowerCase() || 'group_id';

  const generateStarterVerilogCode = (groupPrefix) => `\`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// ACM Vidyut × Engineer '26 NITK & Arcesium
// Verilog Quest 2026 | Round 1: Module Design and Verification
// System: GENOME-X: Synthetic Genome Editing and Verification Engine
// Team: ${activeTeam ? activeTeam.name : 'Unknown Team'}
// Group Identifier: ${groupPrefix}
// Synthesizable Verilog-2001
//////////////////////////////////////////////////////////////////////////////////

// ==============================================================================
// PART 4: MODULE 1 - GUIDE MATCHER (${groupPrefix}_guide_matcher)
// Objective: Determine whether an 8-base candidate window matches a given guide.
// DNA Encoding: A=2'b00, C=2'b01, G=2'b10, T=2'b11
// ==============================================================================
module ${groupPrefix}_guide_matcher (
    input  wire [15:0] guide,          // 8-base guide sequence (2 bits per base)
    input  wire [15:0] window,         // Candidate 8-base window
    input  wire [1:0]  threshold,      // Maximum permitted mismatches, 0-2
    output wire [3:0]  mismatch_count, // Number of differing bases (0-8)
    output wire        match           // Asserted when mismatch_count <= threshold
);
    // TODO: Compare corresponding DNA bases, not individual bits.
    // Count differing base positions and assert match when mismatch_count <= threshold.
endmodule


// ==============================================================================
// PART 5: MODULE 2 - GENOME WINDOW GENERATOR (${groupPrefix}_genome_window_generator)
// Objective: Generate overlapping 8-base windows across consecutive input fragments.
// Each incoming fragment contains 8 DNA bases = 16 bits.
// ==============================================================================
module ${groupPrefix}_genome_window_generator (
    input  wire        clk,            // System clock (rising edge)
    input  wire        rst,            // Synchronous active-high reset
    input  wire [15:0] fragment,       // Incoming 8-base fragment
    input  wire        fragment_valid, // Indicates a valid incoming fragment
    output reg  [15:0] window,         // Generated 8-base window
    output reg         window_valid    // Indicates a valid output window
);
    // TODO: Accept fragments in sequence, preserve base order, and generate
    // consecutive overlapping 8-base windows across fragment boundaries.
endmodule


// ==============================================================================
// PART 6: MODULE 3 - TARGET LOCATOR (${groupPrefix}_target_locator)
// Objective: Search 32-base genome (base 0 at [63:62]) from index 0 to 24 for the
// first eligible target matching the guide sequence within mismatch threshold.
// ==============================================================================
module ${groupPrefix}_target_locator (
    input  wire        clk,             // System clock
    input  wire        rst,             // Synchronous active-high reset
    input  wire        start,           // Starts a search operation
    input  wire [63:0] genome,          // Original 32-base genome
    input  wire [15:0] guide,           // 8-base guide sequence
    input  wire [1:0]  threshold,       // Maximum permitted mismatches (0-2)
    output reg         target_found,    // Indicates an eligible target was found
    output reg  [4:0]  target_position, // Starting base index of selected target (0-24)
    output reg  [3:0]  mismatch_count,  // Mismatch count at selected target
    output reg         done             // Indicates that search has completed
);
    // TODO: Search base positions 0 through 24 using 8-base sliding windows.
    // Report the leftmost eligible target and assert done upon completion.
endmodule


// ==============================================================================
// PART 7: MODULE 4 - GENOME EDITOR (${groupPrefix}_genome_editor)
// Objective: Perform controlled substitution of 4 consecutive bases at specified
// position (valid 0-28). Preserve untouched bases; reject invalid requests.
// ==============================================================================
module ${groupPrefix}_genome_editor (
    input  wire        clk,           // System clock
    input  wire        rst,           // Synchronous active-high reset
    input  wire        edit_request,  // Requests an edit operation
    input  wire [63:0] genome_in,     // Original 32-base genome
    input  wire [4:0]  edit_position, // Starting base index of the edit (valid 0-28)
    input  wire [7:0]  replacement,   // Four-base replacement sequence
    output reg  [63:0] genome_out,    // Resulting 32-base genome
    output reg         edit_success,  // Indicates a successful edit
    output reg         done           // Indicates request completion
);
    // TODO: Substitute 4 consecutive bases beginning at edit_position.
    // Preserve all other bases. Reject edit_position > 28 without modifying genome.
endmodule


// ==============================================================================
// PART 8: MODULE 5 - EDIT VERIFIER (${groupPrefix}_edit_verifier)
// Objective: Independently reconstruct expected edited genome and compare against
// actual edited genome across all 32 bases. Assert verify_pass on exact match.
// ==============================================================================
module ${groupPrefix}_edit_verifier (
    input  wire        clk,             // System clock
    input  wire        rst,             // Synchronous active-high reset
    input  wire        verify_request,  // Starts verification operation
    input  wire [63:0] genome_original, // Original genome
    input  wire [63:0] genome_edited,   // Actual edited genome from Editor
    input  wire [4:0]  edit_position,   // Starting base index of intended edit
    input  wire [7:0]  replacement,     // Intended 4-base replacement sequence
    output reg         verify_pass,     // Asserted when actual matches expected exactly
    output reg  [5:0]  mismatch_count,  // Number of differing bases across 32 bases (0-32)
    output reg         done             // Indicates verification completion
);
    // TODO: Independently construct expected edited genome from original, edit_position,
    // and replacement. Compare against genome_edited across all 32 bases.
endmodule
`;

  const starterVerilogCode = generateStarterVerilogCode(gid);

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
    a.download = `${gid}_genome_x_pkg.v`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ── Top Header Banner ── */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-all duration-500 ${
        isFullyUnlocked 
          ? 'bg-gradient-to-r from-[#121815] via-[#101413] to-[#0d100f] border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.18)]' 
          : 'bg-gradient-to-r from-[#141518] via-[#121316] to-[#0e0f11] border-[#282a30] shadow-[0_0_30px_rgba(0,240,255,0.1)]'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-[#00e5ff] border border-cyan-400/30">
                ACM VIDYUT &times; ENGINEER &apos;26
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                isFullyUnlocked
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
              }`}>
                {isFullyUnlocked ? 'ROUND ONE CHALLENGE UNLOCKED' : 'ENCRYPTED ROUND ONE CHALLENGE'}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono text-[#00e5ff] bg-cyan-950/80 border border-cyan-800">
                SPONSORED BY ARCESIUM
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              {isFullyUnlocked ? (
                <>
                  <Dna className="w-8 h-8 text-emerald-400 shrink-0" />
                  <span>{FINAL_PROBLEM_STATEMENT.title}</span>
                </>
              ) : (
                <>
                  <Lock className="w-8 h-8 text-amber-400 shrink-0" />
                  <span>ROUND ONE PROBLEM STATEMENT &bull; ENCRYPTED</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {isFullyUnlocked
                ? FINAL_PROBLEM_STATEMENT.overview
                : "The official Round 1 Grand Challenge Problem Statement is encrypted. Solve all 5 statement puzzles in the Decryption Matrix to unlock the full architecture brief, synthesizable Verilog code starter kit, and official specification PDF."}
            </p>

            {isFullyUnlocked && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="/GENOME_X_Round1_Problem_Statement.pdf"
                  download="GENOME_X_Round1_Problem_Statement.pdf"
                  onClick={() => soundFx.playZap()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.35)] inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Grand Problem PDF (11 Pages)</span>
                </a>
                <a
                  href="/GENOME_X_Round1_Problem_Statement.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>View PDF in Tab</span>
                </a>
              </div>
            )}
          </div>

          {/* Decryption Gauge Meter */}
          <div className="p-4 rounded-xl bg-[#0f1012]/80 border border-[#222429] text-center min-w-[210px] shrink-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              DECRYPTION PROGRESS
            </div>
            <div className={`text-3xl font-black font-mono my-1 ${isFullyUnlocked ? 'text-emerald-400' : 'text-[#00e5ff]'}`}>
              {progressPercent}%
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {solvedCount} of {puzzles?.length || 5} Puzzles Solved
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full mt-2 overflow-hidden border border-slate-700">
              <div 
                className={`h-full transition-all duration-500 ${
                  isFullyUnlocked 
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' 
                    : 'bg-gradient-to-r from-cyan-400 to-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Target Specs Summary Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Target Platform</div>
          <div className="text-sm font-bold text-white font-mono mt-0.5">Xilinx Artix-7 RTL</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Language Standard</div>
          <div className="text-sm font-bold text-[#00e5ff] font-mono mt-0.5">Verilog-2001 (IEEE 1364)</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Evaluation Score</div>
          <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">100 Points Total</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Title Sponsor</div>
          <div className="text-sm font-bold text-[#00e5ff] font-mono mt-0.5">Arcesium Tech</div>
        </div>
      </div>

      {/* ── 5 Statement Fragments Breakdown Matrix ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-[#00e5ff]" />
            <span>5-Fragment Architectural Blueprints</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {isFullyUnlocked 
              ? "All 5 GENOME-X module fragments decrypted" 
              : `Solve Puzzles 1 through 5 to compile (${puzzles.length - solvedCount} remaining)`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {puzzles.map((p) => {
            const isUnlocked = solvedIds.includes(p.id);

            return (
              <div 
                key={p.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#141518]/90 border-[#282a30] shadow-[0_0_15px_rgba(0,240,255,0.1)]'
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
                      {p.fragment.title}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-mono text-[#00e5ff] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#00e5ff]" />
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
                      Solve Stage {p.stageNumber}
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
                    [ENCRYPTED BITSTREAM BLOCK &bull; REQUIRES STAGE {p.stageNumber} DECRYPTION KEY]
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Gated Content: Locked vs Unlocked View ── */}
      {!isFullyUnlocked ? (
        /* LOCKED STATE: High-Security Cryptographic Gate */
        <div className="p-8 sm:p-12 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#181512] via-[#121316] to-[#0c0d10] text-center space-y-5 shadow-[0_0_40px_rgba(251,191,36,0.12)] relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(251,191,36,0.25)]">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              CRYPTOGRAPHIC AIR-GAP LOCK ACTIVE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Round 1 Problem Statements Locked
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              The official Round One problem statement &mdash; <strong>GENOME-X: Synthetic Genome Editing and Verification Engine</strong> &mdash; is secured behind the encryption matrix. To unlock the full 10-part specification, signal ports, Verilog starter code, and official 11-page problem statement PDF, your team must first decrypt all <strong>5 statement puzzles</strong>.
            </p>
          </div>

          <div className="p-4 max-w-md mx-auto rounded-xl bg-black/60 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Remaining to Decrypt:</span>
            <span className="text-amber-400 font-bold">
              {puzzles.length - solvedCount} of {puzzles.length} Puzzles Left
            </span>
          </div>

          <div className="p-3.5 max-w-md mx-auto rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <FileText className="w-4 h-4 text-amber-400/60" />
              <span>Official 11-Page Problem PDF:</span>
            </div>
            <span className="text-amber-400/80 font-bold flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>LOCKED</span>
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playZap();
                onJumpToStage(nextStageToSolve <= puzzles.length ? nextStageToSolve : 1);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(251,191,36,0.4)] inline-flex items-center gap-2 transition"
            >
              <span>Resume Stage 0{nextStageToSolve <= puzzles.length ? nextStageToSolve : 1} Decryption</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* UNLOCKED STATE: Full Official GENOME-X Specification Document */
        <div className="space-y-8 animate-fadeIn">
          
          {/* ── OFFICIAL SPECIFICATION PDF RELEASE CARD ── */}
          <div className="p-6 sm:p-7 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-[#101923] via-[#0e141c] to-[#0c1017] shadow-[0_0_35px_rgba(0,240,255,0.18)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00e5ff] shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <FileText className="w-6 h-6 text-[#00e5ff]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-[#00e5ff] border border-cyan-500/30">
                    OFFICIAL PDF RELEASE
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    GENOME_X_Round1_Problem_Statement.pdf &bull; 11 Pages (172 KB)
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  Download Official GENOME-X Problem Statement PDF
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  The complete 11-page IEEE document contains the formal mission brief, 2-bit DNA encoding standards, signal port tables (width, direction, active-high resets), synthesizable RTL constraints, and the 100-point evaluation rubric. Use it offline or import into external EDA and simulation tools.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="/GENOME_X_Round1_Problem_Statement.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-medium inline-flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Open in Tab</span>
              </a>
              <a
                href="/GENOME_X_Round1_Problem_Statement.pdf"
                download="GENOME_X_Round1_Problem_Statement.pdf"
                onClick={() => soundFx.playZap()}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-mono font-bold inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
          
          {/* ── PART 1: MISSION BRIEF ── */}
          <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/40 bg-[#121417] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Part 1: Mission Brief &bull; Year 2089</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Emergency Sequence-Search, Editing &amp; Verification Restoration
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              A critical system responsible for processing synthetic genetic sequences has suffered a failure. Its sequence-search, editing, and verification subsystems must be rebuilt before the system can be brought back online.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your mission is to design <strong>GENOME-X</strong>, a digital hardware system that searches a synthetic DNA sequence, identifies a target region, performs a controlled edit, and independently verifies the result. The system must be designed using <strong>synthesizable Verilog</strong>, tested through simulation, and prepared for integration into a complete FPGA-based system in Round 2.
            </p>
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span>
                <strong>Hardware Simulation Notice: </strong>
                {FINAL_PROBLEM_STATEMENT.disclaimer}
              </span>
            </div>
          </div>

          {/* ── PART 2: DNA REPRESENTATION & ENCODING ── */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#262830] bg-[#121316] space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00e5ff] uppercase font-bold tracking-wider">
              <Binary className="w-4 h-4" />
              <span>Part 2: DNA Representation &amp; Bit-Packing Standards</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2-Bit Base Encoding Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                  2-Bit DNA Base Encoding
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#17181c] border-b border-slate-800 text-slate-400 font-mono">
                      <tr>
                        <th className="py-2.5 px-3">Base</th>
                        <th className="py-2.5 px-3">Bit Encoding</th>
                        <th className="py-2.5 px-3">Verilog Literal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {FINAL_PROBLEM_STATEMENT.dnaRepresentation.encoding.map((enc) => (
                        <tr key={enc.base} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-bold text-white text-sm">{enc.base}</td>
                          <td className="py-2.5 px-3 text-[#00e5ff] font-bold">"{enc.bits}"</td>
                          <td className="py-2.5 px-3 text-amber-400">{enc.binary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Sequence Sizes */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                  System Sequence Sizes &amp; Bit Widths
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#17181c] border-b border-slate-800 text-slate-400 font-mono">
                      <tr>
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Hardware Width</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      {FINAL_PROBLEM_STATEMENT.dnaRepresentation.parameters.map((param) => (
                        <tr key={param.parameter} className="hover:bg-slate-900/40">
                          <td className="py-2 px-3 font-semibold text-white">{param.parameter}</td>
                          <td className="py-2 px-3 text-[#00e5ff]">{param.size}</td>
                          <td className="py-2 px-3 text-amber-400">{param.bits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bit-Packing Rule Box */}
            <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-amber-400 font-bold uppercase">
                Critical Genome Packing Rule
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                {FINAL_PROBLEM_STATEMENT.dnaRepresentation.packingRule}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">
                <code>genome[63:62] = Base 0 | genome[61:60] = Base 1 | ... | genome[1:0] = Base 31</code>
              </div>
            </div>
          </div>

          {/* ── PART 3: MODULE NAMING CONVENTION ── */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#262830] bg-[#121316] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00e5ff] uppercase font-bold tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Part 3: Mandatory Module Naming Convention</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Each team must include a unique group identifier in the name of every module it implements. This is mandatory to distinguish modules during evaluation:
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/40 text-sm font-mono text-cyan-300 flex items-center justify-between">
              <span>Required format: <strong>&lt;group_id&gt;_&lt;module_name&gt;</strong></span>
              <span className="text-xs text-slate-400">Example: T07_guide_matcher</span>
            </div>

            {/* Dynamic Group ID Customizer */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1">
                  Enter Your Team Group Identifier:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={groupIdInput}
                    onChange={(e) => setGroupIdInput(e.target.value)}
                    placeholder="e.g. t07 or team01"
                    className="px-3 py-1.5 rounded-lg bg-black border border-slate-700 text-[#00e5ff] font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">
                    (Updates starter code &amp; filenames in real time)
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300">
                Active Prefix: <strong className="text-amber-400">{gid}_*</strong>
              </div>
            </div>
          </div>

          {/* ── PARTS 4 TO 8: MODULE SPECIFICATIONS (MODULES 1 TO 5) ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00e5ff]" />
                <span>Parts 4 &ndash; 8: Detailed Module Specifications</span>
              </h3>
              <div className="flex gap-1 overflow-x-auto text-xs font-mono">
                {['ALL', 'M01', 'M02', 'M03', 'M04', 'M05'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveModuleTab(tab)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      activeModuleTab === tab
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'ALL' ? 'All Modules' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {FINAL_PROBLEM_STATEMENT.modules
                .filter((m) => activeModuleTab === 'ALL' || activeModuleTab === m.id)
                .map((mod) => (
                  <div key={mod.id} className="p-6 rounded-2xl border border-slate-800 bg-[#131418] space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-800 text-[#00e5ff]">
                            {mod.id} &bull; {mod.points} PTS
                          </span>
                          <h4 className="text-base font-bold text-white font-mono">
                            {mod.title}
                          </h4>
                        </div>
                        <div className="text-xs font-mono text-amber-400 mt-1">
                          Required Module Name: <code className="bg-black/60 px-1.5 py-0.5 rounded border border-slate-800">{gid}_{mod.name}</code>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 font-medium max-w-sm text-left sm:text-right">
                        {mod.objective}
                      </div>
                    </div>

                    {/* Signal Ports Table */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                        Interface Signals
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#18191e] border-b border-slate-800 text-slate-400 font-mono">
                            <tr>
                              <th className="py-2 px-3">Signal</th>
                              <th className="py-2 px-3">Direction</th>
                              <th className="py-2 px-3">Width</th>
                              <th className="py-2 px-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50 font-mono text-slate-300">
                            {mod.signals.map((sig) => (
                              <tr key={sig.name} className="hover:bg-slate-900/40">
                                <td className="py-2 px-3 font-bold text-[#00e5ff]">{sig.name}</td>
                                <td className={`py-2 px-3 font-semibold ${sig.dir === 'Input' ? 'text-amber-300' : 'text-emerald-400'}`}>{sig.dir}</td>
                                <td className="py-2 px-3 text-slate-300">{sig.width}</td>
                                <td className="py-2 px-3 text-slate-400 font-sans">{sig.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Functional Requirements */}
                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-mono uppercase text-[#00e5ff] font-bold">
                        Functional Requirements:
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {mod.functionalRequirements.map((req, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* ── PART 9: GENERAL DESIGN REQUIREMENTS ── */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#262830] bg-[#121316] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00e5ff] uppercase font-bold tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Part 9: General Design &amp; Synthesizability Requirements</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              {FINAL_PROBLEM_STATEMENT.generalRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5ff] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── PART 10: TESTING, SUBMISSION & EVALUATION RUBRIC ── */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#262830] bg-[#121316] space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">
              <Award className="w-4 h-4" />
              <span>Part 10: Submission Deliverables &amp; Evaluation Rubric (100 Points)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deliverables Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Required Deliverables
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {FINAL_PROBLEM_STATEMENT.deliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evaluation Points Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Official Scoring Rubric (100 Pts Total)
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#17181c] border-b border-slate-800 text-slate-400 font-mono">
                      <tr>
                        <th className="py-2.5 px-3">Criterion / Subsystem</th>
                        <th className="py-2.5 px-3 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      {FINAL_PROBLEM_STATEMENT.evaluationRubric.map((item) => (
                        <tr key={item.module} className="hover:bg-slate-900/40">
                          <td className="py-2 px-3">
                            <div className="font-semibold text-white">{item.module}</div>
                            <div className="text-[10px] text-slate-500 font-sans">{item.key}</div>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-amber-400">{item.points} pts</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-900 font-bold border-t border-slate-700">
                        <td className="py-2.5 px-3 text-[#00e5ff]">TOTAL SCORE</td>
                        <td className="py-2.5 px-3 text-right text-[#00e5ff]">100 PTS</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── SYNTHESIZABLE VERILOG STARTER SKELETON GENERATOR ── */}
          <div className="p-6 sm:p-8 rounded-2xl border border-cyan-500/50 bg-[#151619] shadow-[0_0_35px_rgba(0,240,255,0.2)] space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#00e5ff]" />
                  <span>Synthesizable Module Skeleton Package ({gid}_genome_x_pkg.v)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ready-to-use IEEE 1364 Verilog-2001 template containing all 5 declared module interfaces customized for group <code className="text-[#00e5ff]">{gid}</code>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">Prefix:</span>
                  <input
                    type="text"
                    value={groupIdInput}
                    onChange={(e) => setGroupIdInput(e.target.value)}
                    placeholder="group_id"
                    className="bg-transparent text-[#00e5ff] font-bold w-16 uppercase focus:outline-none"
                    title="Change group identifier prefix for generated Verilog modules"
                  />
                </div>
                <button
                  onClick={handleCopyStarter}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedCode ? "Copied" : "Copy RTL"}</span>
                </button>
                <a
                  href="/GENOME_X_Round1_Problem_Statement.pdf"
                  download="GENOME_X_Round1_Problem_Statement.pdf"
                  onClick={() => soundFx.playZap()}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  title="Download the official 11-page GENOME-X specification PDF"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Spec PDF</span>
                </a>
                <button
                  onClick={handleDownloadStarter}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {gid}_genome_x_pkg.v</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-700 bg-black/80">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>{gid}_genome_x_pkg.v (5 Modules Skeleton)</span>
                <span className="text-[#00e5ff]">Verilog-2001</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
                <code>{starterVerilogCode}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
