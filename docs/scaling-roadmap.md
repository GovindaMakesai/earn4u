# Earn4U — Scaling Roadmap

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Scaling Stages

```
Stage 1: Launch        → 100K MAU, 100 concurrent streams
Stage 2: Growth        → 1M MAU, 1,000 concurrent streams
Stage 3: Scale         → 5M MAU, 5,000 concurrent streams
Stage 4: Global        → 20M+ MAU, 20,000+ concurrent streams
```

---

## 2. Stage 1: Launch (0–100K MAU)

### Infrastructure
- Single AWS region (us-east-1)
- 3 API pods, 3 WebSocket pods
- RDS PostgreSQL (db.r6g.large, Multi-AZ)
- ElastiCache Redis (cache.r6g.large, 2 nodes)
- Single S3 bucket + CloudFront

### Capacity
| Resource | Capacity |
|----------|----------|
| API RPS | 2,000 |
| WebSocket connections | 10,000 |
| Concurrent streams | 100 |
| Database connections | 200 (PgBouncer) |
| Messages/hour | 100,000 |

### Cost Estimate: ~$3,000/month

### Actions
- [ ] Deploy modular monolith (single NestJS app)
- [ ] Configure HPA (min 3, max 10 pods)
- [ ] Set up basic monitoring
- [ ] Implement connection pooling

---

## 3. Stage 2: Growth (100K–1M MAU)

### Infrastructure
- Add read replica (1 PostgreSQL read replica)
- Scale to 10 API pods, 10 WebSocket pods
- Add Kafka (MSK, 3 brokers)
- Add Elasticsearch (3 nodes)
- Redis cluster mode (3 shards)

### Capacity
| Resource | Capacity |
|----------|----------|
| API RPS | 10,000 |
| WebSocket connections | 50,000 |
| Concurrent streams | 1,000 |
| Messages/hour | 1,000,000 |

### Cost Estimate: ~$12,000/month

### Actions
- [ ] Extract WebSocket gateway to separate deployment
- [ ] Implement database read/write splitting
- [ ] Add Kafka for async event processing
- [ ] Partition transaction and message tables
- [ ] Deploy Elasticsearch for search
- [ ] Add CDN for media delivery
- [ ] Implement cache warming strategies

---

## 4. Stage 3: Scale (1M–5M MAU)

### Infrastructure
- Multi-AZ fully utilized
- 30 API pods, 50 WebSocket pods, 10 SFU pods
- 2 PostgreSQL read replicas
- Kafka cluster (6 brokers)
- Elasticsearch (6 nodes)
- Redis cluster (6 shards)
- Dedicated media processing workers

### Capacity
| Resource | Capacity |
|----------|----------|
| API RPS | 50,000 |
| WebSocket connections | 250,000 |
| Concurrent streams | 5,000 |
| Messages/hour | 5,000,000 |

### Cost Estimate: ~$45,000/month

### Actions
- [ ] Extract high-traffic modules to microservices (gifts, messaging)
- [ ] Implement database sharding strategy (by user_id hash)
- [ ] Deploy LiveKit SFU cluster for media
- [ ] Add second AWS region for disaster recovery
- [ ] Implement global Redis with cross-region replication
- [ ] Advanced auto-scaling (custom metrics)
- [ ] Message queue for gift animation delivery
- [ ] Implement circuit breakers between services

---

## 5. Stage 4: Global (5M–20M+ MAU)

### Infrastructure
- 3 AWS regions (us-east-1, eu-west-1, ap-southeast-1)
- 100+ API pods per region
- 200+ WebSocket pods per region
- Database sharding (4+ shards)
- Global Kafka with MirrorMaker
- Multi-region Elasticsearch
- Edge computing for media (CloudFront + Lambda@Edge)

### Capacity
| Resource | Capacity |
|----------|----------|
| API RPS | 200,000+ |
| WebSocket connections | 1,000,000+ |
| Concurrent streams | 20,000+ |
| Messages/hour | 20,000,000+ |

### Cost Estimate: ~$150,000+/month

### Actions
- [ ] Full microservices architecture
- [ ] Global load balancing with geo-routing
- [ ] Database sharding with Citus or custom
- [ ] Event sourcing for financial transactions
- [ ] ML-based auto-scaling predictions
- [ ] Edge caching for static assets and gift animations
- [ ] Cross-region stream failover
- [ ] Dedicated fraud detection service
- [ ] Real-time analytics pipeline (Kafka → Flink → Dashboard)

---

## 6. Bottleneck Analysis & Mitigations

| Bottleneck | Stage | Mitigation |
|-----------|-------|------------|
| Database writes | Stage 2+ | Read replicas, connection pooling, partitioning |
| WebSocket connections | Stage 2+ | Dedicated WS gateway pods, Redis pub/sub |
| Gift processing | Stage 2+ | Kafka async processing, batch ledger writes |
| Media bandwidth | Stage 3+ | SFU architecture, adaptive bitrate, CDN |
| Search latency | Stage 2+ | Elasticsearch with dedicated cluster |
| Payment processing | All | Async validation, idempotency, queue |
| Gift animations | Stage 3+ | Pre-rendered assets on CDN, client-side rendering |

---

## 7. Database Scaling Strategy

### Phase 1: Vertical + Read Replicas
- Upgrade instance size
- Add 1-2 read replicas
- PgBouncer connection pooling

### Phase 2: Partitioning
- Partition `transactions` by month
- Partition `messages` by month
- Partition `gift_events` by month

### Phase 3: Sharding
- Shard key: `user_id` hash
- 4 shards initially, expand to 16
- Cross-shard queries via aggregation service

---

## 8. Cost Optimization

| Strategy | Savings |
|----------|---------|
| Reserved instances (1-year) | 30-40% on compute |
| Spot instances for workers | 60-70% on batch jobs |
| S3 Intelligent Tiering | 20-30% on storage |
| CloudFront caching | 40% on bandwidth |
| Right-sizing (weekly review) | 10-20% overall |

---

## 9. Related Documents

- [Technical Architecture](technical-architecture.md)
- [Production Launch Checklist](production-launch-checklist.md)
- [Revenue Model](revenue-model.md)
