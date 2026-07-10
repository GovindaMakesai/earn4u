'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass-card p-8 text-center">
      <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
      <p className="text-sm text-[var(--text-secondary)] mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
