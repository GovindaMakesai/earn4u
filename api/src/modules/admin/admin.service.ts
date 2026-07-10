import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Profile } from '../users/entities/profile.entity';
import { UserStatus } from '../users/enums/user-role.enum';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    private withdrawalsService: WithdrawalsService,
  ) {}

  async searchUsers(query: string, page = 1, limit = 20) {
    const [data, total] = await this.profileRepo.findAndCount({
      where: [
        { username: Like(`%${query}%`) },
        { displayName: Like(`%${query}%`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, meta: { page, limit, total } };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    await this.profileRepo.update(userId, { status });
    return this.profileRepo.findOne({ where: { id: userId } });
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

  getDashboardStats() {
    return {
      totalUsers: 0,
      activeStreams: 0,
      activeRooms: 0,
      revenueToday: 0,
      pendingWithdrawals: this.withdrawalsService.getPending().length,
    };
  }
}
