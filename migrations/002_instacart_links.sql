CREATE TABLE IF NOT EXISTS instacart_links (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_hash CHAR(64) NOT NULL,
  destination_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT instacart_links_user_request_unique UNIQUE (user_id, request_hash)
);

CREATE INDEX IF NOT EXISTS instacart_links_user_expires_idx
  ON instacart_links(user_id, expires_at);
