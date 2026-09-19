import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, HeartPulse, ShieldAlert, Coffee, ArrowRight } from 'lucide-react';
import { UserProfile, ReadinessState, ActivityLog, ChatMessage } from '../types';

interface AiCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  readiness: ReadinessState;
  recentActivities: ActivityLog[];
  onActivateBadDayMode: () => void;
}

const QUICK_QUESTIONS = [
  "What workout should I do today?",
  "I only have 15 minutes. What can I do?",
  "I missed my workout yesterday. What should I do today?",
  "Why did my Fitness Score change?",
  "How can I improve my consistency?",
  "I feel low energy today. Can you adapt my plan?",
];

export const AiCoachDrawer: React.FC<AiCoachDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  readiness,
  recentActivities,
  onActivateBadDayMode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'coach',
      text: `Hello ${userProfile.name}! I'm your FitSync AI Coach. I'm calibrated to your profile (${userProfile.fitnessExperience} level, goal: ${userProfile.goals[0] || 'General Fitness'}).

How is your body feeling today? You can ask me for a quick time-crunched routine, advice on missed sessions, or workout adjustments.`,
      timestamp: 'Just now',
      suggestedActions: ['What workout should I do today?', 'I only have 15 minutes', 'Activate 2-Min Reset'],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // If user clicked 2-Min Reset or said overwhelmed
    if (text.toLowerCase().includes('2-min') || text.toLowerCase().includes('bad day') || text.toLowerCase().includes('exhausted')) {
      onActivateBadDayMode();
    }

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userProfile,
          readiness,
          recentActivities: recentActivities.slice(0, 5),
        }),
      });

      const data = await response.json();
      const coachMsg: ChatMessage = {
        id: `coach_${Date.now()}`,
        sender: 'coach',
        text: data.reply || 'Listen to your body and celebrate every micro-win today!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `coach_err_${Date.now()}`,
          sender: 'coach',
          text: "I'm right here with you! If you're feeling pressed for time or low energy, take a 2-minute stretch break. Keeping your routine friction-free is what creates lifelong fitness habits.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end" id="ai-coach-drawer">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">FitSync AI Coach</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Adaptive
                </span>
              </div>
              <p className="text-xs text-slate-400">Context-aware fitness & habit guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Low-Motivation / Bad-Day Mode quick banner */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Exhausted, overwhelmed, or short on time?</span>
          </div>
          <button
            onClick={() => {
              onActivateBadDayMode();
              handleSendMessage("I'm feeling overwhelmed today. Let's do the 2-Minute Reset instead of a full workout.");
            }}
            className="px-2.5 py-1 bg-amber-200/70 hover:bg-amber-300 text-amber-950 font-semibold rounded-md transition text-[11px] shrink-0"
          >
            2-Min Reset
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

              {/* Suggested action chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(action)}
                      className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-full border border-slate-200 shadow-2xs transition"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200/70 rounded-2xl max-w-[70%] text-slate-500 text-xs shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
              <span>Analyzing readiness and formulating guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt suggestion pills */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">Prompts:</span>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200/60 whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your coach anything about today's routine..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <HeartPulse className="w-3 h-3 text-emerald-500" />
            <span>AI Coach adapts recommendations. Not medical diagnosis.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
