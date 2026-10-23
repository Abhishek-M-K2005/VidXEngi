import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  Sparkles,
  Lock,
  Dna,
  Binary,
  FileCode,
  Terminal,
  AlertTriangle,
  Layers,
  Info
} from 'lucide-react';
import { FINAL_PROBLEM_STATEMENT } from '../data/puzzles';

export const RulesView = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-left">
      
      {/* ── Page Header ── */}
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
          Official tournament guidelines, scoring rubric, and technical criteria for <strong>VERILOG QUEST 2026</strong> &bull; Round 1: Module Design and Verification (<strong>GENOME-X</strong>), presented by ACM NITK Vidyut &times; Engineer NITK '26, sponsored by Arcesium.
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
              ARCESIUM TECH
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Engineering High-Throughput Computational Hardware
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Arcesium delivers sophisticated post-trade technology, asset servicing, and unified data architectures for premier global investment institutions. We are proud to empower hardware innovators at NITK Surathkal to design deterministically verified, synthesizable digital architectures.
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

      {/* ── Structure Overview: Phase 1 vs Round 1 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Phase 1: Statement Puzzles */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Phase 1: 5 Sequential Statement Puzzles
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span><strong>Sequential Progression:</strong> Teams must decrypt each puzzle stage sequentially (Stage N requires Stage N-1 to be verified).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span><strong>Blueprint Compilation:</strong> Each decrypted puzzle unlocks 1 of the 5 module blueprints for the grand challenge &mdash; <em>GENOME-X</em>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span><strong>Air-Gap Lock:</strong> The Round 1 problem statement and module specifications remain encrypted until all 5 puzzles are solved.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
              <span><strong>Scoring &amp; Penalties:</strong> Each stage awards points (100 to 200 pts; 800 pts total). Unlocking hints incurs a timing penalty on the leaderboard.</span>
            </li>
          </ul>
        </div>

        {/* Round 1: GENOME-X Engine */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Dna className="w-4 h-4" />
            Round 1: GENOME-X Engine (100 Points)
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Mission Objective:</strong> Rebuild the sequence-search, window-generation, target-locating, editing, and independent verification subsystems for synthetic DNA sequences.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>5 Interconnected Modules:</strong> Guide Matcher, Genome Window Generator, Target Locator, Genome Editor, and Edit Verifier.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Synthesizability:</strong> Pure synthesizable Verilog-2001 targeting FPGA implementation (Xilinx Artix-7 compatible).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Independent Verification:</strong> The Verifier module must independently reconstruct the expected result without relying on the Editor's signals.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Official 100-Point Evaluation Rubric ── */}
      <div className="matte-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#23252a] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Official Round 1 Evaluation Rubric (100 Points Total)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#00e5ff] font-bold">
            MAX: 100 PTS
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#23252a]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#101113] border-b border-[#202227] text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Subsystem / Criterion</th>
                <th className="py-3 px-3">Module ID</th>
                <th className="py-3 px-4">Key Evaluation Criteria</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2025] font-mono text-zinc-300">
              {FINAL_PROBLEM_STATEMENT.evaluationRubric.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#141519]">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                    <span>{item.module}</span>
                  </td>
                  <td className="py-3 px-3 text-[#00e5ff]">
                    {idx < 5 ? `Module 0${idx + 1}` : 'General'}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-sans text-xs">
                    {item.key}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-400 text-sm">
                    {item.points} pts
                  </td>
                </tr>
              ))}
              <tr className="bg-[#16171c] border-t-2 border-[#2b2d35] font-bold">
                <td colSpan={3} className="py-3 px-4 text-[#00e5ff] uppercase font-mono tracking-wider">
                  Total Evaluation Score
                </td>
                <td className="py-3 px-4 text-right text-[#00e5ff] text-base font-black">
                  100 PTS
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Technical Specifications: DNA Representation & Naming Rules ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* DNA Representation Standards */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-[#00e5ff] uppercase tracking-wider flex items-center gap-2">
            <Binary className="w-4 h-4" />
            DNA Bit-Packing &amp; Representation Standards
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-[#00e5ff] font-bold font-mono">1.</span>
              <span><strong>2-Bit Base Encoding:</strong> A = <code>2'b00</code>, C = <code>2'b01</code>, G = <code>2'b10</code>, T = <code>2'b11</code>. Comparisons must examine corresponding 2-bit DNA bases, not individual bits.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00e5ff] font-bold font-mono">2.</span>
              <span><strong>Genome Packing:</strong> 32 bases = 64 bits. Base 0 occupies bits <code>[63:62]</code>, Base 1 occupies <code>[61:60]</code>, down to Base 31 at <code>[1:0]</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00e5ff] font-bold font-mono">3.</span>
              <span><strong>Sequence Sizes:</strong> Guide sequence is 8 bases (16 bits); Replacement sequence is 4 bases (8 bits); Mismatch threshold is 2 bits (values 0, 1, or 2).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00e5ff] font-bold font-mono">4.</span>
              <span><strong>Target Positions:</strong> Guide Matcher operates on 8-base windows (positions 0 through 24); Genome Editor accepts starting positions 0 through 28.</span>
            </li>
          </ul>
        </div>

        {/* Mandatory Module Naming Convention */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Mandatory Module Naming Convention
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every team must prefix all five module declarations with their assigned group identifier: <code>&lt;group_id&gt;_&lt;module_name&gt;</code>.
          </p>
          <div className="p-3 rounded-lg bg-[#0e0f12] border border-[#23252a] font-mono text-xs space-y-1 text-zinc-300">
            <div className="text-[11px] text-zinc-500 uppercase font-bold">Required Module Names (Example for T07):</div>
            <div className="text-[#00e5ff]">&bull; T07_guide_matcher</div>
            <div className="text-[#00e5ff]">&bull; T07_genome_window_generator</div>
            <div className="text-[#00e5ff]">&bull; T07_target_locator</div>
            <div className="text-[#00e5ff]">&bull; T07_genome_editor</div>
            <div className="text-[#00e5ff]">&bull; T07_edit_verifier</div>
          </div>
          <p className="text-[11px] text-rose-300/80 leading-relaxed flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Do not alter the specified port names, widths, or directions. Using inconsistent module prefixes will result in automated grading testbench failures.</span>
          </p>
        </div>
      </div>

      {/* ── General Synthesizability & Deliverables ── */}
      <div className="matte-card p-6 space-y-4">
        <h4 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#00e5ff]" />
          General RTL Requirements &amp; Submission Deliverables
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-[#00e5ff] uppercase">RTL Design Rules</div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Use synthesizable Verilog-2001 standard.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rising-edge clock (<code>posedge clk</code>) and synchronous active-high reset (<code>rst</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero latch inference; all combinations and default cases fully specified.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero simulation-only delays (<code>#delay</code>) in synthesizable code.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase">Required Deliverables</div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Verilog source files for all 5 modules (<code>&lt;group_id&gt;_*.v</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Self-checking testbench for each module (<code>tb_&lt;group_id&gt;_*.v</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Simulation waveform logs validating boundary conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Brief design documentation detailing window handshaking and connection scheme.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Leaderboard Ranking Criteria & Tie-Breakers ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Official Ranking &amp; Tie-Breakers
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Live standings across the competition are determined by:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 font-mono">
            <li>Number of Decrypted Statement Puzzles (0 to 5)</li>
            <li>Cumulative Statement Score Points</li>
            <li>Effective Solve Timestamp + Penalty Minutes (Ascending)</li>
            <li>Round 1 GENOME-X Automated Grading Score (0 to 100 pts)</li>
          </ol>
        </div>

        {/* Host Chapters & Portals */}
        <div className="matte-card p-5 space-y-3">
          <h4 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00e5ff]" />
            Official Event Portals
          </h4>
          <div className="space-y-2 text-xs">
            <a 
              href="https://engineer.nitk.ac.in" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-[#0e0f11] hover:bg-[#16171b] border border-[#23252a] text-zinc-300 flex items-center justify-between transition"
            >
              <span>Engineer '26 NITK Official Fest</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>
            <div className="p-2.5 rounded-lg bg-[#0e0f11] border border-[#23252a] text-zinc-400 flex items-center justify-between">
              <span>ACM NITK Student Chapter &bull; Vidyut SIG</span>
              <span className="text-[11px] font-mono text-[#00e5ff]">VLSI &amp; Embedded Systems</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Anti-Cheat & Single Active Session Policy ── */}
      <div className="matte-card p-5 space-y-3 border-amber-500/30 bg-amber-950/10">
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
  );
};
