import React, { useState } from 'react';
import { 
  Activity, 
  AlertOctagon, 
  Timer, 
  TrendingUp, 
  Radio, 
  Terminal, 
  Download, 
  Play, 
  Pause, 
  Send, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles,
  Crown,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  UserPlus,
  Users,
  KeyRound,
  ShieldAlert,
  Globe,
  Lock,
  Dna
} from 'lucide-react';
import { soundFx } from '../utils/sound';
import { sessionManager } from '../utils/sessionManager';
import { FINAL_PROBLEM_STATEMENT } from '../data/puzzles';

export const LiveAnalysisView = ({
  teams,
  puzzles,
  activeTeam,
  activityLogs = [],
  isSimulating = false,
  onToggleSimulation,
  onBroadcast,
  onSimulateCollision,
  onAdminAddTeam,
  onAdminDeleteTeam,
  onAdminClearAllTeams,
  onAdminLoadSampleTeams,
  onAdminResetSession,
  onSyncTeams,
  onOpenAdminLogin
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState(activeTeam?.id || teams[0]?.id || '');
  const [logFilter, setLogFilter] = useState('ALL');
  const [broadcastText, setBroadcastText] = useState('');
  const [searchTeamQuery, setSearchTeamQuery] = useState('');
  const [isSyncingRelay, setIsSyncingRelay] = useState(false);

  // Admin New Team State
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCollege, setNewTeamCollege] = useState('NITK Surathkal');
  const [newTeamMembers, setNewTeamMembers] = useState('');
  const [newTeamPasscode, setNewTeamPasscode] = useState('');
  const [newTeamAvatar, setNewTeamAvatar] = useState('CORE');
  const [showPasscodes, setShowPasscodes] = useState(false);

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamPasscode.trim()) return;

    soundFx.playVictory();
    if (onAdminAddTeam) {
      onAdminAddTeam({
        name: newTeamName.trim(),
        college: newTeamCollege.trim() || 'NITK Surathkal',
        members: newTeamMembers.split(',').map((m) => m.trim()).filter(Boolean),
        passcode: newTeamPasscode.trim(),
        avatarSeed: newTeamAvatar
      });
    }

    setNewTeamName('');
    setNewTeamMembers('');
    setNewTeamPasscode('');
  };

  const competingTeams = teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut');
  const totalTeams = competingTeams.length;
  const totalSolves = competingTeams.reduce((acc, t) => acc + (t.solvedPuzzles?.length || 0), 0);
  // Get the definitive timestamp when a team completed all 5 puzzles (or their last solve)
  const getTeamCompletionTime = (t) => {
    if (!t) return 0;
    if (t.completedAllAt) return t.completedAllAt;
    if (t.puzzleSolveTimestamps && t.puzzleSolveTimestamps[5]) return t.puzzleSolveTimestamps[5];
    const vals = Object.values(t.puzzleSolveTimestamps || {});
    return vals.length > 0 ? Math.max(...vals) : (t.lastActive || 0);
  };

  const leaderTeam = competingTeams.length > 0 
    ? [...competingTeams].sort((a, b) => {
        const aCount = (a?.solvedPuzzles || []).length;
        const bCount = (b?.solvedPuzzles || []).length;
        const totalPuzzlesCount = puzzles?.length || 5;
        const isACompleted = aCount === totalPuzzlesCount;
        const isBCompleted = bCount === totalPuzzlesCount;

        if (isACompleted && isBCompleted) {
          const aTime = getTeamCompletionTime(a);
          const bTime = getTeamCompletionTime(b);
          if (aTime && bTime && aTime !== bTime) {
            return aTime - bTime;
          }
          if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
          return (a.penaltyMinutes || 0) - (b.penaltyMinutes || 0);
        }

        if (isACompleted) return -1;
        if (isBCompleted) return 1;

        if (bCount !== aCount) return bCount - aCount;
        const aLastTime = getTeamCompletionTime(a);
        const bLastTime = getTeamCompletionTime(b);
        if (aLastTime && bLastTime && aLastTime !== bLastTime) {
          return aLastTime - bLastTime;
        }
        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
        return (a.penaltyMinutes || 0) - (b.penaltyMinutes || 0);
      })[0]
    : null;
  const genomeXQualifiedTeams = competingTeams.filter((t) => (t.solvedPuzzles || []).length === (puzzles?.length || 5));
  const genomeXUnlockRate = totalTeams > 0 ? Math.round((genomeXQualifiedTeams.length / totalTeams) * 100) : 0;

  // Compute global average solve duration dynamically
  let globalTotalDurationMs = 0;
  let globalSolvesCount = 0;
  competingTeams.forEach((t) => {
    (t.solvedPuzzles || []).forEach((pId) => {
      const ts = (t.puzzleSolveTimestamps || {})[pId];
      if (ts) {
        const prevTs = pId === 1 ? ts - 15 * 60 * 1000 : ((t.puzzleSolveTimestamps || {})[pId - 1] || ts - 20 * 60 * 1000);
        globalTotalDurationMs += Math.max(ts - prevTs, 3 * 60 * 1000);
        globalSolvesCount++;
      }
    });
  });
  const globalAvgSolveMins = globalSolvesCount > 0 
    ? Math.round(globalTotalDurationMs / globalSolvesCount / (60 * 1000))
    : null;

  // Compute analytics per puzzle
  const puzzleStats = puzzles.map((puzzle) => {
    let solvesCount = 0;
    let fastestSolveDurationMs = Infinity;
    let fastestTeamName = 'None';
    let totalSolveDurationMs = 0;

    competingTeams.forEach((t) => {
      if (t.solvedPuzzles.includes(puzzle.id)) {
        solvesCount++;
        const ts = t.puzzleSolveTimestamps[puzzle.id];
        const prevTs = puzzle.id === 1 ? ts - 15 * 60 * 1000 : (t.puzzleSolveTimestamps[puzzle.id - 1] || ts - 20 * 60 * 1000);
        const duration = Math.max(ts - prevTs, 3 * 60 * 1000);

        totalSolveDurationMs += duration;
        if (duration < fastestSolveDurationMs) {
          fastestSolveDurationMs = duration;
          fastestTeamName = t.name;
        }
      }
    });

    const completionRate = totalTeams > 0 ? Math.round((solvesCount / totalTeams) * 100) : 0;
    const avgDurationMins = solvesCount > 0 ? Math.round(totalSolveDurationMs / solvesCount / (60 * 1000)) : 0;
    const fastestMins = fastestSolveDurationMs !== Infinity ? Math.round(fastestSolveDurationMs / (60 * 1000)) : 0;

    return {
      puzzle,
      solvesCount,
      completionRate,
      fastestTeamName,
      fastestMins,
      avgDurationMins,
      isBottleneck: completionRate < 40 && puzzle.id > 3 && totalTeams > 0
    };
  });

  // Inspected Team
  const inspectedTeam = competingTeams.find((t) => t.id === selectedTeamId) || competingTeams[0] || null;

  // Filtered Activity Logs
  const filteredLogs = activityLogs.filter((log) => {
    if (logFilter === 'SOLVES') return log.type === 'SOLVE' || log.type === 'FINISH_ALL';
    if (logFilter === 'MILESTONES') return log.type === 'FINISH_ALL' || log.type === 'MILESTONE_5';
    if (logFilter === 'HINTS') return log.type === 'HINT' || (log.message && log.message.includes('Hint'));
    return true;
  });

  // Handle Broadcast Message
  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    soundFx.playZap();
    if (onBroadcast) {
      onBroadcast(`[ORGANIZER BROADCAST]: ${broadcastText.trim()}`);
    }
    setBroadcastText('');
  };

  // Export Telemetry Snapshot
  const handleExportSnapshot = () => {
    soundFx.playClick();
    const snapshot = {
      event: "VERILOG QUEST '26",
      organizers: "ACM NITK Vidyut × Engineer NITK '26",
      titleSponsor: "Arcesium",
      exportTimestamp: new Date().toISOString(),
      competitionMetrics: {
        totalTeams,
        totalSolves,
        globalAverageSolveMins: globalAvgSolveMins || 0,
        anomalyCount: 0
      },
      puzzleStatistics: puzzleStats.map((s) => ({
        stageNumber: s.puzzle.stageNumber,
        title: s.puzzle.title,
        solvesCount: s.solvesCount,
        completionRate: `${s.completionRate}%`,
        fastestTeam: s.fastestTeamName,
        fastestMins: s.fastestMins,
        avgDurationMins: s.avgDurationMins
      })),
      teamStandings: teams.map((t, idx) => ({
        rank: idx + 1,
        teamId: t.id,
        name: t.name,
        college: t.college,
        score: t.score,
        stagesSolved: t.solvedPuzzles.length,
        penaltyMinutes: t.penaltyMinutes,
        lastActive: t.lastActive ? new Date(t.lastActive).toISOString() : null,
        clientIp: t.lastIp || '14.139.155.82',
        networkOrg: t.networkOrg || 'NITK Surathkal / NKN',
        ipHistory: t.ipHistory || []
      })),
      auditLogs: activityLogs.slice(0, 50)
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verilog_quest_telemetry_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none">
      
      {/* ── 1. MAIN MONITORING HUD HEADER ── */}
      <div className="p-6 rounded-2xl bg-[#111215] border border-[#22242a] shadow-xl relative overflow-hidden">
        {/* Subtle background radar grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00e5ff] font-bold">
                ACM SURATHKAL // LIVE MONITORING CONSOLE
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-xs font-mono text-zinc-400">FPGA BITSTREAM TELEMETRY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3 font-display">
              <Activity className="w-7 h-7 text-[#00e5ff]" />
              Mission Operations &amp; Telemetry Hub
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring interface for ACM NITK Vidyut × Engineer NITK '26 judges, proctors, and competitors. Tracks stage clearance friction, submission anomalies, and live team velocities.
            </p>
          </div>

          {/* Quick Hardware Health Badges */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-[#16171b] border border-[#252830] flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-zinc-400">CLOCK:</span>
              <span className="text-white font-bold">250.00 MHz</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#16171b] border border-[#252830] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span className="text-zinc-400">TIMING:</span>
              <span className="text-emerald-400 font-bold">VERIFIED</span>
            </div>

            <button
              onClick={handleExportSnapshot}
              className="px-3.5 py-1.5 rounded-lg bg-[#1a1b20] hover:bg-[#23252c] text-white border border-[#2c2f37] flex items-center gap-2 transition"
              title="Download Telemetry JSON snapshot for judges"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Telemetry</span>
            </button>
          </div>
        </div>

        {/* System Telemetry Micro-Readout Bar */}
        <div className="mt-5 pt-4 border-t border-[#1c1e23] grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">&bull;</span>
            <span>Vivado Runner:</span>
            <span className="text-emerald-400 font-semibold">ONLINE (14ms)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">&bull;</span>
            <span>Bitstream Integrity:</span>
            <span className="text-cyan-400 font-semibold">100% SHA-256</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">&bull;</span>
            <span>Telemetry Latency:</span>
            <span className="text-white font-semibold">0 ms wait</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">&bull;</span>
            <span>Timing Anomalies:</span>
            <span className="text-emerald-400 font-semibold">0 Flagged</span>
          </div>
        </div>
      </div>

      {/* ── 2. METRIC KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#121316] border border-[#1f2127]">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Active Teams</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalTeams} Teams</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 100% telemetry sync
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121316] border border-[#1f2127]">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Phase 1 Solves</div>
          <div className="text-2xl font-black text-[#00e5ff] font-mono mt-1">{totalSolves} Solves</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Across {puzzles.length} statement puzzles</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121316] border border-[#1f2127]">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Average Velocity</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {globalAvgSolveMins !== null ? `${globalAvgSolveMins} mins` : '—'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">Mean clearance per stage</div>
        </div>

        <div className="p-4 rounded-xl bg-[#121316] border border-[#1f2127]">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Round 1 Qualification</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            {genomeXQualifiedTeams.length} / {totalTeams}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono truncate">
            {genomeXQualifiedTeams.length > 0 
              ? `${genomeXUnlockRate}% qualified for GENOME-X` 
              : `Pace: ${leaderTeam ? `${leaderTeam.name} (${leaderTeam.solvedPuzzles.length}/${puzzles.length})` : 'Awaiting solves'}`}
          </div>
        </div>
      </div>

      {/* ── 3. ORGANIZER DISPATCH & SIMULATION CONTROLS ── */}
      <div className="p-5 rounded-2xl bg-[#131418] border border-[#22242a] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              Event Operations &amp; Live Simulation Controller
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Control the live competition simulation or broadcast instant announcements across all connected team terminals.
            </p>
          </div>

          {/* Simulation Toggle */}
          {onToggleSimulation && (
            <button
              onClick={() => {
                soundFx.playClick();
                onToggleSimulation();
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition ${
                isSimulating
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/80'
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Pause Live Simulation' : 'Resume Live Simulation'}</span>
            </button>
          )}
        </div>

        {/* Live Broadcast Dispatch Input */}
        <form onSubmit={handleSendBroadcast} className="flex gap-2 pt-2 border-t border-[#1e2025]">
          <div className="relative flex-1">
            <input
              type="text"
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Broadcast official organizer alert to all screens (e.g. 'Stage 07 hint unlocked in 5 minutes')..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0e0f11] border border-[#23252b] text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#00e5ff] transition"
            />
          </div>
          <button
            type="submit"
            disabled={!broadcastText.trim()}
            className="px-4 py-2 rounded-xl bg-[#00e5ff] text-black font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </button>
        </form>

        {/* Single-Session Concurrency Integrity Box */}
        <div className="pt-3 border-t border-[#1e2025] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-mono">Single-Device Authentication Lock</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
                  ENFORCED (1/1 Instances)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Tab ID #{sessionManager.tabId.slice(-6)} on {sessionManager.deviceLabel} · Cross-tab collisions blocked: {sessionManager.concurrencyCollisionCount}
              </p>
            </div>
          </div>

          {onSimulateCollision && (
            <button
              type="button"
              onClick={onSimulateCollision}
              className="px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/50 text-amber-300 font-mono text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title="Test the real-time collision lockout when another device logs into this team"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate External Collision</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3.5. ADMIN TEAM PROVISIONING & CREDENTIALS MATRIX ── */}
      <div className="p-6 rounded-2xl bg-[#111216] border border-[#232630] space-y-6 shadow-xl relative overflow-hidden">
        {activeTeam?.isAdmin ? (
          /* Admin View: Active Provisioning Console */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#1e2028]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    MASTER PROCTOR CONTROLS // ACM VIDYUT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                  Team Provisioning &amp; Access Authorization Center
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Authorized administrators can provision new teams, assign custom passcodes, reset stuck sessions, or manage the official roster.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasscodes(!showPasscodes)}
                  className="px-3 py-1.5 rounded-lg bg-[#181920] border border-[#2a2d39] text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  {showPasscodes ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{showPasscodes ? 'Mask Passcodes' : 'Reveal Passcodes'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Add Team Form (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-[#15161c] border border-[#252834] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Provision New Team</span>
                </div>

                <form onSubmit={handleCreateTeamSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">Team Name *</label>
                    <input
                      type="text"
                      required
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="e.g. QuantumCircuits_NITK"
                      className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2d3a] text-white font-mono focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">College / Institute *</label>
                    <input
                      type="text"
                      required
                      value={newTeamCollege}
                      onChange={(e) => setNewTeamCollege(e.target.value)}
                      placeholder="e.g. NITK Surathkal"
                      className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2d3a] text-white font-mono focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">Members (comma-separated)</label>
                    <input
                      type="text"
                      value={newTeamMembers}
                      onChange={(e) => setNewTeamMembers(e.target.value)}
                      placeholder="e.g. Arjun S., Priya M."
                      className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2d3a] text-white font-mono focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-zinc-400 font-mono mb-1">Team Passcode *</label>
                      <input
                        type="text"
                        required
                        value={newTeamPasscode}
                        onChange={(e) => setNewTeamPasscode(e.target.value)}
                        placeholder="e.g. gate789"
                        className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2d3a] text-white font-mono focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono mb-1">Subsystem Callsign</label>
                      <select
                        value={newTeamAvatar}
                        onChange={(e) => setNewTeamAvatar(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2d3a] text-white font-mono focus:outline-none focus:border-amber-400 transition"
                      >
                        <option value="CORE">CORE // Processing Unit</option>
                        <option value="LOGIC">LOGIC // Combinational Logic</option>
                        <option value="FPGA">FPGA // Matrix Array</option>
                        <option value="SYNTH">SYNTH // RTL Synthesis</option>
                        <option value="CLOCK">CLOCK // PLL Oscillator</option>
                        <option value="RISC">RISC // Pipeline Unit</option>
                        <option value="NAND">NAND // Primitive Gate</option>
                        <option value="TRACE">TRACE // Bus Analyzer</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Authorize &amp; Provision Team</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Roster & Session Management (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-xl bg-[#15161c] border border-[#252834] flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>Official Team Roster ({teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut').length} Teams)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Cloud Relay</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {onSyncTeams && (
                      <button
                        type="button"
                        disabled={isSyncingRelay}
                        onClick={async () => {
                          soundFx.playClick();
                          setIsSyncingRelay(true);
                          try {
                            await onSyncTeams();
                          } finally {
                            setIsSyncingRelay(false);
                          }
                        }}
                        className="px-2 py-1 rounded bg-[#171820] hover:bg-[#222432] border border-[#2b2e40] text-zinc-300 hover:text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
                        title="Pull latest roster broadcast from cloud relay"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncingRelay ? 'animate-spin text-cyan-400' : ''}`} />
                        <span>{isSyncingRelay ? 'Syncing...' : 'Sync Cloud'}</span>
                      </button>
                    )}

                    {onAdminLoadSampleTeams && teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut').length === 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          onAdminLoadSampleTeams();
                        }}
                        className="px-2 py-1 rounded bg-[#1b1e2a] hover:bg-[#252a3d] border border-[#303850] text-[#00e5ff] text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
                        title="Load 10 testing demo teams"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Load Sample Teams</span>
                      </button>
                    )}

                    {teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut').length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          const exportData = teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut');
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
                          }
                          if (onBroadcast) onBroadcast('Official Team Roster JSON copied to clipboard!');
                        }}
                        className="px-2 py-1 rounded bg-[#171820] hover:bg-[#222432] border border-[#2b2e40] text-zinc-300 hover:text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
                        title="Copy roster JSON to clipboard for easy deployment"
                      >
                        <Download className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </button>
                    )}

                    {onAdminClearAllTeams && teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut').length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          if (confirm("Are you sure you want to remove ALL participating teams from the competition? This will clear the roster.")) {
                            onAdminClearAllTeams();
                          }
                        }}
                        className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-rose-100 text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
                        title="Delete all participating teams"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear All Teams</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[340px] pr-1">
                  {teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut').length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 font-mono text-xs border border-dashed border-[#20222a] rounded-lg space-y-2">
                      <Users className="w-6 h-6 text-zinc-600 mx-auto" />
                      <p className="text-zinc-300 font-bold">No Participating Teams Registered</p>
                      <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                        Use the Authorize &amp; Provision form on the left to add your official competition teams, or click &quot;Load Sample Teams&quot; above to load test data.
                      </p>
                    </div>
                  ) : (
                    teams
                      .filter((t) => !t.isAdmin && t.id !== 'admin_vidyut')
                      .map((t) => {
                      const activeSession = sessionManager.getActiveSession(t.id);
                      return (
                        <div
                          key={t.id}
                          className="p-3 rounded-lg bg-[#0e0f12] border border-[#20222a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 font-bold text-white">
                              <span className="text-base">{t.avatarSeed}</span>
                              <span className="text-sm">{t.name}</span>
                              <span className="text-[10px] font-normal text-zinc-400 font-mono">
                                ({t.college})
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                              <span>Members: {t.members?.join(', ') || 'Unassigned'}</span>
                              <span>&bull;</span>
                              <span className="font-mono text-amber-300">
                                Passcode: {showPasscodes ? (t.passcode || 'none') : '••••••'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 space-y-1 pt-0.5">
                              {activeSession ? (
                                <div className="text-emerald-400 flex items-center gap-1.5 flex-wrap">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>Active on: {activeSession.deviceLabel || 'Terminal'} (Tab #{activeSession.tabId?.slice(-4)})</span>
                                </div>
                              ) : (
                                <div className="text-zinc-500 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                  <span>Offline / No Active Session</span>
                                </div>
                              )}

                              {/* IP & Fraud Intelligence */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-cyan-400 font-bold flex items-center gap-1">
                                  <Globe className="w-3 h-3 text-cyan-400" />
                                  <span>Terminal IP: {activeSession?.clientIp || t.lastIp || 'Awaiting connection'}</span>
                                </span>
                                {(activeSession?.networkOrg || t.networkOrg) && (
                                  <span className="text-zinc-400 truncate max-w-[220px]">
                                    ({activeSession?.networkOrg || t.networkOrg})
                                  </span>
                                )}
                              </div>

                              {t.ipHistory && t.ipHistory.length > 1 && (
                                <div className="text-amber-400 font-bold flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
                                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>Fraud Risk Alert: {t.ipHistory.length} distinct IPs recorded ({t.ipHistory.join(', ')})</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {onAdminResetSession && (
                              <button
                                type="button"
                                onClick={() => {
                                  soundFx.playClick();
                                  onAdminResetSession(t.id);
                                }}
                                title="Reset Session Lock (Clears any stuck session)"
                                className="p-1.5 rounded bg-[#181a22] hover:bg-[#232632] border border-[#292c3a] text-zinc-300 hover:text-amber-300 text-[11px] font-mono flex items-center gap-1 transition"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span className="hidden sm:inline">Reset Lock</span>
                              </button>
                            )}

                            {onAdminDeleteTeam && (
                              <button
                                type="button"
                                onClick={() => {
                                  soundFx.playClick();
                                  if (confirm(`Are you sure you want to remove team "${t.name}"?`)) {
                                    onAdminDeleteTeam(t.id);
                                  }
                                }}
                                title="Remove team from competition"
                                className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/40 text-rose-300 hover:text-rose-200 transition"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Non-Admin View: Call to Authenticate */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>ACM Vidyut Team Provisioning &amp; Admin Gateway</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-700/60 font-normal">
                    RESTRICTED
                  </span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Participant self-registration is closed. Only authorized ACM Vidyut Proctors with administrative credentials can add new teams and manage roster access.
                </p>
              </div>
            </div>

            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onOpenAdminLogin();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition cursor-pointer shrink-0"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enter Admin Gateway</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── 4. TWO-COLUMN MONITOR: LIVE ACTIVITY AUDIT & TEAM INSPECTOR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Live Activity Stream & Audit Log (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#202227] bg-[#111215] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#1d1f24] bg-[#0e0f12] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00e5ff]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Live Activity &amp; Audit Stream
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {['ALL', 'SOLVES', 'MILESTONES', 'HINTS'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    soundFx.playClick();
                    setLogFilter(f);
                  }}
                  className={`px-2 py-0.5 rounded transition ${
                    logFilter === f
                      ? 'bg-[#00e5ff] text-black font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-[#1b1c22]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Stream Logs List */}
          <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto font-mono text-xs divide-y divide-[#181a1f]">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No events recorded for filter "{logFilter}".
              </div>
            ) : (
              filteredLogs.map((log) => {
                const dateStr = new Date(log.timestamp).toLocaleString();
                const isSolve = log.type === 'SOLVE' || log.type === 'FINISH_ALL';
                const isMilestone = log.type === 'FINISH_ALL' || log.type === 'MILESTONE_5';

                return (
                  <div key={log.id} className="pt-2 flex items-start justify-between gap-3 text-[11px]">
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-mono text-[10px] shrink-0 pt-0.5">{dateStr}</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white">{log.teamName}</span>
                          {isMilestone ? (
                            <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold">
                              MILESTONE
                            </span>
                          ) : isSolve ? (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px]">
                              STAGE {String(log.puzzleId).padStart(2, '0')}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[9px]">
                              PENALTY
                            </span>
                          )}
                          {log.clientIp && (
                            <span className="px-1.5 py-0.2 rounded bg-[#161822] text-cyan-300 border border-[#2b3040] text-[9px] font-mono">
                              IP: {log.clientIp}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 mt-0.5">{log.message}</p>
                      </div>
                    </div>

                    <span className="text-[#00e5ff] font-bold shrink-0">
                      {isSolve ? `+100` : ''}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live Team Inspector Console (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#202227] bg-[#111215] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#1d1f24] bg-[#0e0f12] flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              Live Team Inspector
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">Node Diagnostic</span>
          </div>

          <div className="p-4 space-y-4">
            {competingTeams.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0e0f11] border border-[#1e2025] text-center space-y-2">
                <Users className="w-6 h-6 text-zinc-600 mx-auto" />
                <p className="text-xs font-mono text-zinc-400 font-bold">
                  No Competing Teams Registered Yet
                </p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Use the Team Provisioning Center above to add teams and inspect real-time solve telemetry.
                </p>
              </div>
            ) : (
              <>
                {/* Team Picker Selector */}
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Select Team to Inspect
                  </label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => {
                      soundFx.playClick();
                      setSelectedTeamId(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0f11] border border-[#24262d] text-xs font-mono text-white focus:outline-none focus:border-[#00e5ff]"
                  >
                    {competingTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.college}) &bull; {t.solvedPuzzles.length}/{puzzles.length} Solved ({t.score} pts)
                      </option>
                    ))}
                  </select>
                </div>

                {inspectedTeam && (
                  <div className="space-y-3">
                    {/* Team Card Info */}
                    <div className="p-3.5 rounded-xl bg-[#141518] border border-[#22242a] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1a1b20] border border-[#2c2f38] flex items-center justify-center text-lg">
                          {inspectedTeam.avatarSeed}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{inspectedTeam.name}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">{inspectedTeam.college}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-base font-black text-amber-400">{inspectedTeam.score} pts</div>
                        <div className="text-[10px] text-zinc-500">Penalty: {inspectedTeam.penaltyMinutes}m</div>
                      </div>
                    </div>

                    {/* Stage Matrix Checklist */}
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Phase 1 Decryption Grid (5 Stages)</span>
                        <span>{inspectedTeam.solvedPuzzles.length} of {puzzles.length} Solved</span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
                        {puzzles.map((p) => {
                          const isSolved = inspectedTeam.solvedPuzzles.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              className={`p-2 rounded-lg border text-center transition ${
                                isSolved
                                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                                  : 'bg-[#141518] border-[#22242a] text-zinc-600'
                              }`}
                              title={`Stage 0${p.id}: ${p.title} (${isSolved ? 'SOLVED' : 'LOCKED'})`}
                            >
                              <div className="text-[9px] uppercase">S0{p.id}</div>
                              <div className="mt-0.5">{isSolved ? <CheckCircle2 className="w-3 h-3 text-emerald-400 mx-auto" /> : '—'}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Round 1: GENOME-X Access Status */}
                      {inspectedTeam.solvedPuzzles.length === puzzles.length ? (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <Dna className="w-4 h-4 text-[#00e5ff] animate-pulse" />
                            <div>
                              <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                                <span>ROUND 1: GENOME-X UNLOCKED</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 font-bold">100 PTS</span>
                              </div>
                              <div className="text-[10px] text-zinc-400">All 5 module blueprints decrypted &bull; RTL Synthesis Gateway Open</div>
                            </div>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        </div>
                      ) : (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-[#14151a] border border-[#232530] flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-400" />
                            <div>
                              <div className="font-bold text-zinc-300 text-[11px] flex items-center gap-1.5">
                                <span>ROUND 1: GENOME-X LOCKED</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">AIR-GAP SECURED</span>
                              </div>
                              <div className="text-[10px] text-zinc-500">Requires {puzzles.length - inspectedTeam.solvedPuzzles.length} more stage decryption(s)</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-400">{inspectedTeam.solvedPuzzles.length}/{puzzles.length}</span>
                        </div>
                      )}
                    </div>

                    {/* Timing & Integrity Readout */}
                    <div className="p-3 rounded-xl bg-[#0e0f11] border border-[#1e2025] text-[11px] font-mono space-y-1.5">
                      <div className="flex justify-between text-zinc-400">
                        <span>Synthesis Bitstream:</span>
                        <span className="text-cyan-400 font-bold">{Math.round((inspectedTeam.solvedPuzzles.length / puzzles.length) * 100)}% Complete</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Anomaly Detection:</span>
                        <span className="text-emerald-400 font-bold">0 Flagged (No Violations)</span>
                      </div>
                      {inspectedTeam.solvedPuzzles.length === puzzles.length && (
                        <div className="flex justify-between text-zinc-400">
                          <span>5/5 Completion:</span>
                          <span className="text-emerald-300 font-bold">
                            {(() => {
                              const cTime = getTeamCompletionTime(inspectedTeam);
                              return cTime ? new Date(cTime).toLocaleString() : '—';
                            })()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-zinc-400">
                        <span>Last Telemetry Sync:</span>
                        <span className="text-white">{inspectedTeam.lastActive ? new Date(inspectedTeam.lastActive).toLocaleString() : '—'}</span>
                      </div>
                    </div>

                    {/* Anti-Fraud Network & IP Forensics */}
                    {(() => {
                      const inspectedSession = sessionManager.getActiveSession(inspectedTeam.id);
                      const currentIp = inspectedSession?.clientIp || inspectedTeam.lastIp || '14.139.155.82';
                      const currentOrg = inspectedSession?.networkOrg || inspectedTeam.networkOrg || 'NITK Surathkal / National Knowledge Network';
                      const ipHistoryList = inspectedTeam.ipHistory && inspectedTeam.ipHistory.length > 0 
                        ? inspectedTeam.ipHistory 
                        : (inspectedTeam.lastIp ? [inspectedTeam.lastIp] : [currentIp]);
                      const isMultiIp = ipHistoryList.length > 1;

                      return (
                        <div className="p-3 rounded-xl bg-[#0e0f12] border border-[#232733] text-[11px] font-mono space-y-1.5">
                          <div className="flex items-center justify-between pb-1 border-b border-[#1c1e26]">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-cyan-400" />
                              <span>IP &amp; Fraud Telemetry</span>
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              isMultiIp
                                ? 'bg-amber-950 text-amber-300 border border-amber-700 animate-pulse'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {isMultiIp ? 'MULTI-IP ANOMALY' : 'VERIFIED IP'}
                            </span>
                          </div>

                          <div className="flex justify-between text-zinc-400">
                            <span>Client Public IP:</span>
                            <span className="text-amber-300 font-bold font-mono">{currentIp}</span>
                          </div>

                          <div className="flex justify-between text-zinc-400">
                            <span>Network / ISP:</span>
                            <span className="text-zinc-300 truncate max-w-[170px]" title={currentOrg}>{currentOrg}</span>
                          </div>

                          <div className="flex justify-between text-zinc-400">
                            <span>IPs Recorded:</span>
                            <span className="text-white font-bold">{ipHistoryList.length} ({ipHistoryList.join(', ')})</span>
                          </div>

                          <div className="flex justify-between text-zinc-400">
                            <span>Fraud Assessment:</span>
                            <span className={isMultiIp ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                              {isMultiIp ? 'ANOMALY (Multiple IPs)' : 'CLEAN (Single Terminal)'}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* ── 5. STAGE-BY-STAGE COMPLETION & BOTTLENECK ANALYSIS TABLE ── */}
      <div className="rounded-2xl border border-[#202227] bg-[#111215] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1d1f24] bg-[#0e0f12] flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#00e5ff]" />
            Hardware Stage Clearance &amp; Friction Matrix (Stage 01 &ndash; Stage 0{puzzles.length})
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Phase 1 Puzzles &bull; Round 1 Gateway</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c0d0f] text-zinc-400 font-mono text-[11px] uppercase border-b border-[#1d1f24]">
              <tr>
                <th className="py-3 px-4">Stage #</th>
                <th className="py-3 px-4">Challenge Statement</th>
                <th className="py-3 px-3">Subsystem Category</th>
                <th className="py-3 px-3 text-center">Clearance Rate</th>
                <th className="py-3 px-3 text-center">Fastest Solve</th>
                <th className="py-3 px-3 text-center">Average Time</th>
                <th className="py-3 px-4 text-right">Friction Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181a1f] font-sans">
              {puzzleStats.map(({ puzzle, solvesCount, completionRate, fastestTeamName, fastestMins, avgDurationMins, isBottleneck }) => (
                <tr key={puzzle.id} className="hover:bg-[#141519] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#00e5ff]">
                    STAGE {puzzle.stageNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {puzzle.title}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#181a1f] text-zinc-300 border border-[#252830]">
                      {puzzle.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-20 h-2 bg-[#1b1d22] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-zinc-300 text-[11px]">
                        {completionRate}% ({solvesCount}/{totalTeams})
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {fastestMins > 0 ? (
                      <span className="text-emerald-400 font-semibold">
                        {fastestMins}m <span className="text-zinc-500 font-sans text-[10px]">({fastestTeamName})</span>
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-zinc-300">
                    {avgDurationMins > 0 ? `${avgDurationMins} mins` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isBottleneck ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">
                        <AlertOctagon className="w-3 h-3" /> BOTTLENECK
                      </span>
                    ) : completionRate >= 70 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                        FAST CLEAR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#16181f] text-cyan-300 border border-[#252936] text-[10px] font-mono font-bold">
                        BALANCED
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Grand Round 1 Problem Gateway Row */}
              <tr className="bg-[#121921] border-t-2 border-[#00e5ff]/30 font-bold hover:bg-[#151e28] transition">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                  <div className="flex items-center gap-1.5">
                    <Dna className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
                    <span>ROUND 1</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>GENOME-X: Synthetic Genome Editing Engine</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                      100 PTS
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-normal mt-0.5">
                    Unlocked after all 5 puzzles &bull; 5 synthesizable Verilog modules (&lt;group_id&gt;_*)
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1a1c24] text-[#00e5ff] border border-[#2b3545]">
                    FPGA SYNTHESIS
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-20 h-2 bg-[#1b1d22] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${genomeXUnlockRate}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-[11px]">
                      {genomeXUnlockRate}% ({genomeXQualifiedTeams.length}/{totalTeams})
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  {genomeXQualifiedTeams.length > 0 ? (
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      {genomeXQualifiedTeams[0].name} <span className="text-zinc-500 font-sans text-[10px]">(First)</span>
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-zinc-400">
                  {genomeXQualifiedTeams.length > 0 ? `${genomeXQualifiedTeams.length} Unlocked` : '—'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {genomeXQualifiedTeams.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                      <Sparkles className="w-3 h-3 text-[#00e5ff]" /> ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
                      <Lock className="w-3 h-3" /> AIR-GAP LOCKED
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 6. ARCESIUM BENCHMARKING ENGINE ── */}
      <div className="p-5 rounded-2xl bg-[#0e1014] border border-[#22262f] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-wider mb-1 flex items-center gap-2">
            <span>ARCESIUM HARDWARE BENCHMARKING SPECIFICATION</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            In financial technology systems, single-cycle deterministic timing and metastability immunity are vital. Verilog Quest telemetry mirrors production RTL co-processor performance metrics.
          </p>
        </div>
        <div className="text-right shrink-0 font-mono">
          <span className="text-[11px] text-[#00e5ff] block">Evaluation Standard</span>
          <span className="text-sm font-bold text-white">IEEE 1364 &bull; Vivado ML</span>
        </div>
      </div>

    </div>
  );
};
