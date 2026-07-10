'use client';

import { EmptyState } from '@/components/ui/empty-state';

export default function ModerationPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Moderation</h1>
        <p className="text-[var(--text-secondary)] mt-1">Reports and content moderation</p>
      </div>
      <EmptyState message="Moderation API is not implemented on the backend yet" />
    </div>
  );
}
