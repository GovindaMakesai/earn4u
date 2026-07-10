import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthSession,
} from './auth-storage';
import type { ApiResponse, LoginResponse } from './types';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://earn4u-api.onrender.com/api/v1';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && original && !original._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthSession();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiResponse<LoginResponse>>(
          `${baseURL}/auth/refresh`,
          { refreshToken },
        );

        const tokens = data.data;
        setAuthSession(tokens.accessToken, tokens.refreshToken, getStoredUser() ?? {});
        processQueue(tokens.accessToken);
        original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(null);
        clearAuthSession();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403 && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('earn4u:toast', {
          detail: { type: 'error', message: 'Permission denied' },
        }),
      );
    }

    return Promise.reject(error);
  },
);

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('earn4u_admin_user');
  return raw ? JSON.parse(raw) : null;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
    email,
    password,
    platform: 'web',
    deviceName: 'Earn4U Admin',
  });
  return data.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore network errors on logout
  } finally {
    clearAuthSession();
  }
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiResponse<unknown> | undefined;
    if (apiError?.error?.message) return apiError.error.message;
    if (error.response?.status === 500) return 'Server error — please retry';
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
