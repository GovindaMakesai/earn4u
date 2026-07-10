import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID, createHash } from 'crypto';
import {
  UserCredentials,
  Session,
  Device,
} from './entities/user-credentials.entity';
import { Profile } from '../users/entities/profile.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { RegisterDto, LoginDto, GuestLoginDto } from './dto/auth.dto';
import { UserRole, UserStatus } from '../users/enums/user-role.enum';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Partial<Profile>;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly MAX_SESSIONS = 5;

  constructor(
    @InjectRepository(UserCredentials)
    private credentialsRepo: Repository<UserCredentials>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingEmail = await this.credentialsRepo.findOne({
      where: { email: dto.email },
    });
    const existingUsername = await this.profileRepo.findOne({
      where: { username: dto.username },
    });

    if (existingEmail || existingUsername) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Email or username already exists',
      });
    }

    const profile = this.profileRepo.create({
      username: dto.username,
      displayName: dto.displayName,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });
    await this.profileRepo.save(profile);

    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const credentials = this.credentialsRepo.create({
      userId: profile.id,
      email: dto.email,
      passwordHash,
    });
    await this.credentialsRepo.save(credentials);

    const wallet = this.walletRepo.create({ userId: profile.id });
    await this.walletRepo.save(wallet);

    return this.issueTokens(profile);
  }

  async login(dto: LoginDto, ip?: string): Promise<AuthResponse> {
    const credentials = await this.credentialsRepo.findOne({
      where: { email: dto.email },
      relations: ['user'],
    });

    if (!credentials?.passwordHash) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    const valid = await bcrypt.compare(dto.password, credentials.passwordHash);
    if (!valid) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    if (credentials.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Account is suspended or banned',
      });
    }

    let deviceId: string | null = null;
    if (dto.deviceFingerprint) {
      deviceId = await this.registerDevice(credentials.userId, dto);
    }

    return this.issueTokens(credentials.user, deviceId, ip);
  }

  async guestLogin(dto: GuestLoginDto, ip?: string): Promise<AuthResponse> {
    const guestId = `guest_${randomUUID().slice(0, 8)}`;
    const profile = this.profileRepo.create({
      username: guestId,
      displayName: 'Guest',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isGuest: true,
    });
    await this.profileRepo.save(profile);

    const wallet = this.walletRepo.create({ userId: profile.id });
    await this.walletRepo.save(wallet);

    const deviceId = await this.registerDevice(profile.id, dto);
    return this.issueTokens(profile, deviceId, ip);
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const hash = this.hashToken(refreshToken);
    const session = await this.sessionRepo.findOne({
      where: { refreshTokenHash: hash },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    }

    const profile = await this.profileRepo.findOne({
      where: { id: session.userId },
    });

    if (!profile || profile.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Account is not active',
      });
    }

    session.revokedAt = new Date();
    await this.sessionRepo.save(session);

    return this.issueTokens(profile, session.deviceId).then(
      ({ accessToken, refreshToken: newRefresh }) => ({
        accessToken,
        refreshToken: newRefresh,
      }),
    );
  }

  async logout(userId: string, sessionId?: string): Promise<void> {
    if (sessionId) {
      await this.sessionRepo.update(
        { id: sessionId, userId },
        { revokedAt: new Date() },
      );
    } else {
      await this.sessionRepo.update(
        { userId, revokedAt: null as unknown as Date },
        { revokedAt: new Date() },
      );
    }
  }

  private async issueTokens(
    profile: Profile,
    deviceId?: string | null,
    ip?: string,
  ): Promise<AuthResponse> {
    const payload = {
      sub: profile.id,
      username: profile.username,
      role: profile.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = randomUUID();
    const refreshTokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.enforceSessionLimit(profile.id);

    const session = this.sessionRepo.create({
      userId: profile.id,
      refreshTokenHash,
      deviceId: deviceId ?? null,
      ipAddress: ip ?? null,
      expiresAt,
    });
    await this.sessionRepo.save(session);

    return {
      user: this.sanitizeProfile(profile),
      accessToken,
      refreshToken,
    };
  }

  private async enforceSessionLimit(userId: string): Promise<void> {
    const sessions = await this.sessionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const active = sessions.filter(
      (s) => !s.revokedAt && s.expiresAt > new Date(),
    );
    if (active.length >= this.MAX_SESSIONS) {
      const toRevoke = active.slice(this.MAX_SESSIONS - 1);
      for (const session of toRevoke) {
        session.revokedAt = new Date();
        await this.sessionRepo.save(session);
      }
    }
  }

  private async registerDevice(
    userId: string,
    dto: { deviceFingerprint?: string; deviceName?: string; platform?: string },
  ): Promise<string> {
    if (!dto.deviceFingerprint) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Device fingerprint required',
      });
    }

    let device = await this.deviceRepo.findOne({
      where: { userId, deviceFingerprint: dto.deviceFingerprint },
    });

    if (!device) {
      device = this.deviceRepo.create({
        userId,
        deviceFingerprint: dto.deviceFingerprint,
        deviceName: dto.deviceName ?? null,
        platform: dto.platform ?? 'android',
      });
    }

    device.lastActiveAt = new Date();
    await this.deviceRepo.save(device);
    return device.id;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private sanitizeProfile(profile: Profile): Partial<Profile> {
    const {
      id,
      username,
      displayName,
      avatarUrl,
      role,
      vipLevel,
      wealthLevel,
      popularityLevel,
      isVerified,
      isGuest,
    } = profile;
    return {
      id,
      username,
      displayName,
      avatarUrl,
      role,
      vipLevel,
      wealthLevel,
      popularityLevel,
      isVerified,
      isGuest,
    };
  }
}
