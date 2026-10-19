const BASE_START_TIME = Date.now() - 3 * 3600 * 1000; // 3 hours ago

export const INITIAL_TEAMS = [
  {
    id: "team_rtl_overclockers",
    name: "RTL_Overclockers",
    college: "NITK Surathkal",
    members: ["Aditya K.", "Rohan S.", "Pooja M."],
    passcode: "rtl123",
    solvedPuzzles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    puzzleSolveTimestamps: {
      1: BASE_START_TIME + 8 * 60 * 1000,
      2: BASE_START_TIME + 21 * 60 * 1000,
      3: BASE_START_TIME + 39 * 60 * 1000,
      4: BASE_START_TIME + 62 * 60 * 1000,
      5: BASE_START_TIME + 88 * 60 * 1000,
      6: BASE_START_TIME + 115 * 60 * 1000,
      7: BASE_START_TIME + 138 * 60 * 1000,
      8: BASE_START_TIME + 160 * 60 * 1000,
      9: BASE_START_TIME + 174 * 60 * 1000,
    },
    penaltyMinutes: 10,
    score: 2550,
    avatarSeed: "⚡",
    lastActive: Date.now() - 4 * 60 * 1000
  },
  {
    id: "team_fpga_phoenix",
    name: "FPGA_Phoenix",
    college: "IIT Bombay",
    members: ["Tanmay V.", "Ananya R."],
    passcode: "fpga456",
    solvedPuzzles: [1, 2, 3, 4, 5, 6, 7, 8],
    puzzleSolveTimestamps: {
      1: BASE_START_TIME + 12 * 60 * 1000,
      2: BASE_START_TIME + 28 * 60 * 1000,
      3: BASE_START_TIME + 47 * 60 * 1000,
      4: BASE_START_TIME + 70 * 60 * 1000,
      5: BASE_START_TIME + 95 * 60 * 1000,
      6: BASE_START_TIME + 120 * 60 * 1000,
      7: BASE_START_TIME + 149 * 60 * 1000,
      8: BASE_START_TIME + 172 * 60 * 1000,
    },
    penaltyMinutes: 15,
    score: 2050,
    avatarSeed: "🔥",
    lastActive: Date.now() - 6 * 60 * 1000
  },
  {
    id: "team_silicon_surfers",
    name: "SiliconSurfers",
    college: "NITK Surathkal",
    members: ["Nikhil P.", "Deepak N.", "Sanjana B."],
    passcode: "surf789",
    solvedPuzzles: [1, 2, 3, 4, 5, 6],
    puzzleSolveTimestamps: {
      1: BASE_START_TIME + 14 * 60 * 1000,
      2: BASE_START_TIME + 33 * 60 * 1000,
      3: BASE_START_TIME + 58 * 60 * 1000,
      4: BASE_START_TIME + 84 * 60 * 1000,
      5: BASE_START_TIME + 112 * 60 * 1000,
      6: BASE_START_TIME + 145 * 60 * 1000,
    },
    penaltyMinutes: 5,
    score: 1450,
    avatarSeed: "🌊",
    lastActive: Date.now() - 15 * 60 * 1000
  },
  {
    id: "team_nand_lords",
    name: "NAND_Lords",
    college: "BITS Pilani",
    members: ["Varun C.", "Gaurav H."],
    passcode: "nand000",
    solvedPuzzles: [1, 2, 3, 4, 5],
    puzzleSolveTimestamps: {
      1: BASE_START_TIME + 18 * 60 * 1000,
      2: BASE_START_TIME + 42 * 60 * 1000,
      3: BASE_START_TIME + 67 * 60 * 1000,
      4: BASE_START_TIME + 99 * 60 * 1000,
      5: BASE_START_TIME + 130 * 60 * 1000,
    },
    penaltyMinutes: 8,
    score: 1000,
    avatarSeed: "👑",
    lastActive: Date.now() - 25 * 60 * 1000
  },
  {
    id: "team_gate_crashers",
    name: "GateCrashers",
    college: "NIT Trichy",
    members: ["Meera S.", "Kavya T.", "Arun V."],
    passcode: "gate111",
    solvedPuzzles: [1, 2, 3, 4],
    puzzleSolveTimestamps: {
      1: BASE_START_TIME + 16 * 60 * 1000,
      2: BASE_START_TIME + 38 * 60 * 1000,
      3: BASE_START_TIME + 75 * 60 * 1000,
      4: BASE_START_TIME + 110 * 60 * 1000,
    },
    penaltyMinutes: 5,
    score: 700,
    avatarSeed: "🚪",
    lastActive: Date.now() - 32 * 60 * 1000
  },
  {
    id: "team_bitflipper_01",
    name: "BitFlipper_01",
    college: "NITK Surathkal",
    members: ["Kiran M.", "Sneha R."],
    passcode: "bit01",
    solvedPuzzles: [1],
    puzzleSolveTimestamps: {
      1: BASE_START_TIME + 25 * 60 * 1000,
    },
    penaltyMinutes: 0,
    score: 100,
    avatarSeed: "👾",
    lastActive: Date.now() - 1 * 60 * 1000
  },
  {
    id: "team_verilog_vipers",
    name: "VerilogVipers",
    college: "RVCE Bengaluru",
    members: ["Akash D.", "Pranav G."],
    passcode: "viper222",
    solvedPuzzles: [1, 2, 3],
    puzzleSolveTimestamps: {
      1: BASE_START_TIME + 22 * 60 * 1000,
      2: BASE_START_TIME + 51 * 60 * 1000,
      3: BASE_START_TIME + 89 * 60 * 1000,
    },
    penaltyMinutes: 12,
    score: 450,
    avatarSeed: "🐍",
    lastActive: Date.now() - 40 * 60 * 1000
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "act_1",
    timestamp: Date.now() - 4 * 60 * 1000,
    teamId: "team_rtl_overclockers",
    teamName: "RTL_Overclockers",
    puzzleId: 9,
    puzzleTitle: "UART Baud Rate Divisor at 50 MHz",
    type: "SOLVE",
    message: "Decrypted Stage 09 in 14 mins! Unlocked Thermal Governor Spec."
  },
  {
    id: "act_2",
    timestamp: Date.now() - 6 * 60 * 1000,
    teamId: "team_fpga_phoenix",
    teamName: "FPGA_Phoenix",
    puzzleId: 8,
    puzzleTitle: "Asynchronous FIFO Gray Code Conversion",
    type: "SOLVE",
    message: "Decrypted Stage 08! CRC32 hardware engine unlocked."
  },
  {
    id: "act_3",
    timestamp: Date.now() - 12 * 60 * 1000,
    teamId: "team_silicon_surfers",
    teamName: "SiliconSurfers",
    puzzleId: 6,
    puzzleTitle: "ALU Overflow Bit Paradox",
    type: "SOLVE",
    message: "Solved Stage 06! Microcode sequencer decoded."
  },
  {
    id: "act_4",
    timestamp: Date.now() - 18 * 60 * 1000,
    teamId: "team_nand_lords",
    teamName: "NAND_Lords",
    puzzleId: 5,
    puzzleTitle: "The Ghost in the LFSR",
    type: "MILESTONE_5",
    message: "Hit 50% Milestone! 5 fragments decrypted."
  },
  {
    id: "act_5",
    timestamp: Date.now() - 35 * 60 * 1000,
    teamId: "team_bitflipper_01",
    teamName: "BitFlipper_01",
    puzzleId: 1,
    puzzleTitle: "The Ground Wire Anomaly",
    type: "SOLVE",
    message: "First Blood on Stage 01! Initialized baseline telemetry."
  }
];
