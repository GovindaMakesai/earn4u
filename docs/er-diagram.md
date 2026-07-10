# Earn4U — Entity Relationship Diagrams

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Core Domain ER Diagram

```mermaid
erDiagram
    PROFILES ||--o| CREDENTIALS : has
    PROFILES ||--o{ OAUTH_PROVIDERS : has
    PROFILES ||--o{ SESSIONS : has
    PROFILES ||--o{ DEVICES : owns
    PROFILES ||--|| WALLETS : has
    PROFILES ||--o{ FOLLOWS : follows
    PROFILES ||--o{ ACHIEVEMENTS : earns
    PROFILES ||--o{ VIP_SUBSCRIPTIONS : subscribes

    WALLETS ||--o{ TRANSACTIONS : records

    PROFILES ||--o{ GIFT_EVENTS : sends
    PROFILES ||--o{ GIFT_EVENTS : receives
    GIFT_CATALOG ||--o{ GIFT_EVENTS : used_in

    PROFILES ||--o{ ROOMS : hosts
    ROOMS ||--o{ SEATS : contains
    ROOMS }o--|| THEMES : uses

    PROFILES ||--o{ STREAMS : hosts
    STREAMS ||--o{ STREAM_VIEWERS : has

    PROFILES ||--o{ PK_PARTICIPANTS : joins
    PK_BATTLES ||--o{ PK_PARTICIPANTS : contains

    PROFILES ||--o{ CONVERSATION_MEMBERS : joins
    CONVERSATIONS ||--o{ CONVERSATION_MEMBERS : has
    CONVERSATIONS ||--o{ MESSAGES : contains

    PROFILES ||--o{ WITHDRAWAL_REQUESTS : requests
    PROFILES ||--o| AGENCY_MEMBERS : belongs_to
    AGENCIES ||--o{ AGENCY_MEMBERS : has

    PROFILES {
        uuid id PK
        string username UK
        string display_name
        int vip_level
        int wealth_level
        int popularity_level
        enum role
        enum status
    }

    WALLETS {
        uuid id PK
        uuid user_id FK
        bigint coins_balance
        bigint diamonds_balance
        bigint reward_points_balance
    }

    TRANSACTIONS {
        uuid id PK
        uuid wallet_id FK
        enum type
        enum currency
        bigint amount
        enum category
    }
```

---

## 2. Authentication Domain

```mermaid
erDiagram
    PROFILES ||--|| CREDENTIALS : has
    PROFILES ||--o{ OAUTH_PROVIDERS : linked
    PROFILES ||--o{ SESSIONS : active
    PROFILES ||--o{ DEVICES : registered
    SESSIONS }o--|| DEVICES : on

    CREDENTIALS {
        uuid id PK
        uuid user_id FK
        string email UK
        string phone UK
        string password_hash
        boolean two_factor_enabled
    }

    OAUTH_PROVIDERS {
        uuid id PK
        uuid user_id FK
        enum provider
        string provider_user_id
    }

    SESSIONS {
        uuid id PK
        uuid user_id FK
        uuid device_id FK
        string refresh_token_hash
        timestamp expires_at
    }

    DEVICES {
        uuid id PK
        uuid user_id FK
        string device_fingerprint
        enum platform
        int trust_score
    }
```

---

## 3. Economy & Gifting Domain

```mermaid
erDiagram
    PROFILES ||--|| WALLETS : owns
    WALLETS ||--o{ TRANSACTIONS : ledger
    PROFILES ||--o{ GIFT_EVENTS : sends
    PROFILES ||--o{ GIFT_EVENTS : receives
    GIFT_CATALOG ||--o{ GIFT_EVENTS : instance
    COIN_PACKAGES ||--o{ PURCHASES : sold_as
    PROFILES ||--o{ PURCHASES : buys

    WALLETS {
        uuid id PK
        uuid user_id FK
        bigint coins_balance
        bigint diamonds_balance
        int version
    }

    TRANSACTIONS {
        uuid id PK
        uuid wallet_id FK
        enum currency
        bigint amount
        enum category
        string idempotency_key UK
    }

    GIFT_CATALOG {
        uuid id PK
        string name
        enum category
        int coin_price
        string animation_url
        int min_vip_level
    }

    GIFT_EVENTS {
        uuid id PK
        uuid gift_id FK
        uuid sender_id FK
        uuid receiver_id FK
        enum context_type
        uuid context_id
        int total_coins
        int diamonds_earned
    }

    COIN_PACKAGES {
        uuid id PK
        string name
        int coins_amount
        decimal price_usd
    }
```

---

## 4. Real-Time Entertainment Domain

```mermaid
erDiagram
    PROFILES ||--o{ ROOMS : hosts
    ROOMS ||--o{ SEATS : has
    ROOMS }o--o| THEMES : styled_with
    PROFILES ||--o{ STREAMS : broadcasts
    STREAMS ||--o{ STREAM_COMMENTS : has
    PK_BATTLES ||--o{ PK_PARTICIPANTS : includes
    PROFILES ||--o{ PK_PARTICIPANTS : competes

    ROOMS {
        uuid id PK
        uuid host_id FK
        string title
        enum type
        int max_seats
        enum status
        int listener_count
    }

    SEATS {
        uuid id PK
        uuid room_id FK
        int seat_number
        uuid user_id FK
        enum role
        boolean is_muted
    }

    STREAMS {
        uuid id PK
        uuid host_id FK
        enum type
        enum status
        int viewer_count
        string webrtc_room_id
    }

    PK_BATTLES {
        uuid id PK
        enum type
        enum status
        bigint total_score_a
        bigint total_score_b
        enum winner_side
    }

    PK_PARTICIPANTS {
        uuid id PK
        uuid battle_id FK
        uuid user_id FK
        enum side
        bigint score
    }
```

---

## 5. Messaging Domain

```mermaid
erDiagram
    CONVERSATIONS ||--o{ CONVERSATION_MEMBERS : has
    PROFILES ||--o{ CONVERSATION_MEMBERS : participates
    CONVERSATIONS ||--o{ MESSAGES : contains
    PROFILES ||--o{ MESSAGES : sends
    MESSAGES ||--o| MESSAGES : replies_to

    CONVERSATIONS {
        uuid id PK
        enum type
        string name
        timestamp last_message_at
    }

    CONVERSATION_MEMBERS {
        uuid conversation_id FK
        uuid user_id FK
        timestamp last_read_at
        boolean is_muted
    }

    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        enum type
        text content
        string media_url
        uuid reply_to_id FK
    }
```

---

## 6. Creator Economy Domain

```mermaid
erDiagram
    AGENCIES ||--o{ AGENCY_MEMBERS : employs
    PROFILES ||--o{ AGENCY_MEMBERS : works_at
    PROFILES ||--o{ WITHDRAWAL_REQUESTS : requests
    PROFILES ||--o{ CREATOR_EARNINGS : earns
    AGENCIES ||--o{ AGENCY_COMMISSIONS : receives

    AGENCIES {
        uuid id PK
        string name
        uuid owner_id FK
        decimal commission_rate
        enum status
    }

    AGENCY_MEMBERS {
        uuid id PK
        uuid agency_id FK
        uuid user_id FK
        enum role
        timestamp joined_at
    }

    WITHDRAWAL_REQUESTS {
        uuid id PK
        uuid user_id FK
        bigint amount_diamonds
        decimal amount_fiat
        enum method
        enum status
        int risk_score
    }

    CREATOR_EARNINGS {
        uuid id PK
        uuid user_id FK
        date period_start
        date period_end
        bigint total_diamonds
        decimal total_fiat
        enum status
    }
```

---

## 7. Admin & Moderation Domain

```mermaid
erDiagram
    PROFILES ||--o{ REPORTS : files
    PROFILES ||--o{ REPORTS : reported_in
    PROFILES ||--o{ BANS : receives
    PROFILES ||--o{ AUDIT_LOGS : performs
    PROFILES ||--o{ ADMIN_ROLES : assigned

    REPORTS {
        uuid id PK
        uuid reporter_id FK
        uuid reported_id FK
        enum context_type
        uuid context_id
        enum reason
        enum status
    }

    BANS {
        uuid id PK
        uuid user_id FK
        uuid banned_by FK
        enum type
        string reason
        timestamp expires_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK
        string action
        string entity_type
        uuid entity_id
        jsonb changes
        timestamp created_at
    }
```

---

## 8. Key Relationships Summary

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| Profile → Wallet | 1:1 | Every user has exactly one wallet |
| Profile → Credentials | 1:0..1 | OAuth-only users may lack credentials |
| Wallet → Transactions | 1:N | Immutable ledger entries |
| Profile → Follows | M:N | Self-referential through follows table |
| Room → Seats | 1:N | Fixed seat count per room |
| Battle → Participants | 1:N | 2–6 participants per battle |
| Conversation → Members | 1:N | 2–500 members per conversation |
| Agency → Members | 1:N | Hosts managed by agency |

---

## 9. Related Documents

- [Database Architecture](database-architecture.md)
- [API Specification](api-specification.md)
- [Technical Architecture](technical-architecture.md)
