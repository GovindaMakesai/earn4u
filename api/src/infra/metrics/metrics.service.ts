import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Registry,
  Counter,
  Histogram,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new Registry();
  private httpRequestsTotal: Counter;
  private httpRequestDuration: Histogram;

  constructor(private config: ConfigService) {
    this.httpRequestsTotal = new Counter({
      name: 'earn4u_http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'earn4u_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
      registers: [this.registry],
    });
  }

  onModuleInit() {
    if (this.config.get('METRICS_ENABLED', 'true') !== 'false') {
      collectDefaultMetrics({ register: this.registry, prefix: 'earn4u_' });
    }
  }

  recordRequest(method: string, route: string, status: number, durationMs: number) {
    this.httpRequestsTotal.inc({ method, route, status: String(status) });
    this.httpRequestDuration.observe({ method, route }, durationMs / 1000);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
