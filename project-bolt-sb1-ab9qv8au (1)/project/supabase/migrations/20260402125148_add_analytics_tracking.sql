/*
  # Add Portal Analytics Tracking

  ## Overview
  This migration adds analytics tracking capability to the portal system.

  ## New Tables
  
  ### `portal_views`
  - `id` (uuid, primary key) - Unique view record
  - `coach_id` (uuid, foreign key) - References coaches table
  - `ip_address` (text, nullable) - Client IP address
  - `created_at` (timestamptz) - Timestamp of view
  
  ### `portal_session_analytics`
  - `id` (uuid, primary key) - Unique session identifier
  - `coach_id` (uuid, foreign key) - References coaches table
  - `session_id` (text) - Unique session identifier
  - `views_count` (int) - Number of pages viewed in session
  - `time_spent_minutes` (int) - Time spent on portal in minutes
  - `completed (boolean) - Whether user completed the form
  - `created_at` (timestamptz) - Session start time
  - `updated_at` (timestamptz) - Last activity time

  ## Security
  - Enable RLS on all analytics tables
  - Only coaches can view their own analytics
*/

CREATE TABLE IF NOT EXISTS portal_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portal_session_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  views_count int DEFAULT 0,
  time_spent_minutes int DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portal_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_session_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view own portal analytics"
  ON portal_views FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE POLICY "Anyone can insert portal views"
  ON portal_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Coaches can view own session analytics"
  ON portal_session_analytics FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE POLICY "Coaches can insert session analytics"
  ON portal_session_analytics FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE POLICY "Coaches can update session analytics"
  ON portal_session_analytics FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id))
  WITH CHECK (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE INDEX IF NOT EXISTS idx_portal_views_coach_id ON portal_views(coach_id);
CREATE INDEX IF NOT EXISTS idx_portal_views_created_at ON portal_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portal_session_analytics_coach_id ON portal_session_analytics(coach_id);
CREATE INDEX IF NOT EXISTS idx_portal_session_analytics_created_at ON portal_session_analytics(created_at DESC);