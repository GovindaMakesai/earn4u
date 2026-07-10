import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum GiftCategory {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  SEASONAL = 'seasonal',
  EVENT = 'event',
  VIP = 'vip',
}

@Entity('catalog', { schema: 'gifts' })
export class GiftCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ type: 'enum', enum: GiftCategory, default: GiftCategory.STANDARD })
  category: GiftCategory;

  @Column({ name: 'coin_price', type: 'int' })
  coinPrice: number;

  @Column({ name: 'animation_url', length: 500 })
  animationUrl: string;

  @Column({ name: 'sound_url', type: 'varchar', length: 500, nullable: true })
  soundUrl: string | null;

  @Column({ name: 'thumbnail_url', length: 500 })
  thumbnailUrl: string;

  @Column({ name: 'min_vip_level', default: 0 })
  minVipLevel: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}

export enum GiftContextType {
  STREAM = 'stream',
  ROOM = 'room',
  PROFILE = 'profile',
  PK_BATTLE = 'pk_battle',
}

@Entity('events', { schema: 'gifts' })
@Index(['receiverId', 'createdAt'])
@Index(['contextType', 'contextId'])
export class GiftEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'gift_id', type: 'uuid' })
  giftId: string;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @Column({ name: 'receiver_id', type: 'uuid' })
  receiverId: string;

  @Column({ name: 'context_type', type: 'enum', enum: GiftContextType })
  contextType: GiftContextType;

  @Column({ name: 'context_id', type: 'uuid' })
  contextId: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'total_coins', type: 'int' })
  totalCoins: number;

  @Column({ name: 'diamonds_earned', type: 'int' })
  diamondsEarned: number;

  @Column({ name: 'combo_count', default: 1 })
  comboCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
