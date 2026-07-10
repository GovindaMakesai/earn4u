# Earn4U — Folder Structure & Code Organization

## Monorepo Layout

```
earn4u/
├── README.md                          # Project overview and quick start
├── package.json                       # Monorepo root (npm workspaces)
│
├── docs/                              # Architecture & product documentation
│   ├── PRD.md                         # Product requirements document
│   ├── technical-architecture.md      # System architecture
│   ├── database-architecture.md       # Database schema & design
│   ├── er-diagram.md                  # Entity relationship diagrams
│   ├── api-specification.md           # REST & WebSocket API spec
│   ├── design-system.md               # UI/UX design system
│   ├── security-architecture.md       # Security design
│   ├── revenue-model.md               # Monetization strategy
│   ├── feature-roadmap.md             # Development phases
│   ├── scaling-roadmap.md             # Infrastructure scaling plan
│   ├── testing-strategy.md            # QA & testing approach
│   └── production-launch-checklist.md # Go-live checklist
│
├── api/                               # NestJS Backend API
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts                    # App bootstrap
│       ├── app.module.ts              # Root module
│       ├── common/                    # Shared utilities
│       │   ├── decorators/            # @Public, @Roles, @UserId
│       │   ├── guards/                # JWT, RBAC guards
│       │   ├── filters/               # Exception filters
│       │   └── interceptors/          # Logging, transform
│       ├── database/
│       │   └── migrations/            # SQL migrations
│       └── modules/
│           ├── auth/                  # Authentication & sessions
│           ├── users/                 # Profiles & social graph
│           ├── wallet/                # Economy & transactions
│           ├── gifts/                   # Virtual gifting
│           ├── vip/                     # VIP tiers & subscriptions
│           ├── rooms/                   # Voice party rooms
│           ├── streams/                 # Live streaming
│           ├── pk/                      # PK battles
│           ├── messaging/               # DM & group chat
│           ├── withdrawals/             # Creator payouts
│           ├── admin/                   # Admin operations
│           ├── websocket/               # Real-time gateway
│           └── health/                  # Health checks
│
├── apps/
│   ├── mobile/                        # Flutter Mobile App
│   │   ├── pubspec.yaml
│   │   ├── lib/
│   │   │   ├── main.dart
│   │   │   ├── core/
│   │   │   │   ├── theme/             # Design tokens
│   │   │   │   ├── router/            # Navigation
│   │   │   │   ├── network/           # API client
│   │   │   │   └── constants/         # App constants
│   │   │   ├── features/
│   │   │   │   ├── auth/              # Login, register
│   │   │   │   ├── home/              # Home feed
│   │   │   │   ├── stream/            # Live streaming
│   │   │   │   ├── voice_room/        # Voice party
│   │   │   │   ├── gifts/             # Gift sending
│   │   │   │   ├── messaging/         # Chat
│   │   │   │   ├── profile/           # User profile
│   │   │   │   ├── wallet/            # Coins & diamonds
│   │   │   │   ├── pk/                # PK battles
│   │   │   │   └── games/             # Multiplayer games
│   │   │   └── shared/
│   │   │       └── widgets/           # Reusable UI components
│   │   └── assets/
│   │       ├── animations/            # Lottie/Rive gift animations
│   │       ├── images/
│   │       └── fonts/
│   │
│   └── admin/                         # Next.js Admin Panel
│       ├── package.json
│       ├── next.config.js
│       └── src/
│           └── app/
│               ├── layout.tsx
│               ├── dashboard/         # Revenue & analytics
│               ├── users/             # User management
│               ├── streams/           # Stream management
│               ├── rooms/             # Room management
│               ├── gifts/             # Gift catalog
│               ├── withdrawals/       # Payout approvals
│               ├── moderation/        # Reports & bans
│               └── settings/          # System config
│
├── packages/
│   └── shared-types/                  # Shared TypeScript types
│
├── infrastructure/
│   ├── docker/
│   │   └── docker-compose.yml         # Local dev services
│   ├── kubernetes/
│   │   └── api-deployment.yaml        # K8s manifests
│   └── monitoring/
│       └── prometheus.yml             # Metrics scraping
│
└── .github/
    └── workflows/
        └── ci-api.yml                 # CI/CD pipeline
```

## Module Organization Principles

1. **Feature-based modules** — Each domain (auth, wallet, gifts) is a self-contained NestJS module
2. **Layered architecture** — Controller → Service → Repository (TypeORM)
3. **Shared code in `common/`** — Guards, decorators, filters used across modules
4. **Flutter feature folders** — Each screen feature has `data/`, `domain/`, `presentation/` layers
5. **Admin mirrors API** — Admin panel pages map 1:1 to admin API endpoints

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| API endpoints | kebab-case, plural | `/api/v1/coin-packages` |
| Database tables | snake_case, schema-prefixed | `economy.wallets` |
| TypeScript classes | PascalCase | `WalletService` |
| Flutter files | snake_case | `home_screen.dart` |
| Env variables | SCREAMING_SNAKE | `JWT_ACCESS_SECRET` |
| Kafka topics | dot-separated | `gift.events` |
| WebSocket events | colon-separated | `room:gift` |
