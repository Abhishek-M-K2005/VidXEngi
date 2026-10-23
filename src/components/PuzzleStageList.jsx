import React, { useState } from 'react';
import { PuzzleCard } from './PuzzleCard';
import { InteractiveHoloCore } from './InteractiveHoloCore';
import { soundFx } from '../utils/sound';
import { Key, Search, Cpu, ChevronDown, ChevronUp, Check } from 'lucide-react';

export const PuzzleStageList = ({
  puzzles,
  activeTeam,
  onSolve,
  onUseHint,
  usedHints,
  onOpenAuth,
  onNavigateToFinal
}) => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHoloInspector, setShowHoloInspector] = useState(false);

  const solvedIds = activeTeam?.solvedPuzzles || [];
  const solvedCount = solvedIds.length;
  const nextPuzzleId = solvedCount + 1;

  const totalStages = puzzles?.length || 5;

  const filteredPuzzles = (puzzles || []).filter((p) => {
    const matchesCat = filterCategory === 'ALL' || p.category === filterCategory;
    const matchesQuery =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.puzzleStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.stageNumber).includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  const categories = [
    'ALL', 
    'COMBINATIONAL LOGIC', 
    'SEQUENTIAL LOGIC', 
    'BIT SLICING & CONCATENATION', 
    'RTL RACE CONDITIONS', 
    'TIMING & ASSERTION'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* ── Top Header Banner ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#141517] border border-[#232529]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
              ACM VIDYUT × ENGINEER NITK '26
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {totalStages} Stage Decryption Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Each decrypted stage unlocks {Math.round(100 / totalStages)}% of the grand FPGA co-processor problem statement. Solve all {totalStages} stages to unlock the full Round One challenge.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              soundFx.playZap();
              setShowHoloInspector(!showHoloInspector);
            }}
            className="btn-matte-ghost text-xs"
          >
            <Cpu className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>{showHoloInspector ? 'Hide 3D Core' : '3D Silicon Die'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateToFinal();
            }}
            className="btn-matte-primary text-xs"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Final Blueprint</span>
          </button>
        </div>
      </div>

      {/* ── Optional 3D Holo Core ── */}
      {showHoloInspector && (
        <div className="animate-fadeIn">
          <InteractiveHoloCore />
        </div>
      )}

      {/* ── Quick Stage Jumper Strip ── */}
      <div className="matte-card p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
          <span>Jump to stage</span>
          <span className="text-[#00e5ff] font-bold">{solvedCount} / {puzzles.length} Decrypted</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {puzzles.map((p) => {
            const isSolved = solvedIds.includes(p.id);
            const isNext = p.id === nextPuzzleId;

            return (
              <a
                key={p.id}
                href={`#stage-${p.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  soundFx.playClick();
                  document.getElementById(`stage-${p.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition ${
                  isSolved
                    ? 'bg-[#152327] border-[#00e5ff]/40 text-[#00e5ff]'
                    : isNext
                    ? 'bg-[#262115] border-amber-500/50 text-amber-300'
                    : 'bg-[#18191c] border-[#25272c] text-zinc-600 hover:border-[#383b43]'
                }`}
              >
                <span className="text-[11px] font-mono font-bold">P{p.stageNumber}</span>
                <span className="text-[9px] mt-0.5 font-medium flex items-center justify-center">
                  {isSolved ? <Check className="w-2.5 h-2.5" /> : isNext ? 'ACTIVE' : '—'}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Category Filters and Search ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
                filterCategory === cat
                  ? 'bg-[#202329] border-[#373b45] text-white font-bold'
                  : 'bg-[#141517] border-[#222429] text-zinc-400 hover:text-white hover:border-[#30333b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search puzzle statement..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141517] border border-[#25272c] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00e5ff] transition"
          />
        </div>
      </div>

      {/* ── Puzzle Cards ── */}
      <div className="space-y-5">
        {filteredPuzzles.map((puzzle) => {
          const isSolved = solvedIds.includes(puzzle.id);
          const isUnlocked = puzzle.id === 1 || solvedIds.includes(puzzle.id - 1);
          const isNextToSolve = puzzle.id === nextPuzzleId;

          return (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              isUnlocked={isUnlocked}
              isSolved={isSolved}
              isNextToSolve={isNextToSolve}
              onSolve={onSolve}
              onUseHint={onUseHint}
              hasUsedHint={usedHints.includes(puzzle.id)}
              activeTeam={activeTeam}
              onOpenAuth={onOpenAuth}
            />
          );
        })}
      </div>

    </div>
  );
};
