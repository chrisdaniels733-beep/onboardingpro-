import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Coach, ClientResponse } from '../lib/supabase';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [responses, setResponses] = useState<ClientResponse[]>([]);
  const [analytics, setAnalytics] = useState({ views: 0, sessions: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: coachData } = await supabase
        .from('coaches')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (coachData) {
        setCoach(coachData);

        const { data: responsesData } = await supabase
          .from('client_responses')
          .select('*')
          .eq('coach_id', coachData.id)
          .order('created_at', { ascending: false });

        if (responsesData) {
          setResponses(responsesData);
        }

        const { data: viewsData } = await supabase
          .from('portal_views')
          .select('*')
          .eq('coach_id', coachData.id);

        const { data: sessionsData } = await supabase
          .from('portal_session_analytics')
          .select('*')
          .eq('coach_id', coachData.id);

        const completedCount = responsesData?.filter((r) => r.status === 'completed').length || 0;
        const completionRate = responsesData && responsesData.length > 0
          ? Math.round((completedCount / responsesData.length) * 100)
          : 0;

        setAnalytics({
          views: viewsData?.length || 0,
          sessions: sessionsData?.length || 0,
          completionRate,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const copyPortalLink = () => {
    if (coach) {
      const link = `${window.location.origin}/portal/${coach.portal_slug}`;
      navigator.clipboard.writeText(link);
      alert('Portal link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</div>
          <p className="text-gray-600 mb-4">Unable to load your coach profile.</p>
          <button onClick={handleSignOut} className="text-blue-900 underline">Sign out and try again</button>
        </div>
      </div>
    );
  }

  const newResponses = responses.filter((r) => r.status === 'new');

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
          <a href="/dashboard" className="flex items-center gap-3 px-6 py-3 text-white/90 bg-yellow-600/10 border-l-2 border-yellow-600">
            <span>📊</span>
            <span className="font-medium">Overview</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-white/50 hover:text-white/90 hover:bg-white/5 transition">
            <span>🎨</span>
            <span className="font-medium">Portal Builder</span>
          </a>
          <div className="px-6 text-xs font-bold uppercase tracking-widest text-white/25 mt-6 mb-2">Settings</div>
          <Link to="/settings" className="flex items-center gap-3 px-6 py-3 text-white/50 hover:text-white/90 hover:bg-white/5 transition">
            <span>⚙️</span>
            <span className="font-medium">Settings</span>
          </Link>
          <Link to="/pricing" className="flex items-center gap-3 px-6 py-3 text-white/50 hover:text-white/90 hover:bg-white/5 transition">
            <span>💳</span>
            <span className="font-medium">Billing</span>
          </Link>
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
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Welcome back, {coach.business_name.split(' ')[0]}!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyPortalLink}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition text-sm"
            >
              🔗 Copy Portal Link
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 border-t-4 border-t-blue-900">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Total Clients</div>
              <div className="text-3xl font-bold text-blue-900">{responses.length}</div>
              <div className="text-xs text-green-600 mt-2">↑ {newResponses.length} new</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 border-t-4 border-t-yellow-600">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Portal Views</div>
              <div className="text-3xl font-bold text-blue-900">{analytics.views}</div>
              <div className="text-xs text-gray-400 mt-2">Total page views</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 border-t-4 border-t-green-600">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Completion Rate</div>
              <div className="text-3xl font-bold text-blue-900">{analytics.completionRate}%</div>
              <div className="text-xs text-green-600 mt-2">↑ Excellent</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 border-t-4 border-t-purple-600">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Portal URL</div>
              <div className="text-sm font-mono text-blue-900 truncate">{coach.portal_slug}</div>
              <div className="text-xs text-gray-400 mt-2">Your unique link</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Client Responses</h2>
                <p className="text-sm text-gray-500">View and manage client intake submissions</p>
              </div>
            </div>

            {responses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No client responses yet</h3>
                <p className="text-gray-600 mb-6">Share your portal link to start receiving client submissions.</p>
                <button
                  onClick={copyPortalLink}
                  className="px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Copy Portal Link
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {responses.map((response) => (
                  <details key={response.id} className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {response.first_name[0]}{response.last_name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {response.first_name} {response.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{response.email}</div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(response.created_at).toLocaleDateString()}
                        </div>
                        {response.status === 'new' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 bg-gray-50 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Phone</div>
                          <div className="text-sm text-gray-900">{response.phone || 'Not provided'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Experience Level</div>
                          <div className="text-sm text-gray-900">{response.experience_level || 'Not provided'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Referral Source</div>
                          <div className="text-sm text-gray-900">{response.referral_source || 'Not provided'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Commitment Score</div>
                          <div className="text-sm text-gray-900">{response.commitment_score ? `${response.commitment_score}/10` : 'Not provided'}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Primary Goal</div>
                        <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200">{response.primary_goal}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Biggest Challenge</div>
                        <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200">{response.biggest_challenge}</div>
                      </div>
                      {response.vision_future && (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Vision for Future</div>
                          <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200">{response.vision_future}</div>
                        </div>
                      )}
                      {response.additional_notes && (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Additional Notes</div>
                          <div className="text-sm text-gray-900 bg-white p-4 rounded-lg border border-gray-200">{response.additional_notes}</div>
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
