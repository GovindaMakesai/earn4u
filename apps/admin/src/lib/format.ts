import type { AdminUser } from './types';

export function formatCount(value?: number | string | null): string {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num.toLocaleString() : '0';
}

export function formatMoney(value?: number | string | null): string {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(num) ? num : 0);
}

export function normalizeAdminUser(raw: Record<string, unknown>): AdminUser {
  return {
    id: String(raw.id ?? ''),
    username: String(raw.username ?? ''),
    displayName: String(raw.displayName ?? ''),
    email: (raw.email as string | null | undefined) ?? null,
    role: String(raw.role ?? 'user'),
    status: String(raw.status ?? 'active'),
    vipLevel: Number(raw.vipLevel ?? 0),
    isVerified: Boolean(raw.isVerified),
    isGuest: Boolean(raw.isGuest),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    coinsBalance: Number(raw.coinsBalance ?? 0),
    diamondsBalance: Number(raw.diamondsBalance ?? 0),
  };
}

export function unwrapList<T>(payload: unknown): T[] {
  if (!payload || typeof payload !== 'object') return [];
  const data = payload as Record<string, unknown>;
  if (Array.isArray(data.data)) return data.data as T[];
  if (Array.isArray(payload)) return payload as T[];
  return [];
}

export function unwrapPaginatedUsers(payload: unknown): {
  users: AdminUser[];
  total: number;
} {
  if (!payload || typeof payload !== 'object') {
    return { users: [], total: 0 };
  }

  const body = payload as Record<string, unknown>;
  const rows = Array.isArray(body.data) ? body.data : [];
  const meta =
    body.meta && typeof body.meta === 'object'
      ? (body.meta as Record<string, unknown>)
      : {};

  return {
    users: rows.map((row) =>
      normalizeAdminUser(row as Record<string, unknown>),
    ),
    total: Number(meta.total ?? rows.length),
  };
}
