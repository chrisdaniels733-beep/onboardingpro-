/*
  # Initial Schema for OnboardPro

  ## Overview
  This migration creates the core database structure for OnboardPro, a coaching client onboarding platform.

  ## New Tables
  
  ### `coaches`
  - `id` (uuid, primary key) - Links to auth.users
  - `business_name` (text) - Coach's business name
  - `tagline` (text) - Business tagline
  - `brand_color` (text) - Primary brand color hex code
  - `logo_url` (text, nullable) - URL to coach's logo
  - `welcome_message` (text) - Custom welcome message for clients
  - `portal_slug` (text, unique) - Unique URL slug for the portal
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `client_responses`
  - `id` (uuid, primary key) - Unique response identifier
  - `coach_id` (uuid, foreign key) - References coaches table
  - `first_name` (text) - Client's first name
  - `last_name` (text) - Client's last name
  - `email` (text) - Client's email address
  - `phone` (text, nullable) - Client's phone number
  - `experience_level` (text) - Client's experience level
  - `referral_source` (text, nullable) - How they found the coach
  - `primary_goal` (text) - Client's #1 goal
  - `biggest_challenge` (text) - Client's main challenge
  - `vision_future` (text, nullable) - 1-year vision
  - `commitment_score` (int) - Commitment level 1-10
  - `additional_notes` (text, nullable) - Any extra notes
  - `status` (text) - Response status (new, viewed, completed)
  - `created_at` (timestamptz) - Submission timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `subscriptions`
  - `id` (uuid, primary key) - Unique subscription identifier
  - `coach_id` (uuid, foreign key) - References coaches table
  - `stripe_customer_id` (text) - Stripe customer ID
  - `stripe_subscription_id` (text, nullable) - Stripe subscription ID
  - `plan_name` (text) - Plan name (starter, pro, elite)
  - `status` (text) - Subscription status (active, canceled, past_due)
  - `current_period_end` (timestamptz, nullable) - Subscription period end
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Coaches can only read/update their own data
  - Coaches can read client responses for their clients only
  - Clients can insert their own responses (no auth required for submission)
*/

-- Create coaches table
CREATE TABLE IF NOT EXISTS coaches (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL DEFAULT '',
  tagline text DEFAULT '',
  brand_color text DEFAULT '#1a2744',
  logo_url text,
  welcome_message text DEFAULT 'Welcome! I am excited to work with you.',
  portal_slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create client_responses table
CREATE TABLE IF NOT EXISTS client_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  experience_level text,
  referral_source text,
  primary_goal text NOT NULL,
  biggest_challenge text NOT NULL,
  vision_future text,
  commitment_score int CHECK (commitment_score >= 1 AND commitment_score <= 10),
  additional_notes text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  stripe_customer_id text NOT NULL,
  stripe_subscription_id text,
  plan_name text NOT NULL,
  status text DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Coaches policies
CREATE POLICY "Coaches can read own profile"
  ON coaches FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Coaches can update own profile"
  ON coaches FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Coaches can insert own profile"
  ON coaches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Client responses policies
CREATE POLICY "Coaches can read own client responses"
  ON client_responses FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE POLICY "Coaches can update own client responses"
  ON client_responses FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id))
  WITH CHECK (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE POLICY "Anyone can insert client responses"
  ON client_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Subscriptions policies
CREATE POLICY "Coaches can read own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE POLICY "Coaches can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

CREATE POLICY "Coaches can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id))
  WITH CHECK (coach_id IN (SELECT id FROM coaches WHERE auth.uid() = id));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_responses_coach_id ON client_responses(coach_id);
CREATE INDEX IF NOT EXISTS idx_client_responses_created_at ON client_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_coach_id ON subscriptions(coach_id);
CREATE INDEX IF NOT EXISTS idx_coaches_portal_slug ON coaches(portal_slug);