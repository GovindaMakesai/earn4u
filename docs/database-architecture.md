# Earn4U — Database Architecture

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Overview

Earn4U uses **PostgreSQL 16** as the primary transactional database with **Redis** for caching/real-time state, **Elasticsearch** for search, and **AWS S3** for media blobs. All financial data follows **double-entry ledger** accounting principles.

---

## 2. Schema Organization

```
earn4u_db
├── auth          # Authentication, sessions, devices
├── users         # Profiles, levels, social graph
├── economy       # Wallets, transactions, coin packages
├── gifts         # Gift catalog, gift events
├── vip           # VIP tiers, subscriptions
├── rooms         # Voice rooms, seats, themes
├── streams       # Live streams, viewers, replays
├── pk            # PK battles, scores, rankings
├── messaging     # Conversations, messages
├── games         # Game sessions, tournaments
├── creators      # Creator earnings, agencies
├── withdrawals   # Payout requests, KYC
├── moderation    # Reports, bans, audit
├── admin         # System config, roles
└── analytics     # Aggregated metrics (materialized views)
```

---

## 3. Core Tables

### 3.1 Authentication Schema

#### `auth.users_credentials`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() |
| user_id | UUID | FK → users.profiles.id, UNIQUE |
| email | VARCHAR(255) | UNIQUE, nullable |
| phone | VARCHAR(20) | UNIQUE, nullable |
| password_hash | VARCHAR(255) | nullable (OAuth-only users) |
| email_verified | BOOLEAN | DEFAULT false |
| phone_verified | BOOLEAN | DEFAULT false |
| two_factor_enabled | BOOLEAN | DEFAULT false |
| two_factor_secret | VARCHAR(255) | encrypted, nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `auth.oauth_providers`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.profiles.id |
| provider | ENUM | google, apple, facebook |
| provider_user_id | VARCHAR(255) | |
| access_token | TEXT | encrypted |
| refresh_token | TEXT | encrypted, nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `auth.sessions`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK |
| refresh_token_hash | VARCHAR(255) | |
| device_id | UUID | FK → auth.devices.id |
| ip_address | INET | |
| user_agent | TEXT | |
| expires_at | TIMESTAMPTZ | |
| revoked_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `auth.devices`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK |
| device_fingerprint | VARCHAR(255) | |
| device_name | VARCHAR(100) | |
| platform | ENUM | ios, android, web |
| trust_score | INTEGER | DEFAULT 50 |
| last_active_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### 3.2 Users Schema

#### `users.profiles`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| username | VARCHAR(30) | UNIQUE, NOT NULL |
| display_name | VARCHAR(50) | NOT NULL |
| bio | TEXT | max 500 chars |
| avatar_url | VARCHAR(500) | nullable |
| cover_url | VARCHAR(500) | nullable |
| country_code | CHAR(2) | |
| language | VARCHAR(5) | DEFAULT 'en' |
| gender | ENUM | male, female, other, undisclosed |
| date_of_birth | DATE | nullable |
| is_verified | BOOLEAN | DEFAULT false |
| verification_type | ENUM | nullable: identity, creator, agency |
| vip_level | INTEGER | DEFAULT 0, CHECK 0-20 |
| wealth_level | INTEGER | DEFAULT 0 |
| popularity_level | INTEGER | DEFAULT 0 |
| creator_level | INTEGER | DEFAULT 0 |
| role | ENUM | user, host, agency, coin_seller, moderator, admin, super_admin, owner |
| status | ENUM | active, suspended, banned, deleted |
| follower_count | INTEGER | DEFAULT 0, denormalized |
| following_count | INTEGER | DEFAULT 0, denormalized |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `users.follows`
| Column | Type | Constraints |
|--------|------|-------------|
| follower_id | UUID | FK → profiles.id |
| following_id | UUID | FK → profiles.id |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| PRIMARY KEY | (follower_id, following_id) | |

#### `users.achievements`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK |
| achievement_code | VARCHAR(50) | |
| unlocked_at | TIMESTAMPTZ | DEFAULT NOW() |

### 3.3 Economy Schema

#### `economy.wallets`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → profiles.id, UNIQUE |
| coins_balance | BIGINT | DEFAULT 0, CHECK >= 0 |
| diamonds_balance | BIGINT | DEFAULT 0, CHECK >= 0 |
| reward_points_balance | BIGINT | DEFAULT 0, CHECK >= 0 |
| frozen_coins | BIGINT | DEFAULT 0 |
| frozen_diamonds | BIGINT | DEFAULT 0 |
| version | INTEGER | DEFAULT 0 (optimistic locking) |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `economy.transactions` (partitioned by month)
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| wallet_id | UUID | FK |
| type | ENUM | credit, debit |
| currency | ENUM | coins, diamonds, reward_points |
| amount | BIGINT | NOT NULL, CHECK > 0 |
| balance_after | BIGINT | NOT NULL |
| category | ENUM | purchase, gift_sent, gift_received, withdrawal, reward, commission, refund, admin_adjustment |
| reference_type | VARCHAR(50) | nullable (gift, stream, room, game, etc.) |
| reference_id | UUID | nullable |
| metadata | JSONB | DEFAULT '{}' |
| idempotency_key | VARCHAR(255) | UNIQUE |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `economy.coin_packages`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | |
| coins_amount | INTEGER | |
| bonus_coins | INTEGER | DEFAULT 0 |
| price_usd | DECIMAL(10,2) | |
| platform | ENUM | ios, android, web, all |
| is_active | BOOLEAN | DEFAULT true |
| sort_order | INTEGER | DEFAULT 0 |

### 3.4 Gifts Schema

#### `gifts.catalog`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | |
| slug | VARCHAR(100) | UNIQUE |
| category | ENUM | standard, premium, seasonal, event, vip |
| coin_price | INTEGER | |
| animation_url | VARCHAR(500) | |
| sound_url | VARCHAR(500) | nullable |
| thumbnail_url | VARCHAR(500) | |
| min_vip_level | INTEGER | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT true |
| sort_order | INTEGER | DEFAULT 0 |

#### `gifts.events` (partitioned by month)
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| gift_id | UUID | FK → catalog.id |
| sender_id | UUID | FK → profiles.id |
| receiver_id | UUID | FK → profiles.id |
| context_type | ENUM | stream, room, profile, pk_battle |
| context_id | UUID | |
| quantity | INTEGER | DEFAULT 1 |
| total_coins | INTEGER | |
| diamonds_earned | INTEGER | |
| combo_count | INTEGER | DEFAULT 1 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### 3.5 Voice Rooms Schema

#### `rooms.rooms`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| host_id | UUID | FK → profiles.id |
| title | VARCHAR(100) | |
| description | TEXT | nullable |
| type | ENUM | public, private, password |
| password_hash | VARCHAR(255) | nullable |
| max_seats | INTEGER | DEFAULT 8 |
| theme_id | UUID | FK → rooms.themes.id, nullable |
| status | ENUM | active, closed, suspended |
| listener_count | INTEGER | DEFAULT 0 |
| category | VARCHAR(50) | |
| tags | TEXT[] | |
| announcement | TEXT | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| closed_at | TIMESTAMPTZ | nullable |

#### `rooms.seats`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| room_id | UUID | FK |
| seat_number | INTEGER | |
| user_id | UUID | FK, nullable |
| role | ENUM | host, co_host, speaker, audience |
| is_muted | BOOLEAN | DEFAULT false |
| joined_at | TIMESTAMPTZ | nullable |

### 3.6 Live Streams Schema

#### `streams.streams`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| host_id | UUID | FK → profiles.id |
| title | VARCHAR(100) | |
| type | ENUM | video, audio |
| status | ENUM | preparing, live, ended, suspended |
| category | VARCHAR(50) | |
| tags | TEXT[] | |
| viewer_count | INTEGER | DEFAULT 0 |
| peak_viewers | INTEGER | DEFAULT 0 |
| total_gifts_coins | BIGINT | DEFAULT 0 |
| replay_url | VARCHAR(500) | nullable |
| webrtc_room_id | VARCHAR(100) | |
| started_at | TIMESTAMPTZ | nullable |
| ended_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### 3.7 PK Battles Schema

#### `pk.battles`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| type | ENUM | solo_1v1, team_2v2, team_3v3 |
| status | ENUM | pending, active, completed, cancelled |
| duration_seconds | INTEGER | DEFAULT 300 |
| winner_side | ENUM | nullable: side_a, side_b, draw |
| total_score_a | BIGINT | DEFAULT 0 |
| total_score_b | BIGINT | DEFAULT 0 |
| started_at | TIMESTAMPTZ | nullable |
| ended_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `pk.participants`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| battle_id | UUID | FK |
| user_id | UUID | FK |
| side | ENUM | side_a, side_b |
| score | BIGINT | DEFAULT 0 |
| gifts_received | INTEGER | DEFAULT 0 |

### 3.8 Messaging Schema

#### `messaging.conversations`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| type | ENUM | direct, group |
| name | VARCHAR(100) | nullable (groups) |
| avatar_url | VARCHAR(500) | nullable |
| created_by | UUID | FK |
| last_message_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `messaging.messages` (partitioned by month)
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| conversation_id | UUID | FK |
| sender_id | UUID | FK |
| type | ENUM | text, image, video, audio, sticker, system |
| content | TEXT | nullable |
| media_url | VARCHAR(500) | nullable |
| metadata | JSONB | DEFAULT '{}' |
| reply_to_id | UUID | FK, nullable |
| is_deleted | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### 3.9 Withdrawals Schema

#### `withdrawals.requests`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK |
| amount_diamonds | BIGINT | |
| amount_fiat | DECIMAL(12,2) | |
| currency | CHAR(3) | DEFAULT 'USD' |
| method | ENUM | bank_transfer, upi, paypal |
| status | ENUM | pending, under_review, approved, rejected, processing, completed, failed |
| risk_score | INTEGER | DEFAULT 0 |
| payment_details | JSONB | encrypted |
| reviewed_by | UUID | FK, nullable |
| reviewed_at | TIMESTAMPTZ | nullable |
| completed_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

## 4. Indexing Strategy

### 4.1 Critical Indexes

```sql
-- Users
CREATE INDEX idx_profiles_username ON users.profiles (username);
CREATE INDEX idx_profiles_status_role ON users.profiles (status, role);
CREATE INDEX idx_follows_following ON users.follows (following_id);

-- Economy
CREATE INDEX idx_transactions_wallet_created ON economy.transactions (wallet_id, created_at DESC);
CREATE INDEX idx_transactions_reference ON economy.transactions (reference_type, reference_id);

-- Gifts
CREATE INDEX idx_gift_events_receiver ON gifts.events (receiver_id, created_at DESC);
CREATE INDEX idx_gift_events_context ON gifts.events (context_type, context_id);

-- Rooms
CREATE INDEX idx_rooms_status_category ON rooms.rooms (status, category) WHERE status = 'active';

-- Streams
CREATE INDEX idx_streams_status ON streams.streams (status) WHERE status = 'live';

-- Messages
CREATE INDEX idx_messages_conversation ON messaging.messages (conversation_id, created_at DESC);

-- Withdrawals
CREATE INDEX idx_withdrawals_status ON withdrawals.requests (status) WHERE status IN ('pending', 'under_review');
```

### 4.2 Partitioning

```sql
-- Monthly partitions for high-volume tables
CREATE TABLE economy.transactions (...) PARTITION BY RANGE (created_at);
CREATE TABLE gifts.events (...) PARTITION BY RANGE (created_at);
CREATE TABLE messaging.messages (...) PARTITION BY RANGE (created_at);
```

---

## 5. Data Integrity Rules

1. **Wallet balances** updated only via stored procedures with optimistic locking
2. **Gift sending** is atomic: debit sender coins → credit receiver diamonds → record event
3. **Follow counts** updated via database triggers
4. **Soft deletes** for users (status = 'deleted'), hard deletes prohibited
5. **Audit trail** for all admin actions and financial mutations
6. **Idempotency keys** required for all financial API calls

---

## 6. Migration Strategy

- TypeORM migrations in `apps/api/src/database/migrations/`
- Sequential numbering: `001_initial_schema`, `002_add_vip_tables`, etc.
- Zero-downtime migrations: additive changes first, data backfill, then cleanup
- Rollback scripts for every migration

---

## 7. Related Documents

- [ER Diagrams](er-diagram.md)
- [API Specification](api-specification.md)
- [Technical Architecture](technical-architecture.md)
