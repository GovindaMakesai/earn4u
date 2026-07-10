# Earn4U — Audit & Remediation Plan

**Date:** June 2026  
**Status:** Active — Phase 1 in progress

---

## Audit Summary

### Production-Ready (DB-backed)
| Module | Status |
|--------|--------|
| Auth (email/guest/sessions) | Partial — phone OTP stub, no OAuth |
| Users | DB-backed |
| Wallet (debit/credit) | DB-backed — missing purchase flow |
| Gifts | DB-backed — non-atomic money flow |
| Admin | Partial — user ops real, dashboard stub |

### Placeholder / In-Memory (must replace)
| Module | Issue |
|--------|-------|
| Rooms | `Map` in RAM |
| Streams | `Map` in RAM, fake WebRTC tokens |
| PK Battles | `Map` in RAM, broken routes |
| Messaging | `Map` in RAM, IDOR |
| Withdrawals | Array in RAM, no wallet integration |
| VIP | Hardcoded tiers, no subscriptions |
| WebSocket | No JWT auth, spoofable userId |
| Health | Always returns ready |

### Infrastructure Gaps
- Docker: no MinIO, mail, workers, API container, networks
- Redis/Kafka/ES in compose but **not integrated in API**
- No structured logging, metrics, tracing
- Migration tooling broken (`data-source.ts` missing)
- No env validation on startup

### Critical Security Issues
1. WebSocket identity spoofing
2. Gift debit/credit not atomic
3. Withdrawals without balance hold
4. JWT guard doesn't check live account status
5. Default secrets in code

---

## Remediation Phases

| Phase | Focus | Priority |
|-------|-------|----------|
| **1** | Production infrastructure | P0 — IN PROGRESS |
| **2** | LiveKit integration | P0 |
| **3** | Real-time messaging (Socket.io + Redis) | P0 |
| **4** | Double-entry ledger | P0 |
| **5** | Payments (Stripe, IAP, Razorpay) | P0 |
| **6** | Virtual gift engine | P1 |
| **7** | VIP economy | P1 |
| **8** | Creator economy | P1 |
| **9** | Withdrawal system | P0 |
| **10** | Push notifications (FCM) | P1 |
| **11** | Flutter completion | P1 |
| **12** | Admin completion | P1 |
| **13** | Moderation & safety | P1 |
| **14** | Analytics pipeline | P2 |
| **15** | Security hardening | P0 |
| **16** | Testing | P1 |
| **17** | Production deployment | P2 |

---

## Phase 1 Deliverables

- [x] Audit complete
- [ ] Full Docker Compose (PG, Redis, Kafka, ES, MinIO, Mailpit, Prometheus)
- [ ] API + Worker containers with health dependencies
- [ ] Environment validation on startup
- [ ] Structured logging (Pino)
- [ ] Real health checks (DB, Redis)
- [ ] Prometheus metrics endpoint
- [ ] Redis integration module
- [ ] BullMQ worker service
- [ ] TypeORM data-source for migrations
- [ ] Single-command startup (`npm run stack:up`)
- [ ] Fix gift atomicity
- [ ] Fix JWT live status check

---

## Phase 1 Exit Criteria

1. `docker compose up` starts entire local stack
2. API connects to PostgreSQL + Redis on startup
3. `/health/ready` fails if DB or Redis down
4. `/metrics` exposes Prometheus metrics
5. Worker processes jobs from Redis queue
6. Structured JSON logs in production mode
7. Env validation rejects missing required secrets in production
