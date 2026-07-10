import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { validateEnv } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { GiftsModule } from './modules/gifts/gifts.module';
import { VipModule } from './modules/vip/vip.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { StreamsModule } from './modules/streams/streams.module';
import { PkModule } from './modules/pk/pk.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { AdminModule } from './modules/admin/admin.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { HealthModule } from './modules/health/health.module';
import { RedisModule } from './infra/redis/redis.module';
import { MetricsModule } from './infra/metrics/metrics.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Profile } from './modules/users/entities/profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),

    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get('LOG_LEVEL', 'info'),
          transport:
            config.get('NODE_ENV') === 'development'
              ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
              : undefined,
          redact: ['req.headers.authorization', 'req.headers.cookie'],
          serializers: {
            req: (req: { method: string; url: string }) => ({
              method: req.method,
              url: req.url,
            }),
          },
        },
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        ssl: config.get('DATABASE_SSL') === 'true',
        autoLoadEntities: true,
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development',
        extra: {
          max: config.get<number>('DATABASE_POOL_MAX', 20),
          idleTimeoutMillis: 30000,
        },
      }),
    }),

    TypeOrmModule.forFeature([Profile]),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: config.get<number>('THROTTLE_TTL', 60000),
        limit: config.get<number>('THROTTLE_LIMIT', 100),
      }],
    }),

    RedisModule,
    MetricsModule,
    HealthModule,
    AuthModule,
    UsersModule,
    WalletModule,
    GiftsModule,
    VipModule,
    RoomsModule,
    StreamsModule,
    PkModule,
    MessagingModule,
    WithdrawalsModule,
    AdminModule,
    WebsocketModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
