'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Users,
  Radio,
  Mic,
  DollarSign,
  TrendingUp,
  Wallet,
  Clock,
} from 'lucide-react';
import { api, getApiErrorMessage } from '@/lib/api';
import { formatCount, formatMoney } from '@/lib/format';
import type { ApiResponse, DashboardStats } from '@/lib/types';
import { PageSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiResponse<DashboardStats>>(
        '/admin/dashboard/revenue',
      );
      setStats(data.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <PageSkeleton />;
  if (error) return <div className="p-8"><ErrorState message={error} onRetry={load} /></div>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Revenue', value: formatMoney(stats.totalRevenue), icon: DollarSign, color: 'text-amber-400' },
    { label: 'Revenue Today', value: formatMoney(stats.revenueToday), icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Revenue (Month)', value: formatMoney(stats.revenueMonth), icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Active Users', value: formatCount(stats.activeUsers), icon: Users, color: 'text-cyan-400' },
    { label: 'Total Users', value: formatCount(stats.totalUsers), icon: Users, color: 'text-purple-400' },
    { label: 'Live Streams', value: formatCount(stats.activeStreams), icon: Radio, color: 'text-rose-400' },
    { label: 'Voice Rooms', value: formatCount(stats.activeRooms), icon: Mic, color: 'text-cyan-400' },
    { label: 'Platform Coins', value: formatCount(stats.platformCoinsBalance), icon: Wallet, color: 'text-amber-400' },
    { label: 'Pending Withdrawals', value: formatCount(stats.pendingWithdrawals), icon: Clock, color: 'text-rose-400' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">Live platform metrics from Render API</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
