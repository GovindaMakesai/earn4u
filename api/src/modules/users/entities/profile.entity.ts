import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index,
} from 'typeorm';
import {
  UserRole,
  UserStatus,
  Gender,
  VerificationType,
} from '../enums/user-role.enum';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { UserCredentials } from '../../auth/entities/user-credentials.entity';

@Entity('profiles', { schema: 'users' })
@Index(['username'], { unique: true })
@Index(['status', 'role'])
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, unique: true })
  username: string;

  @Column({ name: 'display_name', length: 50 })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'cover_url', type: 'varchar', length: 500, nullable: true })
  coverUrl: string | null;

  @Column({ name: 'country_code', type: 'char', length: 2, nullable: true })
  countryCode: string | null;

  @Column({ length: 5, default: 'en' })
  language: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.UNDISCLOSED })
  gender: Gender;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({
    name: 'verification_type',
    type: 'enum',
    enum: VerificationType,
    nullable: true,
  })
  verificationType: VerificationType | null;

  @Column({ name: 'vip_level', default: 0 })
  vipLevel: number;

  @Column({ name: 'wealth_level', default: 0 })
  wealthLevel: number;

  @Column({ name: 'popularity_level', default: 0 })
  popularityLevel: number;

  @Column({ name: 'creator_level', default: 0 })
  creatorLevel: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ name: 'follower_count', default: 0 })
  followerCount: number;

  @Column({ name: 'following_count', default: 0 })
  followingCount: number;

  @Column({ name: 'is_guest', default: false })
  isGuest: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToOne(() => UserCredentials, (creds) => creds.user)
  credentials: UserCredentials;
}

@Entity('follows', { schema: 'users' })
export class Follow {
  @Column({ name: 'follower_id', type: 'uuid', primary: true })
  followerId: string;

  @Column({ name: 'following_id', type: 'uuid', primary: true })
  followingId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
