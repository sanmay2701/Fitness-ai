import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, Clock, Camera, Flame, Dumbbell, Coffee, RotateCcw } from 'lucide-react';
import { WorkoutSession } from '../types';

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: WorkoutSession | null;
  onCompleteSession: (sessionId: string, durationMinutes: number, rpe: number) => void;
  onLaunchPoseCoach: (exerciseName: string) => void;
  onAdaptToBadDay: () => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  isOpen,
  onClose,
  session,
  onCompleteSession,
  onLaunchPoseCoach,
  onAdaptToBadDay,
}) => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeRestTimer, setActiveRestTimer] = useState<number | null>(null);
  const [rpe, setRpe] = useState<number>(6);

  useEffect(() => {
    let interval: any = null;
    if (activeRestTimer !== null && activeRestTimer > 0) {
      interval = setInterval(() => {
        setActiveRestTimer((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeRestTimer]);

  if (!isOpen || !session) return null;

  const toggleExerciseComplete = (id: string) => {
    setCompletedExercises((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    onCompleteSession(session.id, session.durationMinutes, rpe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto" id="workout-detail-modal">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {session.day}
              </span>
              <span className="text-xs text-slate-400">• {session.durationMinutes} mins • {session.difficulty}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{session.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Low Motivation / Bad-Day notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Exhausted or short on energy today?</span>
          </div>
          <button
            onClick={() => {
              onAdaptToBadDay();
              onClose();
            }}
            className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 font-semibold rounded-md transition text-[11px]"
          >
            Switch to 2-Min Reset
          </button>
        </div>

        {/* Rest Timer Banner if active */}
        {activeRestTimer !== null && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-between text-xs font-semibold animate-pulse">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Rest Interval Active: Breathe deeply</span>
            </div>
            <div className="font-mono text-base">{activeRestTimer}s left</div>
          </div>
        )}

        {/* Exercise Checklist */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Exercises in this routine ({session.exercises.length})</span>
            <span>
              {completedExercises.length}/{session.exercises.length} completed
            </span>
          </div>

          <div className="space-y-3">
            {session.exercises.map((ex, idx) => {
              const isDone = completedExercises.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleExerciseComplete(ex.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-emerald-500 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {idx + 1}. {ex.name}
                          </h4>
                          {ex.poseSupported && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                              AI Pose Supported
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">
                          {ex.sets} sets × {ex.reps} • {ex.restSeconds}s rest
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Tip: {ex.tips}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                      {ex.poseSupported && (
                        <button
                          onClick={() => onLaunchPoseCoach(ex.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Check Form</span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveRestTimer(ex.restSeconds)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Rest ({ex.restSeconds}s)</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Post-session RPE Slider */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Rate Session Effort (RPE: {rpe}/10)
              </label>
              <span className="text-xs text-emerald-700 font-semibold font-mono">
                {rpe <= 4 ? 'Light / Recovery' : rpe <= 7 ? 'Optimal Adapt' : 'Challenging'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Your RPE informs the Adaptive Engine whether to scale volume up or prescribe active recovery next.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            Awards <strong className="text-emerald-700 font-bold">+100 XP</strong> upon completion
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition"
            >
              Save for Later
            </button>
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete & Log Workout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
