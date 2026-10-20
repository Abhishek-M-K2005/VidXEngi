import React, { useState } from 'react';
import { soundFx } from '../utils/sound';
import { Trophy, Search, Filter, Radio, Play, Pause } from 'lucide-react';

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

  const sortedTeams = [...competingTeams].sort((a, b) => {
    if (b.solvedPuzzles.length !== a.solvedPuzzles.length) return b.solvedPuzzles.length - a.solvedPuzzles.length;
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

  const formatTimeAgo = (ts) => {
    if (!ts) return '—';
    const d = Math.max(0, Date.now() - ts);
    const m = Math.floor(d / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ${m % 60}m ago`;
  };

  const MEDAL = ['🥇', '🥈', '🥉'];

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
            Real-time stage completion timestamps, cumulative scores, and timing penalties across all 10 stages.
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
                <span className="text-2xl">{MEDAL[idx]}</span>
                <span className="text-2xl">{team.avatarSeed}</span>
              </div>
              <h4 className="text-base font-extrabold text-white truncate">{team.name}</h4>
              <p className="text-xs text-zinc-400 truncate mb-4">{team.college}</p>
              <div className="pt-3 border-t border-[#23252a] flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Solved: <strong className="text-[#00e5ff]">{team.solvedPuzzles.length}/10</strong></span>
                <span className="text-amber-400 font-bold">{team.score.toLocaleString()} pts</span>
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
                <th className="py-3.5 px-3 text-center hidden md:table-cell">Stages (P1 &ndash; P10)</th>
                <th className="py-3.5 px-3 text-center hidden sm:table-cell">Last Solve</th>
                <th className="py-3.5 px-3 text-right hidden sm:table-cell">Penalty</th>
                <th className="py-3.5 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2025] font-sans">
              {filteredTeams.map((team, idx) => {
                const isCurrentUserTeam = activeTeam?.id === team.id;
                const latestSolveTime = Math.max(...Object.values(team.puzzleSolveTimestamps), 0);

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
                      {idx < 3 ? MEDAL[idx] : <span className="text-zinc-500">#{idx + 1}</span>}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{team.avatarSeed}</span>
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
                      <div className="inline-flex items-center gap-1">
                        {puzzles.map((p) => {
                          const solved = team.solvedPuzzles.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              title={`P${p.stageNumber}: ${p.title} - ${solved ? 'Solved' : 'Pending'}`}
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold border ${
                                solved
                                  ? 'bg-[#142327] border-[#00e5ff]/40 text-[#00e5ff]'
                                  : 'bg-[#18191c] border-[#222429] text-zinc-700'
                              }`}
                            >
                              {solved ? '✓' : p.stageNumber}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center font-mono text-zinc-400 hidden sm:table-cell">
                      {formatTimeAgo(latestSolveTime)}
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
          {activityLogs.map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-lg bg-[#0e0f11] border border-[#1e2024] flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                <span className="font-bold text-white">{act.teamName}</span>
                <span className="text-zinc-400">{act.message}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                {formatTimeAgo(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
