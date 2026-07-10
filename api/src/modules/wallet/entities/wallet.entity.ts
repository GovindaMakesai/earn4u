import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  VersionColumn,
} from 'typeorm';
import { Profile } from '../../users/entities/profile.entity';

@Entity('wallets', { schema: 'economy' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'coins_balance', type: 'bigint', default: 0 })
  coinsBalance: number;

  @Column({ name: 'diamonds_balance', type: 'bigint', default: 0 })
  diamondsBalance: number;

  @Column({ name: 'reward_points_balance', type: 'bigint', default: 0 })
  rewardPointsBalance: number;

  @Column({ name: 'frozen_coins', type: 'bigint', default: 0 })
  frozenCoins: number;

  @Column({ name: 'frozen_diamonds', type: 'bigint', default: 0 })
  frozenDiamonds: number;

  @VersionColumn()
  version: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'user_id' })
  user: Profile;

  @OneToMany(() => Transaction, (tx) => tx.wallet)
  transactions: Transaction[];
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum Currency {
  COINS = 'coins',
  DIAMONDS = 'diamonds',
  REWARD_POINTS = 'reward_points',
}

export enum TransactionCategory {
  PURCHASE = 'purchase',
  GIFT_SENT = 'gift_sent',
  GIFT_RECEIVED = 'gift_received',
  WITHDRAWAL = 'withdrawal',
  REWARD = 'reward',
  COMMISSION = 'commission',
  REFUND = 'refund',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

@Entity('transactions', { schema: 'economy' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'wallet_id', type: 'uuid' })
  walletId: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ name: 'balance_after', type: 'bigint' })
  balanceAfter: number;

  @Column({ type: 'enum', enum: TransactionCategory })
  category: TransactionCategory;

  @Column({ name: 'reference_type', type: 'varchar', length: 50, nullable: true })
  referenceType: string | null;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 255, unique: true, nullable: true })
  idempotencyKey: string | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @OneToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}

@Entity('coin_packages', { schema: 'economy' })
export class CoinPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'coins_amount', type: 'int' })
  coinsAmount: number;

  @Column({ name: 'bonus_coins', type: 'int', default: 0 })
  bonusCoins: number;

  @Column({ name: 'price_usd', type: 'decimal', precision: 10, scale: 2 })
  priceUsd: number;

  @Column({ type: 'enum', enum: ['ios', 'android', 'web', 'all'], default: 'all' })
  platform: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
