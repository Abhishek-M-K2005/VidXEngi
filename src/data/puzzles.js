export const PUZZLES = [
  {
    id: 1,
    stageNumber: "01",
    title: "Multi-Flag Error Aggregator",
    category: "COMBINATIONAL LOGIC",
    difficulty: "STANDARD",
    points: 100,
    storyContext: "At 03:00 hours, NITK's Cleanroom telemetry detected asynchronous fault transients across primary Bus Lines Alpha, Beta, and Gamma. To assess fault severity, the supervisory safety interlock requires an instantaneous tally of all active high error flags.",
    puzzleStatement: "You have three independent 1-bit error flags: err1, err2, and err3. Write the combinational logic to output a 2-bit error_count showing exactly how many flags are high.",
    hardwareSnippet: {
      language: "verilog",
      code: `// Stage 01: Multi-Flag Error Accumulator
module error_accumulator (
    input  wire err1, err2, err3,
    output wire [1:0] error_count
);
    // Write the continuous assignment to count active high flags:
    assign error_count = /* COMBINATIONAL ADDER LOGIC */;
endmodule`
    },
    clue: "In Verilog, 1-bit signals can be directly summed using the addition operator `+`. Summing three 1-bit signals produces a result from 0 to 3, perfectly fitting a 2-bit wire.",
    hint: "Use continuous assignment: assign error_count = err1 + err2 + err3;",
    hintPenaltyMinutes: 5,
    acceptedAnswers: [
      "assign error_count = err1 + err2 + err3;",
      "assign error_count = err1 + err2 + err3",
      "error_count = err1 + err2 + err3;",
      "error_count = err1 + err2 + err3",
      "err1 + err2 + err3;",
      "err1 + err2 + err3",
      "err1+err2+err3",
      "assign error_count = {1'b0, err1} + {1'b0, err2} + {1'b0, err3};",
      "assign error_count = {1'b0, err1} + {1'b0, err2} + {1'b0, err3}",
      "{1'b0, err1} + {1'b0, err2} + {1'b0, err3}",
      "assign error_count = (err1 + err2 + err3);",
      "assign error_count = (err1 + err2 + err3)"
    ],
    explanation: "Because err1, err2, and err3 are single-bit wires evaluated in a 2-bit context, the addition operator sums their binary values (0 or 1) to produce a 2-bit binary count between 2'b00 (0) and 2'b11 (3).",
    fragment: {
      index: 1,
      title: "MODULE 1: GUIDE MATCHER BLUEPRINT",
      subsystemTag: "GENOME_M01",
      content: "Module 1 (<group_id>_guide_matcher) performs 2-bit base-by-base comparisons between an 8-base candidate window (16 bits) and an 8-base guide sequence (16 bits). Encodes A='00', C='01', G='10', T='11'. Counts mismatching bases and asserts match when mismatch_count <= threshold (0-2).",
      verilogSignature: "module <group_id>_guide_matcher (input wire [15:0] guide, input wire [15:0] window, input wire [1:0] threshold, output wire [3:0] mismatch_count, output wire match);",
      checksum: "0x8F91A0"
    }
  },
  {
    id: 2,
    stageNumber: "02",
    title: "Symbol Pipeline History Shift Register",
    category: "SEQUENTIAL LOGIC",
    difficulty: "INTERMEDIATE",
    points: 150,
    storyContext: "The genetic sequencer must track continuous streaming sequence fragments arriving over serial lanes. Upstream pattern locators require a continuous side-by-side view of the most recent symbol alongside its preceding symbol.",
    puzzleStatement: "A 2-bit symbol sym_in arrives every clock cycle. You need to output a 4-bit history bus that always holds the previous symbol and the symbol before that, side-by-side.",
    hardwareSnippet: {
      language: "verilog",
      code: `// Stage 02: 2-Stage Symbol Pipeline History Buffer
module symbol_tracker (
    input  wire       clk,
    input  wire [1:0] sym_in,
    output reg  [3:0] history
);
    // Shift incoming 2-bit symbol into the 4-bit history register:
    always @(posedge clk) begin
        history <= /* CONCATENATION SHIFT EXPRESSION */;
    end
endmodule`
    },
    clue: "Use Verilog concatenation `{}` inside a clocked procedural block: shift the current lower 2 bits of history alongside the incoming `sym_in`.",
    hint: "always @(posedge clk) history <= {history[1:0], sym_in};",
    hintPenaltyMinutes: 5,
    acceptedAnswers: [
      "always @(posedge clk) history <= {history[1:0], sym_in};",
      "always @(posedge clk) history <= {history[1:0], sym_in}",
      "always @(posedge clk) begin history <= {history[1:0], sym_in}; end",
      "always @(posedge clk) history <= {sym_in, history[3:2]};",
      "always @(posedge clk) history <= {sym_in, history[3:2]}",
      "history <= {history[1:0], sym_in};",
      "history <= {history[1:0], sym_in}",
      "history <= {sym_in, history[3:2]};",
      "history <= {sym_in, history[3:2]}",
      "{history[1:0], sym_in}",
      "{history[1:0],sym_in}",
      "{sym_in, history[3:2]}",
      "{sym_in,history[3:2]}"
    ],
    explanation: "At every rising clock edge, `{history[1:0], sym_in}` shifts the older symbol into upper bits `[3:2]` and stores the new incoming symbol `sym_in` into lower bits `[1:0]`, providing a continuous 2-symbol temporal history.",
    fragment: {
      index: 2,
      title: "MODULE 2: GENOME WINDOW GENERATOR BLUEPRINT",
      subsystemTag: "GENOME_M02",
      content: "Module 2 (<group_id>_genome_window_generator) accepts sequential 8-base incoming fragments (16 bits) synchronized to clk and synchronous active-high rst. Generates consecutive overlapping 8-base windows across fragment boundaries with window_valid handshaking.",
      verilogSignature: "module <group_id>_genome_window_generator (input wire clk, rst, fragment_valid, input wire [15:0] fragment, output wire [15:0] window, output wire window_valid);",
      checksum: "0x3B41C9"
    }
  },
  {
    id: 3,
    stageNumber: "03",
    title: "Bus Mask Slicing & Injection",
    category: "BIT SLICING & CONCATENATION",
    difficulty: "STANDARD",
    points: 150,
    storyContext: "During DNA sequence reconstruction, the diagnostic test unit must force an emergency override mask into a sequence header. The middle 4 nibble bits must be clamped to all-ones (0xF) while preserving the high-order and low-order status bits unmodified.",
    puzzleStatement: "You have an 8-bit bus data_in. Write a continuous assignment that outputs data_out where the middle 4 bits (bits 5 down to 2) are replaced with 4'b1111, but the outer bits are left untouched.",
    hardwareSnippet: {
      language: "verilog",
      code: `// Stage 03: Middle-Bit Mask Injection Engine
module mask_replace (
    input  wire [7:0] data_in,
    output wire [7:0] data_out
);
    // Replace bits [5:2] with 4'b1111, preserving bits [7:6] and [1:0]:
    assign data_out = /* CONCATENATION REPLACEMENT */;
endmodule`
    },
    clue: "Split `data_in` using bus slicing: take upper bits `data_in[7:6]`, concatenate literal `4'b1111`, and concatenate lower bits `data_in[1:0]` inside `{}`.",
    hint: "assign data_out = {data_in[7:6], 4'b1111, data_in[1:0]};",
    hintPenaltyMinutes: 5,
    acceptedAnswers: [
      "assign data_out = {data_in[7:6], 4'b1111, data_in[1:0]};",
      "assign data_out = {data_in[7:6], 4'b1111, data_in[1:0]}",
      "assign data_out = {data_in[7:6], 4'hf, data_in[1:0]};",
      "assign data_out = {data_in[7:6], 4'hf, data_in[1:0]}",
      "data_out = {data_in[7:6], 4'b1111, data_in[1:0]};",
      "data_out = {data_in[7:6], 4'b1111, data_in[1:0]}",
      "{data_in[7:6], 4'b1111, data_in[1:0]};",
      "{data_in[7:6], 4'b1111, data_in[1:0]}",
      "{data_in[7:6],4'b1111,data_in[1:0]}",
      "{data_in[7:6], 4'hf, data_in[1:0]}",
      "{data_in[7:6],4'hf,data_in[1:0]}"
    ],
    explanation: "Verilog concatenation `{data_in[7:6], 4'b1111, data_in[1:0]}` reassembles the 8-bit bus by preserving the 2 most-significant bits [7:6], inserting the 4-bit literal 1111 into positions [5:2], and preserving the 2 least-significant bits [1:0].",
    fragment: {
      index: 3,
      title: "MODULE 3: TARGET LOCATOR BLUEPRINT",
      subsystemTag: "GENOME_M03",
      content: "Module 3 (<group_id>_target_locator) searches a 32-base genome (64 bits, packed base 0 at [63:62]) from base index 0 through 24 for the first eligible target matching the guide sequence within the mismatch threshold (0-2). Reports leftmost target_position, mismatch_count, target_found, and done.",
      verilogSignature: "module <group_id>_target_locator (input wire clk, rst, start, input wire [63:0] genome, input wire [15:0] guide, input wire [1:0] threshold, output wire target_found, output wire [4:0] target_position, output wire [3:0] mismatch_count, output wire done);",
      checksum: "0xA790EE"
    }
  },
  {
    id: 4,
    stageNumber: "04",
    title: "Multi-Driver Conflict Resolution",
    category: "RTL RACE CONDITIONS",
    difficulty: "INTERMEDIATE",
    points: 200,
    storyContext: "A junior RTL engineer attempted to implement an execution trigger flag for the editing stage using two concurrent `always` blocks. During EDA synthesis, the compiler aborted with a critical 'multi-driven net' fatal error because both procedural blocks assign to the same register.",
    puzzleStatement: `A student wants a flag to turn ON when start is high, and OFF when stop is high.
Correct the student's code to make it work:
always @(posedge clk) if (start) flag <= 1;
always @(posedge clk) if (stop)  flag <= 0;`,
    hardwareSnippet: {
      language: "verilog",
      code: `// Stage 04: Multiple-Driver Elimination
// BUGGY SYNTHESIS ATTEMPT:
//   always @(posedge clk) if (start) flag <= 1;
//   always @(posedge clk) if (stop)  flag <= 0; // Fatal: multi-driven register!

// Provide the single unified always block with proper priority logic:
always @(posedge clk) begin
    /* UNIFIED CONDITIONAL PRIORITY LOGIC */
end`
    },
    clue: "In hardware, a register can only be assigned within a SINGLE procedural `always` block. Unify the two conditions into one block using `if ... else if ...`.",
    hint: "always @(posedge clk) if (stop) flag <= 0; else if (start) flag <= 1;",
    hintPenaltyMinutes: 8,
    acceptedAnswers: [
      "always @(posedge clk) if (stop) flag <= 0; else if (start) flag <= 1;",
      "always @(posedge clk) if (stop) flag <= 0; else if (start) flag <= 1",
      "always @(posedge clk) if (start) flag <= 1; else if (stop) flag <= 0;",
      "always @(posedge clk) if (start) flag <= 1; else if (stop) flag <= 0",
      "if (stop) flag <= 0; else if (start) flag <= 1;",
      "if (stop) flag <= 0; else if (start) flag <= 1",
      "if (start) flag <= 1; else if (stop) flag <= 0;",
      "if (start) flag <= 1; else if (stop) flag <= 0",
      "always @(posedge clk) begin if (stop) flag <= 0; else if (start) flag <= 1; end",
      "always @(posedge clk) begin if (start) flag <= 1; else if (stop) flag <= 0; end",
      "always @(posedge clk) if (stop) flag <= 1'b0; else if (start) flag <= 1'b1;",
      "always @(posedge clk) if (start) flag <= 1'b1; else if (stop) flag <= 1'b0;",
      "if (stop) flag <= 1'b0; else if (start) flag <= 1'b1;",
      "if (start) flag <= 1'b1; else if (stop) flag <= 1'b0;",
      "single always block"
    ],
    explanation: "Multiple `always` blocks driving the same register violate synthesis rules because they create conflicting physical drivers on the flip-flop D-input. Merging both conditions into a single clocked block with priority (`if (stop) ... else if (start) ...`) creates a deterministic, valid hardware circuit.",
    fragment: {
      index: 4,
      title: "MODULE 4: GENOME EDITOR BLUEPRINT",
      subsystemTag: "GENOME_M04",
      content: "Module 4 (<group_id>_genome_editor) performs controlled 4-base substitution (8 bits) into a 32-base genome (64 bits) starting at edit_position (valid from 0 through 28). Preserves all untouched bases, rejects out-of-range positions without corruption, and asserts edit_success & done.",
      verilogSignature: "module <group_id>_genome_editor (input wire clk, rst, edit_request, input wire [63:0] genome_in, input wire [4:0] edit_position, input wire [7:0] replacement, output wire [63:0] genome_out, output wire edit_success, output wire done);",
      checksum: "0x1994EF"
    }
  },
  {
    id: 5,
    stageNumber: "05",
    title: "1-Cycle Latency Verification Monitor",
    category: "TIMING & ASSERTION",
    difficulty: "INTERMEDIATE",
    points: 200,
    storyContext: "The independent genome verification engine must monitor sequence transformations. The automated telemetry monitor must verify pipeline contracts and raise a hardware assertion flag whenever an unexpected delay or corruption occurs.",
    puzzleStatement: "A module takes data_in and spits out data_out exactly one clock cycle later. Assert an error flag if data_out does not match the original data_in.",
    hardwareSnippet: {
      language: "verilog",
      code: `// Stage 05: 1-Cycle Pipeline Verification Monitor
module latency_checker (
    input  wire clk,
    input  wire [7:0] data_in,
    input  wire [7:0] data_out,
    output wire error
);
    reg [7:0] dly_reg;

    // Register data_in by one clock cycle, then assert error if mismatch:
    always @(posedge clk) dly_reg <= data_in;
    assign error = /* INEQUALITY COMPARISON */;
endmodule`
    },
    clue: "Store `data_in` on `posedge clk` in an intermediate register (`dly_reg <= data_in;`), and continuously assert `error` when `data_out` is not equal to `dly_reg` (`data_out != dly_reg`).",
    hint: "always @(posedge clk) dly_reg <= data_in;\nassign error = (data_out != dly_reg);",
    hintPenaltyMinutes: 8,
    acceptedAnswers: [
      "always @(posedge clk) dly_reg <= data_in; assign error = (data_out != dly_reg);",
      "always @(posedge clk) dly_reg <= data_in; assign error = (data_out != dly_reg)",
      "always @(posedge clk) dly_reg <= data_in; assign error = data_out != dly_reg;",
      "always @(posedge clk) dly_reg <= data_in; assign error = data_out != dly_reg",
      "always @(posedge clk) begin dly_reg <= data_in; end assign error = (data_out != dly_reg);",
      "always @(posedge clk) dly_reg <= data_in; assign error = (data_in_d != data_out);",
      "always @(posedge clk) data_dly <= data_in; assign error = (data_out != data_dly);",
      "assign error = (data_out != dly_reg);",
      "assign error = (data_out != dly_reg)",
      "assign error = data_out != dly_reg;",
      "assign error = data_out != dly_reg",
      "error = (data_out != dly_reg);",
      "error = (data_out != dly_reg)",
      "(data_out != dly_reg)",
      "data_out != dly_reg",
      "dly_reg <= data_in; assign error = (data_out != dly_reg);",
      "dly_reg <= data_in; assign error = (data_out != dly_reg)"
    ],
    explanation: "Because `data_out` represents the module's output 1 cycle later, sampling `data_in` into `dly_reg` at `posedge clk` aligns both signals in the same clock cycle. Comparing `(data_out != dly_reg)` asserts `error` whenever the pipeline output deviates from the delayed input.",
    fragment: {
      index: 5,
      title: "MODULE 5: EDIT VERIFIER BLUEPRINT",
      subsystemTag: "GENOME_M05",
      content: "Module 5 (<group_id>_edit_verifier) independently reconstructs the expected edited genome from genome_original, edit_position, and replacement. Compares against actual genome_edited across all 32 bases, outputting 6-bit mismatch_count, verify_pass (only on exact 32-base match), and done.",
      verilogSignature: "module <group_id>_edit_verifier (input wire clk, rst, verify_request, input wire [63:0] genome_original, genome_edited, input wire [4:0] edit_position, input wire [7:0] replacement, output wire verify_pass, output wire [5:0] mismatch_count, output wire done);",
      checksum: "0xFE5591"
    }
  }
];

export const FINAL_PROBLEM_STATEMENT = {
  title: "GENOME-X: SYNTHETIC GENOME EDITING & VERIFICATION ENGINE",
  subtitle: "Verilog Quest 2026 | Round 1: Module Design and Verification",
  sponsor: "Sponsored by Arcesium",
  targetHardware: "FPGA Synthesizable Digital Hardware (Xilinx Artix-7 compatible)",
  clockConstraint: "Synchronous Rising-Edge Clock & Synchronous Active-High Reset",
  prizePool: "₹17,500 INR",
  year: "2089",
  overview: "A critical system responsible for processing synthetic genetic sequences has suffered a failure. Its sequence-search, editing, and verification subsystems must be rebuilt before the system can be brought back online. Your mission is to design GENOME-X, a digital hardware system that searches a synthetic DNA sequence, identifies a target region, performs a controlled edit, and independently verifies the result using synthesizable Verilog.",
  disclaimer: "This is a digital hardware simulation using synthetic sequence data. It does not perform actual biological gene editing.",
  
  dnaRepresentation: {
    encoding: [
      { base: "A", bits: "00", binary: "2'b00" },
      { base: "C", bits: "01", binary: "2'b01" },
      { base: "G", bits: "10", binary: "2'b10" },
      { base: "T", bits: "11", binary: "2'b11" }
    ],
    parameters: [
      { parameter: "Genome", size: "32 bases", bits: "64 bits", description: "Packed base 0 at [63:62], base 1 at [61:60], down to base 31 at [1:0]" },
      { parameter: "Guide sequence", size: "8 bases", bits: "16 bits", description: "Target sequence to locate within the genome" },
      { parameter: "Replacement sequence", size: "4 bases", bits: "8 bits", description: "Controlled sequence to substitute into the target region" },
      { parameter: "Mismatch threshold", size: "Configurable", bits: "2 bits", description: "Permitted differing bases (0, 1, or 2)" }
    ],
    packingRule: "The genome is packed such that base 0 occupies bits [63:62], base 1 occupies [61:60], base 2 occupies [59:58], and so on, with base 31 at [1:0]."
  },

  namingConvention: {
    rule: "<group_id>_<module_name>",
    exampleGroupId: "T07",
    examples: [
      "T07_guide_matcher",
      "T07_genome_window_generator",
      "T07_target_locator",
      "T07_genome_editor",
      "T07_edit_verifier"
    ],
    guidelines: [
      "Use a short, unique group identifier assigned or approved by the organizers (e.g., T01, T07).",
      "Use lowercase letters, numbers, and underscores only.",
      "Preserve the required module-name suffix exactly.",
      "Ensure all declarations, instantiations, and testbenches use the same prefix.",
      "Do not modify the specified input/output names or bit widths."
    ]
  },

  modules: [
    {
      id: "M01",
      name: "guide_matcher",
      fullName: "<group_id>_guide_matcher",
      title: "Module 1: Guide Matcher",
      points: 15,
      objective: "Determine whether an 8-base candidate window matches a given guide sequence.",
      signals: [
        { name: "guide", dir: "Input", width: "16 bits", desc: "8-base guide sequence" },
        { name: "window", dir: "Input", width: "16 bits", desc: "Candidate 8-base window" },
        { name: "threshold", dir: "Input", width: "2 bits", desc: "Maximum permitted mismatches, 0–2" },
        { name: "mismatch_count", dir: "Output", width: "4 bits", desc: "Number of differing bases (0 to 8)" },
        { name: "match", dir: "Output", width: "1 bit", desc: "Asserted when mismatch_count <= threshold" }
      ],
      functionalRequirements: [
        "Compare corresponding DNA bases, not individual bits.",
        "Count the number of positions where the 2-bit bases differ.",
        "Assert 'match' when 'mismatch_count' is less than or equal to 'threshold'.",
        "Handle threshold values of 0, 1, and 2 correctly."
      ]
    },
    {
      id: "M02",
      name: "genome_window_generator",
      fullName: "<group_id>_genome_window_generator",
      title: "Module 2: Genome Window Generator",
      points: 20,
      objective: "Generate overlapping 8-base windows from consecutive incoming input fragments (each fragment contains 8 bases = 16 bits).",
      signals: [
        { name: "clk", dir: "Input", width: "1 bit", desc: "System clock" },
        { name: "rst", dir: "Input", width: "1 bit", desc: "Synchronous active-high reset" },
        { name: "fragment", dir: "Input", width: "16 bits", desc: "Incoming 8-base fragment" },
        { name: "fragment_valid", dir: "Input", width: "1 bit", desc: "Indicates a valid incoming fragment" },
        { name: "window", dir: "Output", width: "16 bits", desc: "Generated 8-base candidate window" },
        { name: "window_valid", dir: "Output", width: "1 bit", desc: "Indicates a valid output window" }
      ],
      functionalRequirements: [
        "Accept fragments in sequence.",
        "Generate consecutive, overlapping 8-base windows across fragment boundaries.",
        "Preserve the order of bases.",
        "Avoid losing or duplicating windows.",
        "Define and implement when the first output window becomes valid.",
        "Document clearly the behavior and timing of the window generator in design explanations."
      ]
    },
    {
      id: "M03",
      name: "target_locator",
      fullName: "<group_id>_target_locator",
      title: "Module 3: Target Locator",
      points: 20,
      objective: "Search a 32-base genome and identify the first eligible target matching the guide sequence.",
      signals: [
        { name: "clk", dir: "Input", width: "1 bit", desc: "System clock" },
        { name: "rst", dir: "Input", width: "1 bit", desc: "Synchronous active-high reset" },
        { name: "start", dir: "Input", width: "1 bit", desc: "Starts a search operation" },
        { name: "genome", dir: "Input", width: "64 bits", desc: "Original 32-base genome" },
        { name: "guide", dir: "Input", width: "16 bits", desc: "8-base guide sequence" },
        { name: "threshold", dir: "Input", width: "2 bits", desc: "Maximum permitted mismatches (0–2)" },
        { name: "target_found", dir: "Output", width: "1 bit", desc: "Indicates an eligible target was found" },
        { name: "target_position", dir: "Output", width: "5 bits", desc: "Starting base index of the selected target (0–24)" },
        { name: "mismatch_count", dir: "Output", width: "4 bits", desc: "Mismatch count at the selected target" },
        { name: "done", dir: "Output", width: "1 bit", desc: "Indicates that search has completed" }
      ],
      functionalRequirements: [
        "Search the genome from base position 0 through base position 24.",
        "Examine all valid 8-base windows, including overlapping windows.",
        "Use the configured mismatch threshold.",
        "Report the leftmost eligible target, its starting position, and its mismatch count.",
        "Correctly indicate when no eligible target exists (target_found = 0).",
        "Assert 'done' when the search has finished.",
        "Use the functionality of both Guide Matcher and Genome Window Generator (document interface and connection method)."
      ]
    },
    {
      id: "M04",
      name: "genome_editor",
      fullName: "<group_id>_genome_editor",
      title: "Module 4: Genome Editor",
      points: 20,
      objective: "Perform a controlled substitution of four consecutive bases at a specified position.",
      signals: [
        { name: "clk", dir: "Input", width: "1 bit", desc: "System clock" },
        { name: "rst", dir: "Input", width: "1 bit", desc: "Synchronous active-high reset" },
        { name: "edit_request", dir: "Input", width: "1 bit", desc: "Requests an edit operation" },
        { name: "genome_in", dir: "Input", width: "64 bits", desc: "Original 32-base genome" },
        { name: "edit_position", dir: "Input", width: "5 bits", desc: "Starting base index of the edit (valid 0–28)" },
        { name: "replacement", dir: "Input", width: "8 bits", desc: "Four-base replacement sequence" },
        { name: "genome_out", dir: "Output", width: "64 bits", desc: "Resulting edited 32-base genome" },
        { name: "edit_success", dir: "Output", width: "1 bit", desc: "Indicates a successful edit" },
        { name: "done", dir: "Output", width: "1 bit", desc: "Indicates request completion" }
      ],
      functionalRequirements: [
        "Replace exactly four consecutive bases beginning at 'edit_position'.",
        "Accept only starting positions from 0 through 28, inclusive.",
        "Preserve all bases outside the selected four-base region.",
        "Reject invalid edit positions (edit_position > 28).",
        "Ensure a rejected request does not modify the genome (genome_out matches genome_in).",
        "Assert 'done' and indicate whether the edit succeeded via 'edit_success'."
      ]
    },
    {
      id: "M05",
      name: "edit_verifier",
      fullName: "<group_id>_edit_verifier",
      title: "Module 5: Edit Verifier",
      points: 20,
      objective: "Independently verify that the Genome Editor performed the intended substitution without introducing unintended changes.",
      signals: [
        { name: "clk", dir: "Input", width: "1 bit", desc: "System clock" },
        { name: "rst", dir: "Input", width: "1 bit", desc: "Synchronous active-high reset" },
        { name: "verify_request", dir: "Input", width: "1 bit", desc: "Starts verification operation" },
        { name: "genome_original", dir: "Input", width: "64 bits", desc: "Original unedited genome" },
        { name: "genome_edited", dir: "Input", width: "64 bits", desc: "Actual edited genome from Editor" },
        { name: "edit_position", dir: "Input", width: "5 bits", desc: "Starting base index of the intended edit" },
        { name: "replacement", dir: "Input", width: "8 bits", desc: "Intended 4-base replacement sequence" },
        { name: "verify_pass", dir: "Output", width: "1 bit", desc: "Asserted when actual result matches expected result exactly" },
        { name: "mismatch_count", dir: "Output", width: "6 bits", desc: "Number of differing bases between expected and actual (0–32)" },
        { name: "done", dir: "Output", width: "1 bit", desc: "Indicates verification completion" }
      ],
      functionalRequirements: [
        "Independently construct the expected edited genome using genome_original, edit_position, and replacement.",
        "Compare the expected genome against actual genome_edited across all 32 bases.",
        "Assert 'verify_pass' only when expected and actual genomes match exactly across all 32 bases.",
        "Report the number of differing DNA bases in 'mismatch_count'.",
        "Assert 'done' when verification is complete.",
        "Reconstruct the expected result independently without relying solely on the Editor's 'edit_success' signal."
      ]
    }
  ],

  generalRequirements: [
    "Use synthesizable Verilog-2001.",
    "Use the exact required signal names, widths, and directions as specified in this document.",
    "Use a rising-edge clock (posedge clk) and synchronous active-high reset (rst) for sequential modules.",
    "Avoid unintended latch inference (ensure complete case/if assignments).",
    "Avoid simulation-only delays (#delay) in synthesizable logic.",
    "Handle relevant boundary conditions and invalid requests deterministically.",
    "Remain compatible with the module interfaces specified in this document.",
    "Each team must write its own RTL implementation. No prewritten logic skeletons will be supplied."
  ],

  deliverables: [
    "Verilog source files for all five modules (<group_id>_<module_name>.v)",
    "A self-checking testbench for each module (tb_<group_id>_<module_name>.v)",
    "Simulation results / waveform logs demonstrating correct operation",
    "Test cases covering normal operation and boundary edge cases",
    "A brief explanation of each design architecture and its operation"
  ],

  evaluationRubric: [
    { module: "Guide Matcher", points: 15, key: "Matching accuracy, threshold handling (0-2)" },
    { module: "Genome Window Generator", points: 20, key: "Boundary overlapping windows, valid signal timing" },
    { module: "Target Locator", points: 20, key: "Leftmost target detection, 0-24 index scanning, done handshake" },
    { module: "Genome Editor", points: 20, key: "4-base substitution, 0-28 position guard, untouched preservation" },
    { module: "Edit Verifier", points: 20, key: "Independent expected reconstruction, 32-base full comparison" },
    { module: "Design explanation & test quality", points: 5, key: "Architecture documentation and test coverage" }
  ]
};
