# Earn4U — Technical Architecture

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Architecture Overview

Earn4U follows a **microservices-oriented modular monolith** architecture with clear service boundaries, designed for eventual extraction into independent microservices as scale demands.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Flutter App  │  │ Admin Panel  │  │  Coin Seller │                  │
│  │  (iOS/Android)│  │  (Next.js)   │  │    Portal    │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼──────────────────────────┐
│         ▼                  ▼                  ▼     EDGE LAYER           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │                    NGINX / AWS ALB                           │        │
│  │         (TLS termination, rate limiting, routing)            │        │
│  └──────────────────────────┬──────────────────────────────────┘        │
└─────────────────────────────┼────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────────────┐
│                             ▼          API GATEWAY LAYER                 │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │              NestJS API Server (apps/api)                    │        │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │        │
│  │  │  Auth   │ │  Users  │ │ Economy │ │  Gifts  │  ...     │        │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │        │
│  └──────────────────────────┬──────────────────────────────────┘        │
│  ┌──────────────────────────┴──────────────────────────────────┐        │
│  │              WebSocket Gateway (Socket.io)                   │        │
│  │   Rooms │ Streams │ Messaging │ PK Battles │ Games          │        │
│  └──────────────────────────┬──────────────────────────────────┘        │
└─────────────────────────────┼────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────────────┐
│                             ▼       REAL-TIME LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │  WebRTC SFU  │  │  Media Server │  │  TURN/STUN   │                  │
│  │  (LiveKit)   │  │  (Recording)  │  │  Servers     │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└──────────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────────────┐
│                             ▼         DATA LAYER                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │PostgreSQL│ │  Redis   │ │  Kafka   │ │Elastic-  │ │  AWS S3  │    │
│  │ (Primary)│ │ (Cache/  │ │ (Events) │ │ search   │ │ (Media)  │    │
│  │          │ │  PubSub) │ │          │ │ (Search) │ │          │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────────────┐
│                             ▼      OBSERVABILITY LAYER                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │Prometheus│ │ Grafana  │ │  Sentry  │ │ Mixpanel │ │ Firebase │    │
│  │          │ │          │ │          │ │          │ │ Analytics│    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Service Modules (NestJS)

### 2.1 Core Services

| Module | Responsibility | Key Dependencies |
|--------|---------------|------------------|
| `auth` | Authentication, sessions, OAuth, 2FA | PostgreSQL, Redis |
| `users` | Profiles, levels, followers, achievements | PostgreSQL, Redis, S3 |
| `wallet` | Coins, diamonds, reward points, ledger | PostgreSQL, Redis |
| `gifts` | Gift catalog, sending, animations | PostgreSQL, Redis, Kafka |
| `vip` | VIP tiers, subscriptions, benefits | PostgreSQL, Stripe/IAP |
| `payments` | IAP validation, payment gateways | PostgreSQL, external APIs |

### 2.2 Real-Time Services

| Module | Responsibility | Key Dependencies |
|--------|---------------|------------------|
| `voice-rooms` | Voice party lifecycle, seats, moderation | WebSocket, Redis, WebRTC |
| `live-streams` | Stream management, viewer tracking | WebSocket, WebRTC, S3 |
| `pk-battles` | Battle logic, scoring, rankings | WebSocket, Redis, Kafka |
| `messaging` | DM, group chat, media messages | WebSocket, PostgreSQL, S3, ES |
| `games` | Game sessions, tournaments, rewards | WebSocket, Redis, Kafka |

### 2.3 Business Services

| Module | Responsibility | Key Dependencies |
|--------|---------------|------------------|
| `creators` | Creator earnings, levels, analytics | PostgreSQL, Kafka |
| `agencies` | Agency management, commissions | PostgreSQL |
| `withdrawals` | Payout requests, KYC, approvals | PostgreSQL, external APIs |
| `coin-sellers` | Authorized coin distribution | PostgreSQL, wallet |
| `moderation` | Reports, bans, content review | PostgreSQL, Kafka, ML |

### 2.4 Platform Services

| Module | Responsibility | Key Dependencies |
|--------|---------------|------------------|
| `admin` | Admin operations, dashboards | PostgreSQL, Redis |
| `notifications` | Push, in-app, email | FCM, PostgreSQL |
| `analytics` | Event tracking, metrics | Kafka, Mixpanel |
| `search` | User/room/stream/message search | Elasticsearch |
| `media` | Upload, processing, CDN | S3, CloudFront |

---

## 3. Communication Patterns

### 3.1 Synchronous (REST/GraphQL)

- Client ↔ API: REST over HTTPS (JSON)
- Admin ↔ API: REST with elevated RBAC
- Internal: Direct module injection (modular monolith)

### 3.2 Asynchronous (Kafka Topics)

| Topic | Producer | Consumers |
|-------|----------|-----------|
| `user.events` | auth, users | analytics, notifications, search |
| `gift.events` | gifts | wallet, analytics, pk-battles |
| `stream.events` | live-streams | analytics, notifications, search |
| `wallet.transactions` | wallet | analytics, fraud-detection |
| `moderation.events` | moderation | notifications, admin |
| `withdrawal.events` | withdrawals | admin, notifications, fraud |

### 3.3 Real-Time (WebSocket)

| Namespace | Events | Purpose |
|-----------|--------|---------|
| `/rooms` | join, leave, seat, mute, gift, reaction | Voice party |
| `/streams` | join, comment, gift, reaction, viewer-count | Live streaming |
| `/pk` | start, score-update, end, reward | PK battles |
| `/chat` | message, typing, read, reaction | Messaging |
| `/games` | join, move, result, tournament | Multiplayer games |

### 3.4 Media (WebRTC)

- **SFU Architecture:** LiveKit for selective forwarding
- **Codecs:** VP8/VP9/H.264 video, Opus audio
- **Adaptive Bitrate:** Simulcast with 3 layers
- **Recording:** Server-side composite to S3

---

## 4. Data Architecture

### 4.1 PostgreSQL (Primary Store)

- **Pattern:** Single database with schema separation per domain
- **ORM:** TypeORM with migrations
- **Connection Pooling:** PgBouncer (transaction mode)
- **Read Replicas:** 2+ for read-heavy queries
- **Partitioning:** Transaction ledger by month, messages by month

### 4.2 Redis (Cache & Real-Time State)

| Use Case | Data Structure | TTL |
|----------|---------------|-----|
| Session store | Hash | 7 days |
| Rate limiting | Sorted Set | 1 min–1 hour |
| Room state | Hash | Session |
| Stream viewer count | HyperLogLog | Session |
| PK battle scores | Sorted Set | Battle duration |
| Leaderboards | Sorted Set | Varies |
| Pub/Sub | Channels | N/A |

### 4.3 Elasticsearch

- User search (name, username, bio)
- Message search (content, metadata)
- Room/stream discovery (title, tags, category)
- Admin audit log search

### 4.4 AWS S3

```
s3://earn4u-media/
├── avatars/{userId}/
├── galleries/{userId}/
├── messages/{conversationId}/
├── streams/{streamId}/recordings/
├── gifts/animations/
└── assets/themes/
```

---

## 5. Security Architecture

```
Request → WAF → ALB → Rate Limiter → JWT Guard → RBAC Guard → Handler
                                              ↓
                                    Audit Log (all mutations)
```

### 5.1 Authentication Flow

1. Client authenticates (email/phone/OAuth)
2. API issues access token (15 min) + refresh token (30 days)
3. Refresh token stored in Redis with device fingerprint
4. Token rotation on every refresh
5. Concurrent session limit enforced

### 5.2 Authorization (RBAC)

```
Owner > Super Admin > Admin > Agency > Host > Coin Seller > Moderator > User
```

Permissions stored as bitmask + role inheritance. Enforced via NestJS guards.

### 5.3 Encryption

| Data | At Rest | In Transit |
|------|---------|------------|
| Passwords | bcrypt (cost 12) | TLS 1.3 |
| PII | AES-256-GCM | TLS 1.3 |
| Payment tokens | Vault/AWS KMS | TLS 1.3 |
| Messages | AES-256-GCM (optional E2E) | TLS 1.3 |

---

## 6. Deployment Architecture (AWS)

```
┌─────────────────────────────────────────────────┐
│                  Route 53 (DNS)                  │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              CloudFront (CDN)                    │
│         Static assets, media delivery            │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│           ALB (Application Load Balancer)        │
│              WAF attached                         │
└───────┬────────────────────────────┬────────────┘
        │                            │
┌───────▼──────────┐    ┌───────────▼──────────┐
│  EKS Cluster     │    │  EKS Cluster          │
│  (API + WS)      │    │  (Media/LiveKit)      │
│  ┌────┐ ┌────┐  │    │  ┌────┐ ┌────┐       │
│  │Pod │ │Pod │  │    │  │SFU │ │SFU │       │
│  │ x3 │ │ x3 │  │    │  │ x2 │ │ x2 │       │
│  └────┘ └────┘  │    │  └────┘ └────┘       │
└──────────────────┘    └──────────────────────┘
        │
┌───────▼──────────────────────────────────────┐
│  RDS PostgreSQL (Multi-AZ)                    │
│  ElastiCache Redis (Cluster Mode)             │
│  MSK Kafka                                    │
│  OpenSearch (Elasticsearch)                   │
│  S3 + CloudFront                              │
└──────────────────────────────────────────────┘
```

### 6.1 Kubernetes Namespaces

| Namespace | Workloads |
|-----------|-----------|
| `earn4u-api` | API server, WebSocket gateway |
| `earn4u-media` | LiveKit SFU, TURN servers |
| `earn4u-workers` | Kafka consumers, cron jobs |
| `earn4u-monitoring` | Prometheus, Grafana |
| `earn4u-ingress` | NGINX ingress controller |

### 6.2 Auto-Scaling

- **HPA:** CPU 70% / Memory 80% thresholds
- **API pods:** Min 3, Max 50
- **WS pods:** Min 3, Max 100 (connection-based scaling)
- **SFU pods:** Min 2, Max 30 (stream-count based)

---

## 7. CI/CD Pipeline

```
Push → Lint + Type Check → Unit Tests → Build Docker Image
  → Push to ECR → Deploy to Staging → Integration Tests
  → Manual Approval → Deploy to Production → Smoke Tests
```

GitHub Actions workflows:
- `ci-api.yml` — API lint, test, build
- `ci-mobile.yml` — Flutter analyze, test, build
- `ci-admin.yml` — Admin lint, test, build
- `cd-staging.yml` — Auto-deploy to staging on merge to `develop`
- `cd-production.yml` — Deploy to production on release tag

---

## 8. Disaster Recovery

| Component | Backup Strategy | RPO | RTO |
|-----------|----------------|-----|-----|
| PostgreSQL | Continuous WAL + daily snapshots | 5 min | 15 min |
| Redis | AOF persistence + daily RDB | 1 min | 5 min |
| S3 | Cross-region replication | 0 | 5 min |
| Kafka | Multi-AZ, 3 replicas | 0 | 10 min |
| Config/Secrets | AWS Secrets Manager | 0 | 5 min |

---

## 9. Technology Decisions & Rationale

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend framework | NestJS | Enterprise TypeScript, modular, DI, guards |
| Mobile | Flutter | Single codebase, 60fps, rich animations |
| Primary DB | PostgreSQL | ACID, JSON support, mature ecosystem |
| Cache | Redis | Sub-ms latency, pub/sub, sorted sets |
| Event bus | Kafka | Durable, high-throughput, replay capability |
| Search | Elasticsearch | Full-text, aggregations, near real-time |
| Media SFU | LiveKit | Open-source, scalable, WebRTC native |
| Admin UI | Next.js | SSR, React ecosystem, fast development |
| Container orchestration | Kubernetes | Industry standard, auto-scaling, self-healing |

---

## 10. API Versioning Strategy

- URL prefix: `/api/v1/`, `/api/v2/`
- Breaking changes require new version
- Deprecation notice: 6 months minimum
- Sunset: 12 months after deprecation

---

## 11. Related Documents

- [Database Architecture](database-architecture.md)
- [ER Diagrams](er-diagram.md)
- [API Specification](api-specification.md)
- [Security Architecture](security-architecture.md)
- [Scaling Roadmap](scaling-roadmap.md)
