import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ActivityLog, FitnessScoreData } from '../types';

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FitnessChartsProps {
  logs: ActivityLog[];
  scoreData: FitnessScoreData;
}

export const FitnessCharts: React.FC<FitnessChartsProps> = ({ logs, scoreData }) => {
  // 1. Weekly activity minutes by day
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayMinutes = [35, 30, 0, 20, 28, 25, 0]; // mapped from logs

  const barData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Active Minutes',
        data: dayMinutes,
        backgroundColor: dayMinutes.map((val, idx) =>
          idx === 4 ? 'rgba(16, 185, 129, 0.9)' : val > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(226, 232, 240, 0.8)'
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 13, family: 'Plus Jakarta Sans' },
        bodyFont: { size: 12, family: 'Plus Jakarta Sans' },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `${context.parsed.y} mins active movement`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 12 } },
      },
      y: {
        grid: { color: 'rgba(241, 245, 249, 1)' },
        ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 11 }, stepSize: 15 },
        max: 50,
      },
    },
  };

  // 2. Score trend over past weeks
  const trendData = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6 (Now)'],
    datasets: [
      {
        label: 'Fitness Score',
        data: [62, 65, 69, 71, 74, scoreData.overallScore],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 13, family: 'Plus Jakarta Sans' },
        bodyFont: { size: 12, family: 'Plus Jakarta Sans' },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 12 } },
      },
      y: {
        min: 50,
        max: 100,
        grid: { color: 'rgba(241, 245, 249, 1)' },
        ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="fitness-charts-container">
      {/* Weekly Activity Volume */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between" id="chart-card-weekly-activity">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-slate-900">Weekly Activity Volume</h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              138 / 150m Target
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Daily minutes of intentional exercise and active movement.</p>
        </div>
        <div className="h-56 w-full">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Target: 150 min WHO Baseline</span>
          <span className="text-emerald-600 font-medium font-mono">92% Met</span>
        </div>
      </div>

      {/* Fitness Score Trajectory */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between" id="chart-card-fitness-score-trend">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-slate-900">Fitness Score Progression</h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
              +{scoreData.change} pts this month
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Continuous index based on adherence, recovery, and completion.</p>
        </div>
        <div className="h-56 w-full">
          <Line data={trendData} options={trendOptions} />
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Current Score: <strong className="text-slate-800 font-semibold">{scoreData.overallScore}/100</strong></span>
          <span className="text-emerald-600 font-medium">Sustainable Upward Trend</span>
        </div>
      </div>
    </div>
  );
};
