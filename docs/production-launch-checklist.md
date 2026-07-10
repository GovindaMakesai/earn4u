# Earn4U — Production Launch Checklist

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Infrastructure Readiness

### AWS Environment
- [ ] Production VPC with public/private subnets (3 AZs)
- [ ] EKS cluster provisioned and configured
- [ ] RDS PostgreSQL Multi-AZ instance
- [ ] ElastiCache Redis cluster mode
- [ ] MSK Kafka cluster
- [ ] OpenSearch domain
- [ ] S3 buckets with cross-region replication
- [ ] CloudFront distribution configured
- [ ] Route 53 DNS records
- [ ] ACM SSL certificates
- [ ] AWS WAF rules configured
- [ ] IAM roles and policies (least privilege)

### Kubernetes
- [ ] Namespaces created (api, media, workers, monitoring)
- [ ] NGINX Ingress Controller deployed
- [ ] Cert-manager for TLS automation
- [ ] HPA policies configured
- [ ] Resource limits and requests set
- [ ] Network policies applied
- [ ] Secrets via AWS Secrets Manager

### Monitoring
- [ ] Prometheus deployed and scraping
- [ ] Grafana dashboards configured
- [ ] Sentry DSN configured (API + mobile + admin)
- [ ] PagerDuty/Opsgenie alerting
- [ ] CloudWatch alarms
- [ ] Log aggregation (Fluentd → CloudWatch/OpenSearch)

---

## 2. Application Readiness

### Backend API
- [ ] All P0 endpoints implemented and tested
- [ ] Database migrations applied
- [ ] Seed data loaded (gift catalog, VIP tiers, coin packages)
- [ ] Rate limiting configured
- [ ] CORS configured for production domains
- [ ] Health check endpoints (/health, /ready)
- [ ] Graceful shutdown handling
- [ ] Environment variables in Secrets Manager

### Mobile App
- [ ] iOS build submitted to App Store Connect
- [ ] Android build submitted to Google Play Console
- [ ] App Store screenshots and metadata
- [ ] Play Store screenshots and metadata
- [ ] IAP products configured (coin packages, VIP)
- [ ] Push notification certificates
- [ ] Deep linking configured
- [ ] Crash reporting (Sentry) verified

### Admin Panel
- [ ] Deployed to production URL
- [ ] Admin accounts created with proper roles
- [ ] SSL certificate active
- [ ] Authentication flow tested

---

## 3. Security Checklist

- [ ] Penetration test completed and findings resolved
- [ ] OWASP Top 10 review passed
- [ ] All secrets rotated from development values
- [ ] TLS 1.3 enforced everywhere
- [ ] WAF rules active (SQL injection, XSS, rate limiting)
- [ ] Database encryption at rest enabled
- [ ] S3 bucket policies verified (no public access)
- [ ] Audit logging active
- [ ] GDPR data deletion flow tested
- [ ] Age verification gates in place

---

## 4. Financial Readiness

- [ ] Payment gateway production credentials
- [ ] Apple IAP production agreements signed
- [ ] Google Play billing configured
- [ ] Coin packages and pricing finalized
- [ ] VIP subscription products created
- [ ] Withdrawal methods tested end-to-end
- [ ] Financial reconciliation job running
- [ ] Fraud detection rules active
- [ ] Tax compliance reviewed

---

## 5. Content & Legal

- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Community Guidelines published
- [ ] DMCA agent registered
- [ ] Age rating obtained (App Store / Play Store)
- [ ] Content moderation policies documented
- [ ] Moderator team trained
- [ ] Report escalation procedures defined

---

## 6. Operational Readiness

- [ ] On-call rotation established
- [ ] Incident response playbook documented
- [ ] Runbooks for common issues
- [ ] Disaster recovery tested (failover drill)
- [ ] Backup restoration tested
- [ ] Customer support channels ready
- [ ] Status page configured (e.g., status.earn4u.com)
- [ ] Communication plan for launch

---

## 7. Launch Day Protocol

### T-24 hours
- [ ] Final staging verification
- [ ] Database backup taken
- [ ] Team briefing
- [ ] Rollback plan confirmed

### T-1 hour
- [ ] Deploy production release
- [ ] Smoke tests pass
- [ ] Monitoring dashboards green
- [ ] Support team on standby

### T-0 (Launch)
- [ ] Enable app store availability
- [ ] DNS cutover (if applicable)
- [ ] Social media announcements
- [ ] Monitor error rates and latency

### T+1 hour
- [ ] Review error logs
- [ ] Check payment processing
- [ ] Verify real-time features
- [ ] User feedback monitoring

### T+24 hours
- [ ] Post-launch retrospective scheduled
- [ ] Performance metrics review
- [ ] User acquisition metrics
- [ ] Bug triage and hotfix plan

---

## 8. Rollback Criteria

Immediate rollback if:
- Error rate > 5% for 5 minutes
- API p95 latency > 2 seconds
- Payment processing failures > 1%
- Data integrity issue detected
- Security breach detected

---

## 9. Related Documents

- [Scaling Roadmap](scaling-roadmap.md)
- [Security Architecture](security-architecture.md)
- [Testing Strategy](testing-strategy.md)
