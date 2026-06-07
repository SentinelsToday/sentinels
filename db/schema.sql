-- =====================================================================
-- Sentinels — InsForge Postgres schema (v1)
-- Generated from prisma/schema.prisma on 2026-06-07.
--
-- Apply via:
--   1. npx @insforge/cli login   (one-time)
--   2. npx @insforge/cli db push --file db/schema.sql
-- or paste into the InsForge SQL editor.
--
-- IDs are TEXT (cuid) to match what the Next.js code already generates;
-- if you prefer Postgres uuid_generate_v4(), swap DEFAULT clauses.
-- =====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------
-- Organization & multi-tenant
-- -------------------------------------------------------------

CREATE TABLE "Organization" (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  plan        TEXT NOT NULL DEFAULT 'free',
  maxRobots   INTEGER NOT NULL DEFAULT 10,
  maxFleets   INTEGER NOT NULL DEFAULT 1,
  ownerId     TEXT NOT NULL,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "OrgMember" (
  id        TEXT PRIMARY KEY,
  orgId     TEXT NOT NULL REFERENCES "Organization"(id) ON DELETE CASCADE,
  userId    TEXT NOT NULL,
  role      TEXT NOT NULL DEFAULT 'member',
  joinedAt  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (orgId, userId)
);
CREATE INDEX idx_orgmember_org ON "OrgMember"(orgId);

-- -------------------------------------------------------------
-- Users (mirrors InsForge auth.users one-to-one by id)
-- -------------------------------------------------------------

CREATE TABLE "User" (
  id        TEXT PRIMARY KEY,
  email     TEXT UNIQUE NOT NULL,
  name      TEXT,
  role      TEXT NOT NULL DEFAULT 'viewer',
  fleetId   TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- Fleet
-- -------------------------------------------------------------

CREATE TABLE "Fleet" (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  apiKey      TEXT UNIQUE NOT NULL,
  orgId       TEXT REFERENCES "Organization"(id) ON DELETE SET NULL,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_fleet_org ON "Fleet"(orgId);

-- -------------------------------------------------------------
-- Robot (core entity)
-- -------------------------------------------------------------

CREATE TABLE "Robot" (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  model               TEXT,
  serialNumber        TEXT UNIQUE NOT NULL,
  did                 TEXT UNIQUE NOT NULL,
  publicKey           TEXT NOT NULL,
  privateKey          TEXT NOT NULL,  -- TODO: encrypt with pgcrypto or KMS before prod
  publicKeyHex        TEXT NOT NULL,
  hardwareFingerprint TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'registered',
  trustScore          INTEGER NOT NULL DEFAULT 50,
  fleetId             TEXT REFERENCES "Fleet"(id) ON DELETE SET NULL,
  createdAt           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_robot_fleet ON "Robot"(fleetId);
CREATE INDEX idx_robot_status ON "Robot"(status);

-- -------------------------------------------------------------
-- Trust subsystem
-- -------------------------------------------------------------

CREATE TABLE "FirmwareRecord" (
  id           TEXT PRIMARY KEY,
  robotId      TEXT NOT NULL REFERENCES "Robot"(id) ON DELETE CASCADE,
  version      TEXT NOT NULL,
  hash         TEXT NOT NULL,
  signature    TEXT NOT NULL,
  verified     BOOLEAN NOT NULL DEFAULT FALSE,
  previousHash TEXT,
  createdAt    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_firmware_robot ON "FirmwareRecord"(robotId);

CREATE TABLE "TelemetryEvent" (
  id         TEXT PRIMARY KEY,
  robotId    TEXT NOT NULL REFERENCES "Robot"(id) ON DELETE CASCADE,
  eventType  TEXT NOT NULL,
  payload    JSONB NOT NULL,         -- upgrade from TEXT for query-ability
  hash       TEXT NOT NULL,
  signature  TEXT NOT NULL,
  verified   BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_telemetry_robot ON "TelemetryEvent"(robotId);
CREATE INDEX idx_telemetry_time ON "TelemetryEvent"(timestamp);
CREATE INDEX idx_telemetry_type ON "TelemetryEvent"(eventType);

CREATE TABLE "AuditLog" (
  id           TEXT PRIMARY KEY,
  robotId      TEXT NOT NULL REFERENCES "Robot"(id) ON DELETE CASCADE,
  action       TEXT NOT NULL,
  details      JSONB NOT NULL,
  hash         TEXT NOT NULL,
  previousHash TEXT,
  signature    TEXT NOT NULL,
  timestamp    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_robot ON "AuditLog"(robotId);
CREATE INDEX idx_audit_time ON "AuditLog"(timestamp);

-- -------------------------------------------------------------
-- Commands & OTA
-- -------------------------------------------------------------

CREATE TABLE "Command" (
  id          TEXT PRIMARY KEY,
  robotId     TEXT NOT NULL REFERENCES "Robot"(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  payload     JSONB,
  status      TEXT NOT NULL DEFAULT 'pending',
  issuedAt    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completedAt TIMESTAMPTZ
);
CREATE INDEX idx_command_robot ON "Command"(robotId);

CREATE TABLE "SoftwareUpdate" (
  id          TEXT PRIMARY KEY,
  robotId     TEXT NOT NULL REFERENCES "Robot"(id) ON DELETE CASCADE,
  version     TEXT NOT NULL,
  packageUrl  TEXT NOT NULL,
  packageHash TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending',
  scheduledAt TIMESTAMPTZ,
  startedAt   TIMESTAMPTZ,
  completedAt TIMESTAMPTZ,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_swupdate_robot ON "SoftwareUpdate"(robotId);

-- -------------------------------------------------------------
-- Wallet & transactions
-- -------------------------------------------------------------

CREATE TABLE "Wallet" (
  id          TEXT PRIMARY KEY,
  robotId     TEXT UNIQUE NOT NULL REFERENCES "Robot"(id) ON DELETE CASCADE,
  address     TEXT UNIQUE NOT NULL,
  balance     NUMERIC(20, 8) NOT NULL DEFAULT 0,
  permissions JSONB NOT NULL DEFAULT '["read"]'::jsonb,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Transaction" (
  id          TEXT PRIMARY KEY,
  fromRobotId TEXT NOT NULL REFERENCES "Robot"(id) ON DELETE RESTRICT,
  toRobotId   TEXT NOT NULL REFERENCES "Robot"(id) ON DELETE RESTRICT,
  amount      NUMERIC(20, 8) NOT NULL,
  type        TEXT NOT NULL DEFAULT 'transfer',
  status      TEXT NOT NULL DEFAULT 'pending',
  memo        TEXT,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completedAt TIMESTAMPTZ
);
CREATE INDEX idx_tx_from ON "Transaction"(fromRobotId);
CREATE INDEX idx_tx_to ON "Transaction"(toRobotId);

-- -------------------------------------------------------------
-- Webhooks & waitlist
-- -------------------------------------------------------------

CREATE TABLE "Webhook" (
  id        TEXT PRIMARY KEY,
  fleetId   TEXT NOT NULL REFERENCES "Fleet"(id) ON DELETE CASCADE,
  url       TEXT NOT NULL,
  secret    TEXT NOT NULL,
  events    JSONB NOT NULL DEFAULT '[]'::jsonb,
  active    BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_webhook_fleet ON "Webhook"(fleetId);

CREATE TABLE "WaitlistEntry" (
  id            TEXT PRIMARY KEY,
  walletAddress TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  createdAt     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_waitlist_email ON "WaitlistEntry"(email);

-- =====================================================================
-- Row Level Security (RLS) — InsForge enforces auth.uid() from JWT
-- =====================================================================
--
-- Strategy:
--   * Org-scoped tables (Fleet, Robot, Wallet, Webhook, Transaction,
--     FirmwareRecord, TelemetryEvent, AuditLog, Command, SoftwareUpdate):
--     readable by org members; writable by admins/operators only.
--   * AuditLog is append-only: no UPDATE/DELETE for anyone except a
--     service role.
--   * WaitlistEntry: anyone may INSERT (public form); only service role
--     can SELECT/UPDATE.
--   * Per-robot rows resolve org membership via Robot.fleetId -> Fleet.orgId
-- ---------------------------------------------------------------------

ALTER TABLE "Organization"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrgMember"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Fleet"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Robot"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FirmwareRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TelemetryEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Command"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SoftwareUpdate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Wallet"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Webhook"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WaitlistEntry"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"           ENABLE ROW LEVEL SECURITY;

-- helper: is the calling user a member of this org?
CREATE OR REPLACE FUNCTION is_org_member(target_org TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM "OrgMember"
    WHERE "OrgMember".orgId = target_org
      AND "OrgMember".userId = auth.uid()::text
  );
$$ LANGUAGE SQL STABLE;

-- helper: org id for a fleet
CREATE OR REPLACE FUNCTION fleet_org(target_fleet TEXT)
RETURNS TEXT AS $$
  SELECT orgId FROM "Fleet" WHERE id = target_fleet;
$$ LANGUAGE SQL STABLE;

-- helper: org id for a robot (via its fleet)
CREATE OR REPLACE FUNCTION robot_org(target_robot TEXT)
RETURNS TEXT AS $$
  SELECT f.orgId
  FROM "Robot" r
  JOIN "Fleet" f ON f.id = r.fleetId
  WHERE r.id = target_robot;
$$ LANGUAGE SQL STABLE;

-- Organization: members can read; only owners can update.
CREATE POLICY org_read   ON "Organization" FOR SELECT USING (is_org_member(id));
CREATE POLICY org_update ON "Organization" FOR UPDATE USING (ownerId = auth.uid()::text);

-- OrgMember: members can see fellow members.
CREATE POLICY orgmember_read ON "OrgMember" FOR SELECT USING (is_org_member(orgId));

-- Fleet: org members read, admins write (role enforced at app layer for now).
CREATE POLICY fleet_read  ON "Fleet" FOR SELECT USING (is_org_member(orgId));
CREATE POLICY fleet_write ON "Fleet" FOR ALL USING (is_org_member(orgId));

-- Robot: same as fleet.
CREATE POLICY robot_read  ON "Robot" FOR SELECT USING (is_org_member(fleet_org(fleetId)));
CREATE POLICY robot_write ON "Robot" FOR ALL USING (is_org_member(fleet_org(fleetId)));

-- Per-robot tables: scope through robot_org()
CREATE POLICY firmware_rw ON "FirmwareRecord" FOR ALL USING (is_org_member(robot_org(robotId)));
CREATE POLICY telemetry_rw ON "TelemetryEvent" FOR ALL USING (is_org_member(robot_org(robotId)));
CREATE POLICY command_rw ON "Command" FOR ALL USING (is_org_member(robot_org(robotId)));
CREATE POLICY swupdate_rw ON "SoftwareUpdate" FOR ALL USING (is_org_member(robot_org(robotId)));
CREATE POLICY wallet_rw ON "Wallet" FOR ALL USING (is_org_member(robot_org(robotId)));

-- AuditLog: append-only (no UPDATE/DELETE policies → blocked).
CREATE POLICY audit_read ON "AuditLog" FOR SELECT USING (is_org_member(robot_org(robotId)));
CREATE POLICY audit_insert ON "AuditLog" FOR INSERT WITH CHECK (is_org_member(robot_org(robotId)));

-- Transaction: visible to either side's org.
CREATE POLICY tx_read ON "Transaction" FOR SELECT USING (
  is_org_member(robot_org(fromRobotId)) OR is_org_member(robot_org(toRobotId))
);
CREATE POLICY tx_insert ON "Transaction" FOR INSERT WITH CHECK (
  is_org_member(robot_org(fromRobotId))
);

-- Webhook: by fleet's org.
CREATE POLICY webhook_rw ON "Webhook" FOR ALL USING (is_org_member(fleet_org(fleetId)));

-- WaitlistEntry: anyone can sign up; only service role can list.
CREATE POLICY waitlist_signup ON "WaitlistEntry" FOR INSERT WITH CHECK (TRUE);
-- No SELECT policy → reads require service role (bypasses RLS).

-- User: a user can read+update their own row.
CREATE POLICY user_self_read ON "User" FOR SELECT USING (id = auth.uid()::text);
CREATE POLICY user_self_update ON "User" FOR UPDATE USING (id = auth.uid()::text);
