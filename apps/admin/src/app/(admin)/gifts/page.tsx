'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import type { ApiResponse, GiftCatalog } from '@/lib/types';
import { PageSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';

export default function GiftsPage() {
  const [gifts, setGifts] = useState<GiftCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiResponse<GiftCatalog[]>>('/gifts');
      setGifts(data.data);
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Gifts</h1>
        <p className="text-[var(--text-secondary)] mt-1">Gift catalog from live API</p>
      </div>

      {gifts.length === 0 ? (
        <EmptyState message="No gifts in catalog — seed gifts in the database" />
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[var(--text-secondary)]">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price (coins)</th>
                <th className="text-left p-4">Active</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((gift) => (
                <tr key={gift.id} className="border-b border-white/5">
                  <td className="p-4 font-medium">{gift.name}</td>
                  <td className="p-4">{gift.category}</td>
                  <td className="p-4">{gift.coinPrice.toLocaleString()}</td>
                  <td className="p-4">{gift.isActive ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
