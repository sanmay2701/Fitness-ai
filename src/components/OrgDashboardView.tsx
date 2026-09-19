import React from 'react';
import { Users, Trophy, Award, TrendingUp, ShieldCheck, Download, Calendar, Flame, CheckCircle2 } from 'lucide-react';
import { Challenge } from '../types';

interface OrgDashboardViewProps {
  organizationName: string;
  challenges: Challenge[];
  onJoinChallenge: (challengeId: string) => void;
}

export const OrgDashboardView: React.FC<OrgDashboardViewProps> = ({
  organizationName,
  challenges,
  onJoinChallenge,
}) => {
  const teams = [
    { name: 'Computer Science & Engineering', members: 420, activePercent: 86, avgStreak: 8.2, points: 14850 },
    { name: 'Health Sciences & Kinesiology', members: 380, activePercent: 91, avgStreak: 9.4, points: 16200 },
    { name: 'Business & Management School', members: 310, activePercent: 74, avgStreak: 6.5, points: 10400 },
    { name: 'Faculty & Administrative Staff', members: 290, activePercent: 79, avgStreak: 7.1, points: 11950 },
  ];

  return (
    <div className="space-y-8" id="org-dashboard-view">
      {/* Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Campus & Workplace Wellness Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {organizationName || 'Campus Community Wellness League'}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Privacy-first aggregate fitness engagement. Track team participation, collective wellness campaigns, and encourage sustainable active habits across peers.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-slate-300">
              <strong>Zero Biometric Exposure:</strong> Complies with educational & corporate privacy frameworks. Only anonymized aggregations are compiled.
            </span>
          </div>
          <button
            onClick={() => {
              alert('Exported Anonymized Campus Wellness Executive Report (PDF/CSV format).');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition flex items-center gap-2 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Aggregate Report</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Community</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">1,400+</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% new participants</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Participation Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">82.5%</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Above 70% threshold</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Movement Mins</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">28,450</div>
          <div className="text-xs text-slate-500 mt-1">
            Logged this monthly cycle
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Average Streak</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">7.8 Days</div>
          <div className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>High consistency index</span>
          </div>
        </div>
      </div>

      {/* Team Leaderboard / Department Standings */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Campus Department & Club Standings</h3>
            <p className="text-xs text-slate-500">Ranked by participation consistency and collective workout points</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 self-start sm:self-auto">
            Fall Wellness Cup 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Department / Team</th>
                <th className="pb-3">Active Ratio</th>
                <th className="pb-3">Avg Streak</th>
                <th className="pb-3 text-right pr-2">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {teams.map((team, idx) => (
                <tr key={team.name} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 pl-2 font-bold font-mono text-slate-900">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                      idx === 0 ? 'bg-amber-100 text-amber-800' :
                      idx === 1 ? 'bg-slate-200 text-slate-700' :
                      idx === 2 ? 'bg-amber-50 text-amber-900' : 'text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="font-semibold text-slate-900">{team.name}</div>
                    <div className="text-xs text-slate-500">{team.members} registered members</div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${team.activePercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{team.activePercent}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-medium text-slate-700">
                    {team.avgStreak} days
                  </td>
                  <td className="py-3.5 text-right pr-2 font-mono font-bold text-emerald-600">
                    {team.points.toLocaleString()} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Campus Challenges */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Featured Group Wellness Challenges</h3>
          <p className="text-xs text-slate-500">Join collaborative campaigns to boost collective health momentum</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.filter(c => c.category !== 'individual').map((ch) => (
            <div
              key={ch.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    {ch.category}
                  </span>
                  <span className="text-xs text-slate-500">{ch.participantsCount} participants</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{ch.title}</h4>
                <p className="text-xs text-slate-600 mb-4">{ch.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Collective Target: {ch.targetValue}</span>
                  <span className="font-semibold text-emerald-600">{ch.currentProgress} / {ch.targetValue}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-4">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (ch.currentProgress / ch.targetValue) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-600">+{ch.xpReward} XP Reward</span>
                  <button
                    onClick={() => onJoinChallenge(ch.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      ch.joined
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {ch.joined ? 'Joined ✓' : 'Join Challenge'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
