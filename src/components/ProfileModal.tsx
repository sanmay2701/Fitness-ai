import React, { useState } from 'react';
import { X, User, Target, Shield, Check, Dumbbell, Clock, Calendar, Download, Trash2 } from 'lucide-react';
import { UserProfile, FitnessGoal } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onExportData: () => void;
  onResetData: () => void;
}

const ALL_GOALS: FitnessGoal[] = [
  'Improve general fitness',
  'Build strength',
  'Improve endurance',
  'Increase mobility',
  'Improve flexibility',
  'Improve consistency',
  'Increase daily activity',
  'Improve sports performance',
  'Maintain an active lifestyle',
];

const EQUIPMENT_OPTIONS = [
  'Bodyweight',
  'Dumbbells',
  'Resistance Bands',
  'Kettlebell',
  'Barbell & Plates',
  'Pull-up Bar',
  'Full Gym Access',
];

const WORKOUT_TYPES = [
  'Strength',
  'HIIT',
  'Yoga & Mobility',
  'Running / Cardio',
  'Pilates',
  'Sports',
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onExportData,
  onResetData,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'profile' | 'goals' | 'equipment' | 'privacy'>('profile');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const toggleGoal = (goal: FitnessGoal) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      const updated = exists ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal];
      return { ...prev, goals: updated.length > 0 ? updated : [goal] };
    });
  };

  const toggleEquipment = (eq: string) => {
    setFormData((prev) => {
      const exists = prev.availableEquipment.includes(eq);
      const updated = exists ? prev.availableEquipment.filter((e) => e !== eq) : [...prev.availableEquipment, eq];
      return { ...prev, availableEquipment: updated.length > 0 ? updated : [eq] };
    });
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.preferredWorkoutDays.includes(day);
      const updated = exists ? prev.preferredWorkoutDays.filter((d) => d !== day) : [...prev.preferredWorkoutDays, day];
      return { ...prev, preferredWorkoutDays: updated.length > 0 ? updated : [day] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto" id="profile-modal">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Fitness Profile & Settings</h2>
              <p className="text-xs text-slate-400">Personalize your adaptive plan, equipment, and privacy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-50 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Basic & Schedule
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
              activeTab === 'goals'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Goals & Context
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
              activeTab === 'equipment'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Equipment & Days
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition border-b-2 ${
              activeTab === 'privacy'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Privacy & Data
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    min={14}
                    max={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (optional, kg)</label>
                  <input
                    type="number"
                    value={formData.weightKg || ''}
                    placeholder="e.g. 70"
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) || undefined })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fitness Experience</label>
                  <select
                    value={formData.fitnessExperience}
                    onChange={(e) => setFormData({ ...formData, fitnessExperience: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="Beginner">Beginner (Getting started)</option>
                    <option value="Intermediate">Intermediate (1-3 years steady)</option>
                    <option value="Advanced">Advanced (Consistent athletic base)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Workout Time</label>
                  <select
                    value={formData.availableWorkoutTime}
                    onChange={(e) => setFormData({ ...formData, availableWorkoutTime: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value={15}>15 minutes (Quick recharge)</option>
                    <option value={20}>20 minutes (Focused circuit)</option>
                    <option value={30}>30 minutes (Optimal standard)</option>
                    <option value={45}>45 minutes (Comprehensive)</option>
                    <option value={60}>60 minutes (Extended athlete)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Community / Affiliation</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'individual', label: 'Individual' },
                    { id: 'college_student', label: 'College Student' },
                    { id: 'employee', label: 'Workplace Team' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFormData({ ...formData, userType: item.id as any })}
                      className={`py-2 px-3 text-xs font-medium rounded-xl border transition ${
                        formData.userType === item.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {formData.userType !== 'individual' && (
                  <input
                    type="text"
                    value={formData.organizationName || ''}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="Enter College or Organization name..."
                    className="mt-2 w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Your Fitness Goals (Choose 1 or more)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_GOALS.map((g) => {
                    const isSelected = formData.goals.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => toggleGoal(g)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-medium transition ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{g}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobility Limitations or Sensitivities (Optional)
                </label>
                <textarea
                  value={formData.mobilityLimitations}
                  onChange={(e) => setFormData({ ...formData, mobilityLimitations: e.target.value })}
                  placeholder="e.g. tight lower back after long desk sessions, sensitive left knee, shoulder stiffness..."
                  rows={2}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
                <p className="text-[11px] text-slate-400 mt-1">FitSync adapts exercise selections to protect joint comfort.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exercise Preferences & Habits
                </label>
                <input
                  type="text"
                  value={formData.exercisePreferences}
                  onChange={(e) => setFormData({ ...formData, exercisePreferences: e.target.value })}
                  placeholder="e.g. loves bodyweight flows, brisk morning walks, kettlebell swings..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Available Equipment</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EQUIPMENT_OPTIONS.map((eq) => {
                    const isSelected = formData.availableEquipment.includes(eq);
                    return (
                      <button
                        type="button"
                        key={eq}
                        onClick={() => toggleEquipment(eq)}
                        className={`p-2.5 rounded-xl border text-xs text-center font-medium transition ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Preferred Workout Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = formData.preferredWorkoutDays.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => toggleDay(d)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {d.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Anonymous Leaderboard Display</div>
                    <div className="text-[11px] text-slate-500">Hide your real name on public leaderboards</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.privacySettings.anonymousOnLeaderboard}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacySettings: { ...formData.privacySettings, anonymousOnLeaderboard: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Share Aggregated Campus / Org Metrics</div>
                    <div className="text-[11px] text-slate-500">Only shares anonymized activity counts with your group</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.privacySettings.shareOrgAggregates}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacySettings: { ...formData.privacySettings, shareOrgAggregates: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Local-Only Pose Processing</div>
                    <div className="text-[11px] text-slate-500">Camera frames remain exclusively in your browser memory</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.privacySettings.localPoseProcessing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacySettings: { ...formData.privacySettings, localPoseProcessing: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 border-slate-300"
                  />
                </div>
              </div>

              {/* Data Export & Deletion */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onExportData}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export FitSync Data (JSON)</span>
                </button>

                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center justify-center gap-2 transition border border-rose-200/60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear / Reset My Data</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetData();
                        setShowResetConfirm(false);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md shadow-emerald-600/20"
            >
              Save Profile & Update Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
