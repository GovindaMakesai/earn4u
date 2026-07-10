# Earn4U — Enterprise Social Entertainment Platform

A production-grade social entertainment ecosystem combining live streaming, voice rooms, creator monetization, virtual gifting, messaging, gaming, and digital commerce.

## Platform Overview

| Layer | Technology |
|-------|------------|
| Mobile | Flutter (latest stable) |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL, Redis, Elasticsearch |
| Messaging | Kafka |
| Real-time | WebSocket, WebRTC |
| Storage | AWS S3 |
| Infrastructure | Docker, Kubernetes, NGINX, AWS |
| Notifications | Firebase Cloud Messaging |
| Analytics | Mixpanel, Firebase Analytics |
| Monitoring | Prometheus, Grafana, Sentry |
| CI/CD | GitHub Actions |

## Monorepo Structure

```
earn4u/
├── api/                       # NestJS backend API
├── apps/
│   ├── mobile/                # Flutter mobile application
│   └── admin/                 # Next.js admin panel
├── packages/
│   └── shared-types/     # Shared TypeScript types & contracts
├── docs/                 # Architecture, PRD, API specs, runbooks
├── infrastructure/       # Docker, K8s, monitoring, Terraform
└── .github/workflows/    # CI/CD pipelines
```

## Core Modules

- **Authentication** — Email, phone OTP, OAuth (Google/Apple/Facebook), guest, 2FA
- **User Profiles** — VIP/wealth/popularity levels, verification, achievements
- **Voice Party** — Multi-seat rooms, moderation, themes, reactions
- **Live Streaming** — Video/audio streams, PK battles, gifts, replays
- **Messaging** — DM, group chat, media, voice messages
- **Virtual Economy** — Coins, diamonds, reward points, wallet ledger
- **Virtual Gifts** — Premium animated gifts with 3D effects
- **VIP System** — 20-tier VIP with exclusive benefits
- **Creator Economy** — Agency management, revenue sharing, payouts
- **Games** — Ludo, quiz, racing, card games, tournaments
- **Admin Panel** — RBAC dashboard for platform operations

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Flutter 3.24+ (for mobile)
- Docker & Docker Compose (for local infra)

### Local Development

```bash
# Install dependencies
npm install

# Start infrastructure (PostgreSQL, Redis, Kafka, Elasticsearch)
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Run database migrations
cd api && npm run migration:run

# Start API server
cd api && npm run start:dev

# Start admin panel
cd apps/admin && npm run dev

# Run Flutter mobile app
cd apps/mobile && flutter run
```

### Environment Variables

Copy `.env.example` files in each app directory and configure:

- `apps/api/.env.example` — Database, Redis, JWT, AWS, payment gateways
- `apps/admin/.env.example` — API URL, auth secrets
- `apps/mobile/.env.example` — API endpoints, Firebase config

## Documentation

| Document | Path |
|----------|------|
| Product Requirements | [docs/PRD.md](docs/PRD.md) |
| Technical Architecture | [docs/technical-architecture.md](docs/technical-architecture.md) |
| Database Architecture | [docs/database-architecture.md](docs/database-architecture.md) |
| ER Diagrams | [docs/er-diagram.md](docs/er-diagram.md) |
| API Specification | [docs/api-specification.md](docs/api-specification.md) |
| Design System | [docs/design-system.md](docs/design-system.md) |
| Security Architecture | [docs/security-architecture.md](docs/security-architecture.md) |
| Testing Strategy | [docs/testing-strategy.md](docs/testing-strategy.md) |
| Production Launch Checklist | [docs/production-launch-checklist.md](docs/production-launch-checklist.md) |
| Scaling Roadmap | [docs/scaling-roadmap.md](docs/scaling-roadmap.md) |
| Revenue Model | [docs/revenue-model.md](docs/revenue-model.md) |
| Feature Roadmap | [docs/feature-roadmap.md](docs/feature-roadmap.md) |

## License

Proprietary — All rights reserved.
