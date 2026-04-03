import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, Coach } from '../lib/supabase';

export default function ClientPortal() {
  const { slug } = useParams<{ slug: string }>();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceLevel: '',
    referralSource: '',
    primaryGoal: '',
    biggestChallenge: '',
    visionFuture: '',
    commitmentScore: 0,
    additionalNotes: '',
  });

  useEffect(() => {
    const fetchCoach = async () => {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('portal_slug', slug)
        .maybeSingle();

      if (!error && data) {
        setCoach(data);

        await supabase.from('portal_views').insert({
          coach_id: data.id,
          ip_address: null,
        });
      }
      setLoading(false);
    };

    if (slug) {
      fetchCoach();
    }
  }, [slug]);

  const handleSubmit = async () => {
    if (!coach) return;

    const { error } = await supabase.from('client_responses').insert({
      coach_id: coach.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      experience_level: formData.experienceLevel || null,
      referral_source: formData.referralSource || null,
      primary_goal: formData.primaryGoal,
      biggest_challenge: formData.biggestChallenge,
      vision_future: formData.visionFuture || null,
      commitment_score: formData.commitmentScore || null,
      additional_notes: formData.additionalNotes || null,
      status: 'new',
    });

    if (!error) {
      await supabase.from('portal_session_analytics').insert({
        coach_id: coach.id,
        session_id: sessionId,
        views_count: currentStep,
        time_spent_minutes: 5,
        completed: true,
      });

      setSubmitted(true);
      setCurrentStep(5);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">Loading...</div>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Portal Not Found</div>
          <p className="text-gray-600">This coaching portal does not exist.</p>
        </div>
      </div>
    );
  }

  const progress = ((currentStep - 1) / 4) * 100;

  return (
    <div className="min-h-screen bg-cream">
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div className="h-full bg-yellow-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <header className="bg-blue-900 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-700 flex items-center justify-center text-white font-bold text-lg">
            {coach.business_name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-white text-lg">{coach.business_name}</div>
            <div className="text-xs text-white/50">{coach.tagline}</div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center py-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-600 to-blue-900 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
                {coach.business_name.substring(0, 2).toUpperCase()}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome, <em className="text-yellow-600">you're in<br />the right place.</em>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
                {coach.welcome_message}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-3">A note from {coach.business_name.split(' ')[0]}</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Before we dive in...</h3>
              <p className="text-gray-600 leading-relaxed">
                Every client I work with is unique. Your answers help me understand exactly where you are, what you want, and how I can best support you.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition shadow-lg"
            >
              Let's Get Started →
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-2">Step 1 of 3</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Tell me about yourself</h2>
              <p className="text-gray-600">Basic info so I know who I'm talking to.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Experience Level</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                >
                  <option value="">Select an option</option>
                  <option>Complete beginner — just starting out</option>
                  <option>Some experience — ready to level up</option>
                  <option>Intermediate — looking for a breakthrough</option>
                  <option>Advanced — optimizing at a high level</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:border-blue-900 hover:text-blue-900 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
                disabled={!formData.firstName || !formData.lastName || !formData.email}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-2">Step 2 of 3</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your goals & challenges</h2>
              <p className="text-gray-600">The more honest you are here, the better our coaching will be.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What is your #1 goal right now?</label>
                <textarea
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none resize-none"
                  rows={4}
                  placeholder="Be as specific as possible..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">What is your biggest challenge?</label>
                <textarea
                  value={formData.biggestChallenge}
                  onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none resize-none"
                  rows={4}
                  placeholder="What's been holding you back?"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">How committed are you (1-10)?</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFormData({ ...formData, commitmentScore: num })}
                      className={`w-12 h-12 rounded-lg border-2 font-semibold transition ${
                        formData.commitmentScore === num
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'border-gray-300 hover:border-blue-900'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:border-blue-900 hover:text-blue-900 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
                disabled={!formData.primaryGoal || !formData.biggestChallenge}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-2">Step 3 of 3 — Almost done!</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Final thoughts</h2>
              <p className="text-gray-600">Anything else you want to share?</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Additional Notes (optional)</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none resize-none"
                rows={4}
                placeholder="Anything I should know before our first session?"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-600 hover:border-blue-900 hover:text-blue-900 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
              >
                ✓ Submit & Complete Onboarding
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && submitted && (
          <div className="text-center space-y-8 animate-fadeIn py-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-5xl mx-auto shadow-lg">
              🎉
            </div>
            <h2 className="text-4xl font-bold text-blue-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>You're all set!</h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              Your onboarding is complete. {coach.business_name.split(' ')[0]} has been notified and will review your answers before your first session.
            </p>
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-left max-w-xl mx-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">A note from {coach.business_name.split(' ')[0]}</div>
              <p className="text-white text-lg italic leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "I'm so excited to work with you. I've read your answers and I already have some ideas I can't wait to share. See you on our first call!"
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bg-cream {
          background: #faf8f4;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease;
        }
      `}</style>
    </div>
  );
}
