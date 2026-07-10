# Earn4U — Security Architecture

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Security Layers

```
┌─────────────────────────────────────────────┐
│  Layer 1: Edge Security (WAF, DDoS, TLS)    │
├─────────────────────────────────────────────┤
│  Layer 2: Application Security (Auth, RBAC) │
├─────────────────────────────────────────────┤
│  Layer 3: Data Security (Encryption, Audit) │
├─────────────────────────────────────────────┤
│  Layer 4: Infrastructure Security (K8s, IAM)│
├─────────────────────────────────────────────┤
│  Layer 5: Monitoring & Response (SIEM)      │
└─────────────────────────────────────────────┘
```

---

## 2. Authentication Security

### 2.1 Token Strategy

| Token | Algorithm | Expiry | Storage |
|-------|-----------|--------|---------|
| Access Token | RS256 (JWT) | 15 minutes | Client memory |
| Refresh Token | Opaque (UUID) | 30 days | Redis + HttpOnly cookie |
| WebRTC Token | HS256 (JWT) | 1 hour | Client memory |

- Token rotation on every refresh (old token invalidated)
- Maximum 5 concurrent sessions per user
- Device fingerprint binding on token issuance

### 2.2 Password Policy

- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special char
- bcrypt hashing with cost factor 12
- Password breach check via HaveIBeenPwned API
- Account lockout after 5 failed attempts (15 min cooldown)

### 2.3 OAuth Security

- State parameter validation for CSRF prevention
- ID token signature verification
- Nonce validation for Apple Sign-In
- Scope limitation (email, profile only)

---

## 3. Authorization (RBAC)

### 3.1 Role Hierarchy

```
owner (128) > super_admin (64) > admin (32) > agency (16) > host (8) > coin_seller (4) > moderator (2) > user (1)
```

### 3.2 Permission Enforcement

- NestJS `@Roles()` decorator + `RolesGuard`
- Permission bitmask checked at guard level
- Resource-level authorization (user can only edit own profile)
- Admin actions require audit log entry

### 3.3 API Key Security (Coin Sellers)

- Scoped API keys with rate limits
- IP whitelist enforcement
- Key rotation every 90 days

---

## 4. Data Protection

### 4.1 Encryption at Rest

| Data Type | Method | Key Management |
|-----------|--------|---------------|
| Passwords | bcrypt (cost 12) | N/A |
| PII (phone, email) | AES-256-GCM | AWS KMS |
| Payment details | AES-256-GCM | AWS KMS |
| OAuth tokens | AES-256-GCM | AWS KMS |
| KYC documents | AES-256-GCM | AWS KMS (separate key) |

### 4.2 Encryption in Transit

- TLS 1.3 enforced on all endpoints
- Certificate pinning in mobile app
- WebRTC media encrypted via DTLS-SRTP

### 4.3 Data Classification

| Class | Examples | Retention | Access |
|-------|----------|-----------|--------|
| Public | Username, avatar, bio | Indefinite | Anyone |
| Internal | Wallet balance, VIP level | Account lifetime | Owner + admin |
| Confidential | Email, phone, payment info | Account lifetime + 7yr | Owner + authorized admin |
| Restricted | KYC docs, audit logs | 7 years | Super admin only |

---

## 5. Financial Security

### 5.1 Transaction Integrity

- Double-entry ledger (every debit has matching credit)
- Optimistic locking on wallet updates (version column)
- Idempotency keys prevent duplicate transactions
- All financial mutations in database transactions
- Daily reconciliation job compares ledger vs balances

### 5.2 Fraud Detection

| Signal | Weight | Action |
|--------|--------|--------|
| New account large purchase | High | Block + review |
| Rapid gift sending pattern | High | Rate limit + alert |
| Multiple accounts same device | Medium | Flag for review |
| Unusual withdrawal pattern | High | Manual review |
| VPN/proxy detected | Low | Reduce trust score |
| Chargeback history | Critical | Ban account |

### 5.3 Payment Security

- Apple/Google receipt validation server-side
- PCI DSS compliance via Stripe/payment gateway (no card data stored)
- 3D Secure for web payments
- Refund policy enforcement

---

## 6. Application Security

### 6.1 Input Validation

- class-validator on all DTOs
- SQL injection prevention via parameterized queries (TypeORM)
- XSS prevention via output encoding
- File upload validation (type, size, virus scan)
- Request body size limits (1MB default, 50MB for media)

### 6.2 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 10 | 1 min per IP |
| OTP send | 3 | 5 min per phone |
| API general | 100 | 1 min per user |
| Gift send | 30 | 1 min per user |
| Message send | 60 | 1 min per user |
| File upload | 10 | 1 min per user |
| Admin actions | 50 | 1 min per admin |

Implementation: Redis sliding window counter.

### 6.3 Anti-Spam & Anti-Bot

- Device fingerprinting (FingerprintJS)
- CAPTCHA on registration (hCaptcha)
- Behavioral analysis for bot detection
- Message spam filtering (keyword + ML)
- Room/stream creation limits for new accounts

---

## 7. Infrastructure Security

### 7.1 Kubernetes Security

- Network policies (pod-to-pod isolation)
- Pod security standards (restricted)
- Secrets via AWS Secrets Manager (not K8s secrets)
- RBAC for K8s API access
- Image scanning in CI/CD (Trivy)

### 7.2 AWS Security

- VPC with private subnets for databases
- Security groups with least-privilege
- IAM roles (no long-lived credentials)
- S3 bucket policies (no public access)
- CloudTrail for API audit
- AWS WAF with managed rule sets

---

## 8. Audit & Compliance

### 8.1 Audit Logging

All mutations logged with:
- Actor ID and role
- Action type
- Entity type and ID
- Before/after state (JSON diff)
- IP address and user agent
- Timestamp

Retention: 7 years in Elasticsearch.

### 8.2 Compliance Targets

| Standard | Status | Timeline |
|----------|--------|----------|
| GDPR | Required | Launch |
| CCPA | Required | Launch |
| PCI DSS | Via Stripe | Launch |
| SOC 2 Type II | Target | Month 12 |
| COPPA (age gates) | Required | Launch |

---

## 9. Incident Response

| Severity | Response Time | Escalation |
|----------|--------------|------------|
| P0 (data breach) | 15 min | CTO + Legal |
| P1 (service down) | 30 min | On-call engineer |
| P2 (degraded) | 2 hours | Team lead |
| P3 (minor) | 24 hours | Assigned engineer |

---

## 10. Related Documents

- [Technical Architecture](technical-architecture.md)
- [API Specification](api-specification.md)
- [Production Launch Checklist](production-launch-checklist.md)
