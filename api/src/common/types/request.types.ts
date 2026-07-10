import { UserRole } from '../../modules/users/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser extends JwtPayload {
  role: UserRole;
  vipLevel: number;
}

export interface AuthenticatedRequest {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  url?: string;
  user?: AuthenticatedUser;
}
