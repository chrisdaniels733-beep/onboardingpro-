import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Coach } from '../lib/supabase';
import { getSubscription, getSubscriptionStatus } from '../lib/stripe';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [formData, setFormData] = useState({
    business_name: '',
    tagline: '',
    brand_color: '#1a2744',
    welcome_message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setCoach(data);
        setFormData({
          business_name: data.business_name,
          tagline: data.tagline || '',
          brand_color: data.brand_color || '#1a2744',
          welcome_message: data.welcome_message || '',
        });
      }

      const sub = await getSubscription();
      setSubscription(sub);
      setSubscriptionLoading(false);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!coach) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await supabase
      .from('coaches')
      .update(formData)
      .eq('id', coach.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('Settings saved successfully!');
      setCoach({ ...coach, ...formData });
      setTimeout(() => setSuccess(''), 3000);
    }

    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading settings...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Error Loading Settings</div>
          <button onClick={handleSignOut} className="text-blue-900 underline">Sign out and try again</button>
        </div>
      </div>
    );
  }

  const colors = [
    { name: 'Deep Blue', value: '#1a2744' },
    { name: 'Gold', value: '#c9a84c' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Teal', value: '#0891b2' },
    { name: 'Green', value: '#059669' },
    { name: 'Red', value: '#e11d48' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 fixed top-0 left-0 bottom-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Onboard<span className="text-yellow-600">Pro</span>
          </div>
          <div className="text-xs text-white/30 mt-1">Coach Dashboard</div>
        </div>

        <nav className="flex-1 py-4">
          <div className="px-6 text-xs font-bold uppercase tracking-widest text-white/25 mb-2">Main</div>
          <a href="/dashboard" className="flex items-center gap-3 px-6 py-3 text-white/50 hover:text-white/90 hover:bg-white/5 transition">
            <span>📊</span>
            <span className="font-medium">Overview</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-white/50 hover:text-white/90 hover:bg-white/5 transition">
            <span>🎨</span>
            <span className="font-medium">Portal Builder</span>
          </a>
          <div className="px-6 text-xs font-bold uppercase tracking-widest text-white/25 mt-6 mb-2">Settings</div>
          <a href="/settings" className="flex items-center gap-3 px-6 py-3 text-white/90 bg-yellow-600/10 border-l-2 border-yellow-600">
            <span>⚙️</span>
            <span className="font-medium">Settings</span>
          </a>
          <a href="/pricing" className="flex items-center gap-3 px-6 py-3 text-white/50 hover:text-white/90 hover:bg-white/5 transition">
            <span>💳</span>
            <span className="font-medium">Billing</span>
          </a>
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer" onClick={handleSignOut}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-600 to-blue-900 flex items-center justify-center text-white font-bold text-sm">
              {coach.business_name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white truncate">{coach.business_name}</div>
              <div className="text-xs text-white/40">Sign out</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-64 flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Customize your coaching portal</p>
        </header>

        <main className="p-8 max-w-4xl">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Business Information</h2>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                  placeholder="Sarah Lee Coaching"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                  placeholder="Business & Life Coach"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Brand Color</label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData({ ...formData, brand_color: color.value })}
                      className={`w-12 h-12 rounded-lg border-2 transition ${
                        formData.brand_color === color.value
                          ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400'
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Welcome Message</label>
                <textarea
                  value={formData.welcome_message}
                  onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition resize-none"
                  rows={5}
                  placeholder="Welcome message that appears on the client portal..."
                />
                <p className="text-sm text-gray-500 mt-2">This message will be displayed to clients on the first step of your portal.</p>
              </div>

              <div className="pt-6 border-t border-gray-200 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-900 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Subscription</h3>
            {subscriptionLoading ? (
              <div className="text-gray-600">Loading subscription information...</div>
            ) : subscription ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Current Plan:</span>
                  <span className="text-lg font-bold text-blue-900">{getSubscriptionStatus(subscription.plan_name)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
                {subscription.current_period_end && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Renews:</span>
                    <span className="text-gray-600">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-blue-200">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="text-blue-900 font-semibold hover:underline"
                  >
                    Change Plan →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-4">You don't have an active subscription yet.</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Start Free Trial
                </button>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Portal URL</h3>
            <div className="bg-white p-4 rounded-lg border border-yellow-200 font-mono text-sm text-gray-700">
              onboardpro.com/portal/{coach.portal_slug}
            </div>
            <p className="text-sm text-gray-600 mt-3">Share this link with clients to access your intake form.</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Danger Zone</h3>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
