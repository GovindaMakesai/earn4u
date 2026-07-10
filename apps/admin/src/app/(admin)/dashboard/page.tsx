'use client';

import {
  Users,
  Radio,
  Mic,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Gift,
  ArrowUpRight,
} from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '1,247,832', change: '+12.5%', icon: Users, color: 'text-purple-400' },
  { label: 'Active Streams', value: '342', change: '+8.2%', icon: Radio, color: 'text-rose-400' },
  { label: 'Voice Rooms', value: '1,205', change: '+15.1%', icon: Mic, color: 'text-cyan-400' },
  { label: 'Revenue Today', value: '$48,291', change: '+22.3%', icon: DollarSign, color: 'text-amber-400' },
];

const recentActivity = [
  { type: 'withdrawal', message: 'Withdrawal request $2,400 — pending review', time: '2 min ago' },
  { type: 'report', message: 'User report flagged — inappropriate content', time: '5 min ago' },
  { type: 'gift', message: 'Castle gift sent — 100,000 coins', time: '8 min ago' },
  { type: 'user', message: 'New creator verified — @starhost', time: '12 min ago' },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Revenue Overview
            </h2>
          </div>
          <div className="h-64 flex items-end gap-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-purple-600 to-purple-400"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-[var(--text-secondary)]">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--primary-700)]">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
                <div>
                  <p className="text-sm">{item.message}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <Gift className="w-8 h-8 text-amber-400" />
          <div>
            <p className="text-lg font-bold">$12.4M</p>
            <p className="text-sm text-[var(--text-secondary)]">Gift GMV (MTD)</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <DollarSign className="w-8 h-8 text-emerald-400" />
          <div>
            <p className="text-lg font-bold">23</p>
            <p className="text-sm text-[var(--text-secondary)]">Pending Withdrawals</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
          <div>
            <p className="text-lg font-bold">7</p>
            <p className="text-sm text-[var(--text-secondary)]">Open Reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
