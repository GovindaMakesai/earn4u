'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ type: Toast['type']; message: string }>).detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, ...detail }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener('earn4u:toast', handler);
    return () => window.removeEventListener('earn4u:toast', handler);
  }, []);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm min-w-[260px] ${
              toast.type === 'error'
                ? 'bg-rose-900/90 text-rose-100 border border-rose-700'
                : toast.type === 'success'
                  ? 'bg-emerald-900/90 text-emerald-100 border border-emerald-700'
                  : 'bg-[var(--primary-700)] text-white border border-white/10'
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export function showToast(type: Toast['type'], message: string) {
  window.dispatchEvent(new CustomEvent('earn4u:toast', { detail: { type, message } }));
}
