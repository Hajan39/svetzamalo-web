-- Svet za malo — application database (Neon Postgres)
--
-- Run this once in the Neon SQL editor. Safe to re-run: everything is IF NOT
-- EXISTS. Amounts are stored in minor units (haléře) as integers so there is
-- no floating-point rounding on money.

CREATE TABLE IF NOT EXISTS leads (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT        NOT NULL,
  lead_type     TEXT        NOT NULL,
  source        TEXT,
  locale        TEXT        NOT NULL DEFAULT 'cs',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per address per magnet: re-submitting the same form must not create
-- duplicates, but the same person may take the ebook and the newsletter.
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_type_idx
  ON leads (lower(email), lead_type);

CREATE TABLE IF NOT EXISTS orders (
  id               BIGSERIAL PRIMARY KEY,
  email            TEXT        NOT NULL,
  full_name        TEXT        NOT NULL,
  product_code     TEXT        NOT NULL,
  amount_minor     INTEGER     NOT NULL,
  currency         TEXT        NOT NULL DEFAULT 'CZK',
  variable_symbol  TEXT        NOT NULL UNIQUE,
  payment_method   TEXT        NOT NULL,               -- bank_transfer | comgate
  status           TEXT        NOT NULL DEFAULT 'pending', -- pending | paid | cancelled
  locale           TEXT        NOT NULL DEFAULT 'cs',
  comgate_trans_id TEXT,
  download_token   TEXT UNIQUE,                        -- issued when paid
  note             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS orders_created_idx  ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx   ON orders (status);
CREATE INDEX IF NOT EXISTS orders_comgate_idx  ON orders (comgate_trans_id);

-- Append-only audit of what the gateway told us. Kept separate from orders so
-- a payment dispute can be reconstructed even after the order row changed.
CREATE TABLE IF NOT EXISTS payment_events (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT      REFERENCES orders (id) ON DELETE SET NULL,
  provider    TEXT        NOT NULL,
  event       TEXT        NOT NULL,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_events_order_idx ON payment_events (order_id, created_at DESC);
