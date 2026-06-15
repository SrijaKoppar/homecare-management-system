-- =========================================================
-- Homecare Management System (HCMS) - PostgreSQL schema (DOWN)
-- Drops objects created by backend/database/schema.sql
-- =========================================================

BEGIN;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS care_note;
DROP TABLE IF EXISTS visit_note;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS conversation_participant;
DROP TABLE IF EXISTS conversation;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS care_plan;
DROP TABLE IF EXISTS assignment_24x7;
DROP TABLE IF EXISTS visit;
DROP TABLE IF EXISTS care_arrangement;
DROP TABLE IF EXISTS care_relationship;
DROP TABLE IF EXISTS membership;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS "user";

-- Drop helper function last
DROP FUNCTION IF EXISTS set_updated_at_now();

COMMIT;
