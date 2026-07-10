import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService, RedisHealthIndicator } from './health.service';
import { MetricsModule } from '../../infra/metrics/metrics.module';

@Module({
  imports: [TerminusModule, MetricsModule],
  controllers: [HealthController],
  providers: [HealthService, RedisHealthIndicator],
})
export class HealthModule {}
