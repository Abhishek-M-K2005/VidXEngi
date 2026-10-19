export const PUZZLES = [
  {
    id: 1,
    stageNumber: "01",
    title: "The Ground Wire Anomaly",
    category: "LOGIC GATES",
    difficulty: "STANDARD",
    points: 100,
    storyContext: "At 03:00 hours, NITK's VLSI Cleanroom telemetry reported an illegal voltage spike across Bus Line Alpha. The combinational safety interlock failed because the Karnaugh map minimization was compromised.",
    puzzleStatement: "Examine the 4-input combinational safety circuit with inputs {A, B, C, D}. The minterm specification where the interlock stays ACTIVE HIGH is Σm(1, 3, 5, 7, 9, 11, 13, 15). Notice any pattern across the 4 variables? What is the single, minimal literal or gate equation that represents this entire function? Provide the single uncomplemented input variable that directly drives output Y.",
    hardwareSnippet: {
      language: "verilog",
      code: `// Stage 01: Interlock Diagnostic
module interlock_check (
    input  wire A, B, C, D,
    output wire Y
);
    // Minterms: 1, 3, 5, 7, 9, 11, 13, 15
    // In binary: 0001, 0011, 0101, 0111, 1001, 1011, 1101, 1111
    // Notice the value of input bit D in all active minterms!
    assign Y = /* DECODE MINIMAL SINGLE INPUT VARIABLE */;
endmodule`
    },
    clue: "Look at the binary representation of every single active minterm. Which bit is ALWAYS 1 regardless of A, B, or C?",
    hint: "Every single minterm is an odd number (1, 3, 5, 7, 9, 11, 13, 15). In binary, odd numbers always have LSB D=1. So Y simplifies purely to D.",
    hintPenaltyMinutes: 5,
    acceptedAnswers: ["D", "input D", "assign Y = D", "Y=D", "D=1"],
    explanation: "Because the minterms comprise all 8 states where the least significant bit D is 1 (all odd values from 0 to 15), the 4-variable K-map groups into an entire half-plane octet, simplifying unconditionally to Y = D.",
    fragment: {
      index: 1,
      title: "SYSTEM TOPOLOGY & CORE CLOCK SPECIFICATION",
      subsystemTag: "SYS_TOP_01",
      content: "The NEURA-CORE FPGA co-processor operates synchronously at 250 MHz (4.00 ns period, Artix-7 -2 speed grade). The top-level wrapper interface binds a 64-bit wide AXI4-Stream slave RX (rx_axis_tdata, rx_axis_tvalid, rx_axis_tlast) directly to the optical physical MAC PHY layer with maximum propagation skew under 150 picoseconds.",
      verilogSignature: "input wire clk_250m, rst_n, rx_axis_tvalid, rx_axis_tlast; input wire [63:0] rx_axis_tdata;",
      checksum: "0x8F91A0"
    }
  },
  {
    id: 2,
    stageNumber: "02",
    title: "Clock Jitter on Pin 9: Delta Cycle Hazard",
    category: "VERILOG RTL",
    difficulty: "STANDARD",
    points: 150,
    storyContext: "A rookie synthesis engineer implemented a pipelined register bank using blocking '=' assignments inside a clocked procedural block. In simulation, the second register captured the updated value in the very same clock tick!",
    puzzleStatement: "What is the standard IEEE-1364 Verilog operator that must replace the blocking '=' assignment inside an `always @(posedge clk)` block to prevent delta-cycle race conditions and infer proper sequential D flip-flops?",
    hardwareSnippet: {
      language: "verilog",
      code: `// Faulty Register Chain causing simulation race condition
always @(posedge clk) begin
    q1 = d;    // Race hazard!
    q2 = q1;   // q2 incorrectly receives 'd' in the same delta cycle
end

// Fix: What operator belongs here instead of '=' ?`
    },
    clue: "Two characters: less-than symbol followed by equals sign. In hardware terms, it represents non-blocking assignment.",
    hint: "The operator is '<=' (Non-blocking procedural assignment).",
    hintPenaltyMinutes: 5,
    acceptedAnswers: ["<=", "non-blocking", "non blocking", "<= operator", "non-blocking assignment"],
    explanation: "In Verilog, '<=' schedules evaluation in the Active region and updates in the Non-Blocking Assignment (NBA) region of the event queue, ensuring registers sample previous-cycle values consistently without simulation race hazards.",
    fragment: {
      index: 2,
      title: "PACKET DESERIALIZER & ETHERNET FRAME PARSER",
      subsystemTag: "ETH_PARSER_02",
      content: "The high-speed ingress pipeline must inspect UDP packet headers in 1 clock cycle. It validates IPv4 multicast addresses, extracts the 16-bit market tick sequence ID, and rejects corrupted checksums with zero payload buffering latency.",
      verilogSignature: "output wire [15:0] tick_seq_id, output wire tick_valid, output wire crc_pass;",
      checksum: "0x3B41C9"
    }
  },
  {
    id: 3,
    stageNumber: "03",
    title: "The Metastable Flip-Flop",
    category: "TIMING & METASTABILITY",
    difficulty: "INTERMEDIATE",
    points: 200,
    storyContext: "An external async push-button pulse arrived precisely during the clock transition window. The first flip-flop output oscillated midway between 0V and 1.8V, threatening downstream combinational logic.",
    puzzleStatement: "To protect an RTL design against metastability when sampling an asynchronous single-bit signal into a local clock domain, what classic multi-stage hardware topology is universally used as the baseline synchronizer? (Answer with the name of the topology or number of flip-flops in series)",
    hardwareSnippet: {
      language: "verilog",
      code: `// Async Boundary Synchronizer
module sync_pulse (
    input  wire clk,
    input  wire async_in,
    output wire sync_out
);
    reg stage1, stage2;
    always @(posedge clk) begin
        stage1 <= async_in;
        stage2 <= stage1;  // Resolves metastable state to valid rail
    end
    assign sync_out = stage2;
endmodule`
    },
    clue: "Often abbreviated as '2-FF' or named the 'two flip-flop synchronizer' or 'dual flip flop'.",
    hint: "Enter '2-FF' or 'Two Flip-Flop Synchronizer' or 'Dual Flip Flop'.",
    hintPenaltyMinutes: 8,
    acceptedAnswers: ["2-ff", "2-ff synchronizer", "two flip-flop", "two flip flop", "dual flip flop", "2 flip flop", "double flop", "2ff"],
    explanation: "The two flip-flop (2-FF) synchronizer gives the first metastable flip-flop one full clock cycle to settle exponentially towards a stable logic rail before the second flip-flop samples it, dramatically increasing the MTBF (Mean Time Between Failures).",
    fragment: {
      index: 3,
      title: "CLOCK DOMAIN CROSSING (CDC) FIFO SPECIFICATION",
      subsystemTag: "CDC_QUEUE_03",
      content: "Ingress packet data crosses from the PHY 156.25 MHz clock to the 250 MHz computational engine via a dual-clock asynchronous FIFO. Read and write pointers must be synchronized across domains exclusively via Gray code encoding to prevent multi-bit transit glitches.",
      verilogSignature: "wire [8:0] wr_ptr_gray, rd_ptr_gray; parameter FIFO_DEPTH = 512;",
      checksum: "0x9E7022"
    }
  },
  {
    id: 4,
    stageNumber: "04",
    title: "FSM State Lockout & Encoding",
    category: "FSM ARCHITECTURE",
    difficulty: "INTERMEDIATE",
    points: 250,
    storyContext: "The transaction controller FSM crashed because an alpha particle caused a bit-flip, dropping the state machine into an unmapped state. The synthesizer had stripped the recovery logic.",
    puzzleStatement: "In high-speed FPGA designs, what state encoding style uses exactly one dedicated register per state bit (having Hamming distance = 2 between legal states, avoiding wide decoding muxes and delivering the highest f_max)?",
    hardwareSnippet: {
      language: "verilog",
      code: `// State Encoding Dilemma
localparam STATE_IDLE   = 4'b0001;
localparam STATE_HEADER = 4'b0010;
localparam STATE_PAYLOAD= 4'b0100;
localparam STATE_COMMIT = 4'b1000;
// Exactly one bit is active '1' for each state!`
    },
    clue: "Opposite of binary encoding. Known as 'one-___' encoding.",
    hint: "The encoding is named 'one-hot'.",
    hintPenaltyMinutes: 8,
    acceptedAnswers: ["one-hot", "one hot", "onehot", "one-hot encoding"],
    explanation: "One-hot encoding assigns each state its own flip-flop bit. In FPGAs rich in registers and 6-LUTs, one-hot yields minimal combinational next-state decoding depth, maximizing timing slack at 250+ MHz.",
    fragment: {
      index: 4,
      title: "ORDER-BOOK L3 DEPTH ENGINE",
      subsystemTag: "BOOK_L3_04",
      content: "Maintains top-16 bid and ask limit price levels in high-speed parallel distributed registers. Upon arrival of tick delta, the engine completes priority-insert or cancel operations within 2 clock cycles using parallel comparator trees.",
      verilogSignature: "output wire [31:0] best_bid_price, best_ask_price; output wire [15:0] spread_ticks;",
      checksum: "0x12FA88"
    }
  },
  {
    id: 5,
    stageNumber: "05",
    title: "The Ghost in the LFSR",
    category: "LOGIC GATES",
    difficulty: "INTERMEDIATE",
    points: 300,
    storyContext: "The random testbench generator flatlined into an all-zeros output stream and never recovered. The linear feedback shift register tapped polynomial was mathematically correct, but an illegal seed locked it in an unrecoverable null cycle.",
    puzzleStatement: "Consider a 4-bit Fibonacci LFSR with feedback polynomial P(x) = x^4 + x^3 + 1 (XOR taps on bit 3 and bit 2). If initialized with seed 4'b0000, what will the register contain on the subsequent clock tick? Provide the 4-bit binary value (e.g., 0000).",
    hardwareSnippet: {
      language: "verilog",
      code: `module lfsr_4bit (
    input  wire clk, rst,
    output reg [3:0] q
);
    wire feedback = q[3] ^ q[2];
    always @(posedge clk) begin
        if (rst) q <= 4'b0000; // The fatal seed!
        else     q <= {q[2:0], feedback};
    end
endmodule`
    },
    clue: "0 XOR 0 = 0. Shifting zeros creates... zeros.",
    hint: "Because 0 ^ 0 = 0, shifting produces 4'b0000 forever. The all-zero state is the forbidden lockup trap in XOR LFSRs.",
    hintPenaltyMinutes: 10,
    acceptedAnswers: ["0000", "4'b0000", "0", "4'd0", "4'h0"],
    explanation: "An XOR-based LFSR has an all-zero lockup state because 0^0 evaluates to 0 perpetually. Hardware LFSRs must be initialized with a non-zero seed or use an XNOR gate to enable self-start from zero.",
    fragment: {
      index: 5,
      title: "Q16.16 FIXED-POINT ARBITRAGE ARITHMETIC UNIT",
      subsystemTag: "DSP_ALU_05",
      content: "The mathematical decision kernel computes triangular cross-currency arbitrage differentials: Δ = (Bid_A * Bid_B) - Ask_C using DSP48E1 primitives. All calculations are executed in signed Q16.16 fixed-point format with saturation clipping.",
      verilogSignature: "input wire signed [31:0] price_a, price_b, price_c; output wire signed [31:0] arb_profit;",
      checksum: "0x5C800E"
    }
  },
  {
    id: 6,
    stageNumber: "06",
    title: "ALU Overflow Bit Paradox",
    category: "VERILOG RTL",
    difficulty: "ADVANCED",
    points: 350,
    storyContext: "During a stress test, an 8-bit signed accumulator computed 127 + 1. Instead of 128, the register wrapped around to -128, triggering a catastrophic margin liquidation simulation error.",
    puzzleStatement: "In two's complement binary arithmetic, signed overflow occurs when the carry into the sign bit differs from the carry out of the sign bit. What single 2-input logic gate computes this overflow condition V from Carry_In and Carry_Out (i.e. V = C_in ? C_out)?",
    hardwareSnippet: {
      language: "verilog",
      code: `// 8-bit Signed Adder Overflow Detector
wire c_into_msb;  // Carry into bit 7
wire c_out_msb;   // Carry out of bit 7
wire overflow;    // Active high when signed arithmetic overflows

// What logic gate produces 'overflow' from these two carry bits?
assign overflow = c_into_msb ^ c_out_msb;`
    },
    clue: "The gate outputs 1 when the inputs differ, and 0 when they are identical.",
    hint: "Exclusive OR gate (XOR).",
    hintPenaltyMinutes: 10,
    acceptedAnswers: ["xor", "exclusive or", "exclusive-or", "^", "xor gate"],
    explanation: "Signed two's complement overflow happens if and only if Carry-in to MSB ≠ Carry-out from MSB. The XOR (Exclusive-OR) gate is the fundamental hardware detector for this exact inequality.",
    fragment: {
      index: 6,
      title: "MICROCODE EXECUTION SEQUENCER & TRIGGER DISPATCH",
      subsystemTag: "EXEC_SEQ_06",
      content: "If the calculated arbitrage spread exceeds the dynamic gas/exchange fee threshold (arb_profit > fee_thresh_q16), the execution engine constructs an outbound order execution token in under 8.0 nanoseconds (2 clock cycles).",
      verilogSignature: "output wire order_fire, output wire [63:0] order_token, output wire [15:0] qty_lots;",
      checksum: "0xD432A1"
    }
  },
  {
    id: 7,
    stageNumber: "07",
    title: "Memory Collision in True Dual-Port Block RAM",
    category: "FPGA HARDWARE",
    difficulty: "ADVANCED",
    points: 400,
    storyContext: "Port A and Port B of an FPGA BRAM attempted to access the exact same address 0x3FF simultaneously. Port A was writing while Port B was reading.",
    puzzleStatement: "When a read and write occur at the identical address on the same clock cycle in Xilinx True Dual-Port Block RAM, what memory configuration mode ensures that the read port immediately outputs the freshly written data? (Choose: WRITE_FIRST, READ_FIRST, or NO_CHANGE)",
    hardwareSnippet: {
      language: "verilog",
      code: `// BRAM Collision Mode Definition
// Mode options:
// 1. "WRITE_FIRST" (Transparent mode: output reflects new input data)
// 2. "READ_FIRST"  (Output reflects old stored data before write)
// 3. "NO_CHANGE"   (Output remains latched during write)

(* ram_style = "block" *)
reg [63:0] ram [0:1023];
// Desired mode for instant transparency:`
    },
    clue: "Write occurs before read: WRITE_...",
    hint: "Enter 'WRITE_FIRST'.",
    hintPenaltyMinutes: 10,
    acceptedAnswers: ["write_first", "write first", "write-first", "\"write_first\""],
    explanation: "In Xilinx 7-series and UltraScale Block RAMs, the WRITE_FIRST (also known as transparent mode) attribute guarantees that when a collision occurs, Port B observes the incoming write data from Port A during the same clock cycle.",
    fragment: {
      index: 7,
      title: "CIRCULAR RING BUFFER & SLIPPAGE AUDIT LOG",
      subsystemTag: "RING_BUF_07",
      content: "A 4096-entry 128-bit wide Block RAM configured in WRITE_FIRST mode logs all timestamped tick-to-trade latencies, rejected quotes, and fill confirmations. Backpressure flow control alerts the host via PCIe interrupt if depth hits 90%.",
      verilogSignature: "output wire [11:0] buffer_occupancy, output wire fifo_near_full, output wire pcie_irq;",
      checksum: "0x77E1B5"
    }
  },
  {
    id: 8,
    stageNumber: "08",
    title: "Asynchronous FIFO Gray Code Conversion",
    category: "TIMING & METASTABILITY",
    difficulty: "ADVANCED",
    points: 450,
    storyContext: "In an asynchronous FIFO, passing standard binary pointers across clock domains causes catastrophic read/write pointer corruption when multiple bits flip simultaneously (e.g. from 0111 to 1000). Gray code guarantees only 1 bit changes at any transition.",
    puzzleStatement: "Given a 4-bit binary value B = 4'b1010, what is its corresponding 4-bit Gray code value G? (Formula: G = B ^ (B >> 1). Calculate the 4 bits: b3, b3^b2, b2^b1, b1^b0). Provide the 4-bit binary output.",
    hardwareSnippet: {
      language: "verilog",
      code: `// Binary to Gray Code Converter
function [3:0] bin2gray(input [3:0] bin);
    bin2gray = bin ^ (bin >> 1);
endfunction

// Input:  4'b1010
// Shift:  4'b0101
// XOR:    1010 ^ 0101 = ?`
    },
    clue: "Bit 3 is 1^0 = 1. Bit 2 is 0^1 = 1. Bit 1 is 1^0 = 1. Bit 0 is 0^1 = 1.",
    hint: "1010 XOR 0101 yields 1111.",
    hintPenaltyMinutes: 12,
    acceptedAnswers: ["1111", "4'b1111", "15", "4'hF", "0xF"],
    explanation: "Computing bitwise: MSB remains 1. Next bit: 1^0 = 1. Third bit: 0^1 = 1. LSB: 1^0 = 1. The resulting Gray code for 1010 (binary 10) is 1111.",
    fragment: {
      index: 8,
      title: "HARDWARE CRC32 INTEGRITY ENGINE",
      subsystemTag: "CRC32_ENG_08",
      content: "Computes IEEE 802.3 32-bit Ethernet Cyclic Redundancy Check across 64-bit parallel data words in 1 cycle. Employs optimized Galois XOR matrix generator reducing logic depth to 4 levels of 6-LUTs.",
      verilogSignature: "input wire [63:0] data_in; output wire [31:0] crc32_out; input wire crc_init, crc_en;",
      checksum: "0x20F9C7"
    }
  },
  {
    id: 9,
    stageNumber: "09",
    title: "UART Baud Rate Divisor at 50 MHz",
    category: "FPGA HARDWARE",
    difficulty: "ELITE",
    points: 500,
    storyContext: "The diagnostic FPGA UART console spews garbage characters during boot because the integer divider register was calculated incorrectly for the on-board 50 MHz system oscillator.",
    puzzleStatement: "You have a 50,000,000 Hz (50 MHz) FPGA system clock. You need to generate an oversampled 16x baud tick for a target baud rate of 115,200 bps. The divisor equation is: Divisor = Clock_Frequency / (16 * Baud_Rate). Round the result to the nearest integer. What is this integer divisor value?",
    hardwareSnippet: {
      language: "verilog",
      code: `// UART Baud Rate Generator Parameter
parameter CLK_HZ    = 50_000_000;
parameter BAUD_RATE = 115_200;
parameter OVERSAMPLE= 16;

// Divisor = 50,000,000 / (16 * 115,200)
// Divisor = 50,000,000 / 1,843,200 = 27.1267...
// Nearest Integer: ?`
    },
    clue: "50,000,000 divided by 1,843,200 is approximately 27.126. Nearest whole number?",
    hint: "27",
    hintPenaltyMinutes: 12,
    acceptedAnswers: ["27", "27.13", "0x1B", "8'd27"],
    explanation: "50,000,000 / (16 * 115,200) = 27.1267. Using an integer counter that resets every 27 clock ticks yields an actual baud rate of 115,740 bps, giving an error of just 0.47%, well within the standard 2% UART tolerance limit.",
    fragment: {
      index: 9,
      title: "THERMAL GOVERNOR & DYNAMIC CLOCK SHUTDOWN",
      subsystemTag: "THRM_GOV_09",
      content: "Reads the internal 7-Series XADC temperature sensor at 1 kHz. If junction temperature exceeds 85°C, the governor de-asserts clock gate CE to idle the compute core, preventing thermal runaway while maintaining register state.",
      verilogSignature: "input wire [11:0] xadc_temp_raw; output wire thermal_alarm, core_clk_enable;",
      checksum: "0x6A19FF"
    }
  },
  {
    id: 10,
    stageNumber: "10",
    title: "The FPGA Bitstream Sync Word",
    category: "FPGA HARDWARE",
    difficulty: "ELITE",
    points: 600,
    storyContext: "The JTAG boundary scan programmer is attempting to initialize configuration SRAM on the Artix-7 chip. The hardware configuration controller is scanning incoming serial SPI flash bytes for the universal 32-bit Synchronization Word to align byte boundaries.",
    puzzleStatement: "What is the universal 32-bit hexadecimal Synchronization Word embedded in all Xilinx FPGA bitstreams (Artix-7, Kintex-7, Virtex-7, UltraScale) that tells the configuration state machine to start decoding frame packets? (Format: 8 hex characters, e.g. AA995566 or 0xAA995566)",
    hardwareSnippet: {
      language: "verilog",
      code: `// FPGA Configuration State Machine (UG470)
// 1. Bus Width Auto-Detect: 0x000000BB, 0x11220044
// 2. Dummy Word:            0xFFFFFFFF
// 3. SYNCHRONIZATION WORD:  32'h???????? (0xAA99....)
// Once matched, CFG_STATE transitions to PACKET_PARSE!`
    },
    clue: "It alternates hex digits: AA, 99, 55, 66. Written without spaces: AA995566.",
    hint: "The sync word is AA995566 (or 0xAA995566).",
    hintPenaltyMinutes: 15,
    acceptedAnswers: ["aa995566", "0xaa995566", "32'haa995566", "0xAA995566", "AA995566"],
    explanation: "Per the Xilinx 7 Series FPGAs Configuration User Guide (UG470), the 32-bit Synchronization Word is 0xAA995566. Finding this exact sequence aligns the internal configuration logic to packet boundaries before reading bitstream commands.",
    fragment: {
      index: 10,
      title: "FINAL ARBITRATION PROTOCOL & GOLDEN BITSTREAM RUBRIC",
      subsystemTag: "FINAL_SYNTH_10",
      content: "All 10 subsystems now synthesize into the unified top module 'neura_core_top.v'. Submissions must meet: F_MAX >= 250 MHz on xc7a100tcsg324-2, Total Logic Utilization < 65% LUTs, Zero Setup/Hold timing violations, and pass the 10,000 tick golden market simulation testbench.",
      verilogSignature: "module neura_core_top ( ... full top-level netlist available for download ... );",
      checksum: "0x4EEB90"
    }
  }
];

export const FINAL_PROBLEM_STATEMENT = {
  title: "PROJECT NEURA-CORE: ZERO-LATENCY ARBITRAGE CO-PROCESSOR",
  subtitle: "ACM Vidyut x Engineer '26 NITK Hardware Hackathon Grand Challenge",
  sponsor: "Sponsored by Arcesium",
  targetHardware: "Xilinx Artix-7 FPGA (xc7a100tcsg324-2)",
  clockConstraint: "250.00 MHz (4.00 ns period, WNS >= 0.250 ns)",
  prizePool: "₹17,500 INR",
  overview: "Modern algorithmic trading institutions rely on ultra-low-latency FPGA hardware to detect and execute multi-currency triangular arbitrage opportunities in under 50 nanoseconds. Your team's mission in this grand challenge is to implement and synthesize 'neura_core_top', a real-time hardware co-processor capable of processing 64-bit Ethernet AXI-Stream ticks, updating an internal 16-level L3 order book, computing fixed-point arbitrage spreads, and dispatching signed order execution tokens with deterministic zero packet drops.",
  designRequirements: [
    "Clock Frequency: Synchronous operation at 250 MHz on Artix-7 (-2 speed grade). All primary datapath registers must exhibit strictly positive Worst Negative Slack (WNS > 0.00 ns).",
    "AXI4-Stream Ingress: Ingest 64-bit wide network ticks via rx_axis_tdata, parse IP/UDP multicast frame headers in 1 clock cycle.",
    "Order Book L3 Engine: Maintain Top-16 bid and ask limit prices with priority-insert and tick cancellation in <= 2 clock cycles.",
    "Q16.16 DSP Arithmetic: Compute cross-rate triangular arbitrage formula: Δ = (Bid_A * Bid_B) - Ask_C utilizing dedicated DSP48E1 primitives.",
    "Asynchronous CDC: Safe dual-clock asynchronous boundary crossing using Gray-coded pointers with 2-FF MTBF protection.",
    "Outbound Execution Token: Emit a 64-bit fire token within 2 clock cycles of opportunity trigger.",
    "Hardware Integrity: Validate frame payload with parallel 64-bit CRC32 engine matching IEEE 802.3 standard."
  ],
  deliverables: [
    "Synthesizable Verilog / SystemVerilog source files (neura_core_top.v and child modules)",
    "Vivado Timing Summary Report demonstrating zero timing violations (Setup, Hold, Pulse Width)",
    "Self-checking testbench (tb_neura_core.sv) simulating 10,000 synthetic market ticks with zero dropped packets",
    "A 2-page Architecture Architecture Brief documenting pipeline stage latency and resource utilization (LUTs, FFs, BRAMs, DSPs)"
  ]
};
