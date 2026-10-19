import React from 'react';
import { 
  BarChart3, 
  Activity, 
  AlertOctagon,
  Timer,
  TrendingUp
} from 'lucide-react';

export const LiveAnalysisView = ({
  teams,
  puzzles,
  activeTeam
}) => {
  const totalTeams = teams.length;

  // Compute analytics per puzzle
  const puzzleStats = puzzles.map((puzzle) => {
    let solvesCount = 0;
    let fastestSolveDurationMs = Infinity;
    let fastestTeamName = 'None';
    let totalSolveDurationMs = 0;

    teams.forEach((t) => {
      if (t.solvedPuzzles.includes(puzzle.id)) {
        solvesCount++;
        const ts = t.puzzleSolveTimestamps[puzzle.id];
        // Calculate solve time relative to previous puzzle solve or start
        const prevTs = puzzle.id === 1 ? ts - 15 * 60 * 1000 : (t.puzzleSolveTimestamps[puzzle.id - 1] || ts - 20 * 60 * 1000);
        const duration = Math.max(ts - prevTs, 3 * 60 * 1000); // minimum 3 mins

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
      isBottleneck: completionRate < 40 && puzzle.id > 4
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#141518]/90 border border-[#23252a] shadow-[0_0_20px_rgba(0,240,255,0.12)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#00e5ff] font-bold">
            STATISTICAL TELEMETRY
          </span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-xs text-slate-400">Live Task Completion Analysis</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[#00e5ff]" />
          RTL Puzzle Velocity &amp; Bottleneck Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Detailed metrics by task: completion velocity, fastest solves, stage clearance friction, and team timeline trajectories.
        </p>
      </div>

      {/* Metric KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Active Competing Teams</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{totalTeams} Teams</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> 100% telemetry online
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Verified Solves</div>
          <div className="text-2xl font-black text-[#00e5ff] font-mono mt-1">
            {teams.reduce((acc, t) => acc + t.solvedPuzzles.length, 0)} Solves
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across 10 hardware stages</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Average Solve Time</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">16.4 mins</div>
          <div className="text-[11px] text-slate-400 mt-1">Per unlocked hardware stage</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Leader Pace</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">9 / 10 Stages</div>
          <div className="text-[11px] text-slate-400 mt-1">RTL_Overclockers (NITK)</div>
        </div>
      </div>

      {/* Stage-by-Stage Completion Breakdown Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#131417]/90 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#00e5ff]" />
            Task Completion &amp; Speed Metrics (P1 &ndash; P10)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Updated in Real Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f1012] text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Stage #</th>
                <th className="py-3 px-4">Challenge Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Completion Rate</th>
                <th className="py-3 px-3 text-center">Fastest Solve</th>
                <th className="py-3 px-3 text-center">Avg Time</th>
                <th className="py-3 px-4 text-right">Difficulty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {puzzleStats.map(({ puzzle, solvesCount, completionRate, fastestTeamName, fastestMins, avgDurationMins, isBottleneck }) => (
                <tr key={puzzle.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#00e5ff]">
                    STAGE {puzzle.stageNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {puzzle.title}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {puzzle.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-200 text-[11px]">
                        {completionRate}% ({solvesCount}/{totalTeams})
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {fastestMins > 0 ? (
                      <span className="text-emerald-400 font-semibold">
                        {fastestMins}m <span className="text-slate-500 font-sans text-[10px]">({fastestTeamName})</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                    {avgDurationMins > 0 ? `${avgDurationMins} mins` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isBottleneck ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">
                        <AlertOctagon className="w-3 h-3" /> BOTTLENECK
                      </span>
                    ) : completionRate >= 70 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                        FAST CLEAR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-mono font-bold">
                        BALANCED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Trajectory Timeline */}
      <div className="p-6 rounded-2xl bg-[#121316]/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00e5ff]" />
            Live Stage Clearance Timeline Across Teams
          </h3>
          <span className="text-xs text-slate-400 font-mono">X-Axis: Stages Solved (0 to 10)</span>
        </div>

        <div className="space-y-3 pt-2">
          {teams.map((team) => {
            const count = team.solvedPuzzles.length;
            const percent = (count / 10) * 100;
            const isUser = activeTeam?.id === team.id;

            return (
              <div 
                key={team.id}
                className={`p-3 rounded-xl border transition ${
                  isUser ? 'bg-cyan-950/30 border-cyan-400/50' : 'bg-slate-900/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{team.avatarSeed}</span>
                    <span className="font-bold text-white">{team.name}</span>
                    <span className="text-slate-400">({team.college})</span>
                    {isUser && (
                      <span className="text-[10px] font-mono font-bold bg-cyan-400 text-black px-1.5 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[#00e5ff] font-bold">
                    {count} / 10 Stages ({percent}%) &bull; {team.score} pts
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                    style={{ width: `${Math.max(percent, 2)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arcesium Engineering Benchmarking Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b1c3a] to-[#07132a] border border-cyan-400/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-wider mb-1">
            ARCESIUM BENCHMARKING ENGINE
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            In ultra-low-latency financial engineering, single-cycle deterministic timing and metastability immunity are vital. Verilog Quest metrics reflect real-world FPGA co-processor performance metrics.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] font-mono text-[#00e5ff] block">Evaluation Standard</span>
          <span className="text-base font-black font-mono text-white">IEEE 1364 &bull; Vivado ML</span>
        </div>
      </div>
    </div>
  );
};
