import { Link } from 'react-router-dom';

export default function Pricing() {
  const handleSubscribe = (plan: string) => {
    alert(`Stripe integration for ${plan} plan will be added. This requires setting up Stripe secret keys.\n\nTo implement Stripe:\n1. Create a Stripe account at https://dashboard.stripe.com\n2. Get your Stripe secret key\n3. I'll help you set up Stripe edge functions\n\nFor now, this is a placeholder.`);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-900 hover:shadow-xl transition">
            <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Starter</div>
            <div className="text-5xl font-black text-blue-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>$29</div>
            <div className="text-gray-500 mb-8">per month</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>1 branded portal</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>Intake form builder</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>Up to 10 clients/month</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>Resource links</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('Starter')}
              className="w-full py-3 border-2 border-blue-900 text-blue-900 rounded-lg font-bold hover:bg-blue-900 hover:text-white transition"
            >
              Start Free Trial
            </button>
          </div>

          <div className="bg-blue-900 rounded-2xl p-8 border-2 border-blue-900 shadow-2xl relative transform scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-600 text-blue-900 text-xs font-black uppercase tracking-wider px-6 py-2 rounded-full">
              Most Popular
            </div>
            <div className="text-sm font-bold uppercase tracking-wider text-yellow-400 mb-4">Pro</div>
            <div className="text-5xl font-black text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>$49</div>
            <div className="text-white/50 mb-8">per month</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>3 branded portals</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Custom branding & colors</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Unlimited clients</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Client analytics</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Email notifications</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white">
                <span className="text-yellow-400 font-bold">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('Pro')}
              className="w-full py-3 bg-yellow-600 text-blue-900 rounded-lg font-bold hover:bg-yellow-500 transition"
            >
              Start Free Trial
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-900 hover:shadow-xl transition">
            <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Elite</div>
            <div className="text-5xl font-black text-blue-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>$79</div>
            <div className="text-gray-500 mb-8">per month</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>Unlimited portals</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>White label branding</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>Team member access</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>Zapier integrations</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>Custom domain</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span>1-on-1 onboarding call</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('Elite')}
              className="w-full py-3 border-2 border-blue-900 text-blue-900 rounded-lg font-bold hover:bg-blue-900 hover:text-white transition"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Stripe Integration Available</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              To enable paid subscriptions, you'll need to configure Stripe. I can help you set up:
            </p>
            <ul className="text-left text-sm text-gray-700 space-y-2 mb-6">
              <li>✓ Stripe customer creation</li>
              <li>✓ Subscription management</li>
              <li>✓ Webhook handling for payment events</li>
              <li>✓ Automatic access control based on subscription status</li>
            </ul>
            <div className="text-sm text-gray-600">
              For setup instructions, visit:{' '}
              <a
                href="https://bolt.new/setup/stripe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 font-semibold underline"
              >
                https://bolt.new/setup/stripe
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
