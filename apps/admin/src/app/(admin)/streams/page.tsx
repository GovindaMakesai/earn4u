'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiResponse, LiveStream } from '@/lib/types';
import { PageSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';

export default function StreamsPage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiResponse<LiveStream[]>>('/streams');
      setStreams(data.data);
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

  const live = streams.filter((s) => s.status === 'live');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Streams</h1>
        <p className="text-[var(--text-secondary)] mt-1">Live streams from API</p>
      </div>

      <div className="glass-card p-5 mb-6 inline-block">
        <p className="text-2xl font-bold text-rose-400">{live.length}</p>
        <p className="text-sm text-[var(--text-secondary)]">Live Now</p>
      </div>

      {streams.length === 0 ? (
        <EmptyState message="No streams yet — start one from the mobile app" />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[var(--text-secondary)]">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Viewers</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {streams.map((stream) => (
                <tr key={stream.id} className="border-b border-white/5">
                  <td className="p-4 font-medium">{stream.title}</td>
                  <td className="p-4">{stream.category}</td>
                  <td className="p-4">{stream.viewerCount}</td>
                  <td className="p-4">{stream.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
