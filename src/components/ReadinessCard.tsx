import React, { useState } from 'react';
import { BatteryCharging, Moon, AlertCircle, Sparkles, Coffee, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { ReadinessState } from '../types';

interface ReadinessCardProps {
  readiness: ReadinessState;
  onUpdateReadiness: (updated: ReadinessState) => void;
  onToggleBadDayMode: () => void;
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({
  readiness,
  onUpdateReadiness,
  onToggleBadDayMode,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempState, setTempState] = useState<ReadinessState>({ ...readiness });

  const handleSave = () => {
    onUpdateReadiness({
      ...tempState,
      lastUpdated: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden" id="readiness-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Adaptive Readiness Engine</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              Live Loop
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            FitSync continuously modulates volume and intensity to prevent burnout and sustain habits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleBadDayMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              readiness.isBadDayMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            <span>{readiness.isBadDayMode ? '2-Min Reset Active' : 'Low Motivation Mode'}</span>
          </button>

          <button
            onClick={() => {
              setTempState({ ...readiness });
              setIsEditing(!isEditing);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {isEditing ? 'Cancel' : 'Update Check-in'}
          </button>
        </div>
      </div>

      {readiness.isBadDayMode && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start gap-3">
          <Coffee className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div className="text-xs">
            <strong className="font-bold text-sm block mb-0.5">Bad-Day Mode Engaged (No Shame, No Pressure)</strong>
            <span>
              Your full session has been temporarily scaled to a gentle <strong>2-minute breathing and joint movement reset</strong>. Doing this small action protects your behavioral streak and neural habit loop!
            </span>
          </div>
        </div>
      )}

      {isEditing ? (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Current Energy Level ({tempState.energy}/5)
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={tempState.energy}
                onChange={(e) => setTempState({ ...tempState, energy: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 - Exhausted</span>
                <span>3 - Normal</span>
                <span>5 - Energized</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Sleep Duration ({tempState.sleepHours} hrs)
              </label>
              <input
                type="number"
                step="0.5"
                min={3}
                max={14}
                value={tempState.sleepHours}
                onChange={(e) => setTempState({ ...tempState, sleepHours: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Muscle Soreness</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['None', 'Mild', 'Moderate', 'High'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTempState({ ...tempState, soreness: s })}
                    className={`py-1.5 rounded-lg font-medium border text-center transition ${
                      tempState.soreness === s
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mental Stress Level</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Low', 'Moderate', 'High'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTempState({ ...tempState, stressLevel: st })}
                    className={`py-1.5 rounded-lg font-medium border text-center transition ${
                      tempState.stressLevel === st
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs"
            >
              Save Readiness Check-in
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
              <span>Energy Index</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {readiness.energy} / 5
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              {readiness.energy >= 4 ? 'High Capacity' : readiness.energy === 3 ? 'Steady Baseline' : 'Conserving Energy'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sleep Rest</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {readiness.sleepHours} hrs
            </div>
            <div className="text-[11px] text-slate-500">
              Quality: {readiness.sleepQuality}/5
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Soreness</span>
            </div>
            <div className="text-lg font-bold text-slate-900 capitalize">
              {readiness.soreness}
            </div>
            <div className="text-[11px] text-slate-500">
              {readiness.soreness === 'None' || readiness.soreness === 'Mild' ? 'Ready for volume' : 'Targeted mobility'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Engine Status</span>
            </div>
            <div className="text-xs font-bold text-emerald-950 mt-1">
              {readiness.isBadDayMode
                ? '2-Min Reset Active'
                : readiness.soreness === 'High' || readiness.energy <= 2
                ? 'Active Recovery Paced'
                : 'Progressive Overload'}
            </div>
            <div className="text-[10px] text-emerald-700 mt-1">
              {readiness.isBadDayMode ? 'Zero guilt' : 'Optimized for today'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
