export const ADMIN_PASSCODE = "VidVerilog'27";

export const ADMIN_TEAM = {
  id: "admin_vidyut",
  name: "ACM Vidyut Admin",
  college: "ACM NITK Vidyut × Engineer '26 Organizers",
  role: "admin",
  isAdmin: true,
  avatarSeed: "👑",
  members: ["ACM Vidyut Proctor Core"],
  passcode: ADMIN_PASSCODE,
  solvedPuzzles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  puzzleSolveTimestamps: {},
  penaltyMinutes: 0,
  score: 3000,
  lastActive: Date.now()
};

// Production: No seeded teams. All participating teams are provisioned by Admin.
export const INITIAL_TEAMS = [];

// Production: No seeded activity logs. Live event telemetry starts fresh.
export const INITIAL_ACTIVITY_LOGS = [];
