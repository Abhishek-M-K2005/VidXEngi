# VERILOG QUEST '26 &bull; ACM Vidyut &times; Engineer '26 NITK

> **RTL &times; FPGA Hardware Hackathon Decryption Portal**  
> **Host**: ACM NITK Student Chapter &bull; Vidyut SIG &bull; Engineer '26 NITK Surathkal  
> **Title Sponsor**: [Arcesium](https://www.arcesium.com)  
> **Prize Pool**: ₹17,500 INR | **Date**: 25 October 2026 | **Venue**: NITK Surathkal  
> **Official Fest**: [engineer.nitk.ac.in](https://engineer.nitk.ac.in)  
> **Stack**: React 18 (JSX), Tailwind CSS, Vite, Web Audio API

---

## ⚡ Highlights & Features

1. **Pure React JSX Architecture (`.jsx` & `.js`)**
   - Clean, lightweight modular components written entirely in standard JavaScript and JSX with zero TypeScript compilation overhead.

2. **Electric, Live, Gamey Theme (Clean Legible Font)**
   - Interactive high-voltage circuit canvas with live electric spark arcs reacting to cursor movement and node pulses.
   - Clean, modern, highly legible typography using `Inter` paired with `JetBrains Mono` for hardware code, signals, and hex addresses.
   - Built-in zero-dependency **Web Audio API synthesizer** generating real-time hardware clicks, high-voltage zaps, success chimes, and victory fanfares (with mute/unmute toggle).

3. **5 Sequential Statement Puzzles**
   - **Stage 01: Multi-Flag Error Aggregator** (3-flag adder: `assign error_count = err1 + err2 + err3;`)
   - **Stage 02: Symbol Pipeline History Shift Register** (2-stage temporal shift buffer: `always @(posedge clk) history <= {history[1:0], sym_in};`)
   - **Stage 03: Bus Mask Slicing & Injection** (Middle nibble replacement: `assign data_out = {data_in[7:6], 4'b1111, data_in[1:0]};`)
   - **Stage 04: Multi-Driver Conflict Resolution** (Single always block: `always @(posedge clk) if (stop) flag <= 0; else if (start) flag <= 1;`)
   - **Stage 05: 1-Cycle Latency Verification Monitor** (Pipeline delay checking: `always @(posedge clk) dly_reg <= data_in; assign error = (data_out != dly_reg);`)
   - Sequential unlocking: Stage $N$ requires Stage $N-1$ to be solved.
   - Smart syntax-aware Verilog answer normalizer accepting variations in spacing, semicolons, and operator notations.

4. **Grand Final Problem Decryption Matrix: GENOME-X**
   - **GENOME-X**: Synthetic Genome Editing and Verification Engine (Year 2089 Mission).
   - Each solved stage compiles 1 of 5 architectural module blueprints (`<group_id>_guide_matcher`, `<group_id>_genome_window_generator`, `<group_id>_target_locator`, `<group_id>_genome_editor`, `<group_id>_edit_verifier`).
   - Solving all 5 puzzles unlocks the full 10-part specification, DNA base encoding tables, signal interfaces, dynamic group identifier starter package generator, and GitHub submission portal.

5. **Live Leaderboard & Live Analysis**
   - Real-time ranking with podium medals, stage-by-stage decryption matrix, completion timestamps, and penalty tracking.
   - **Live Analysis Dashboard**: Task velocity, fastest solve records, stage completion rates, friction/bottleneck indicators, and cross-team trajectory timeline.
   - **Live Stream Simulation Mode**: Toggle automated real-time incoming solves from competing teams to test live UI responsiveness.

6. **Team Authentication & Demo Accounts**
   - Teams can sign in or register new teams with credentials and member rosters.
   - One-click demo test accounts (`BitFlipper_01`, `SiliconSurfers`, `RTL_Overclockers`) for instant judging and testing.

7. **Prominent Title Sponsor: Arcesium**
   - Featured in header micro-bar, hero banner, challenge specifications, rules handbook, and footer.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
# Running on http://localhost:5173

# Production build
npm run build
```
