export type FitnessGoal =
  | 'Improve general fitness'
  | 'Build strength'
  | 'Improve endurance'
  | 'Increase mobility'
  | 'Improve flexibility'
  | 'Improve consistency'
  | 'Increase daily activity'
  | 'Improve sports performance'
  | 'Maintain an active lifestyle';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  heightCm: number;
  weightKg?: number;
  fitnessExperience: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyActivityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
  availableWorkoutTime: number; // in minutes: 15, 20, 30, 45, 60
  preferredWorkoutDays: string[];
  availableEquipment: string[];
  preferredWorkoutTypes: string[];
  mobilityLimitations: string;
  exercisePreferences: string;
  goals: FitnessGoal[];
  userType: 'individual' | 'college_student' | 'employee';
  organizationName?: string;
  privacySettings: {
    anonymousOnLeaderboard: boolean;
    shareOrgAggregates: boolean;
    localPoseProcessing: boolean;
    allowAiPersonalization: boolean;
  };
  onboardingCompleted: boolean;
}

export interface ReadinessState {
  energy: number; // 1-5
  sleepHours: number;
  sleepQuality: number; // 1-5
  soreness: 'None' | 'Mild' | 'Moderate' | 'High';
  stressLevel: 'Low' | 'Moderate' | 'High';
  isBadDayMode: boolean; // 2-min micro-reset activated
  lastUpdated: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tips: string;
  poseSupported?: boolean;
}

export interface WorkoutSession {
  id: string;
  day: string;
  title: string;
  durationMinutes: number;
  difficulty: 'Light' | 'Moderate' | 'Challenging';
  focus: string;
  exercises: ExerciseItem[];
  completed: boolean;
  completedAt?: string;
  isAdapted?: boolean;
  adaptationReason?: string;
}

export interface WorkoutPlan {
  id: string;
  planName: string;
  weeklyFocus: string;
  generatedAt: string;
  sessions: WorkoutSession[];
}

export interface ActivityLog {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'Strength' | 'Running' | 'Walking' | 'Cycling' | 'Yoga' | 'HIIT' | 'Sports' | 'Micro-Reset' | 'Mobility';
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  rpe: number; // Rate of Perceived Exertion (1-10)
  exercisesSummary?: string;
  notes?: string;
  source: 'manual' | 'sensor_sync' | 'pose_coach';
  xpEarned: number;
}

export interface FitnessScoreData {
  overallScore: number; // 0-100
  previousScore: number;
  change: number;
  breakdown: {
    consistency: number; // max 30
    completion: number; // max 25
    weeklyVolume: number; // max 20
    readiness: number; // max 15
    challenges: number; // max 10
  };
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'milestone' | 'consistency' | 'form' | 'challenge';
  isUnlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'individual' | 'campus' | 'workplace';
  targetType: 'workouts' | 'active_minutes' | 'pose_reps' | 'streak';
  targetValue: number;
  currentProgress: number;
  deadline: string;
  xpReward: number;
  joined: boolean;
  participantsCount: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  workoutsCompleted: number;
  streakDays: number;
  organization: string;
  isCurrentUser?: boolean;
}

export interface AIInsight {
  type: 'consistency' | 'recovery' | 'load' | 'milestone';
  headline: string;
  description: string;
  action: string;
  tag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface PoseFeedback {
  exercise: 'squats' | 'pushups' | 'lunges' | 'plank' | 'jumping_jacks';
  repCount: number;
  stage: 'up' | 'down' | 'hold' | 'ready';
  currentAngle: number;
  formStatus: 'good' | 'warning' | 'needs_adjustment' | 'analyzing';
  feedback: string;
  confidence: number;
}
