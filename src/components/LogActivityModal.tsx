import React, { useState } from 'react';
import { X, Activity, Watch, Plus, Dumbbell, Flame, CheckCircle, Smartphone } from 'lucide-react';
import { ActivityLog } from '../types';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (log: Omit<ActivityLog, 'id'>) => void;
}

const ACTIVITY_TYPES: ActivityLog['type'][] = [
  'Strength',
  'Walking',
  'Running',
  'Cycling',
  'Yoga',
  'Mobility',
  'HIIT',
  'Sports',
  'Micro-Reset',
];

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  onAddActivity,
}) => {
  const [activeMode, setActiveMode] = useState<'manual' | 'sensor'>('manual');
  const [type, setType] = useState<ActivityLog['type']>('Strength');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [distanceKm, setDistanceKm] = useState<string>('');
  const [caloriesBurned, setCaloriesBurned] = useState<number>(180);
  const [rpe, setRpe] = useState<number>(6);
  const [exercisesSummary, setExercisesSummary] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const xp = Math.round(durationMinutes * 2.5 + rpe * 5);
    onAddActivity({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      durationMinutes,
      distanceKm: distanceKm ? parseFloat(distanceKm) : undefined,
      caloriesBurned,
      rpe,
      exercisesSummary: exercisesSummary || undefined,
      notes: notes || undefined,
      source: 'manual',
      xpEarned: xp,
    });
    onClose();
  };

  const handleSimulateSensorSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      // Auto populate wearable sensor data
      setType('Walking');
      setDurationMinutes(42);
      setDistanceKm('3.4');
      setCaloriesBurned(195);
      setRpe(4);
      setNotes('Synced from Apple Health / Wearable device. 4,820 steps recorded.');
      setTimeout(() => {
        const xp = Math.round(42 * 2.5 + 4 * 5);
        onAddActivity({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Walking',
          durationMinutes: 42,
          distanceKm: 3.4,
          caloriesBurned: 195,
          rpe: 4,
          notes: 'Synced from Apple Health / WearOS wearable feed (4,820 steps, avg HR 112 bpm).',
          source: 'sensor_sync',
          xpEarned: xp,
        });
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto" id="log-activity-modal">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Log Physical Activity</h2>
              <p className="text-xs text-slate-400">Manual entry or direct wearable sensor sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Mode Switcher */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeMode === 'manual'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Input</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('sensor')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeMode === 'sensor'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Watch className="w-3.5 h-3.5 text-emerald-600" />
            <span>Wearable / Sensor Sync</span>
          </button>
        </div>

        {activeMode === 'sensor' ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Watch className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sync Wearable Sensor Stream</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Reads active calories, step counts, duration, and heart rate from your connected health device.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Detected Sensor:</span>
                <span className="font-semibold text-slate-800">Apple HealthKit / WearOS API</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recent Unsynced Activity:</span>
                <span className="font-semibold text-emerald-600">42 min Outdoor Walk (4,820 steps)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Energy Burn:</span>
                <span className="font-semibold text-slate-800">195 kcal</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateSensorSync}
              disabled={isSyncing || syncSuccess}
              className="w-full py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {isSyncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Fetching Sensor Packets...</span>
                </>
              ) : syncSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Activity Synced Successfully!</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Sync Detected Device Session</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Activity Type Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Activity Type</label>
              <div className="flex flex-wrap gap-1.5">
                {ACTIVITY_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      type === t
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Distance */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Distance (km, optional)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 3.2"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Calories & RPE */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Calories Burned</label>
                <input
                  type="number"
                  min={0}
                  max={2500}
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perceived Exertion (RPE: {rpe}/10)
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={rpe}
                  onChange={(e) => setRpe(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-600"
                />
              </div>
            </div>

            {/* Exercises Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exercises & Sets (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Squats 4x12, Push-ups 3x10, Plank 3x40s"
                value={exercisesSummary}
                onChange={(e) => setExercisesSummary(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session Notes / Recovery Feeling</label>
              <input
                type="text"
                placeholder="e.g. felt strong and energetic, joints felt loose"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                Save Activity (+{Math.round(durationMinutes * 2.5 + rpe * 5)} XP)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
