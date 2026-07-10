export enum UserRole {
  USER = 'user',
  HOST = 'host',
  AGENCY = 'agency',
  COIN_SELLER = 'coin_seller',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  OWNER = 'owner',
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.HOST]: 8,
  [UserRole.COIN_SELLER]: 4,
  [UserRole.MODERATOR]: 2,
  [UserRole.AGENCY]: 16,
  [UserRole.ADMIN]: 32,
  [UserRole.SUPER_ADMIN]: 64,
  [UserRole.OWNER]: 128,
};

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  UNDISCLOSED = 'undisclosed',
}

export enum VerificationType {
  IDENTITY = 'identity',
  CREATOR = 'creator',
  AGENCY = 'agency',
}
