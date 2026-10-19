import React, { useState, useEffect } from 'react';
import { PUZZLES } from './data/puzzles';
import { INITIAL_TEAMS, INITIAL_ACTIVITY_LOGS } from './data/teams';
import { soundFx } from './utils/sound';

import { ElectricCanvas } from './components/ElectricCanvas';
import { CyberCursor } from './components/CyberCursor';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PuzzleStageList } from './components/PuzzleStageList';
import { LeaderboardView } from './components/LeaderboardView';
import { FinalProblemView } from './components/FinalProblemView';
import { LiveAnalysisView } from './components/LiveAnalysisView';
import { RulesView } from './components/RulesView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export const App = () => {
  const [currentTab, setCurrentTab] = useState('puzzles');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize Teams from localStorage or fallback
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('vq_teams_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_TEAMS;
  });

  // Current logged in team id
  const [activeTeamId, setActiveTeamId] = useState(() => {
    const saved = localStorage.getItem('vq_active_team_id');
    return saved !== null ? saved : 'team_bitflipper_01';
  });

  // Hints used by teams
  const [usedHintsMap, setUsedHintsMap] = useState(() => {
    const saved = localStorage.getItem('vq_used_hints');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  // Activity feed
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('vq_activity_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Active Team Object
  const activeTeam = teams.find((t) => t.id === activeTeamId) || null;
  const currentTeamSolved = activeTeam ? activeTeam.solvedPuzzles : [];
  const activeTeamUsedHints = activeTeamId ? (usedHintsMap[activeTeamId] || []) : [];

  // Persist teams to localStorage
  useEffect(() => {
    localStorage.setItem('vq_teams_data', JSON.stringify(teams));
  }, [teams]);

  // Persist active team
  useEffect(() => {
    if (activeTeamId) {
      localStorage.setItem('vq_active_team_id', activeTeamId);
    } else {
      localStorage.removeItem('vq_active_team_id');
    }
  }, [activeTeamId]);

  // Persist used hints
  useEffect(() => {
    localStorage.setItem('vq_used_hints', JSON.stringify(usedHintsMap));
  }, [usedHintsMap]);

  // Persist activity logs
  useEffect(() => {
    localStorage.setItem('vq_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Toggle Sound FX
  const handleToggleSound = () => {
    const nextState = soundFx.toggle();
    setSoundEnabled(nextState);
  };

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Solve Puzzle Handler
  const handleSolvePuzzle = (puzzleId, rawAnswer) => {
    if (!activeTeam) return false;

    const puzzle = PUZZLES.find((p) => p.id === puzzleId);
    if (!puzzle) return false;

    // Normalize answer: remove quotes, spaces, lowercase
    const cleanInput = rawAnswer.trim().toLowerCase().replace(/['"`]/g, '');
    const isCorrect = puzzle.acceptedAnswers.some((ans) => {
      const cleanAns = ans.trim().toLowerCase().replace(/['"`]/g, '');
      return cleanAns === cleanInput;
    });

    if (isCorrect) {
      // Check if already solved
      if (activeTeam.solvedPuzzles.includes(puzzleId)) {
        return true;
      }

      const now = Date.now();
      const updatedSolved = [...activeTeam.solvedPuzzles, puzzleId].sort((a, b) => a - b);
      const updatedScore = activeTeam.score + puzzle.points;
      const updatedTimestamps = {
        ...activeTeam.puzzleSolveTimestamps,
        [puzzleId]: now
      };

      const updatedTeam = {
        ...activeTeam,
        solvedPuzzles: updatedSolved,
        score: updatedScore,
        puzzleSolveTimestamps: updatedTimestamps,
        lastActive: now
      };

      setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updatedTeam : t)));

      // Add to activity feed
      const newEvent = {
        id: `act_${Date.now()}`,
        timestamp: now,
        teamId: activeTeam.id,
        teamName: activeTeam.name,
        puzzleId: puzzle.id,
        puzzleTitle: puzzle.title,
        type: updatedSolved.length === 10 ? 'FINISH_ALL' : updatedSolved.length === 5 ? 'MILESTONE_5' : 'SOLVE',
        message: updatedSolved.length === 10 
          ? `🏆 ALL 10 STAGES COMPLETED! Transmitted Golden RTL Bitstream!` 
          : `Decrypted Stage 0${puzzle.id}! +${puzzle.points} pts awarded.`
      };

      setActivityLogs((prev) => [newEvent, ...prev.slice(0, 30)]);
      showToast(`⚡ Stage 0${puzzle.id} Decrypted! Fragment 0${puzzle.id} compiled.`);
      return true;
    }

    return false;
  };

  // Use Hint Handler
  const handleUseHint = (puzzleId) => {
    if (!activeTeam) return;
    const currentHints = usedHintsMap[activeTeam.id] || [];
    if (currentHints.includes(puzzleId)) return;

    const puzzle = PUZZLES.find((p) => p.id === puzzleId);
    if (!puzzle) return;

    const updatedHints = [...currentHints, puzzleId];
    setUsedHintsMap((prev) => ({
      ...prev,
      [activeTeam.id]: updatedHints
    }));

    const updatedTeam = {
      ...activeTeam,
      penaltyMinutes: activeTeam.penaltyMinutes + puzzle.hintPenaltyMinutes
    };

    setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updatedTeam : t)));

    showToast(`⚠️ Hint unlocked (+${puzzle.hintPenaltyMinutes}m timing penalty).`);
  };

  // Switch / Login Team
  const handleLoginTeam = (team) => {
    setActiveTeamId(team.id);
    showToast(`Welcome back, ${team.name}!`);
  };

  // Register New Team
  const handleRegisterTeam = (newTeamData) => {
    const newId = `team_${Date.now()}`;
    const newTeam = {
      ...newTeamData,
      id: newId,
      solvedPuzzles: [],
      puzzleSolveTimestamps: {},
      penaltyMinutes: 0,
      score: 0,
      lastActive: Date.now()
    };

    setTeams((prev) => [newTeam, ...prev]);
    setActiveTeamId(newId);
    showToast(`Team "${newTeam.name}" registered successfully!`);
  };

  // Logout / Switch Team
  const handleLogout = () => {
    setActiveTeamId(null);
    showToast('Logged out of team profile.');
  };

  // Jump to next unsolved puzzle
  const handleJumpToCurrentPuzzle = () => {
    setCurrentTab('puzzles');
    const nextId = (currentTeamSolved.length + 1);
    setTimeout(() => {
      const el = document.getElementById(`stage-${nextId <= 10 ? nextId : 10}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Jump to specific stage
  const handleJumpToStage = (stageId) => {
    setCurrentTab('puzzles');
    setTimeout(() => {
      const el = document.getElementById(`stage-${stageId}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Live Competition Simulation Mode (Simulates competing teams making progress)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const competingTeams = teams.filter((t) => t.id !== activeTeamId && t.solvedPuzzles.length < 10);
      if (competingTeams.length === 0) return;

      const randomTeam = competingTeams[Math.floor(Math.random() * competingTeams.length)];
      const nextPuzzleToSolve = randomTeam.solvedPuzzles.length + 1;
      const puzzle = PUZZLES.find((p) => p.id === nextPuzzleToSolve);
      if (!puzzle) return;

      const now = Date.now();
      const updatedSolved = [...randomTeam.solvedPuzzles, puzzle.id];
      const updatedScore = randomTeam.score + puzzle.points;
      const updatedTimestamps = {
        ...randomTeam.puzzleSolveTimestamps,
        [puzzle.id]: now
      };

      const updated = {
        ...randomTeam,
        solvedPuzzles: updatedSolved,
        score: updatedScore,
        puzzleSolveTimestamps: updatedTimestamps,
        lastActive: now
      };

      setTeams((prev) => prev.map((t) => (t.id === randomTeam.id ? updated : t)));

      const newEvent = {
        id: `act_${now}`,
        timestamp: now,
        teamId: randomTeam.id,
        teamName: randomTeam.name,
        puzzleId: puzzle.id,
        puzzleTitle: puzzle.title,
        type: 'SOLVE',
        message: `Decrypted Stage 0${puzzle.id} (${puzzle.title})! Score: ${updatedScore} pts`
      };

      setActivityLogs((prev) => [newEvent, ...prev.slice(0, 30)]);
      showToast(`⚡ Live Update: ${randomTeam.name} solved Stage 0${puzzle.id}!`);
      soundFx.playZap();
    }, 14000);

    return () => clearInterval(interval);
  }, [isSimulating, teams, activeTeamId]);

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-zinc-100 flex flex-col relative selection:bg-[#00e5ff] selection:text-black">
      {/* Background Interactive Electric Canvas */}
      <ElectricCanvas />

      {/* Custom Tactical HUD Cursor Reticle (Matching User Reference Image) */}
      <CyberCursor />

      {/* Main App Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeTeam={activeTeam}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        solvedCount={currentTeamSolved.length}
        totalPuzzles={PUZZLES.length}
      />

      {/* Hero Banner with telemetry HUD & Countdown */}
      <HeroBanner
        activeTeam={activeTeam}
        solvedCount={currentTeamSolved.length}
        totalPuzzles={PUZZLES.length}
        onSelectTab={setCurrentTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onJumpToCurrentPuzzle={handleJumpToCurrentPuzzle}
      />

      {/* Dynamic Tab Views */}
      <main className="flex-1 relative z-10">
        {currentTab === 'puzzles' && (
          <PuzzleStageList
            puzzles={PUZZLES}
            activeTeam={activeTeam}
            onSolve={handleSolvePuzzle}
            onUseHint={handleUseHint}
            usedHints={activeTeamUsedHints}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigateToFinal={() => setCurrentTab('final-problem')}
          />
        )}

        {currentTab === 'final-problem' && (
          <FinalProblemView
            puzzles={PUZZLES}
            activeTeam={activeTeam}
            onJumpToStage={handleJumpToStage}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            teams={teams}
            puzzles={PUZZLES}
            activeTeam={activeTeam}
            activityLogs={activityLogs}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
          />
        )}

        {currentTab === 'analysis' && (
          <LiveAnalysisView
            teams={teams}
            puzzles={PUZZLES}
            activeTeam={activeTeam}
          />
        )}

        {currentTab === 'rules' && (
          <RulesView />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Team Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        teams={teams}
        onLogin={handleLoginTeam}
        onRegister={handleRegisterTeam}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl bg-[#16171b] border border-[#2a2d35] text-xs font-mono text-zinc-200 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
