import React, { useState, useEffect } from 'react';
import {
  Activity,
  Bot,
  Camera,
  Flame,
  Plus,
  Trophy,
  Sparkles,
  Coffee,
  CheckCircle2,
  Calendar,
  Clock,
  Dumbbell,
  ShieldCheck,
  TrendingUp,
  User,
  Zap,
  ArrowRight,
  RefreshCw,
  Award,
  ChevronRight,
  Users,
} from 'lucide-react';
import {
  UserProfile,
  ReadinessState,
  WorkoutPlan,
  ActivityLog,
  FitnessScoreData,
  Badge,
  Challenge,
  LeaderboardEntry,
  AIInsight,
  WorkoutSession,
} from './types';
import {
  DEFAULT_PROFILE,
  DEFAULT_READINESS,
  INITIAL_WORKOUT_PLAN,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BADGES,
  INITIAL_CHALLENGES,
  INITIAL_LEADERBOARD,
  DEFAULT_INSIGHTS,
  calculateFitnessScore,
} from './data/initialData';
import { FitnessCharts } from './components/FitnessCharts';
import { PoseCoachModal } from './components/PoseCoachModal';
import { AiCoachDrawer } from './components/AiCoachDrawer';
import { ProfileModal } from './components/ProfileModal';
import { LogActivityModal } from './components/LogActivityModal';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { ReadinessCard } from './components/ReadinessCard';
import { OrgDashboardView } from './components/OrgDashboardView';

export default function App() {
  // Navigation / View State
  const [currentTab, setCurrentTab] = useState<'individual' | 'organization'>('individual');

  // Core Persistent State with LocalStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitsync_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [readiness, setReadiness] = useState<ReadinessState>(() => {
    const saved = localStorage.getItem('fitsync_readiness');
    return saved ? JSON.parse(saved) : DEFAULT_READINESS;
  });

  const [plan, setPlan] = useState<WorkoutPlan>(() => {
    const saved = localStorage.getItem('fitsync_plan');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT_PLAN;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('fitsync_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('fitsync_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('fitsync_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [insights, setInsights] = useState<AIInsight[]>(DEFAULT_INSIGHTS);
  const [xp, setXp] = useState<number>(1740);
  const [streakDays, setStreakDays] = useState<number>(7);

  // Modals & Drawers
  const [isPoseModalOpen, setIsPoseModalOpen] = useState(false);
  const [selectedPoseExercise, setSelectedPoseExercise] = useState('squats');
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // 2-Minute Micro-Reset interactive state
  const [microResetActive, setMicroResetActive] = useState(false);
  const [microResetTimer, setMicroResetTimer] = useState(120);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('fitsync_profile', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('fitsync_readiness', JSON.stringify(readiness));
  }, [readiness]);
  useEffect(() => {
    localStorage.setItem('fitsync_plan', JSON.stringify(plan));
  }, [plan]);
  useEffect(() => {
    localStorage.setItem('fitsync_logs', JSON.stringify(logs));
  }, [logs]);
  useEffect(() => {
    localStorage.setItem('fitsync_badges', JSON.stringify(badges));
  }, [badges]);
  useEffect(() => {
    localStorage.setItem('fitsync_challenges', JSON.stringify(challenges));
  }, [challenges]);

  // Micro-reset timer effect
  useEffect(() => {
    let interval: any = null;
    if (microResetActive && microResetTimer > 0) {
      interval = setInterval(() => {
        setMicroResetTimer((t) => t - 1);
      }, 1000);
    } else if (microResetActive && microResetTimer === 0) {
      // Completed 2-min reset!
      setMicroResetActive(false);
      setMicroResetTimer(120);
      handleLogActivity({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Micro-Reset',
        durationMinutes: 2,
        caloriesBurned: 15,
        rpe: 2,
        notes: 'Completed 2-minute mindful movement & breathing reset.',
        source: 'manual',
        xpEarned: 50,
      });
      // Unlock Bad-Day Hero badge
      setBadges((prev) =>
        prev.map((b) => (b.id === 'b_badday_hero' ? { ...b, isUnlocked: true, progressPercent: 100 } : b))
      );
      alert('🌟 2-Minute Reset Completed! You protected your consistency streak (+50 XP).');
    }
    return () => clearInterval(interval);
  }, [microResetActive, microResetTimer]);

  // Dynamic Fitness Score
  const scoreData: FitnessScoreData = calculateFitnessScore(logs, plan, readiness);

  // Today's recommended session
  const todaySession = plan.sessions.find((s) => s.day.includes('Today') || !s.completed) || plan.sessions[0];

  // Actions
  const handleLogActivity = (newLog: Omit<ActivityLog, 'id'>) => {
    const fullLog: ActivityLog = {
      ...newLog,
      id: `act_${Date.now()}`,
    };
    setLogs((prev) => [fullLog, ...prev]);
    setXp((prev) => prev + fullLog.xpEarned);

    // Update streak if not logged today
    setStreakDays((prev) => prev + 1);

    // Update challenge progress
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.joined && c.targetType === 'workouts') {
          return { ...c, currentProgress: Math.min(c.targetValue, c.currentProgress + 1) };
        }
        if (c.joined && c.targetType === 'active_minutes') {
          return { ...c, currentProgress: Math.min(c.targetValue, c.currentProgress + fullLog.durationMinutes) };
        }
        return c;
      })
    );
  };

  const handleCompleteWorkout = (sessionId: string, durationMinutes: number, rpe: number) => {
    setPlan((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, completed: true, completedAt: new Date().toISOString() } : s
      ),
    }));

    handleLogActivity({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Strength',
      durationMinutes,
      caloriesBurned: Math.round(durationMinutes * 6.5),
      rpe,
      exercisesSummary: 'Completed planned full session',
      notes: `Rated RPE ${rpe}/10. Adaptive feedback processed.`,
      source: 'manual',
      xpEarned: 100,
    });

    // Adaptive adjustment: if RPE was high (>= 8) or readiness energy is low, adapt future workout
    if (rpe >= 8 || readiness.energy <= 2) {
      setPlan((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s, idx) => {
          if (!s.completed && idx === 3) {
            return {
              ...s,
              title: 'Adapted: Restorative Joint Mobility & Breath Flow',
              difficulty: 'Light',
              durationMinutes: 20,
              isAdapted: true,
              adaptationReason: 'Paced for recovery following your high-effort (RPE 8+) workout.',
            };
          }
          return s;
        }),
      }));
    }
  };

  const handleCompletePoseReps = (exerciseName: string, repCount: number, durationMinutes: number) => {
    const earnedXp = Math.max(30, repCount * 10);
    handleLogActivity({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Strength',
      durationMinutes,
      caloriesBurned: Math.round(repCount * 3.5),
      rpe: 5,
      exercisesSummary: `${exerciseName}: ${repCount} reps verified with MediaPipe Vision`,
      notes: 'Real-time computer vision joint tracking verified.',
      source: 'pose_coach',
      xpEarned: earnedXp,
    });

    // Update challenges for pose reps
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.joined && c.targetType === 'pose_reps') {
          return { ...c, currentProgress: Math.min(c.targetValue, c.currentProgress + repCount) };
        }
        return c;
      })
    );
  };

  const handleGenerateAiPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          readiness,
          previousWeekVolume: logs.reduce((sum, l) => sum + l.durationMinutes, 0),
        }),
      });
      const data = await response.json();
      if (data.sessions && data.sessions.length > 0) {
        setPlan({
          id: `plan_${Date.now()}`,
          planName: data.planName || 'Personalized Adaptive Routine',
          weeklyFocus: data.weeklyFocus || 'Sustainable Habit Formation',
          generatedAt: new Date().toISOString(),
          sessions: data.sessions.map((s: any, idx: number) => ({
            id: `sess_${Date.now()}_${idx}`,
            day: s.day || `Day ${idx + 1}`,
            title: s.title || 'Functional Movement Session',
            durationMinutes: s.durationMinutes || profile.availableWorkoutTime,
            difficulty: s.difficulty || 'Moderate',
            focus: s.focus || 'Full Body',
            completed: false,
            exercises: (s.exercises || []).map((e: any, eIdx: number) => ({
              id: `ex_${idx}_${eIdx}`,
              name: e.name,
              sets: e.sets || 3,
              reps: e.reps || '10-12 reps',
              restSeconds: e.restSeconds || 45,
              tips: e.tips || 'Move with control',
              poseSupported: e.name.toLowerCase().includes('squat') || e.name.toLowerCase().includes('push') || e.name.toLowerCase().includes('plank'),
            })),
          })),
        });
      }
    } catch (err) {
      console.error('Plan generation failed, fallback preserved', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleToggleBadDayMode = () => {
    const nextState = !readiness.isBadDayMode;
    setReadiness((prev) => ({ ...prev, isBadDayMode: nextState }));
    if (nextState) {
      setMicroResetActive(true);
      setMicroResetTimer(120);
    } else {
      setMicroResetActive(false);
    }
  };

  const handleExportData = () => {
    const exportPayload = {
      profile,
      readiness,
      workoutPlan: plan,
      activityLogs: logs,
      badges,
      challenges,
      score: scoreData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitSync-Personal-Data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    localStorage.clear();
    setProfile(DEFAULT_PROFILE);
    setReadiness(DEFAULT_READINESS);
    setPlan(INITIAL_WORKOUT_PLAN);
    setLogs(INITIAL_ACTIVITY_LOGS);
    setBadges(INITIAL_BADGES);
    setChallenges(INITIAL_CHALLENGES);
    setXp(1740);
    setStreakDays(7);
    alert('Your FitSync local storage has been reset.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  FitSync<span className="text-emerald-600">.ai</span>
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 uppercase tracking-wider">
                  Adaptive
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Intelligent habit-first fitness platform</p>
            </div>
          </div>

          {/* Center Tabs: Individual vs Organization / College */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setCurrentTab('individual')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                currentTab === 'individual'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Fitness Journey
            </button>
            <button
              onClick={() => setCurrentTab('organization')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                currentTab === 'organization'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Campus & Workplace League</span>
            </button>
          </div>

          {/* Right Action Header controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gamification Streak & XP Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200/80 text-xs font-semibold text-amber-900">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>{streakDays} Day Streak</span>
              <span className="text-amber-400">•</span>
              <span className="text-emerald-700 font-mono font-bold">{xp} XP</span>
            </div>

            {/* Pose Form Coach Button */}
            <button
              onClick={() => setIsPoseModalOpen(true)}
              className="px-3 py-2 text-xs font-bold text-slate-800 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl border border-slate-200 transition flex items-center gap-1.5 shadow-2xs"
              title="Open MediaPipe Computer Vision Exercise Form Coach"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Pose Coach</span>
            </button>

            {/* AI Coach Drawer Button */}
            <button
              onClick={() => setIsAiCoachOpen(true)}
              className="px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              title="Chat with FitSync AI Coach"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">AI Coach</span>
            </button>

            {/* Quick Log Button */}
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1 shadow-md shadow-emerald-600/20"
              title="Log activity or sync wearable"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Log Activity</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-100 hover:border-emerald-500 flex items-center justify-center text-slate-700 transition overflow-hidden"
              title="Settings & Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b border-slate-200 bg-white px-4 py-2 gap-2">
        <button
          onClick={() => setCurrentTab('individual')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
            currentTab === 'individual' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Personal Journey
        </button>
        <button
          onClick={() => setCurrentTab('organization')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
            currentTab === 'organization' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Campus & Org Portal
        </button>
      </div>

      {/* 2-Minute Micro-Reset Active Interactive Sticky Banner */}
      {microResetActive && (
        <div className="bg-amber-500 text-slate-950 px-4 py-3 border-b border-amber-600 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-xs animate-spin">
                {microResetTimer}s
              </div>
              <div className="text-xs">
                <span className="font-bold text-sm block">Bad-Day Mode: 2-Minute Gentle Movement Reset</span>
                <span>Inhale deeply, roll your shoulders, stretch your spine gently. Doing this small act protects your habit.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMicroResetTimer(0)}
                className="px-3 py-1 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
              >
                Complete Now (+50 XP)
              </button>
              <button
                onClick={() => setMicroResetActive(false)}
                className="px-2 py-1 text-xs text-slate-950 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {currentTab === 'organization' ? (
          <OrgDashboardView
            organizationName={profile.organizationName || 'Campus Community Wellness League'}
            challenges={challenges}
            onJoinChallenge={(id) => {
              setChallenges((prev) =>
                prev.map((c) => (c.id === id ? { ...c, joined: true, participantsCount: c.participantsCount + 1 } : c))
              );
            }}
          />
        ) : (
          <>
            {/* Top Row: Today's Plan Hero & Transparent Fitness Score Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Today's Plan Recommended Session (7 Cols) */}
              <div
                className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between border border-slate-800 shadow-xl"
                id="todays-plan-hero"
              >
                {/* Background decorative glow */}
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{todaySession.day} • Recommended Plan</span>
                    </div>

                    <button
                      onClick={handleGenerateAiPlan}
                      disabled={isGeneratingPlan}
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition"
                      title="Re-generate plan with Gemini AI"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPlan ? 'animate-spin text-emerald-400' : ''}`} />
                      <span>{isGeneratingPlan ? 'Calibrating...' : 'AI Re-Plan'}</span>
                    </button>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                    {todaySession.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                    Focus: <strong className="text-emerald-400">{todaySession.focus}</strong>. Adapted to your {profile.fitnessExperience} level, available equipment ({profile.availableEquipment.slice(0, 3).join(', ')}), and recent workload.
                  </p>

                  {/* Session Metrics Pill Row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs mb-8">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{todaySession.durationMinutes} Minutes</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-teal-400" />
                      <span>{todaySession.difficulty} Intensity</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                      {todaySession.exercises.length} Exercises Included
                    </span>
                  </div>
                </div>

                {/* Bottom Call-to-actions */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completing session awards +100 XP</span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setSelectedPoseExercise(todaySession.exercises[0]?.name || 'squats');
                        setIsPoseModalOpen(true);
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Check Form</span>
                    </button>

                    <button
                      onClick={() => setActiveSession(todaySession)}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <span>Start Workout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Transparent Explainable Fitness Score Card (5 Cols) */}
              <div
                className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between"
                id="fitness-score-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      FitSync Index
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{scoreData.change} from last week</span>
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight">
                      {scoreData.overallScore}
                    </span>
                    <span className="text-slate-400 font-semibold text-lg">/ 100</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {scoreData.explanation}
                  </p>

                  {/* Component Breakdown Progress Bars */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Consistency (Active Days)</span>
                        <span className="font-mono text-slate-900 font-bold">{scoreData.breakdown.consistency}/30</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${(scoreData.breakdown.consistency / 30) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Workout Completion</span>
                        <span className="font-mono text-slate-900 font-bold">{scoreData.breakdown.completion}/25</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full"
                          style={{ width: `${(scoreData.breakdown.completion / 25) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Weekly Movement Volume</span>
                        <span className="font-mono text-slate-900 font-bold">{scoreData.breakdown.weeklyVolume}/20</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${(scoreData.breakdown.weeklyVolume / 20) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Readiness & Sleep Rest</span>
                        <span className="font-mono text-slate-900 font-bold">{scoreData.breakdown.readiness}/15</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${(scoreData.breakdown.readiness / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Transparent & Non-medical metric</span>
                  <button
                    onClick={() => setIsAiCoachOpen(true)}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    Ask Coach Why →
                  </button>
                </div>
              </div>
            </div>

            {/* Adaptive Readiness Check-In Card */}
            <ReadinessCard
              readiness={readiness}
              onUpdateReadiness={(updated) => setReadiness(updated)}
              onToggleBadDayMode={handleToggleBadDayMode}
            />

            {/* AI Insights & Actionable Recommendations */}
            <div className="space-y-3" id="ai-insights-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">AI Contextual Insights</h3>
                </div>
                <span className="text-xs text-slate-500">Based on recent load & habit patterns</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider mb-2 inline-block">
                        {item.tag}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{item.headline}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-emerald-800 mb-1">Recommended Action:</div>
                      <p className="text-xs text-slate-700 font-medium">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Visualizations (Chart.js) */}
            <FitnessCharts logs={logs} scoreData={scoreData} />

            {/* Activity History & Gamification Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Activity History Table (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Recent Completed Activities</h3>
                    <p className="text-xs text-slate-500">Manual sessions and wearable sensor sync logs</p>
                  </div>
                  <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition flex items-center gap-1 border border-emerald-200/60"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Log</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {logs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs font-bold text-xs">
                          {log.type.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{log.type}</h4>
                            <span className="text-[10px] text-slate-500">
                              {log.date} {log.time && `• ${log.time}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {log.durationMinutes} mins {log.distanceKm ? `• ${log.distanceKm} km` : ''} • {log.caloriesBurned} kcal • RPE {log.rpe}/10
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-emerald-600">+{log.xpEarned} XP</span>
                        <div className="text-[10px] text-slate-400 capitalize">{log.source.replace('_', ' ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges, Challenges & Leaderboard (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Badges Shelf */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Consistency Badges</h3>
                    <span className="text-xs text-slate-500">
                      {badges.filter((b) => b.isUnlocked).length} / {badges.length} Unlocked
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-2xl border text-center transition ${
                          badge.isUnlocked
                            ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                            : 'bg-slate-50 border-slate-200/60 opacity-60 text-slate-400'
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center mb-1.5 ${
                          badge.isUnlocked ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold truncate">{badge.title}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {badge.isUnlocked ? 'Unlocked ✓' : `${badge.progressPercent}%`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900">Active Challenges</h3>
                    <span className="text-xs text-emerald-600 font-semibold">Earn Extra XP</span>
                  </div>

                  <div className="space-y-3">
                    {challenges.slice(0, 2).map((ch) => (
                      <div key={ch.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span className="font-bold text-slate-900">{ch.title}</span>
                          <span className="font-mono text-emerald-600 font-bold">+{ch.xpReward} XP</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden my-2">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (ch.currentProgress / ch.targetValue) * 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>{ch.currentProgress} / {ch.targetValue} completed</span>
                          <span>Deadline: {ch.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy-Aware Leaderboard */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900">Community Leaderboard</h3>
                    <span className="text-xs text-slate-500">Opt-in & Privacy Safe</span>
                  </div>

                  <div className="space-y-2">
                    {leaderboard.slice(0, 4).map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition ${
                          entry.isCurrentUser
                            ? 'bg-emerald-50 border border-emerald-200 font-semibold text-emerald-950'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 font-mono font-bold text-slate-400">#{entry.rank}</span>
                          <img
                            src={entry.avatar}
                            alt={entry.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold">{entry.name}</div>
                            <div className="text-[10px] text-slate-500">{entry.streakDays}d streak</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-emerald-700">{entry.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200/80 bg-white py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>FitSync AI:</strong> Focused on sustainable consistency, habit retention, and health improvement. Not a medical or diagnostic service.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsProfileModalOpen(true)} className="hover:text-slate-700">
              Privacy Settings
            </button>
            <span>•</span>
            <button onClick={handleExportData} className="hover:text-slate-700">
              Export Data
            </button>
            <span>•</span>
            <button onClick={() => setIsAiCoachOpen(true)} className="hover:text-slate-700">
              AI Coach
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals & Drawers */}
      <PoseCoachModal
        isOpen={isPoseModalOpen}
        onClose={() => setIsPoseModalOpen(false)}
        onCompleteReps={handleCompletePoseReps}
        initialExercise={selectedPoseExercise}
      />

      <AiCoachDrawer
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        userProfile={profile}
        readiness={readiness}
        recentActivities={logs}
        onActivateBadDayMode={handleToggleBadDayMode}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => {
          setProfile(updated);
          handleGenerateAiPlan();
        }}
        onExportData={handleExportData}
        onResetData={handleResetData}
      />

      <LogActivityModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onAddActivity={handleLogActivity}
      />

      <WorkoutDetailModal
        isOpen={activeSession !== null}
        onClose={() => setActiveSession(null)}
        session={activeSession}
        onCompleteSession={handleCompleteWorkout}
        onLaunchPoseCoach={(exName) => {
          setActiveSession(null);
          setSelectedPoseExercise(exName);
          setIsPoseModalOpen(true);
        }}
        onAdaptToBadDay={handleToggleBadDayMode}
      />
    </div>
  );
}
