import { supabase } from './supabase';

export type PlanType = 'starter' | 'pro' | 'elite';

export interface Plan {
  name: string;
  priceId: string;
  amount: number;
  features: string[];
}

export const PLANS: Record<PlanType, Plan> = {
  starter: {
    name: 'Starter',
    priceId: 'price_1THTRNAk8koYNeTJ7R9clRCY',
    amount: 2900,
    features: [
      '1 branded portal',
      'Intake form builder',
      'Up to 10 clients/month',
      'Resource links'
    ]
  },
  pro: {
    name: 'Pro',
    priceId: 'price_1TI8B9Ak8koYNeTJnMiEYVgr',
    amount: 4900,
    features: [
      '3 branded portals',
      'Custom branding & colors',
      'Unlimited clients',
      'Client analytics',
      'Email notifications',
      'Priority support'
    ]
  },
  elite: {
    name: 'Elite',
    priceId: 'price_1TI8B9Ak8koYNeTJnMiEYVgr',
    amount: 7900,
    features: [
      'Unlimited portals',
      'White label branding',
      'Team member access',
      'Zapier integrations',
      'Custom domain',
      '1-on-1 onboarding call'
    ]
  }
};

export async function createCheckoutSession(plan: PlanType) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plan, trialDays: 14 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const { url } = await response.json();

  if (url) {
    window.location.href = url;
  }
}

export async function getSubscription() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('coach_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export function getSubscriptionStatus(plan: string | null): string {
  if (!plan) return 'No active subscription';

  const planData = PLANS[plan as PlanType];
  return planData ? `${planData.name} Plan` : 'Unknown Plan';
}
