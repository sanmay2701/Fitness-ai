import { UserProfile, ReadinessState, WorkoutPlan, ActivityLog, FitnessScoreData, Badge, Challenge, LeaderboardEntry, AIInsight } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user_fitsync_01',
  name: 'Alex Rivera',
  age: 26,
  gender: 'Prefer not to say',
  heightCm: 175,
  weightKg: 70,
  fitnessExperience: 'Intermediate',
  dailyActivityLevel: 'Moderately Active',
  availableWorkoutTime: 30,
  preferredWorkoutDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
  availableEquipment: ['Bodyweight', 'Dumbbells', 'Resistance Bands'],
  preferredWorkoutTypes: ['Strength', 'HIIT', 'Yoga & Mobility'],
  mobilityLimitations: 'Occasional lower back tightness after sitting',
  exercisePreferences: 'Compound bodyweight movements, dumbbell work, mobility flows',
  goals: ['Improve general fitness', 'Build strength', 'Improve consistency'],
  userType: 'college_student',
  organizationName: 'State Tech University & Health Campus',
  privacySettings: {
    anonymousOnLeaderboard: false,
    shareOrgAggregates: true,
    localPoseProcessing: true,
    allowAiPersonalization: true,
  },
  onboardingCompleted: true,
};

export const DEFAULT_READINESS: ReadinessState = {
  energy: 4,
  sleepHours: 7.5,
  sleepQuality: 4,
  soreness: 'Mild',
  stressLevel: 'Low',
  isBadDayMode: false,
  lastUpdated: new Date().toISOString(),
};

export const INITIAL_WORKOUT_PLAN: WorkoutPlan = {
  id: 'plan_week_1',
  planName: 'Adaptive Strength & Mobility Cycle',
  weeklyFocus: 'Progressive Overload with Active Movement Integrity',
  generatedAt: new Date().toISOString(),
  sessions: [
    {
      id: 'sess_1',
      day: 'Monday',
      title: 'Full Body Core & Lower Chain',
      durationMinutes: 30,
      difficulty: 'Moderate',
      focus: 'Squats, Core & Hip Mobility',
      completed: true,
      completedAt: '2026-09-15T18:30:00Z',
      exercises: [
        { id: 'e1', name: 'Bodyweight Squats', sets: 4, reps: '12 reps', restSeconds: 45, tips: 'Chest up, press knees outward gently', poseSupported: true },
        { id: 'e2', name: 'Reverse Lunges', sets: 3, reps: '10 per leg', restSeconds: 45, tips: 'Front knee directly over ankle', poseSupported: true },
        { id: 'e3', name: 'Push-ups (Standard/Incline)', sets: 3, reps: '8-12 reps', restSeconds: 60, tips: 'Keep elbows tucked at 45 degrees', poseSupported: true },
        { id: 'e4', name: 'Forearm Plank', sets: 3, reps: '35 sec hold', restSeconds: 45, tips: 'Neutral spine, brace glutes', poseSupported: true },
      ],
    },
    {
      id: 'sess_2',
      day: 'Wednesday',
      title: 'Upper Torso & Dynamic Posture',
      durationMinutes: 25,
      difficulty: 'Moderate',
      focus: 'Upper Body & Stability',
      completed: true,
      completedAt: '2026-09-17T17:45:00Z',
      exercises: [
        { id: 'e5', name: 'Dumbbell Floor Press / Push-ups', sets: 3, reps: '10 reps', restSeconds: 60, tips: 'Controlled descent', poseSupported: true },
        { id: 'e6', name: 'Dumbbell Rows / Band Pull-aparts', sets: 3, reps: '12 reps', restSeconds: 45, tips: 'Retract scapulae before pulling', poseSupported: false },
        { id: 'e7', name: 'Plank Shoulder Taps', sets: 3, reps: '16 total taps', restSeconds: 45, tips: 'Prevent hips from rocking', poseSupported: true },
        { id: 'e8', name: 'Cat-Cow Flow & Torso Twists', sets: 2, reps: '60 seconds', restSeconds: 30, tips: 'Inhale on cow, exhale on cat', poseSupported: false },
      ],
    },
    {
      id: 'sess_3',
      day: 'Today (Friday)',
      title: 'Full Body Functional & Conditioning',
      durationMinutes: 30,
      difficulty: 'Moderate',
      focus: 'Endurance & Form Accuracy',
      completed: false,
      exercises: [
        { id: 'e9', name: 'Goblet / Bodyweight Squats', sets: 3, reps: '15 reps', restSeconds: 45, tips: 'Use camera form feedback for depth', poseSupported: true },
        { id: 'e10', name: 'Push-up to Downward Dog', sets: 3, reps: '8 reps', restSeconds: 45, tips: 'Stretch posterior chain at the top', poseSupported: true },
        { id: 'e11', name: 'Jumping Jacks / Step Jacks', sets: 3, reps: '45 seconds', restSeconds: 30, tips: 'Light on feet, rhythmic arm arc', poseSupported: true },
        { id: 'e12', name: 'Side Plank Holds', sets: 2, reps: '30 sec / side', restSeconds: 45, tips: 'Direct elbow under shoulder', poseSupported: true },
      ],
    },
    {
      id: 'sess_4',
      day: 'Saturday',
      title: 'Aerobic Base & Mobility Flow',
      durationMinutes: 25,
      difficulty: 'Light',
      focus: 'Cardio & Joint Decompression',
      completed: false,
      exercises: [
        { id: 'e13', name: 'Brisk Outdoor / Treadmill Walk', sets: 1, reps: '20 mins', restSeconds: 0, tips: 'Maintain steady nasal breathing', poseSupported: false },
        { id: 'e14', name: 'World\'s Greatest Stretch', sets: 2, reps: '6 per side', restSeconds: 30, tips: 'Elbow to inside ankle', poseSupported: false },
        { id: 'e15', name: 'Supine Hamstring & Glute Stretch', sets: 2, reps: '45 sec / side', restSeconds: 30, tips: 'Relax neck and shoulders', poseSupported: false },
      ],
    },
  ],
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    date: '2026-09-13',
    time: '08:30',
    type: 'Walking',
    durationMinutes: 35,
    distanceKm: 2.8,
    caloriesBurned: 140,
    rpe: 4,
    notes: 'Morning campus walk to class, fresh air.',
    source: 'sensor_sync',
    xpEarned: 60,
  },
  {
    id: 'act_2',
    date: '2026-09-14',
    time: '18:00',
    type: 'Strength',
    durationMinutes: 30,
    caloriesBurned: 185,
    rpe: 6,
    exercisesSummary: 'Squats (4x12), Pushups (3x10), Plank (3x35s)',
    notes: 'Strong session, felt focused.',
    source: 'pose_coach',
    xpEarned: 95,
  },
  {
    id: 'act_3',
    date: '2026-09-16',
    time: '19:15',
    type: 'Yoga',
    durationMinutes: 20,
    caloriesBurned: 85,
    rpe: 3,
    notes: 'Evening hip mobility and breathing relaxation.',
    source: 'manual',
    xpEarned: 50,
  },
  {
    id: 'act_4',
    date: '2026-09-17',
    time: '17:45',
    type: 'Strength',
    durationMinutes: 28,
    caloriesBurned: 170,
    rpe: 7,
    exercisesSummary: 'Dumbbell Press (3x10), Rows (3x12), Shoulder Taps (3x16)',
    notes: 'Good upper body pump. Shoulder felt stable.',
    source: 'manual',
    xpEarned: 90,
  },
  {
    id: 'act_5',
    date: '2026-09-18',
    time: '12:30',
    type: 'Walking',
    durationMinutes: 25,
    distanceKm: 2.1,
    caloriesBurned: 110,
    rpe: 3,
    notes: 'Lunch break step recharge.',
    source: 'sensor_sync',
    xpEarned: 45,
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b_first_workout',
    title: 'First Step',
    description: 'Completed your very first FitSync workout session.',
    iconName: 'Sparkles',
    category: 'milestone',
    isUnlocked: true,
    unlockedAt: '2026-09-13',
    progressPercent: 100,
  },
  {
    id: 'b_streak_7',
    title: '7-Day Streak',
    description: 'Maintained active movement 7 days in a row.',
    iconName: 'Flame',
    category: 'consistency',
    isUnlocked: true,
    unlockedAt: '2026-09-18',
    progressPercent: 100,
  },
  {
    id: 'b_ten_workouts',
    title: 'Tenacious 10',
    description: 'Completed 10 total structured workouts.',
    iconName: 'Trophy',
    category: 'milestone',
    isUnlocked: false,
    progressPercent: 60,
  },
  {
    id: 'b_pose_master',
    title: 'Form Master',
    description: 'Performed 25 camera-verified reps with green form precision.',
    iconName: 'Camera',
    category: 'form',
    isUnlocked: true,
    unlockedAt: '2026-09-14',
    progressPercent: 100,
  },
  {
    id: 'b_badday_hero',
    title: 'Bad-Day Hero',
    description: 'Kept the momentum alive using the 2-min micro-reset when low on energy.',
    iconName: 'ShieldCheck',
    category: 'consistency',
    isUnlocked: true,
    unlockedAt: '2026-09-16',
    progressPercent: 100,
  },
  {
    id: 'b_campus_warrior',
    title: 'Campus Champion',
    description: 'Contributed 3+ activity logs to your university or workplace challenge.',
    iconName: 'Users',
    category: 'challenge',
    isUnlocked: true,
    unlockedAt: '2026-09-17',
    progressPercent: 100,
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch_1',
    title: '30-Day Consistency Kickoff',
    description: 'Complete at least 3 movement sessions per week for 4 consecutive weeks.',
    category: 'individual',
    targetType: 'workouts',
    targetValue: 12,
    currentProgress: 6,
    deadline: 'October 10, 2026',
    xpReward: 300,
    joined: true,
    participantsCount: 1420,
  },
  {
    id: 'ch_2',
    title: 'University Campus Step Wave',
    description: 'Achieve 50,000 active steps this week alongside fellow college peers.',
    category: 'campus',
    targetType: 'active_minutes',
    targetValue: 180,
    currentProgress: 138,
    deadline: 'Sunday, 11:59 PM',
    xpReward: 250,
    joined: true,
    participantsCount: 488,
  },
  {
    id: 'ch_3',
    title: '100 AI Pose Reps Challenge',
    description: 'Complete 100 verified reps using the MediaPipe Pose Form Coach.',
    category: 'individual',
    targetType: 'pose_reps',
    targetValue: 100,
    currentProgress: 42,
    deadline: 'September 30, 2026',
    xpReward: 200,
    joined: true,
    participantsCount: 812,
  },
  {
    id: 'ch_4',
    title: 'Workplace Ergonomic & Stretch Hour',
    description: 'Log 5 five-minute postural resets during busy study or work hours.',
    category: 'workplace',
    targetType: 'workouts',
    targetValue: 5,
    currentProgress: 3,
    deadline: 'Friday, 5:00 PM',
    xpReward: 150,
    joined: false,
    participantsCount: 310,
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb_1', rank: 1, name: 'Maya Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', xp: 2150, workoutsCompleted: 14, streakDays: 16, organization: 'Bioengineering Faculty' },
  { id: 'lb_2', rank: 2, name: 'David Kalu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', xp: 1980, workoutsCompleted: 13, streakDays: 14, organization: 'Campus Crossfit Club' },
  { id: 'lb_3', rank: 3, name: 'Alex Rivera (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', xp: 1740, workoutsCompleted: 11, streakDays: 7, organization: 'State Tech University', isCurrentUser: true },
  { id: 'lb_4', rank: 4, name: 'Sara Lindqvist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', xp: 1620, workoutsCompleted: 10, streakDays: 9, organization: 'Staff Wellness League' },
  { id: 'lb_5', rank: 5, name: 'Liam O’Connor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', xp: 1490, workoutsCompleted: 9, streakDays: 6, organization: 'Computer Science Dept' },
  { id: 'lb_6', rank: 6, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', xp: 1350, workoutsCompleted: 8, streakDays: 5, organization: 'Graduate Student Assoc.' },
];

export const DEFAULT_INSIGHTS: AIInsight[] = [
  {
    type: 'consistency',
    headline: 'Consistency Champion: 4 Sessions Logged',
    description: 'You have maintained active movement across 4 of the last 6 days. Your regular workout rhythm is yielding strong adherence.',
    action: 'Lock in tomorrow’s 30-min session early in the day to finish the weekly cycle strong.',
    tag: 'Habit Formation',
  },
  {
    type: 'load',
    headline: 'Balanced Load & Recovery',
    description: 'Your recent workouts averaged an RPE of 5.8 with moderate volume. Your body is adapting smoothly without signs of central fatigue.',
    action: 'Consider adding 2 reps or a 5-second hold to bodyweight movements today.',
    tag: 'Progressive Overload',
  },
  {
    type: 'recovery',
    headline: 'Postural Reset Recommended',
    description: 'You noted lower back tightness during prolonged sitting. Thoracic extension and hip mobility will decompress spinal discs.',
    action: 'Spend 3 minutes on Cat-Cow and Couch Stretch before bed.',
    tag: 'Injury Prevention',
  },
];

/**
 * Calculates a fully transparent, explainable Fitness Score (0-100)
 */
export function calculateFitnessScore(
  logs: ActivityLog[],
  plan: WorkoutPlan,
  readiness: ReadinessState
): FitnessScoreData {
  const completedPlanned = plan.sessions.filter(s => s.completed).length;
  const totalPlanned = plan.sessions.length || 1;

  // 1. Consistency component (max 30 pts)
  // Check active days in the last 7 days
  const uniqueDays = new Set(logs.map(l => l.date)).size;
  const consistencyScore = Math.min(30, Math.round((uniqueDays / 5) * 30));

  // 2. Completion component (max 25 pts)
  const completionRatio = completedPlanned / totalPlanned;
  const completionScore = Math.min(25, Math.round(completionRatio * 25));

  // 3. Weekly Activity Volume (max 20 pts)
  const totalDuration = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
  // WHO guideline: 150 min/week moderate activity
  const volumeScore = Math.min(20, Math.round((totalDuration / 120) * 20));

  // 4. Recovery & Readiness (max 15 pts)
  let recoveryScore = 10;
  if (readiness.energy >= 4) recoveryScore += 3;
  else if (readiness.energy <= 2) recoveryScore -= 2;
  if (readiness.sleepHours >= 7) recoveryScore += 2;
  recoveryScore = Math.max(0, Math.min(15, recoveryScore));

  // 5. Challenge & Habit Momentum (max 10 pts)
  const habitsScore = logs.some(l => l.source === 'pose_coach') ? 10 : 8;

  const total = Math.min(100, Math.max(10, consistencyScore + completionScore + volumeScore + recoveryScore + habitsScore));
  const previous = Math.max(20, total - 4); // +4 change
  const change = total - previous;

  let explanation = `Your Fitness Score reflects ${uniqueDays} active days logged this week (${consistencyScore}/30 consistency), completing ${completedPlanned} of ${totalPlanned} planned workout sessions (${completionScore}/25 completion), and consistent rest/readiness management.`;

  return {
    overallScore: total,
    previousScore: previous,
    change: change,
    breakdown: {
      consistency: consistencyScore,
      completion: completionScore,
      weeklyVolume: volumeScore,
      readiness: recoveryScore,
      challenges: habitsScore,
    },
    explanation,
  };
}
