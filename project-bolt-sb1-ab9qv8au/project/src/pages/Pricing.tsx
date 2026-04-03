import { Link } from 'react-router-dom';
import { useState } from 'react';
import { createCheckoutSession, PLANS, PlanType } from '../lib/stripe';

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: PlanType) => {
    try {
      setLoading(plan);
      setError(null);
      await createCheckoutSession(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Onboard<span className="text-yellow-600">Pro</span>
        </Link>
        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="text-yellow-600 text-sm font-bold uppercase tracking-widest mb-4">Simple Pricing</div>
          <h1 className="text-5xl font-black text-blue-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Start free. Scale when ready.
          </h1>
          <p className="text-gray-600 text-lg">14-day free trial on all plans. No credit card required.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {(['starter', 'pro', 'elite'] as const).map((planKey) => {
            const plan = PLANS[planKey];
            const isPopular = planKey === 'pro';
            const price = plan.amount / 100;

            return (
              <div
                key={planKey}
                className={`rounded-2xl p-8 border-2 transition ${
                  isPopular
                    ? 'bg-blue-900 border-blue-900 shadow-2xl relative transform scale-105'
                    : 'bg-white border-gray-200 hover:border-blue-900 hover:shadow-xl'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-600 text-blue-900 text-xs font-black uppercase tracking-wider px-6 py-2 rounded-full">
                    Most Popular
                  </div>
                )}

                <div className={`text-sm font-bold uppercase tracking-wider mb-4 ${
                  isPopular ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {plan.name}
                </div>

                <div className={`text-5xl font-black mb-2 ${
                  isPopular ? 'text-white' : 'text-blue-900'
                }`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  ${price.toFixed(0)}
                </div>

                <div className={`mb-8 ${isPopular ? 'text-white/50' : 'text-gray-500'}`}>
                  per month
                </div>

                <ul className={`space-y-3 mb-8 ${isPopular ? 'text-white' : ''}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className={isPopular ? 'text-yellow-400 font-bold' : 'text-green-600 font-bold'}>
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(planKey)}
                  disabled={loading === planKey}
                  className={`w-full py-3 rounded-lg font-bold transition ${
                    isPopular
                      ? 'bg-yellow-600 text-blue-900 hover:bg-yellow-500 disabled:opacity-50'
                      : 'border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white disabled:opacity-50'
                  }`}
                >
                  {loading === planKey ? 'Processing...' : 'Start Free Trial'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Subscription Benefits</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your subscription includes:
            </p>
            <ul className="text-left text-sm text-gray-700 space-y-2 mb-4">
              <li>✓ Secure payment processing through Stripe</li>
              <li>✓ Automatic subscription management</li>
              <li>✓ Access to features based on your plan</li>
              <li>✓ Email receipt and invoice history</li>
            </ul>
            <p className="text-xs text-gray-600">
              No payment required during the 14-day trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
