CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  oidc_issuer TEXT NOT NULL,
  oidc_subject TEXT NOT NULL,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_oidc_identity_unique UNIQUE (oidc_issuer, oidc_subject)
);

CREATE TABLE IF NOT EXISTS sessions (
  id_hash CHAR(64) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token_ciphertext TEXT,
  refresh_token_ciphertext TEXT,
  id_token_ciphertext TEXT,
  provider_expires_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS oidc_login_attempts (
  id_hash CHAR(64) PRIMARY KEY,
  state_hash CHAR(64) NOT NULL,
  pkce_verifier_ciphertext TEXT NOT NULL,
  nonce TEXT NOT NULL,
  return_to TEXT NOT NULL DEFAULT '/',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT oidc_login_attempts_state_unique UNIQUE (state_hash)
);
CREATE INDEX IF NOT EXISTS oidc_login_attempts_expires_at_idx ON oidc_login_attempts(expires_at);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'trialing',
  trial_started_at TIMESTAMPTZ NOT NULL,
  trial_ends_at TIMESTAMPTZ NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  pending_checkout_session_id TEXT UNIQUE,
  pending_checkout_expires_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT subscriptions_status_check CHECK (
    status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')
  )
);
CREATE INDEX IF NOT EXISTS subscriptions_user_status_idx ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS subscriptions_customer_idx ON subscriptions(stripe_customer_id);

CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_workspaces (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  version BIGINT NOT NULL DEFAULT 1,
  document JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS user_workspaces_user_version_idx ON user_workspaces(user_id, version);

CREATE TABLE IF NOT EXISTS user_recipes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  story TEXT NOT NULL DEFAULT '',
  ingredients JSONB NOT NULL,
  method JSONB NOT NULL,
  serves INTEGER NOT NULL,
  minutes INTEGER NOT NULL,
  forked_from TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_recipes_serves_check CHECK (serves BETWEEN 1 AND 50),
  CONSTRAINT user_recipes_minutes_check CHECK (minutes BETWEEN 1 AND 2000)
);
CREATE INDEX IF NOT EXISTS user_recipes_user_id_idx ON user_recipes(user_id);
CREATE INDEX IF NOT EXISTS user_recipes_user_id_id_idx ON user_recipes(user_id, id);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor TEXT NOT NULL,
  destination_host TEXT NOT NULL,
  item_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT affiliate_clicks_vendor_check CHECK (vendor IN ('amazon', 'walmart', 'instacart')),
  CONSTRAINT affiliate_clicks_item_count_check CHECK (item_count BETWEEN 1 AND 1000)
);
CREATE INDEX IF NOT EXISTS affiliate_clicks_user_id_created_idx ON affiliate_clicks(user_id, created_at DESC);
