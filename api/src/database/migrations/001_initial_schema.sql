-- Earn4U Initial Database Schema
-- Run against PostgreSQL 16+

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS economy;
CREATE SCHEMA IF NOT EXISTS gifts;
CREATE SCHEMA IF NOT EXISTS rooms;
CREATE SCHEMA IF NOT EXISTS streams;
CREATE SCHEMA IF NOT EXISTS pk;
CREATE SCHEMA IF NOT EXISTS messaging;
CREATE SCHEMA IF NOT EXISTS withdrawals;

-- Enums
CREATE TYPE users.user_role AS ENUM ('user','host','agency','coin_seller','moderator','admin','super_admin','owner');
CREATE TYPE users.user_status AS ENUM ('active','suspended','banned','deleted');
CREATE TYPE users.gender AS ENUM ('male','female','other','undisclosed');
CREATE TYPE users.verification_type AS ENUM ('identity','creator','agency');
CREATE TYPE economy.transaction_type AS ENUM ('credit','debit');
CREATE TYPE economy.currency AS ENUM ('coins','diamonds','reward_points');
CREATE TYPE economy.transaction_category AS ENUM ('purchase','gift_sent','gift_received','withdrawal','reward','commission','refund','admin_adjustment');
CREATE TYPE gifts.gift_category AS ENUM ('standard','premium','seasonal','event','vip');
CREATE TYPE gifts.gift_context_type AS ENUM ('stream','room','profile','pk_battle');

-- Users
CREATE TABLE users.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    country_code CHAR(2),
    language VARCHAR(5) DEFAULT 'en',
    gender users.gender DEFAULT 'undisclosed',
    date_of_birth DATE,
    is_verified BOOLEAN DEFAULT false,
    verification_type users.verification_type,
    vip_level INTEGER DEFAULT 0 CHECK (vip_level BETWEEN 0 AND 20),
    wealth_level INTEGER DEFAULT 0,
    popularity_level INTEGER DEFAULT 0,
    creator_level INTEGER DEFAULT 0,
    role users.user_role DEFAULT 'user',
    status users.user_status DEFAULT 'active',
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users.follows (
    follower_id UUID REFERENCES users.profiles(id),
    following_id UUID REFERENCES users.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- Auth
CREATE TABLE auth.users_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users.profiles(id),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.profiles(id),
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_id UUID,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.profiles(id),
    device_fingerprint VARCHAR(255) NOT NULL,
    device_name VARCHAR(100),
    platform VARCHAR(10) DEFAULT 'android',
    trust_score INTEGER DEFAULT 50,
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Economy
CREATE TABLE economy.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users.profiles(id),
    coins_balance BIGINT DEFAULT 0 CHECK (coins_balance >= 0),
    diamonds_balance BIGINT DEFAULT 0 CHECK (diamonds_balance >= 0),
    reward_points_balance BIGINT DEFAULT 0 CHECK (reward_points_balance >= 0),
    frozen_coins BIGINT DEFAULT 0,
    frozen_diamonds BIGINT DEFAULT 0,
    version INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE economy.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES economy.wallets(id),
    type economy.transaction_type NOT NULL,
    currency economy.currency NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    balance_after BIGINT NOT NULL,
    category economy.transaction_category NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    metadata JSONB DEFAULT '{}',
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE economy.coin_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    coins_amount INTEGER NOT NULL,
    bonus_coins INTEGER DEFAULT 0,
    price_usd DECIMAL(10,2) NOT NULL,
    platform VARCHAR(10) DEFAULT 'all',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- Gifts
CREATE TABLE gifts.catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category gifts.gift_category DEFAULT 'standard',
    coin_price INTEGER NOT NULL,
    animation_url VARCHAR(500) NOT NULL,
    sound_url VARCHAR(500),
    thumbnail_url VARCHAR(500) NOT NULL,
    min_vip_level INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE gifts.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_id UUID REFERENCES gifts.catalog(id),
    sender_id UUID REFERENCES users.profiles(id),
    receiver_id UUID REFERENCES users.profiles(id),
    context_type gifts.gift_context_type NOT NULL,
    context_id UUID NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_coins INTEGER NOT NULL,
    diamonds_earned INTEGER NOT NULL,
    combo_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_username ON users.profiles(username);
CREATE INDEX idx_profiles_status ON users.profiles(status, role);
CREATE INDEX idx_transactions_wallet ON economy.transactions(wallet_id, created_at DESC);
CREATE INDEX idx_gift_events_receiver ON gifts.events(receiver_id, created_at DESC);
CREATE INDEX idx_gift_events_context ON gifts.events(context_type, context_id);

-- Seed: Coin Packages
INSERT INTO economy.coin_packages (name, coins_amount, bonus_coins, price_usd, sort_order) VALUES
('Starter', 100, 0, 0.99, 1),
('Basic', 500, 50, 4.99, 2),
('Popular', 1200, 200, 9.99, 3),
('Premium', 3000, 600, 24.99, 4),
('Elite', 7000, 1500, 49.99, 5),
('Ultimate', 15000, 4000, 99.99, 6);

-- Seed: Gift Catalog
INSERT INTO gifts.catalog (name, slug, category, coin_price, animation_url, thumbnail_url, sort_order) VALUES
('Rose', 'rose', 'standard', 10, '/gifts/animations/rose.json', '/gifts/thumbs/rose.png', 1),
('Heart', 'heart', 'standard', 50, '/gifts/animations/heart.json', '/gifts/thumbs/heart.png', 2),
('Sports Car', 'sports-car', 'premium', 5000, '/gifts/animations/sports-car.json', '/gifts/thumbs/sports-car.png', 3),
('Hypercar', 'hypercar', 'premium', 15000, '/gifts/animations/hypercar.json', '/gifts/thumbs/hypercar.png', 4),
('Yacht', 'yacht', 'premium', 50000, '/gifts/animations/yacht.json', '/gifts/thumbs/yacht.png', 5),
('Castle', 'castle', 'premium', 100000, '/gifts/animations/castle.json', '/gifts/thumbs/castle.png', 6),
('Dragon', 'dragon', 'event', 200000, '/gifts/animations/dragon.json', '/gifts/thumbs/dragon.png', 7),
('Rocket', 'rocket', 'event', 500000, '/gifts/animations/rocket.json', '/gifts/thumbs/rocket.png', 8);
