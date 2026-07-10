export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  vipLevel: number;
  isVerified: boolean;
  isGuest: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  activeStreams: number;
  activeRooms: number;
  revenueToday: number;
  revenueMonth: number;
  totalRevenue: number;
  platformCoinsBalance: number;
  platformDiamondsBalance: number;
  pendingWithdrawals: number;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  role: string;
  status: string;
  vipLevel: number;
  isVerified: boolean;
  isGuest: boolean;
  createdAt: string;
  coinsBalance: number;
  diamondsBalance: number;
}

export interface PaginatedUsers {
  data: AdminUser[];
  meta: { page: number; limit: number; total: number };
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amountDiamonds: number;
  amountFiat: number;
  currency: string;
  method: string;
  status: string;
  riskScore: number;
  createdAt: string;
}

export interface LiveStream {
  id: string;
  hostId: string;
  title: string;
  status: string;
  category: string;
  viewerCount: number;
}

export interface VoiceRoom {
  id: string;
  hostId: string;
  title: string;
  status: string;
  listenerCount: number;
  category: string;
}

export interface GiftCatalog {
  id: string;
  name: string;
  coinPrice: number;
  category: string;
  isActive: boolean;
}
