# Earn4U — Testing Strategy

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Testing Pyramid

```
         ╱  E2E Tests (5%)  ╲         Playwright, Flutter integration
        ╱ Integration (20%)  ╲        API e2e, WebSocket tests
       ╱   Unit Tests (75%)   ╲      Jest, Flutter test
```

**Coverage Targets:**
- Unit tests: 80% line coverage
- Integration tests: All API endpoints
- E2E tests: Critical user flows

---

## 2. Backend Testing (NestJS)

### 2.1 Unit Tests

**Framework:** Jest + @nestjs/testing

**Scope:**
- Service business logic (wallet, gifts, auth)
- Guards and decorators
- Utility functions
- DTO validation

**Pattern:**
```typescript
describe('WalletService', () => {
  let service: WalletService;
  let mockRepo: MockRepository<Wallet>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: getRepositoryToken(Wallet), useValue: mockRepo },
      ],
    }).compile();
    service = module.get(WalletService);
  });

  it('should debit coins atomically', async () => {
    // ...
  });
});
```

### 2.2 Integration Tests

**Framework:** Jest + Supertest

**Scope:**
- All REST API endpoints
- Authentication flows
- Database interactions
- Redis cache behavior

**Setup:**
- Test database (PostgreSQL in Docker)
- Test Redis instance
- Database seeding per test suite
- Transaction rollback after each test

### 2.3 WebSocket Tests

**Framework:** socket.io-client + Jest

**Scope:**
- Room join/leave events
- Gift broadcasting
- PK score updates
- Chat message delivery

### 2.4 Financial Tests

**Critical — 100% coverage required:**
- Wallet debit/credit atomicity
- Double-spend prevention (idempotency)
- Gift transaction flow (coins → diamonds)
- Withdrawal amount calculations
- Commission splits
- Concurrent transaction handling

---

## 3. Mobile Testing (Flutter)

### 3.1 Unit Tests

**Framework:** flutter_test

**Scope:**
- ViewModel/Bloc logic
- Repository layer
- Utility functions
- Design token validation

### 3.2 Widget Tests

**Scope:**
- Component rendering
- User interaction (tap, scroll)
- State changes
- Animation completion

### 3.3 Integration Tests

**Framework:** integration_test

**Critical flows:**
- Registration → Login → Home
- Join voice room → Send gift
- Start stream → Receive comments
- Purchase coins → Send gift
- Send message → Read receipt

---

## 4. Admin Panel Testing

### 4.1 Unit Tests

**Framework:** Vitest

**Scope:**
- Dashboard data formatting
- Permission checks
- Form validation

### 4.2 E2E Tests

**Framework:** Playwright

**Flows:**
- Admin login → User search → Suspend user
- Withdrawal queue → Approve/reject
- Gift catalog → Create gift
- Dashboard → Verify metrics display

---

## 5. Performance Testing

### 5.1 Load Testing

**Tool:** k6

| Scenario | Target |
|----------|--------|
| API endpoints | 10,000 RPS, p95 < 200ms |
| WebSocket connections | 50,000 concurrent |
| Gift sending | 1,000/second |
| Message throughput | 10,000/second |

### 5.2 Stress Testing

- Find breaking point for each service
- Verify graceful degradation
- Test auto-scaling triggers

### 5.3 Endurance Testing

- 24-hour sustained load at 70% capacity
- Memory leak detection
- Connection pool exhaustion tests

---

## 6. Security Testing

| Type | Tool | Frequency |
|------|------|-----------|
| SAST | SonarQube | Every PR |
| Dependency scan | Snyk/Dependabot | Daily |
| DAST | OWASP ZAP | Weekly (staging) |
| Penetration test | External firm | Quarterly |
| Container scan | Trivy | Every build |

---

## 7. CI/CD Test Pipeline

```yaml
# On every PR:
1. Lint (ESLint, Prettier, Flutter analyze)
2. Unit tests (Jest, flutter test)
3. Integration tests (API e2e)
4. Security scan (Snyk, Trivy)
5. Build verification

# On merge to develop:
6. Full integration test suite
7. Widget tests
8. Deploy to staging
9. E2E tests against staging
10. Load test (smoke)

# On release:
11. Full regression suite
12. Performance benchmarks
13. Security scan
14. Deploy to production
15. Smoke tests
```

---

## 8. Test Data Management

- **Factories:** `@faker-js/faker` for test data generation
- **Seeds:** Consistent seed data for integration tests
- **Fixtures:** JSON fixtures for API response validation
- **Cleanup:** Database reset between test suites

---

## 9. Related Documents

- [Technical Architecture](technical-architecture.md)
- [Production Launch Checklist](production-launch-checklist.md)
