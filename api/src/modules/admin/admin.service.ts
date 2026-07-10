import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../users/entities/profile.entity';
import { UserStatus } from '../users/enums/user-role.enum';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';
import { StreamsService } from '../streams/streams.service';
import { RoomsService } from '../rooms/rooms.service';
import {
  Transaction,
  TransactionCategory,
  TransactionType,
  Wallet,
} from '../wallet/entities/wallet.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private withdrawalsService: WithdrawalsService,
    private streamsService: StreamsService,
    private roomsService: RoomsService,
  ) {}

  async searchUsers(query: string, page = 1, limit = 20, status?: UserStatus) {
    const qb = this.profileRepo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.wallet', 'wallet')
      .leftJoinAndSelect('profile.credentials', 'credentials')
      .orderBy('profile.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query) {
      qb.andWhere(
        '(profile.username ILIKE :q OR profile.displayName ILIKE :q OR credentials.email ILIKE :q)',
        { q: `%${query}%` },
      );
    }

    if (status) {
      qb.andWhere('profile.status = :status', { status });
    }

    const [rows, total] = await qb.getManyAndCount();

    const data = rows.map((profile) => ({
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      email: profile.credentials?.email ?? null,
      role: profile.role,
      status: profile.status,
      vipLevel: profile.vipLevel,
      isVerified: profile.isVerified,
      isGuest: profile.isGuest,
      createdAt: profile.createdAt,
      coinsBalance: Number(profile.wallet?.coinsBalance ?? 0),
      diamondsBalance: Number(profile.wallet?.diamondsBalance ?? 0),
    }));

    return { data, meta: { page, limit, total } };
  }

  async getUser(userId: string) {
    const profile = await this.profileRepo.findOne({
      where: { id: userId },
      relations: ['wallet', 'credentials'],
    });

    if (!profile) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      email: profile.credentials?.email ?? null,
      role: profile.role,
      status: profile.status,
      vipLevel: profile.vipLevel,
      wealthLevel: profile.wealthLevel,
      popularityLevel: profile.popularityLevel,
      isVerified: profile.isVerified,
      isGuest: profile.isGuest,
      createdAt: profile.createdAt,
      wallet: profile.wallet
        ? {
            coinsBalance: Number(profile.wallet.coinsBalance),
            diamondsBalance: Number(profile.wallet.diamondsBalance),
            rewardPointsBalance: Number(profile.wallet.rewardPointsBalance),
          }
        : null,
    };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    const profile = await this.profileRepo.findOne({ where: { id: userId } });
    if (!profile) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    await this.profileRepo.update(userId, { status });
    return this.getUser(userId);
  }

  getPendingWithdrawals() {
    return this.withdrawalsService.getPending();
  }

  approveWithdrawal(id: string) {
    return this.withdrawalsService.approve(id);
  }

  rejectWithdrawal(id: string) {
    return this.withdrawalsService.reject(id);
  }

  async getDashboardStats() {
    const totalUsers = await this.profileRepo.count();
    const activeUsers = await this.profileRepo.count({
      where: { status: UserStatus.ACTIVE },
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueToday = await this.sumPurchaseRevenue(startOfDay);
    const revenueMonth = await this.sumPurchaseRevenue(startOfMonth);
    const totalRevenue = await this.sumPurchaseRevenue();

    const walletTotals = await this.walletRepo
      .createQueryBuilder('wallet')
      .select('COALESCE(SUM(wallet.coinsBalance), 0)', 'coins')
      .addSelect('COALESCE(SUM(wallet.diamondsBalance), 0)', 'diamonds')
      .getRawOne<{ coins: string; diamonds: string }>();

    return {
      totalUsers,
      activeUsers,
      activeStreams: this.streamsService.findLive().length,
      activeRooms: this.roomsService.findActive().length,
      revenueToday,
      revenueMonth,
      totalRevenue,
      platformCoinsBalance: Number(walletTotals?.coins ?? 0),
      platformDiamondsBalance: Number(walletTotals?.diamonds ?? 0),
      pendingWithdrawals: this.withdrawalsService.getPending().length,
    };
  }

  private async sumPurchaseRevenue(since?: Date): Promise<number> {
    const qb = this.transactionRepo
      .createQueryBuilder('tx')
      .select('COALESCE(SUM(tx.amount), 0)', 'total')
      .where('tx.category = :category', {
        category: TransactionCategory.PURCHASE,
      })
      .andWhere('tx.type = :type', { type: TransactionType.CREDIT });

    if (since) {
      qb.andWhere('tx.createdAt >= :since', { since });
    }

    const result = await qb.getRawOne<{ total: string }>();
    return Number(result?.total ?? 0);
  }
}
