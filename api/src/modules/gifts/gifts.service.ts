import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  GiftCatalog,
  GiftEvent,
  GiftContextType,
} from './entities/gift.entity';
import { WalletService } from '../wallet/wallet.service';
import { Profile } from '../users/entities/profile.entity';
import { UserStatus } from '../users/enums/user-role.enum';
import { SendGiftDto } from './dto/gifts.dto';

const CREATOR_SHARE = 0.6;

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(GiftCatalog)
    private giftCatalogRepo: Repository<GiftCatalog>,
    @InjectRepository(GiftEvent)
    private giftEventRepo: Repository<GiftEvent>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    private walletService: WalletService,
    private dataSource: DataSource,
  ) {}

  async getCatalog(
    category?: string,
    vipLevel?: number,
  ): Promise<GiftCatalog[]> {
    const query = this.giftCatalogRepo
      .createQueryBuilder('gift')
      .where('gift.is_active = true')
      .orderBy('gift.sort_order', 'ASC');

    if (category) query.andWhere('gift.category = :category', { category });
    if (vipLevel !== undefined) {
      query.andWhere('gift.min_vip_level <= :vipLevel', { vipLevel });
    }

    return query.getMany();
  }

  async sendGift(
    senderId: string,
    dto: SendGiftDto,
    idempotencyKey: string,
  ): Promise<GiftEvent> {
    if (!idempotencyKey) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Idempotency-Key header is required',
      });
    }

    const [gift, sender, receiver] = await Promise.all([
      this.giftCatalogRepo.findOne({
        where: { id: dto.giftId, isActive: true },
      }),
      this.profileRepo.findOne({ where: { id: senderId } }),
      this.profileRepo.findOne({ where: { id: dto.receiverId } }),
    ]);

    if (!gift) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Gift not found',
      });
    }
    if (!sender || sender.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Sender account is not active',
      });
    }
    if (!receiver || receiver.status !== UserStatus.ACTIVE) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Receiver not found',
      });
    }
    if (sender.vipLevel < gift.minVipLevel) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: `VIP level ${gift.minVipLevel} required for this gift`,
      });
    }

    const totalCoins = gift.coinPrice * dto.quantity;
    const diamondsEarned = Math.floor(totalCoins * CREATOR_SHARE);
    const creditKey = `${idempotencyKey}:credit`;

    return this.dataSource.transaction(async (manager) => {
      await this.walletService.transferGiftFunds(
        {
          senderId,
          receiverId: dto.receiverId,
          coinAmount: totalCoins,
          diamondAmount: diamondsEarned,
          debitIdempotencyKey: idempotencyKey,
          creditIdempotencyKey: creditKey,
          giftId: gift.id,
          metadata: { quantity: dto.quantity, contextType: dto.contextType },
        },
        manager,
      );

      const comboCount = await this.getComboCount(senderId, dto);

      const event = manager.create(GiftEvent, {
        giftId: gift.id,
        senderId,
        receiverId: dto.receiverId,
        contextType: dto.contextType,
        contextId: dto.contextId,
        quantity: dto.quantity,
        totalCoins,
        diamondsEarned,
        comboCount,
      });

      return manager.save(event);
    });
  }

  async getLeaderboard(
    contextType: GiftContextType,
    contextId: string,
    limit = 10,
  ) {
    return this.giftEventRepo
      .createQueryBuilder('event')
      .select('event.receiver_id', 'userId')
      .addSelect('SUM(event.total_coins)', 'totalCoins')
      .addSelect('COUNT(event.id)', 'giftCount')
      .where('event.context_type = :contextType', { contextType })
      .andWhere('event.context_id = :contextId', { contextId })
      .groupBy('event.receiver_id')
      .orderBy('totalCoins', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  private async getComboCount(
    senderId: string,
    dto: SendGiftDto,
  ): Promise<number> {
    const recent = await this.giftEventRepo.findOne({
      where: {
        senderId,
        giftId: dto.giftId,
        contextType: dto.contextType,
        contextId: dto.contextId,
      },
      order: { createdAt: 'DESC' },
    });

    if (!recent) return 1;

    const secondsSince = (Date.now() - recent.createdAt.getTime()) / 1000;
    return secondsSince <= 5 ? recent.comboCount + 1 : 1;
  }
}
