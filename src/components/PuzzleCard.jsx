import React, { useState } from 'react';
import { soundFx } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Lock,
  Zap,
  Code2,
  Copy,
  Check,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  FileCode2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const DIFF_STYLES = {
  STANDARD:     { pill: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',  label: 'Standard' },
  INTERMEDIATE: { pill: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',        label: 'Intermediate' },
  ADVANCED:     { pill: 'text-amber-400 bg-amber-950/40 border-amber-800/40',      label: 'Advanced' },
  EXPERT:       { pill: 'text-rose-400 bg-rose-950/40 border-rose-800/40',        label: 'Expert' },
};

export const PuzzleCard = ({
  puzzle,
  isUnlocked,
  isSolved,
  isNextToSolve,
  onSolve,
  onUseHint,
  hasUsedHint,
  activeTeam,
  onOpenAuth
}) => {
  const [inputAnswer, setInputAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHintConfirm, setShowHintConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const diff = DIFF_STYLES[puzzle.difficulty] || DIFF_STYLES.STANDARD;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeTeam) {
      onOpenAuth();
      return;
    }
    if (!inputAnswer.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const success = onSolve(puzzle.id, inputAnswer);
      if (success) {
        soundFx.playUnlock();
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#fbbf24', '#ffffff', '#2dd4bf'],
        });
        setInputAnswer('');
      } else {
        soundFx.playError();
        setErrorMsg('Decryption Key mismatch. Double-check logic expressions and signal timing.');
      }
      setIsSubmitting(false);
    }, 280);
  };

  const handleCopyCode = () => {
    if (puzzle.hardwareSnippet?.code) {
      navigator.clipboard.writeText(puzzle.hardwareSnippet.code);
      setCopiedCode(true);
      soundFx.playClick();
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const cardBorderClass = isSolved
    ? 'matte-card-solved'
    : isNextToSolve
    ? 'matte-card-active spotlight-card'
    : 'matte-card opacity-85';

  return (
    <div id={`stage-${puzzle.id}`} className={`${cardBorderClass} transition-all duration-200 overflow-hidden`}>
      
      {/* ── HEADER BAR ── */}
      <div className={`px-5 py-4 flex items-center justify-between gap-3 border-b ${
        isSolved
          ? 'border-[#23272d] bg-[#101215]'
          : isNextToSolve
          ? 'border-[#2d313a] bg-[#16181c]'
          : 'border-[#1e2024] bg-[#111215]'
      }`}>
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Stage Icon */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
            isSolved
              ? 'bg-[#152427] border-[#00e5ff]/40 text-[#00e5ff]'
              : isNextToSolve
              ? 'bg-[#262115] border-amber-500/50 text-amber-300'
              : 'bg-[#18191c] border-[#25272c] text-zinc-500'
          }`}>
            {isSolved ? (
              <CheckCircle2 className="w-4.5 h-4.5" />
            ) : isUnlocked ? (
              <span>P{puzzle.stageNumber}</span>
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                Stage 0{puzzle.stageNumber}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${diff.pill}`}>
                {diff.label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1d22] border border-[#2b2d35] text-zinc-400">
                {puzzle.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight truncate">
              {puzzle.title}
            </h3>
          </div>
        </div>

        {/* Right Info: Points & Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block font-mono">
            <div className="text-[10px] text-zinc-500 uppercase">Bounty</div>
            <div className="text-sm font-extrabold text-[#fbbf24]">
              +{puzzle.points} pts
            </div>
          </div>

          {isSolved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#142327] border border-[#00e5ff]/40 text-[#00e5ff]">
              <ShieldCheck className="w-3.5 h-3.5" />
              DECRYPTED
            </span>
          )}

          {!isUnlocked && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-500 bg-[#161719] border border-[#232427]">
              <Lock className="w-3 h-3" />
              LOCKED
            </span>
          )}

          {isSolved && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-[#1a1b1f] transition"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* ── CARD BODY ── */}
      {(!isSolved || expanded) && (
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Locked State Notice */}
          {!isUnlocked && (
            <div className="py-8 text-center space-y-2 border border-dashed border-[#23252a] rounded-xl bg-[#0f1012]">
              <Lock className="w-7 h-7 text-zinc-600 mx-auto" />
              <div className="text-sm font-semibold text-zinc-300">Stage Locked</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Decryption protocol locked. Complete <strong className="text-zinc-300">Stage 0{puzzle.id - 1}</strong> to unlock this puzzle and view its RTL netlist.
              </p>
            </div>
          )}

          {/* Unlocked / Solved Content */}
          {isUnlocked && (
            <>
              {/* Context / Lore */}
              <div className="p-3.5 rounded-xl bg-[#0e0f11] border border-[#1f2125] text-xs text-zinc-300 leading-relaxed font-sans">
                <span className="text-[#00e5ff] font-mono font-bold mr-2 text-[11px] uppercase tracking-wider">
                  [CONTEXT]:
                </span>
                {puzzle.storyContext}
              </div>

              {/* Problem Statement */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  <FileCode2 className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>Objective &bull; Decryption Goal</span>
                </div>
                <p className="text-sm text-zinc-100 font-medium leading-relaxed p-4 rounded-xl bg-[#101114] border border-[#23252a]">
                  {puzzle.puzzleStatement}
                </p>
              </div>

              {/* Code Snippet */}
              {puzzle.hardwareSnippet && (
                <div className="code-block-matte overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-[#121316] border-b border-[#1f2126] text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#00e5ff]" />
                      {puzzle.hardwareSnippet.language.toUpperCase()} &bull; Hardware Netlist
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs sm:text-[13px] font-mono text-zinc-200 overflow-x-auto leading-relaxed select-all">
                    <code>{puzzle.hardwareSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Hint Drawer */}
              <div>
                {hasUsedHint ? (
                  <div className="p-3.5 rounded-xl bg-[#1d1a13] border border-[#3d3319] text-xs text-amber-200 space-y-1 font-mono">
                    <div className="flex items-center gap-2 font-bold text-amber-400 uppercase text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      UNLOCKED HINT (Penalty Incurred)
                    </div>
                    <p className="font-sans text-amber-200/90">{puzzle.hint}</p>
                  </div>
                ) : showHintConfirm ? (
                  <div className="p-3.5 rounded-xl bg-[#1c1913] border border-[#3d341a] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-amber-200">
                      <strong className="text-amber-300">Unlock Hint?</strong> This will incur a{' '}
                      <span className="font-mono font-bold text-amber-400">+{puzzle.hintPenaltyMinutes}m</span>{' '}
                      timing penalty for your team.
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowHintConfirm(false)}
                        className="px-3 py-1 rounded bg-[#252830] hover:bg-[#30333d] text-zinc-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          soundFx.playZap();
                          onUseHint(puzzle.id);
                          setShowHintConfirm(false);
                        }}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-[#0c0d0e] font-bold"
                      >
                        Confirm (+{puzzle.hintPenaltyMinutes}m)
                      </button>
                    </div>
                  </div>
                ) : !isSolved && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShowHintConfirm(true);
                    }}
                    className="text-xs text-amber-400/80 hover:text-amber-300 inline-flex items-center gap-1 font-mono hover:underline"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Request Hardware Hint (+{puzzle.hintPenaltyMinutes}m penalty)
                  </button>
                )}
              </div>

              {/* Submission Form */}
              {!isSolved && (
                <form onSubmit={handleSubmit} className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inputAnswer}
                        onChange={(e) => setInputAnswer(e.target.value)}
                        placeholder="Enter Verilog solution (e.g. assign error_count = ... or expression)..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0b0d] border border-[#25272c] text-white placeholder-zinc-600 text-sm font-mono focus:outline-none focus:border-[#00e5ff] transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !inputAnswer.trim()}
                      className="btn-matte-primary disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      {isSubmitting ? (
                        <span className="animate-spin text-base">⏳</span>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Submit Key</span>
                        </>
                      )}
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-[#241315] border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2 animate-shake">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </form>
              )}

              {/* Decrypted Fragment */}
              {isSolved && (
                <div className="mt-4 p-4 sm:p-5 rounded-xl bg-[#111619] border border-[#1e343d] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b3842] pb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
                      <span className="text-xs font-mono font-bold text-[#00e5ff] uppercase tracking-wider">
                        DECRYPTED FRAGMENT 0{puzzle.fragment.index}/05: {puzzle.fragment.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-[#0e1013] px-2 py-0.5 rounded border border-[#23272e]">
                      CHECKSUM: {puzzle.fragment.checksum}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                    {puzzle.fragment.content}
                  </p>

                  {puzzle.fragment.verilogSignature && (
                    <div className="p-2.5 rounded bg-[#090a0c] border border-[#202b33] text-xs font-mono text-[#00e5ff] overflow-x-auto">
                      <code>{puzzle.fragment.verilogSignature}</code>
                    </div>
                  )}

                  <div className="pt-2 text-xs text-zinc-400 border-t border-[#1a232b]">
                    <strong className="text-zinc-300">Engineering Rationale: </strong>
                    {puzzle.explanation}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}

    </div>
  );
};
