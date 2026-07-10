'use client';

import { Inbox } from 'lucide-react';

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <Inbox className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-3" />
      <p className="text-sm text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}
