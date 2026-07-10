import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profile, Follow } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/users.dto';
import { UserStatus } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) {}

  async getMe(userId: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { id: userId },
      relations: ['wallet'],
    });
    if (!profile) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return profile;
  }

  async getByUsername(username: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { username, status: UserStatus.ACTIVE },
    });
    if (!profile) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getMe(userId);
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Cannot follow yourself',
      });
    }

    const existing = await this.followRepo.findOne({
      where: { followerId, followingId },
    });
    if (existing) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Already following',
      });
    }

    await this.followRepo.save({ followerId, followingId });
    await this.profileRepo.increment({ id: followerId }, 'followingCount', 1);
    await this.profileRepo.increment({ id: followingId }, 'followerCount', 1);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const result = await this.followRepo.delete({ followerId, followingId });
    if (result.affected) {
      await this.profileRepo.decrement({ id: followerId }, 'followingCount', 1);
      await this.profileRepo.decrement({ id: followingId }, 'followerCount', 1);
    }
  }

  async getFollowers(userId: string, page = 1, limit = 20) {
    const [follows, total] = await this.followRepo.findAndCount({
      where: { followingId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const profiles = await this.profileRepo.findBy({
      id: In(follows.map((f) => f.followerId)),
    });

    return { data: profiles, meta: { page, limit, total } };
  }

  async getFollowing(userId: string, page = 1, limit = 20) {
    const [follows, total] = await this.followRepo.findAndCount({
      where: { followerId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const profiles = await this.profileRepo.findBy({
      id: In(follows.map((f) => f.followingId)),
    });

    return { data: profiles, meta: { page, limit, total } };
  }
}
