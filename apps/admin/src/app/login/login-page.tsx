'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, getApiErrorMessage } from '@/lib/api';
import { setAuthSession } from '@/lib/auth-storage';
import { showToast } from '@/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('admin@earn4u.app');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const errorParam = searchParams.get('error');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      const adminRoles = ['admin', 'super_admin', 'owner'];
      if (!adminRoles.includes(result.user.role)) {
        showToast('error', 'This account does not have admin access');
        return;
      }
      setAuthSession(result.accessToken, result.refreshToken, result.user);
      showToast('success', 'Welcome back');
      router.replace('/dashboard');
    } catch (error) {
      showToast('error', getApiErrorMessage(error, 'Login failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--primary-900)]">
      <div className="w-full max-w-md glass-card p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
          Earn4U Admin
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6">
          Sign in to manage the platform
        </p>

        {errorParam === 'not_admin' && (
          <p className="text-sm text-rose-400 mb-4">Admin access required.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
