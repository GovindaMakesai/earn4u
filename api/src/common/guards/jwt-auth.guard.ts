import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorators';
import { Profile } from '../../modules/users/entities/profile.entity';
import { UserStatus } from '../../modules/users/enums/user-role.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Missing authentication token',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const profile = await this.profileRepo.findOne({
        where: { id: payload.sub },
        select: ['id', 'status', 'role', 'username', 'vipLevel'],
      });

      if (!profile || profile.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException({
          code: 'FORBIDDEN',
          message: 'Account is suspended, banned, or deleted',
        });
      }

      request.user = { ...payload, role: profile.role, vipLevel: profile.vipLevel };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      });
    }

    return true;
  }

  private extractToken(request: { headers: Record<string, string> }): string | null {
    const auth = request.headers.authorization;
    if (!auth) return null;
    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
