import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Coach = {
  id: string;
  business_name: string;
  tagline: string;
  brand_color: string;
  logo_url: string | null;
  welcome_message: string;
  portal_slug: string;
  created_at: string;
  updated_at: string;
};

export type ClientResponse = {
  id: string;
  coach_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  experience_level: string | null;
  referral_source: string | null;
  primary_goal: string;
  biggest_challenge: string;
  vision_future: string | null;
  commitment_score: number | null;
  additional_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  coach_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan_name: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};
