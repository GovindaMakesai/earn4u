import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { HealthService } from './health.service';
import { MetricsService } from '../../infra/metrics/metrics.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly metricsService: MetricsService,
  ) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Liveness probe' })
  liveness() {
    return this.healthService.checkLiveness();
  }

  @Public()
  @Get('health/ready')
  @ApiOperation({ summary: 'Readiness probe — checks DB and Redis' })
  readiness() {
    return this.healthService.checkReadiness();
  }

  @Public()
  @Get('metrics')
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  @ApiOperation({ summary: 'Prometheus metrics' })
  async metrics() {
    return this.metricsService.getMetrics();
  }
}
