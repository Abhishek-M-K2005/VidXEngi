import React, { useState, useEffect } from 'react';
import { PUZZLES } from './data/puzzles';
import { INITIAL_TEAMS, INITIAL_ACTIVITY_LOGS, ADMIN_TEAM, SAMPLE_TEAMS } from './data/teams';
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
import { SessionCollisionModal } from './components/SessionCollisionModal';
import { Footer } from './components/Footer';
import { sessionManager } from './utils/sessionManager';
import { fetchClientIpData, getCachedClientIp, getCachedNetworkOrg } from './utils/networkIp';
import { cloudSync, normalizeTeams } from './utils/cloudSync';

export const App = () => {
  const [currentTab, setCurrentTab] = useState('puzzles');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('team');
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Concurrency & Single Active Session State
  const [displacedSessionInfo, setDisplacedSessionInfo] = useState(null);
  const [isCollisionModalOpen, setIsCollisionModalOpen] = useState(false);
  const [displacedTeam, setDisplacedTeam] = useState(null);

  // Initialize Teams from localStorage with reliable fallback to INITIAL_TEAMS
  const [teams, setTeams] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vq_teams_data');
      if (saved !== null) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Filter out legacy dummy demo teams and any test objects
            const DEMO_IDS = [
              'team_rtl_overclockers', 'team_fpga_phoenix', 'team_silicon_surfers',
              'team_nand_lords', 'team_gate_crashers', 'team_bitflipper_01', 'team_verilog_vipers', 'test_team'
            ];
            return normalizeTeams(parsed.filter((t) => !DEMO_IDS.includes(t.id)));
          }
        } catch {
          // fallback
        }
      }

      const legacySaved = localStorage.getItem('vq_prod_teams_v1');
      if (legacySaved !== null) {
        try {
          const parsed = JSON.parse(legacySaved);
          if (Array.isArray(parsed)) {
            const DEMO_IDS = [
              'team_rtl_overclockers', 'team_fpga_phoenix', 'team_silicon_surfers',
              'team_nand_lords', 'team_gate_crashers', 'team_bitflipper_01', 'team_verilog_vipers', 'test_team'
            ];
            return normalizeTeams(parsed.filter((t) => !DEMO_IDS.includes(t.id)));
          }
        } catch {}
      }
    }
    return normalizeTeams(INITIAL_TEAMS);
  });

  // Current logged in team id (starts null in production for unauthenticated visitors)
  const [activeTeamId, setActiveTeamId] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('vq_active_team_id');
    // If it was the legacy demo team, clear it
    if (!saved || saved === 'team_bitflipper_01' || saved.startsWith('team_rtl') || saved.startsWith('team_fpga')) {
      return null;
    }
    
    // Check if another tab/device is already running an active session for this team
    const activeSession = sessionManager.getActiveSession(saved);
    const myTabSessionId = sessionStorage.getItem('vq_current_session_id');
    if (activeSession && (activeSession.tabId !== sessionManager.tabId || activeSession.sessionId !== myTabSessionId)) {
      // Another tab or device is active; start this tab in spectator mode to prevent multi-tab collision
      return null;
    }
    return saved;
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
      try {
        const parsed = JSON.parse(saved);
        // Filter out legacy mock logs
        return parsed.filter((log) => !log.id.startsWith('act_') || Number(log.id.replace('act_', '')) > 100);
      } catch {}
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Active Team Object (supports competing teams and admin account)
  const activeTeam = (activeTeamId === ADMIN_TEAM.id)
    ? ADMIN_TEAM
    : (teams.find((t) => t.id === activeTeamId) || null);
  const currentTeamSolved = activeTeam ? activeTeam.solvedPuzzles : [];
  const activeTeamUsedHints = activeTeamId ? (usedHintsMap[activeTeamId] || []) : [];

  // Register active session & listen for concurrent displacement
  useEffect(() => {
    // Probe client IP & network origin for fraud prevention & admin telemetry
    fetchClientIpData().catch(() => {});

    // Only refresh session registration if this specific tab holds the active session token
    const myTabSessionId = sessionStorage.getItem('vq_current_session_id');
    if (activeTeamId && myTabSessionId) {
      sessionManager.registerSession(activeTeamId);
    }

    const unsubscribe = sessionManager.subscribe((info) => {
      soundFx.playError();
      const currentActive = teams.find((t) => t.id === info.teamId || t.id === activeTeamId);
      setDisplacedTeam(currentActive || null);
      setDisplacedSessionInfo(info);
      setIsCollisionModalOpen(true);
      setActiveTeamId(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Real-Time Cloud Team Synchronization across all devices on Render
  useEffect(() => {
    // 1. Initial fetch from cloud relay
    cloudSync.fetchLatestTeams().then((cloudTeams) => {
      if (Array.isArray(cloudTeams)) {
        setTeams(normalizeTeams(cloudTeams));
      }
    });

    // 2. Real-time listener for incoming additions/deletions from any admin device
    const unsubscribeSync = cloudSync.subscribe((incomingTeams) => {
      if (Array.isArray(incomingTeams)) {
        setTeams(normalizeTeams(incomingTeams));
      }
    });

    return () => {
      unsubscribeSync();
    };
  }, []);

  // Persist teams to localStorage
  useEffect(() => {
    localStorage.setItem('vq_teams_data', JSON.stringify(teams));
    localStorage.setItem('vq_prod_teams_v1', JSON.stringify(teams));
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

    // Robust Verilog code normalization helper
    const normalizeVerilog = (str) => {
      return String(str || '')
        .toLowerCase()
        .replace(/['"`]/g, '')
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // remove comments
        .replace(/\b1'b([01])\b/g, '$1') // normalize 1'b0 -> 0, 1'b1 -> 1
        .replace(/\s+/g, ' ')
        .replace(/\s*;\s*$/, '') // remove trailing semicolon
        .replace(/\s*([=+\-*{};:,()<>!&|^~])\s*/g, '$1') // normalize whitespace around operators
        .trim();
    };

    const cleanInput = rawAnswer.trim().toLowerCase().replace(/['"`]/g, '');
    const normInput = normalizeVerilog(rawAnswer);

    const isCorrect = puzzle.acceptedAnswers.some((ans) => {
      const cleanAns = ans.trim().toLowerCase().replace(/['"`]/g, '');
      const normAns = normalizeVerilog(ans);
      return cleanAns === cleanInput || normAns === normInput;
    });

    if (isCorrect) {
      // Check if already solved
      if (activeTeam.solvedPuzzles.includes(puzzleId)) {
        return true;
      }

      const now = Date.now();
      const clientIp = getCachedClientIp();
      const networkOrg = getCachedNetworkOrg();
      const updatedSolved = [...activeTeam.solvedPuzzles, puzzleId].sort((a, b) => a - b);
      const updatedScore = activeTeam.score + puzzle.points;
      const updatedTimestamps = {
        ...activeTeam.puzzleSolveTimestamps,
        [puzzleId]: now
      };
      const isAllSolved = updatedSolved.length === PUZZLES.length;
      const completedAllAt = isAllSolved ? (activeTeam.completedAllAt || now) : activeTeam.completedAllAt;
      const updatedIpHistory = Array.from(new Set([...(activeTeam.ipHistory || []), clientIp]));

      const updatedTeam = {
        ...activeTeam,
        solvedPuzzles: updatedSolved,
        score: updatedScore,
        puzzleSolveTimestamps: updatedTimestamps,
        lastActive: now,
        lastIp: clientIp,
        networkOrg,
        ipHistory: updatedIpHistory,
        ...(completedAllAt ? { completedAllAt } : {})
      };

      setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updatedTeam : t)));

      // Add to activity feed with client IP audit tracking
      const newEvent = {
        id: `act_${Date.now()}`,
        timestamp: now,
        teamId: activeTeam.id,
        teamName: activeTeam.name,
        puzzleId: puzzle.id,
        puzzleTitle: puzzle.title,
        clientIp,
        networkOrg,
        type: isAllSolved ? 'FINISH_ALL' : 'SOLVE',
        message: isAllSolved 
          ? `[ALL STAGES CLEARED] Grand Problem Statement Unlocked!` 
          : `Decrypted Stage 0${puzzle.id}! +${puzzle.points} pts awarded.`
      };

      setActivityLogs((prev) => [newEvent, ...prev.slice(0, 30)]);
      showToast(
        isAllSolved
          ? `[UNLOCKED] Stage 0${puzzle.id} Decrypted! Round 1: GENOME-X Unlocked!`
          : `Stage 0${puzzle.id} Decrypted! Fragment 0${puzzle.id} compiled.`
      );
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

    showToast(`Hint unlocked (+${puzzle.hintPenaltyMinutes}m timing penalty).`);
  };

  // Switch / Login Team with Single Active Session Registration & IP Audit
  const handleLoginTeam = (team) => {
    const clientIp = getCachedClientIp();
    const networkOrg = getCachedNetworkOrg();

    sessionManager.registerSession(team.id);
    setActiveTeamId(team.id);
    setIsCollisionModalOpen(false);
    setDisplacedSessionInfo(null);

    if (!team.isAdmin) {
      const updatedIpHistory = Array.from(new Set([...(team.ipHistory || []), clientIp]));
      setTeams((prev) => prev.map((t) => (t.id === team.id ? { ...t, lastIp: clientIp, networkOrg, ipHistory: updatedIpHistory } : t)));
    }

    showToast(team.isAdmin 
      ? `Welcome, ACM Vidyut Proctor! Master operations unlocked.` 
      : `Welcome back, ${team.name}! (Active Terminal Locked to IP ${clientIp})`
    );
  };

  // Admin Provision New Team (Only callable by Admin)
  const handleAdminAddTeam = (newTeamData) => {
    const newId = `team_${Date.now()}`;
    const newTeam = {
      ...newTeamData,
      id: newId,
      solvedPuzzles: [],
      puzzleSolveTimestamps: {},
      penaltyMinutes: 0,
      score: 0,
      lastActive: Date.now(),
      lastIp: null,
      ipHistory: []
    };

    setTeams((prev) => {
      const updated = [newTeam, ...prev];
      localStorage.setItem('vq_teams_data', JSON.stringify(updated));
      localStorage.setItem('vq_prod_teams_v1', JSON.stringify(updated));
      cloudSync.publishTeams(updated);
      return updated;
    });

    const newEvent = {
      id: `act_${Date.now()}`,
      timestamp: Date.now(),
      teamId: newId,
      teamName: newTeam.name,
      puzzleId: 0,
      puzzleTitle: 'Team Authorized',
      clientIp: getCachedClientIp(),
      networkOrg: getCachedNetworkOrg(),
      type: 'SOLVE',
      message: `[ADMIN PROVISIONED]: New team "${newTeam.name}" (${newTeam.college}) authorized.`
    };
    setActivityLogs((prev) => [newEvent, ...prev.slice(0, 30)]);
    showToast(`Team "${newTeam.name}" successfully provisioned and synced across all devices!`);
    return newTeam;
  };

  // Admin Delete Team
  const handleAdminDeleteTeam = (teamId) => {
    const teamToDelete = teams.find((t) => t.id === teamId);
    if (!teamToDelete) return;
    sessionManager.releaseSession(teamId);
    setTeams((prev) => {
      const next = prev.filter((t) => t.id !== teamId);
      localStorage.setItem('vq_teams_data', JSON.stringify(next));
      localStorage.setItem('vq_prod_teams_v1', JSON.stringify(next));
      cloudSync.publishTeams(next);
      return next;
    });
    showToast(`Team "${teamToDelete.name}" removed and synced.`);
  };

  // Admin Clear All Teams
  const handleAdminClearAllTeams = () => {
    teams.forEach((t) => sessionManager.releaseSession(t.id));
    setTeams([]);
    localStorage.setItem('vq_teams_data', JSON.stringify([]));
    localStorage.setItem('vq_prod_teams_v1', JSON.stringify([]));
    cloudSync.publishTeams([]);
    showToast('All participating teams cleared and synced across devices.');
  };

  // Admin Load Sample Teams (for rehearsal/testing)
  const handleAdminLoadSampleTeams = () => {
    setTeams(SAMPLE_TEAMS);
    localStorage.setItem('vq_teams_data', JSON.stringify(SAMPLE_TEAMS));
    localStorage.setItem('vq_prod_teams_v1', JSON.stringify(SAMPLE_TEAMS));
    cloudSync.publishTeams(SAMPLE_TEAMS);
    showToast('Loaded and synced 10 sample testing teams.');
  };

  // Manual Cloud Sync trigger
  const handleManualSyncTeams = async () => {
    showToast('Syncing latest official teams from cloud relay...');
    const latest = await cloudSync.fetchLatestTeams();
    if (Array.isArray(latest)) {
      const clean = normalizeTeams(latest);
      setTeams(clean);
      localStorage.setItem('vq_teams_data', JSON.stringify(clean));
      localStorage.setItem('vq_prod_teams_v1', JSON.stringify(clean));
      showToast(`Roster synchronized! Loaded ${clean.length} team(s).`);
    } else {
      showToast('Roster is already synchronized with latest cloud broadcast.');
    }
  };

  // Admin Reset Session Lock
  const handleAdminResetSession = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    sessionManager.forceResetTeamSession(teamId);
    showToast(`Session lock reset for ${team?.name || 'team'}.`);
  };

  // Logout / Switch Team
  const handleLogout = () => {
    if (activeTeamId) {
      sessionManager.releaseSession(activeTeamId);
    }
    setActiveTeamId(null);
    showToast('Logged out of team profile.');
  };

  // Take Over Session on this tab (Displaces any conflicting tab/device)
  const handleTakeOverSession = () => {
    const targetTeam = displacedTeam || teams.find((t) => t.id === displacedSessionInfo?.teamId) || teams[0];
    if (targetTeam) {
      sessionManager.registerSession(targetTeam.id);
      setActiveTeamId(targetTeam.id);
      setIsCollisionModalOpen(false);
      setDisplacedSessionInfo(null);
      showToast(`Session claimed on this tab! Other tab/device has been locked.`);
    }
  };

  // Continue in Spectator Mode (dismisses collision modal)
  const handleSpectate = () => {
    setIsCollisionModalOpen(false);
    setDisplacedSessionInfo(null);
    showToast('Viewing contest in spectator mode. Sign in to submit.');
  };

  // Switch Team from Collision Modal
  const handleSwitchTeamFromModal = () => {
    setIsCollisionModalOpen(false);
    setDisplacedSessionInfo(null);
    setIsAuthModalOpen(true);
  };

  // Simulate External Concurrency Collision (For testing single-session lock)
  const handleSimulateExternalCollision = () => {
    const targetTeam = activeTeam || teams[0];
    if (!targetTeam) return;

    soundFx.playError();
    sessionManager.notifyTerminated({
      reason: 'CONCURRENT_LOGIN_DETECTED',
      teamId: targetTeam.id,
      bySessionId: `sess_remote_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      byTabId: `tab_external_${Math.random().toString(36).substring(2, 6)}`,
      byDevice: 'External Workstation (Firefox on Linux)',
      timestamp: Date.now()
    });
  };

  // Jump to next unsolved puzzle
  const handleJumpToCurrentPuzzle = () => {
    setCurrentTab('puzzles');
    const nextId = (currentTeamSolved.length + 1);
    setTimeout(() => {
      const el = document.getElementById(`stage-${nextId <= PUZZLES.length ? nextId : PUZZLES.length}`);
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

  // Live Competition Simulation Mode
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const competingTeams = teams.filter((t) => !t.isAdmin && t.id !== activeTeamId && t.solvedPuzzles.length < PUZZLES.length);
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

      const isAllSolved = updatedSolved.length === PUZZLES.length;
      const completedAllAt = isAllSolved ? (randomTeam.completedAllAt || now) : randomTeam.completedAllAt;

      const updated = {
        ...randomTeam,
        solvedPuzzles: updatedSolved,
        score: updatedScore,
        puzzleSolveTimestamps: updatedTimestamps,
        lastActive: now,
        ...(completedAllAt ? { completedAllAt } : {})
      };

      setTeams((prev) => prev.map((t) => (t.id === randomTeam.id ? updated : t)));
      const newEvent = {
        id: `act_${now}`,
        timestamp: now,
        teamId: randomTeam.id,
        teamName: randomTeam.name,
        puzzleId: puzzle.id,
        puzzleTitle: puzzle.title,
        type: isAllSolved ? 'FINISH_ALL' : 'SOLVE',
        message: isAllSolved
          ? `[QUALIFIED] Decrypted Stage 05 (${puzzle.title})! All 5 puzzles solved — Round 1: GENOME-X Unlocked! Score: ${updatedScore} pts`
          : `Decrypted Stage 0${puzzle.id} (${puzzle.title})! Score: ${updatedScore} pts`
      };

      setActivityLogs((prev) => [newEvent, ...prev.slice(0, 30)]);
      showToast(
        isAllSolved
          ? `[QUALIFIED] ${randomTeam.name} solved all 5 puzzles & unlocked Round 1: GENOME-X!`
          : `Live Update: ${randomTeam.name} solved Stage 0${puzzle.id}!`
      );
      soundFx.playZap();
    }, 14000);

    return () => clearInterval(interval);
  }, [isSimulating, teams, activeTeamId]);

  return (
    <div className="digital-canvas relative selection:bg-[#00F0FF] selection:text-black">
      {/* Background Interactive Electric Canvas */}
      <ElectricCanvas />

      {/* Custom Tactical HUD Cursor Reticle */}
      <CyberCursor />

      {/* Main App Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeTeam={activeTeam}
        onOpenAuthModal={() => {
          setAuthModalMode('team');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
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
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto pt-8 pb-16">
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
            activityLogs={activityLogs}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onBroadcast={showToast}
            onSimulateCollision={handleSimulateExternalCollision}
            onAdminAddTeam={handleAdminAddTeam}
            onAdminDeleteTeam={handleAdminDeleteTeam}
            onAdminClearAllTeams={handleAdminClearAllTeams}
            onAdminLoadSampleTeams={handleAdminLoadSampleTeams}
            onAdminResetSession={handleAdminResetSession}
            onSyncTeams={handleManualSyncTeams}
            onOpenAdminLogin={() => {
              setAuthModalMode('admin');
              setIsAuthModalOpen(true);
            }}
          />
        )}
        {currentTab === 'rules' && (
          <RulesView />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Single-Session Concurrency Collision Modal */}
      <SessionCollisionModal
        isOpen={isCollisionModalOpen}
        displacementInfo={displacedSessionInfo}
        team={displacedTeam}
        onTakeOver={handleTakeOverSession}
        onSpectate={handleSpectate}
        onSwitchTeam={handleSwitchTeamFromModal}
      />

      {/* Team Authentication / Admin Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        teams={teams}
        onLogin={handleLoginTeam}
        initialMode={authModalMode}
        onSyncTeams={handleManualSyncTeams}
      />

      {/* Floating Toast Notification - Upgraded to Glassmorphism */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl bg-[rgba(15,15,25,0.75)] backdrop-blur-xl border border-[rgba(0,240,255,0.25)] text-xs font-mono text-[#F8FAFC] shadow-[0_0_25px_rgba(0,240,255,0.3)] flex items-center gap-3 animate-bounce glow-hover">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;