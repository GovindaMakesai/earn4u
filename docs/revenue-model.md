# Earn4U — Revenue Model

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Revenue Overview

Earn4U generates revenue through **15 distinct monetization streams**, designed to maximize ARPPU while maintaining user satisfaction and creator retention.

**Projected Year 1 Revenue Mix:**

| Stream | % of Revenue | Est. Annual |
|--------|-------------|-------------|
| Coin purchases | 45% | $22.5M |
| Gift commissions | 20% | $10M |
| VIP subscriptions | 15% | $7.5M |
| Withdrawal fees | 5% | $2.5M |
| Agency commissions | 5% | $2.5M |
| Premium digital goods | 5% | $2.5M |
| Event/tournament fees | 3% | $1.5M |
| Promotional boosts | 2% | $1M |
| **Total** | **100%** | **$50M** |

---

## 2. Revenue Streams

### 2.1 Coin Purchases (Primary)

Users purchase coins with real money to spend on gifts, games, and premium items.

| Package | Coins | Bonus | Price (USD) | Margin |
|---------|-------|-------|-------------|--------|
| Starter | 100 | 0 | $0.99 | 30% |
| Basic | 500 | 50 | $4.99 | 35% |
| Popular | 1,200 | 200 | $9.99 | 40% |
| Premium | 3,000 | 600 | $24.99 | 42% |
| Elite | 7,000 | 1,500 | $49.99 | 45% |
| Ultimate | 15,000 | 4,000 | $99.99 | 48% |

**Payment channels:** Apple IAP (30% store fee), Google Play (30%), direct payment gateway (3% fee), coin sellers (20% margin to seller, platform keeps 80% of face value).

### 2.2 Gift Commissions

When a user sends a gift worth X coins:
- **60%** converted to diamonds for the receiver
- **30%** retained by platform as commission
- **10%** agency commission (if host belongs to agency)

Example: 10,000 coin yacht gift → 6,000 diamonds to creator, 3,000 coins platform revenue, 1,000 coins agency commission.

### 2.3 VIP Subscriptions

Monthly auto-renewing subscriptions:

| Tier | Level | Price/mo | Key Benefits |
|------|-------|----------|-------------|
| Bronze | 1–5 | $4.99 | Badge, basic frame |
| Silver | 6–10 | $9.99 | Entry effect, chat bubble |
| Gold | 11–15 | $19.99 | Exclusive gifts, enhanced visibility |
| Platinum | 16–20 | $49.99 | All benefits, exclusive rooms, priority support |

VIP can also be earned through cumulative spending (alternative to subscription).

### 2.4 Withdrawal Fees

Creators convert diamonds to fiat:

| Method | Fee | Min Withdrawal |
|--------|-----|----------------|
| Bank transfer | 5% | $50 |
| UPI | 3% | $10 |
| PayPal | 7% | $25 |

Diamond-to-USD rate: 100 diamonds = $0.60 (platform buys at wholesale).

### 2.5 Agency Commissions

Agencies earn **10%** of all gifts received by their managed hosts. Platform retains full gift commission; agency commission is deducted from creator's diamond share.

### 2.6 Premium Digital Goods

| Item | Price Range | Type |
|------|------------|------|
| Avatar frames | 500–50,000 coins | One-time |
| Chat bubbles | 300–10,000 coins | One-time |
| Entry effects | 1,000–100,000 coins | One-time |
| Room themes | 500–5,000 coins | One-time |
| Stickers packs | 200–2,000 coins | One-time |
| Profile backgrounds | 1,000–20,000 coins | One-time |

### 2.7 Event & Tournament Fees

- Tournament entry: 100–10,000 coins
- Event participation: 50–5,000 coins
- Platform retains 20% of prize pool as fee

### 2.8 Promotional Boosts

- Stream boost (1hr featured): 5,000 coins
- Room boost (1hr trending): 3,000 coins
- Profile boost (24hr visibility): 2,000 coins

---

## 3. Unit Economics

### 3.1 Per-User Metrics (Target)

| Metric | Value |
|--------|-------|
| CAC (Customer Acquisition Cost) | $2.50 |
| ARPPU (Avg Revenue Per Paying User) | $28/month |
| Paying user conversion | 8% of MAU |
| LTV (Lifetime Value) | $180 |
| LTV:CAC ratio | 72:1 |
| Creator retention (monthly) | 65% |
| Viewer retention (monthly) | 45% |

### 3.2 Per-Transaction Economics

| Transaction | Platform Take |
|------------|--------------|
| $10 coin purchase | $3.50–$7.00 (after store fees) |
| 10,000 coin gift | 3,000 coins ($3.00 equivalent) |
| $19.99 VIP subscription | $13.99 (after store fees) |
| $100 withdrawal | $5.00 fee + diamond spread |

---

## 4. Pricing Strategy

### 4.1 Geographic Pricing

- **Tier 1** (US, EU, JP): Full prices
- **Tier 2** (LATAM, SEA): 60–80% of Tier 1
- **Tier 3** (India, Africa): 30–50% of Tier 1, UPI priority

### 4.2 Dynamic Pricing

- First-purchase bonus: 2x coins
- Returning user offers: 20% bonus after 7-day absence
- Seasonal sales: 30% bonus during holidays
- VIP-exclusive packages

### 4.3 Anti-Abuse

- Daily purchase limits for new accounts
- Velocity checks on large purchases
- Refund policy: no coin refunds, VIP prorated
- Chargeback protection via receipt validation

---

## 5. Creator Payout Model

```
Gift Revenue Flow:
  User spends 10,000 coins on gift
  ├── 6,000 diamonds → Creator (60%)
  ├── 1,000 diamonds → Agency (10% of gift value)
  └── 3,000 coins worth → Platform (30%)

Creator Withdrawal:
  Creator has 60,000 diamonds
  ├── Converts at 100:$0.60 = $360 gross
  ├── 5% withdrawal fee = $18
  └── Net payout: $342
```

---

## 6. Financial Projections (Year 1)

| Quarter | MAU | Paying Users | Revenue |
|---------|-----|-------------|---------|
| Q1 | 500K | 25K | $3M |
| Q2 | 1.5M | 90K | $8M |
| Q3 | 3M | 210K | $15M |
| Q4 | 5M | 400K | $24M |

---

## 7. Related Documents

- [PRD](PRD.md)
- [Feature Roadmap](feature-roadmap.md)
- [Scaling Roadmap](scaling-roadmap.md)
