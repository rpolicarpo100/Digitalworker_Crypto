-- GOD — Global Opportunity Detector Schema
-- PostgreSQL / Supabase Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Assets
CREATE TABLE IF NOT EXISTS assets (
    id VARCHAR(50) PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    chain VARCHAR(50) DEFAULT 'ethereum',
    contract_address VARCHAR(100),
    market_cap DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real Price Snapshots
CREATE TABLE IF NOT EXISTS prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id VARCHAR(50) REFERENCES assets(id),
    symbol VARCHAR(20) NOT NULL,
    price DECIMAL NOT NULL,
    source VARCHAR(50) NOT NULL,
    quality VARCHAR(20) NOT NULL,
    confidence VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OHLC Candles
CREATE TABLE IF NOT EXISTS candles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) NOT NULL,
    interval VARCHAR(10) NOT NULL,
    open_time BIGINT NOT NULL,
    close_time BIGINT NOT NULL,
    open DECIMAL NOT NULL,
    high DECIMAL NOT NULL,
    low DECIMAL NOT NULL,
    close DECIMAL NOT NULL,
    volume DECIMAL NOT NULL,
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(symbol, interval, open_time)
);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(20) NOT NULL,
    timeframe VARCHAR(20) NOT NULL,
    price DECIMAL NOT NULL,
    entry_conditions JSONB NOT NULL,
    confirmation_conditions JSONB NOT NULL,
    invalidation_conditions JSONB NOT NULL,
    exit_conditions JSONB NOT NULL,
    risk_conditions JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prices_symbol_created ON prices(symbol, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candles_symbol_time ON candles(symbol, interval, open_time DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_score ON opportunities(score DESC);
