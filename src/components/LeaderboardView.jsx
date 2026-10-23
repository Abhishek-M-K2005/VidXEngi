import React, { useState } from 'react';
import { soundFx } from '../utils/sound';
import { Trophy, Search, Filter, Radio, Play, Pause, Dna, Lock, CheckCircle2, Sparkles } from 'lucide-react';

export const LeaderboardView = ({
  teams,
  puzzles,
  activeTeam,
  activityLogs,
  isSimulating,
  onToggleSimulation
}) => {
  const [searchTeam, setSearchTeam] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('ALL');

  // Only competing student teams appear on the public leaderboard
  const competingTeams = teams.filter((t) => !t.isAdmin && t.id !== 'admin_vidyut');

  // Get the definitive timestamp when a team completed all 5 puzzles (or their last solve)
  const getTeamCompletionTime = (t) => {
    if (t.completedAllAt) return t.completedAllAt;
    if (t.puzzleSolveTimestamps && t.puzzleSolveTimestamps[5]) return t.puzzleSolveTimestamps[5];
    const vals = Object.values(t.puzzleSolveTimestamps || {});
    return vals.length > 0 ? Math.max(...vals) : (t.lastActive || 0);
  };

  // Sort teams according to contest rules:
  // 1. Teams who solved all 5 puzzles are strictly ranked by completion time (earliest completed is on top!)
  // 2. Teams with fewer puzzles are ranked by solved count (e.g. 4 > 3 > 2), then earliest solve time.
  const sortedTeams = [...competingTeams].sort((a, b) => {
    const aSolvedCount = a.solvedPuzzles.length;
    const bSolvedCount = b.solvedPuzzles.length;
    const isACompleted = aSolvedCount === puzzles.length;
    const isBCompleted = bSolvedCount === puzzles.length;

    // Both completed all 5 puzzles: one who completed early MUST be on top!
    if (isACompleted && isBCompleted) {
      const aTime = getTeamCompletionTime(a);
      const bTime = getTeamCompletionTime(b);
      if (aTime && bTime && aTime !== bTime) {
        return aTime - bTime; // Earlier timestamp comes first (#1 on top)
      }
      if (b.score !== a.score) return b.score - a.score;
      return a.penaltyMinutes - b.penaltyMinutes;
    }

    // Only team A completed all 5 puzzles
    if (isACompleted) return -1;
    // Only team B completed all 5 puzzles
    if (isBCompleted) return 1;

    // Neither completed all 5: order by puzzle solve count descending
    if (bSolvedCount !== aSolvedCount) return bSolvedCount - aSolvedCount;

    // Same count of solved puzzles: earlier solve time ranks higher
    const aLastTime = getTeamCompletionTime(a);
    const bLastTime = getTeamCompletionTime(b);
    if (aLastTime && bLastTime && aLastTime !== bLastTime) {
      return aLastTime - bLastTime;
    }

    if (b.score !== a.score) return b.score - a.score;
    return a.penaltyMinutes - b.penaltyMinutes;
  });

  const colleges = ['ALL', ...Array.from(new Set(competingTeams.map((t) => t.college)))];

  const filteredTeams = sortedTeams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
      t.college.toLowerCase().includes(searchTeam.toLowerCase()) ||
      t.members.some((m) => m.toLowerCase().includes(searchTeam.toLowerCase()));
    const matchesCollege = selectedCollege === 'ALL' || t.college === selectedCollege;
    return matchesSearch && matchesCollege;
  });

  // Format exact date and time (NO "5 hours ago", shows exact day, month, year and hh:mm:ss AM/PM)
  const formatExactDateTime = (ts) => {
    if (!ts || ts === 0) return { date: '—', time: '—', full: '—' };
    const d = new Date(ts);
    if (isNaN(d.getTime())) return { date: '—', time: '—', full: '—' };

    const day = d.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, '0');

    const dateStr = `${day} ${month} ${year}`;
    const timeStr = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return {
      date: dateStr,
      time: timeStr,
      full: `${dateStr}, ${timeStr}`
    };
  };

  const RANK_BADGE = [
    { label: '#1', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { label: '#2', color: 'bg-zinc-400/20 text-zinc-200 border-zinc-400/40' },
    { label: '#3', color: 'bg-amber-800/20 text-amber-400 border-amber-800/40' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* ── Top Header Bar ── */}
      <div className="p-5 rounded-2xl bg-[#141517] border border-[#232529] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              LIVE BROADCAST &bull; VERILOG QUEST '26
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs text-zinc-400">ACM Vidyut × Engineer NITK '26</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Official Standings Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time Phase 1 puzzle progression (01–05), cumulative scores, penalties, and Round 1 (GENOME-X) qualification status.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onToggleSimulation();
          }}
          className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition ${
            isSimulating
              ? 'bg-[#15231c] border-emerald-500/50 text-emerald-300'
              : 'bg-[#18191c] border-[#2b2d35] text-zinc-300 hover:border-zinc-500'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulation Streaming</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>Simulate Live Event</span>
            </>
          )}
        </button>
      </div>

      {/* ── Podium Cards for Top 3 (or Empty State) ── */}
      {sortedTeams.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#121316] border border-[#202228] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Standings Matrix Ready</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            No competing teams have been provisioned yet. The official leaderboard will automatically populate as teams are authorized by ACM Vidyut administrators and begin solving hardware stages.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedTeams.slice(0, 3).map((team, idx) => (
            <div
              key={team.id}
              className={`p-5 rounded-xl border matte-card relative overflow-hidden ${
                idx === 0
                  ? '!border-amber-500/40 !bg-[#1c1a14]'
                  : idx === 1
                  ? '!border-zinc-500/30 !bg-[#18191d]'
                  : '!border-amber-800/30 !bg-[#191614]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs uppercase ${RANK_BADGE[idx].color}`}>
                  {RANK_BADGE[idx].label} RANK
                </span>
                <span className="font-mono text-xs font-bold text-zinc-400 px-2 py-0.5 rounded bg-[#131418] border border-[#23252d]">
                  {team.avatarSeed || 'TEAM'}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white truncate">{team.name}</h4>
              <p className="text-xs text-zinc-400 truncate mb-4">{team.college}</p>
              <div className="pt-3 border-t border-[#23252a] flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Puzzles: <strong className="text-[#00e5ff]">{team.solvedPuzzles.length}/{puzzles.length}</strong></span>
                <span className="text-amber-400 font-bold">{team.score.toLocaleString()} pts</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono px-2.5 py-1.5 rounded bg-[#101115] border border-[#232630]">
                <span className="flex items-center gap-1.5 text-zinc-400 font-bold">
                  <Dna className={`w-3.5 h-3.5 ${team.solvedPuzzles.length === puzzles.length ? 'text-[#00e5ff]' : 'text-zinc-500'}`} />
                  <span>{team.solvedPuzzles.length === puzzles.length ? 'COMPLETED:' : 'GENOME-X:'}</span>
                </span>
                {team.solvedPuzzles.length === puzzles.length ? (
                  <span className="text-emerald-300 font-bold flex items-center gap-1 font-mono text-[10px]" title={formatExactDateTime(getTeamCompletionTime(team)).full}>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{formatExactDateTime(getTeamCompletionTime(team)).full}</span>
                  </span>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {team.solvedPuzzles.length}/{puzzles.length} Solved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter & Search Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <span className="text-xs font-mono text-zinc-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Institution:
          </span>
          {colleges.map((c) => (
            <button
              key={c}
              onClick={() => {
                soundFx.playClick();
                setSelectedCollege(c);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
                selectedCollege === c
                  ? 'bg-[#202228] border-[#373b44] text-white font-bold'
                  : 'bg-[#141517] border-[#222429] text-zinc-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTeam}
            onChange={(e) => setSearchTeam(e.target.value)}
            placeholder="Search team or member..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141517] border border-[#232529] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00e5ff] transition"
          />
        </div>
      </div>

      {/* ── Standings Table ── */}
      <div className="matte-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101113] border-b border-[#202227] text-zinc-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Team &bull; Institution</th>
                <th className="py-3.5 px-3 text-center hidden md:table-cell">Phase 1 Puzzles (01–05)</th>
                <th className="py-3.5 px-3 text-center hidden lg:table-cell">Round 1: GENOME-X</th>
                <th className="py-3.5 px-3 text-center hidden sm:table-cell">Completion &bull; Date &amp; Time</th>
                <th className="py-3.5 px-3 text-right hidden sm:table-cell">Penalty</th>
                <th className="py-3.5 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2025] font-sans">
              {filteredTeams.map((team, idx) => {
                const isCurrentUserTeam = activeTeam?.id === team.id;
                const isGenomeXUnlocked = team.solvedPuzzles.length === puzzles.length;
                const completionTimestamp = getTeamCompletionTime(team);
                const completionDateInfo = formatExactDateTime(completionTimestamp);
                const latestSolveTime = Math.max(...Object.values(team.puzzleSolveTimestamps || {}), 0);
                const latestSolveDateInfo = formatExactDateTime(latestSolveTime);

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors ${
                      isCurrentUserTeam
                        ? 'bg-[#131b1d] ring-1 ring-inset ring-[#00e5ff]/25'
                        : 'hover:bg-[#16171a]'
                    }`}
                  >
                    <td className="py-4 px-4 text-center font-mono font-bold text-sm">
                      {idx < 3 ? (
                        <span className={`inline-block px-2 py-0.5 rounded border text-xs font-bold ${RANK_BADGE[idx].color}`}>
                          {RANK_BADGE[idx].label}
                        </span>
                      ) : (
                        <span className="text-zinc-500">#{idx + 1}</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#18191e] border border-[#252832] flex items-center justify-center font-mono text-[10px] font-bold text-zinc-400 shrink-0">
                          {team.avatarSeed ? team.avatarSeed.slice(0, 4) : 'T'}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{team.name}</span>
                            {isCurrentUserTeam && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#00e5ff] text-[#0c0d0e] font-bold font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {team.college} &bull; {team.members.join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center hidden md:table-cell">
                      <div className="inline-flex items-center gap-1.5">
                        {puzzles.map((p) => {
                          const solved = team.solvedPuzzles.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              title={`Stage 0${p.stageNumber}: ${p.title} - ${solved ? 'Solved' : 'Pending'}`}
                              className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold border transition ${
                                solved
                                  ? 'bg-[#142327] border-[#00e5ff]/50 text-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.15)]'
                                  : 'bg-[#18191c] border-[#222429] text-zinc-700'
                              }`}
                            >
                              {solved ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5ff]" /> : `0${p.stageNumber}`}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center hidden lg:table-cell font-mono">
                      {isGenomeXUnlocked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                          <Dna className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
                          <span>QUALIFIED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141519] border border-[#23252d] text-zinc-500 text-[10px]">
                          <Lock className="w-3 h-3 text-zinc-600" />
                          <span>LOCKED ({team.solvedPuzzles.length}/{puzzles.length})</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono hidden sm:table-cell">
                      {isGenomeXUnlocked ? (
                        <div className="inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 shadow-sm">
                          <span className="text-emerald-300 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{completionDateInfo.time}</span>
                          </span>
                          <span className="text-[10px] text-emerald-400/80 mt-0.5 font-medium">
                            {completionDateInfo.date}
                          </span>
                        </div>
                      ) : latestSolveTime > 0 ? (
                        <div className="inline-flex flex-col items-center justify-center">
                          <span className="text-zinc-200 text-xs font-semibold">
                            {latestSolveDateInfo.time}
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">
                            {latestSolveDateInfo.date}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-4 px-3 text-right font-mono text-amber-400/90 hidden sm:table-cell">
                      {team.penaltyMinutes > 0 ? `+${team.penaltyMinutes}m` : '0m'}
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-sm text-white">
                      {team.score.toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    No participating teams registered yet. Teams will be listed once provisioned by contest coordinators.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Event Activity Log ── */}
      <div className="matte-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00e5ff] animate-pulse" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Live Competition Activity Log
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {activityLogs.length} events recorded
          </span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {activityLogs.map((act) => {
            const isMilestone = act.type === 'FINISH_ALL' || act.message?.includes('GENOME-X') || act.message?.includes('Grand Problem');
            return (
              <div
                key={act.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition ${
                  isMilestone
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-[#0e0f11] border-[#1e2024]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isMilestone ? 'bg-amber-400 animate-ping' : 'bg-[#00e5ff]'}`} />
                  {isMilestone && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold font-mono">
                      ROUND 1
                    </span>
                  )}
                  <span className="font-bold text-white">{act.teamName}</span>
                  <span className={isMilestone ? 'text-amber-300 font-medium' : 'text-zinc-400'}>{act.message}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                  {formatExactDateTime(act.timestamp).full}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
