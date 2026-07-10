'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-storage';
import { PageSkeleton } from '@/components/ui/skeleton';

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'owner']);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const raw = localStorage.getItem('earn4u_admin_user');
    if (raw) {
      try {
        const user = JSON.parse(raw) as { role?: string };
        if (user.role && !ADMIN_ROLES.has(user.role)) {
          router.replace('/login?error=not_admin');
          return;
        }
      } catch {
        router.replace('/login');
        return;
      }
    }

    setReady(true);
  }, [router]);

  if (!ready) return <PageSkeleton />;
  return <>{children}</>;
}
