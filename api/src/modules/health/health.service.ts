import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HealthIndicator,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../infra/redis/redis.constants';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (this.redis.status !== 'ready') {
        await this.redis.connect();
      }
      const pong = await this.redis.ping();
      const isHealthy = pong === 'PONG';
      return this.getStatus(key, isHealthy, { status: this.redis.status });
    } catch (error) {
      return this.getStatus(key, false, {
        message: error instanceof Error ? error.message : 'Redis unreachable',
      });
    }
  }
}

@Injectable()
export class HealthService implements OnModuleInit {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redisHealth: RedisHealthIndicator,
    private config: ConfigService,
  ) {}

  onModuleInit() {
    const nodeEnv = this.config.get('NODE_ENV');
    if (nodeEnv === 'production') {
      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET', '');
      if (accessSecret.includes('dev-secret') || accessSecret.includes('change-me')) {
        throw new Error('FATAL: Default JWT secrets detected in production');
      }
    }
  }

  checkLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'earn4u-api',
      version: process.env.npm_package_version ?? '1.0.0',
      uptime: process.uptime(),
    };
  }

  async checkReadiness() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 3000 }),
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
