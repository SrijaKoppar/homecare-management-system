-- =========================================================
-- Homecare Management System (HCMS) - PostgreSQL schema (DDL)
-- Generated from backend/database/entities/*.py
-- =========================================================

BEGIN;

-- UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- updated_at auto-touch (DB-level)
CREATE OR REPLACE FUNCTION set_updated_at_now()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------
-- user
-- -----------------------------
CREATE TABLE IF NOT EXISTS "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  email varchar(255) NOT NULL,
  password_hash varchar(255),
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  display_name varchar(150),
  phone varchar(50),
  phone_secondary varchar(50),
  avatar_url varchar(500),
  timezone varchar(50) NOT NULL DEFAULT 'UTC',
  locale varchar(10) NOT NULL DEFAULT 'en-US',
  mfa_enabled boolean NOT NULL DEFAULT false,
  status varchar(20) NOT NULL DEFAULT 'active',
  last_login_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS ix_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS ix_user_status ON "user"(status);

CREATE TRIGGER trg_user_set_updated_at
BEFORE UPDATE ON "user"
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- organization
-- -----------------------------
CREATE TABLE IF NOT EXISTS organization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  name varchar(200) NOT NULL,
  type varchar(20) NOT NULL,
  slug varchar(100) UNIQUE,
  logo_url varchar(500),
  primary_phone varchar(50),
  primary_email varchar(255),
  address_street varchar(200),
  address_city varchar(100),
  address_region varchar(100),
  address_postal_code varchar(20),
  address_country varchar(2),
  timezone varchar(50) NOT NULL DEFAULT 'UTC',
  settings jsonb,
  status varchar(20) NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS ix_organization_type ON organization(type);
CREATE INDEX IF NOT EXISTS ix_organization_status ON organization(status);

CREATE TRIGGER trg_organization_set_updated_at
BEFORE UPDATE ON organization
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- location
-- -----------------------------
CREATE TABLE IF NOT EXISTS location (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  name varchar(200) NOT NULL,
  address_street varchar(200),
  address_city varchar(100),
  address_region varchar(100),
  address_postal_code varchar(20),
  address_country varchar(2),
  timezone varchar(50),
  is_default boolean NOT NULL DEFAULT false
);

CREATE TRIGGER trg_location_set_updated_at
BEFORE UPDATE ON location
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- membership
-- -----------------------------
CREATE TABLE IF NOT EXISTS membership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  role varchar(30) NOT NULL,
  title varchar(100),
  location_id uuid REFERENCES location(id) ON DELETE SET NULL,
  status varchar(20) NOT NULL DEFAULT 'active',
  joined_at timestamptz NOT NULL DEFAULT now(),
  invited_at timestamptz,
  invited_by_id uuid REFERENCES "user"(id) ON DELETE SET NULL,

  CONSTRAINT uq_membership_user_org UNIQUE (user_id, organization_id)
);

CREATE TRIGGER trg_membership_set_updated_at
BEFORE UPDATE ON membership
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- care_relationship
-- -----------------------------
CREATE TABLE IF NOT EXISTS care_relationship (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  care_recipient_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  related_user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  role varchar(30) NOT NULL,
  is_24x7_caregiver boolean NOT NULL DEFAULT false,
  start_date date,
  end_date date,
  notes varchar(500),
  status varchar(20) NOT NULL DEFAULT 'active'
);

CREATE TRIGGER trg_care_relationship_set_updated_at
BEFORE UPDATE ON care_relationship
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- care_arrangement
-- -----------------------------
CREATE TABLE IF NOT EXISTS care_arrangement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  care_recipient_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  mode varchar(30) NOT NULL,
  effective_from date NOT NULL,
  effective_to date,
  notes varchar(500)
);

CREATE TRIGGER trg_care_arrangement_set_updated_at
BEFORE UPDATE ON care_arrangement
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- visit
-- -----------------------------
CREATE TABLE IF NOT EXISTS visit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  care_recipient_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  assigned_caregiver_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  visit_type varchar(30) NOT NULL,
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  timezone varchar(50),
  address_street varchar(200),
  address_city varchar(100),
  address_region varchar(100),
  address_postal_code varchar(20),
  address_country varchar(2),
  recurrence_rule varchar(500),
  parent_visit_id uuid REFERENCES visit(id) ON DELETE SET NULL,
  status varchar(20) NOT NULL DEFAULT 'scheduled',
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  notes varchar(2000),
  created_by_id uuid REFERENCES "user"(id) ON DELETE SET NULL
);

CREATE TRIGGER trg_visit_set_updated_at
BEFORE UPDATE ON visit
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- assignment_24x7
-- -----------------------------
CREATE TABLE IF NOT EXISTS assignment_24x7 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  care_recipient_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date,
  start_time time,
  end_time time,
  type varchar(20) NOT NULL DEFAULT 'primary',
  notes varchar(500),
  status varchar(20) NOT NULL DEFAULT 'active',
  created_by_id uuid REFERENCES "user"(id) ON DELETE SET NULL
);

CREATE TRIGGER trg_assignment_24x7_set_updated_at
BEFORE UPDATE ON assignment_24x7
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- care_plan
-- -----------------------------
CREATE TABLE IF NOT EXISTS care_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  care_recipient_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name varchar(200) NOT NULL,
  goals text,
  focus_areas jsonb,
  template_id uuid,
  effective_from date NOT NULL,
  effective_to date,
  status varchar(20) NOT NULL DEFAULT 'active',
  created_by_id uuid REFERENCES "user"(id) ON DELETE SET NULL
);

CREATE TRIGGER trg_care_plan_set_updated_at
BEFORE UPDATE ON care_plan
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- task
-- -----------------------------
CREATE TABLE IF NOT EXISTS task (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  care_recipient_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  care_plan_id uuid REFERENCES care_plan(id) ON DELETE SET NULL,
  visit_id uuid REFERENCES visit(id) ON DELETE CASCADE,
  assignment_24x7_id uuid REFERENCES assignment_24x7(id) ON DELETE CASCADE,
  task_date date NOT NULL,
  title varchar(200) NOT NULL,
  description varchar(1000),
  category varchar(30),
  frequency varchar(50),
  status varchar(20) NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  completed_by_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  notes varchar(500),
  sort_order integer
);

CREATE TRIGGER trg_task_set_updated_at
BEFORE UPDATE ON task
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- conversation
-- -----------------------------
CREATE TABLE IF NOT EXISTS conversation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  care_recipient_id uuid REFERENCES "user"(id) ON DELETE CASCADE,
  title varchar(200),
  type varchar(20) NOT NULL
);

CREATE TRIGGER trg_conversation_set_updated_at
BEFORE UPDATE ON conversation
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- conversation_participant
-- -----------------------------
CREATE TABLE IF NOT EXISTS conversation_participant (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role varchar(20) NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_conversation_participant UNIQUE (conversation_id, user_id)
);

-- -----------------------------
-- message
-- -----------------------------
CREATE TABLE IF NOT EXISTS message (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  body text NOT NULL,
  attachments jsonb,
  status varchar(20) NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------
-- visit_note
-- -----------------------------
CREATE TABLE IF NOT EXISTS visit_note (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  visit_id uuid NOT NULL UNIQUE REFERENCES visit(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  summary varchar(2000),
  mood varchar(100),
  incidents varchar(1000),
  next_steps varchar(500)
);

CREATE TRIGGER trg_visit_note_set_updated_at
BEFORE UPDATE ON visit_note
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

-- -----------------------------
-- care_note
-- -----------------------------
CREATE TABLE IF NOT EXISTS care_note (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  care_recipient_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  assignment_24x7_id uuid REFERENCES assignment_24x7(id) ON DELETE SET NULL,
  author_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  note_date date NOT NULL,
  summary varchar(2000),
  mood varchar(100),
  next_steps varchar(500)
);

CREATE TRIGGER trg_care_note_set_updated_at
BEFORE UPDATE ON care_note
FOR EACH ROW EXECUTE FUNCTION set_updated_at_now();

COMMIT;
