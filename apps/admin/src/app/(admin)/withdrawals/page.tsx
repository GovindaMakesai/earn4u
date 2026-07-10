'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiResponse, WithdrawalRequest } from '@/lib/types';
import { PageSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { showToast } from '@/components/ui/toast';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  under_review: 'bg-cyan-500/20 text-cyan-400',
  approved: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-rose-500/20 text-rose-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
};

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiResponse<WithdrawalRequest[]>>(
        '/admin/withdrawals/pending',
      );
      setWithdrawals(data.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActing(id);
    try {
      await api.post(`/admin/withdrawals/${id}/${action}`);
      showToast('success', `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'}`);
      await load();
    } catch (err) {
      showToast('error', getApiErrorMessage(err));
    } finally {
      setActing(null);
    }
  }

  if (loading) return <PageSkeleton />;
  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Withdrawals</h1>
        <p className="text-[var(--text-secondary)] mt-1">Pending payout requests from live API</p>
      </div>

      <div className="glass-card p-5 mb-6 inline-block">
        <p className="text-2xl font-bold text-amber-400">{withdrawals.length}</p>
        <p className="text-sm text-[var(--text-secondary)]">Pending / Under Review</p>
      </div>

      {withdrawals.length === 0 ? (
        <EmptyState message="No pending withdrawals" />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[var(--text-secondary)]">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">User ID</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Method</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Requested</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-[var(--text-secondary)] font-mono text-xs">{w.id.slice(0, 8)}…</td>
                  <td className="p-4 font-mono text-xs">{w.userId.slice(0, 8)}…</td>
                  <td className="p-4">${w.amountFiat.toFixed(2)}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{w.method}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[w.status] ?? ''}`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">
                    {new Date(w.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        disabled={acting === w.id}
                        onClick={() => handleAction(w.id, 'approve')}
                        className="text-xs px-2 py-1 rounded bg-emerald-600/30 text-emerald-400 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={acting === w.id}
                        onClick={() => handleAction(w.id, 'reject')}
                        className="text-xs px-2 py-1 rounded bg-rose-600/30 text-rose-400 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
