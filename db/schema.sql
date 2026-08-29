-- Svet za malo — application database (Neon Postgres)
--
-- Run this once in the Neon SQL editor. Safe to re-run: everything is
-- IF NOT EXISTS.
--
-- Tables are prefixed shop_ on purpose. An unprefixed "orders" turned out to
-- already exist in this database from an unrelated system, and
-- CREATE TABLE IF NOT EXISTS silently adopted it: the app then read a table
-- with none of its columns, which surfaced as "NaN Kč" rows in /admin. A
-- prefix keeps this schema from ever colliding with anything else living here.
--
-- Amounts are stored in minor units (haléře) as integers so there is no
-- floating-point rounding on money.

CREATE TABLE IF NOT EXISTS shop_leads (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT        NOT NULL,
  lead_type     TEXT        NOT NULL,
  source        TEXT,
  locale        TEXT        NOT NULL DEFAULT 'cs',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per address per magnet: re-submitting the same form must not create
-- duplicates, but the same person may take the ebook and the newsletter.
CREATE UNIQUE INDEX IF NOT EXISTS shop_leads_email_type_idx
  ON shop_leads (lower(email), lead_type);

CREATE TABLE IF NOT EXISTS shop_orders (
  id               BIGSERIAL PRIMARY KEY,
  email            TEXT        NOT NULL,
  full_name        TEXT        NOT NULL,
  product_code     TEXT        NOT NULL,
  amount_minor     INTEGER     NOT NULL,
  currency         TEXT        NOT NULL DEFAULT 'CZK',
  variable_symbol  TEXT        NOT NULL UNIQUE,
  payment_method   TEXT        NOT NULL,                   -- bank_transfer | comgate
  status           TEXT        NOT NULL DEFAULT 'pending', -- pending | paid | cancelled
  locale           TEXT        NOT NULL DEFAULT 'cs',
  comgate_trans_id TEXT,
  download_token   TEXT UNIQUE,                            -- issued when paid
  note             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS shop_orders_created_idx ON shop_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS shop_orders_status_idx  ON shop_orders (status);
CREATE INDEX IF NOT EXISTS shop_orders_comgate_idx ON shop_orders (comgate_trans_id);

-- Append-only audit of what the gateway told us. Kept separate from orders so
-- a payment dispute can be reconstructed even after the order row changed.
CREATE TABLE IF NOT EXISTS shop_payment_events (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT      REFERENCES shop_orders (id) ON DELETE SET NULL,
  provider    TEXT        NOT NULL,
  event       TEXT        NOT NULL,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shop_payment_events_order_idx
  ON shop_payment_events (order_id, created_at DESC);

-- Admin login tokens: one-time e-mail links and the sessions they produce.
-- Only hashes are stored, so a leaked row cannot be replayed as a login.
CREATE TABLE IF NOT EXISTS shop_admin_tokens (
  token_hash  TEXT        PRIMARY KEY,
  email       TEXT        NOT NULL,
  kind        TEXT        NOT NULL,          -- login | session
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shop_admin_tokens_expiry_idx
  ON shop_admin_tokens (expires_at);

-- Ebook downloads. Deliberately holds no IP or user agent: the question is how
-- many downloads happened, and storing more than that would make this personal
-- data for no analytical gain.
CREATE TABLE IF NOT EXISTS shop_downloads (
  id          BIGSERIAL   PRIMARY KEY,
  kind        TEXT        NOT NULL,          -- free | paid
  order_id    BIGINT      REFERENCES shop_orders (id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shop_downloads_created_idx
  ON shop_downloads (kind, created_at DESC);
