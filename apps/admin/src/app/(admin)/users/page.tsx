'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { formatCount, unwrapPaginatedUsers } from '@/lib/format';
import type { AdminUser, ApiResponse, PaginatedUsers } from '@/lib/types';
import { PageSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { showToast } from '@/components/ui/toast';

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400',
  suspended: 'bg-rose-500/20 text-rose-400',
  banned: 'bg-rose-500/20 text-rose-400',
  deleted: 'bg-white/10 text-[var(--text-secondary)]',
  pending: 'bg-amber-500/20 text-amber-400',
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiResponse<PaginatedUsers>>('/admin/users', {
        params: { q: search, page, limit, status: status || undefined },
      });
      const parsed = unwrapPaginatedUsers(data.data);
      setUsers(parsed.users);
      setTotal(parsed.total);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, page, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(user: AdminUser, nextStatus: 'active' | 'suspended' | 'banned') {
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: nextStatus });
      showToast('success', `User ${nextStatus === 'active' ? 'unbanned' : 'banned'}`);
      void load();
      setSelected(null);
    } catch (err) {
      showToast('error', getApiErrorMessage(err));
    }
  }

  if (loading && users.length === 0) return <PageSkeleton />;
  if (error && users.length === 0) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-[var(--text-secondary)] mt-1">Live user data from API</p>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (setPage(1), setSearch(query))}
            className="px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm w-64 focus:outline-none focus:border-purple-500"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <button
            onClick={() => {
              setPage(1);
              setSearch(query);
            }}
            className="px-4 py-2 rounded-lg bg-purple-600/40 text-sm"
          >
            Search
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState message="No users found" />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[var(--text-secondary)]">
                <th className="text-left p-4 font-medium">Username</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">VIP</th>
                <th className="text-left p-4 font-medium">Coins</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Joined</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 font-medium">@{user.username}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{user.email ?? '—'}</td>
                  <td className="p-4">VIP {user.vipLevel}</td>
                  <td className="p-4">{formatCount(user.coinsBalance)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[user.status] ?? ''}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(user)}
                        className="text-xs px-2 py-1 rounded bg-white/10"
                      >
                        View
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => updateStatus(user, 'suspended')}
                          className="text-xs px-2 py-1 rounded bg-rose-600/30 text-rose-400"
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(user, 'active')}
                          className="text-xs px-2 py-1 rounded bg-emerald-600/30 text-emerald-400"
                        >
                          Unban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 text-sm text-[var(--text-secondary)]">
        <span>
          Page {page} of {totalPages} ({total} users)
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">@{selected.username}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Email</dt><dd>{selected.email ?? '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Role</dt><dd>{selected.role}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Coins</dt><dd>{formatCount(selected.coinsBalance)}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Diamonds</dt><dd>{formatCount(selected.diamondsBalance)}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Status</dt><dd>{selected.status}</dd></div>
            </dl>
            <button onClick={() => setSelected(null)} className="mt-6 w-full py-2 rounded-lg bg-white/10">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
