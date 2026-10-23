export const ADMIN_PASSCODE = "VidVerilog'27";

export const ADMIN_TEAM = {
  id: "admin_vidyut",
  name: "ACM Vidyut Admin",
  college: "ACM NITK Vidyut × Engineer '26 Organizers",
  role: "admin",
  isAdmin: true,
  avatarSeed: "ACM",
  members: ["ACM Vidyut Proctor Core"],
  passcode: ADMIN_PASSCODE,
  solvedPuzzles: [1, 2, 3, 4, 5],
  puzzleSolveTimestamps: {},
  penaltyMinutes: 0,
  score: 800,
  lastActive: Date.now()
};

// Official Participating Teams for Verilog Quest 2026
// Each team has an assigned Passkey and Subsystem Callsign (e.g., T07)
export const INITIAL_TEAMS = [
  {
    id: "team_t01_quantum",
    name: "T01_QuantumCircuits",
    callsign: "T01",
    college: "NITK Surathkal",
    members: ["Aditya K.", "Rohan S.", "Pooja M."],
    passcode: "t01pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T01",
    lastActive: Date.now()
  },
  {
    id: "team_t02_rtl",
    name: "T02_RTL_Overclockers",
    callsign: "T02",
    college: "NITK Surathkal",
    members: ["Kiran M.", "Sneha R."],
    passcode: "t02pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T02",
    lastActive: Date.now()
  },
  {
    id: "team_t03_fpga",
    name: "T03_FPGA_Phoenix",
    callsign: "T03",
    college: "IIT Bombay",
    members: ["Tanmay V.", "Ananya R."],
    passcode: "t03pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T03",
    lastActive: Date.now()
  },
  {
    id: "team_t04_silicon",
    name: "T04_SiliconSurfers",
    callsign: "T04",
    college: "NITK Surathkal",
    members: ["Nikhil P.", "Deepak N.", "Sanjana B."],
    passcode: "t04pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T04",
    lastActive: Date.now()
  },
  {
    id: "team_t05_nand",
    name: "T05_NAND_Lords",
    callsign: "T05",
    college: "BITS Pilani",
    members: ["Varun C.", "Gaurav H."],
    passcode: "t05pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T05",
    lastActive: Date.now()
  },
  {
    id: "team_t06_gate",
    name: "T06_GateCrashers",
    callsign: "T06",
    college: "NIT Trichy",
    members: ["Meera S.", "Kavya T.", "Arun V."],
    passcode: "t06pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T06",
    lastActive: Date.now()
  },
  {
    id: "team_t07_knights",
    name: "T07_SiliconKnights",
    callsign: "T07",
    college: "NITK Surathkal",
    members: ["Siddharth M.", "Pooja V."],
    passcode: "t07pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T07",
    lastActive: Date.now()
  },
  {
    id: "team_t08_vipers",
    name: "T08_VerilogVipers",
    callsign: "T08",
    college: "RVCE Bengaluru",
    members: ["Akash D.", "Pranav G."],
    passcode: "t08pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T08",
    lastActive: Date.now()
  },
  {
    id: "team_t09_bit",
    name: "T09_BitFlippers",
    callsign: "T09",
    college: "NITK Surathkal",
    members: ["Harish B.", "Divya K."],
    passcode: "t09pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T09",
    lastActive: Date.now()
  },
  {
    id: "team_t10_logic",
    name: "T10_LogicArchitects",
    callsign: "T10",
    college: "IIT Madras",
    members: ["Rahul N.", "Swathi S."],
    passcode: "t10pass",
    solvedPuzzles: [],
    puzzleSolveTimestamps: {},
    penaltyMinutes: 0,
    score: 0,
    avatarSeed: "T10",
    lastActive: Date.now()
  }
];

// Fresh live event telemetry starts cleanly
export const INITIAL_ACTIVITY_LOGS = [];
