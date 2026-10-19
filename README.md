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

3. **10 Sequential Statement Puzzles**
   - **Stage 01: The Ground Wire Anomaly** (K-Map min-term octet reduction)
   - **Stage 02: Clock Jitter on Pin 9** (Verilog non-blocking `<=` delta-cycle race prevention)
   - **Stage 03: The Metastable Flip-Flop** (2-FF synchronizer topology & MTBF)
   - **Stage 04: FSM State Lockout** (One-hot encoding for high-speed FPGA LUTs)
   - **Stage 05: The Ghost in the LFSR** (XOR LFSR all-zero lockup trap)
   - **Stage 06: ALU Overflow Bit Paradox** (Two's complement signed carry XOR condition)
   - **Stage 07: Memory Collision in BRAM** (True Dual-Port RAM `WRITE_FIRST` mode)
   - **Stage 08: Async FIFO Gray Code** (Gray pointer conversion `G = B ^ (B >> 1)`)
   - **Stage 09: UART Baud Rate Divisor** (50 MHz to 115,200 baud integer divisor `27`)
   - **Stage 10: FPGA Bitstream Sync Word** (Xilinx 32-bit sync word `0xAA995566`)
   - Sequential unlocking: Stage $N$ requires Stage $N-1$ to be solved.
   - Instant verification feedback, interactive hint system with time penalties, and code copy tools.

4. **Grand Final Problem Decryption Matrix**
   - **PROJECT NEURA-CORE**: 250 MHz Zero-Latency Triangular Arbitrage Co-Processor on Xilinx Artix-7.
   - Each solved stage compiles 1 of 10 architectural fragments.
   - When all 10 are solved, unlocks the full synthesizable top-level Verilog template (`neura_core_top.v`), testbench specification, timing constraint criteria (WNS > 0.0 ns), and submission portal.

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
