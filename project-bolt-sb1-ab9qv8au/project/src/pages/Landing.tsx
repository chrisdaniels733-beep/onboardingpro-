import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-5 bg-cream/95 backdrop-blur-sm border-b border-yellow-600/20">
        <div className="text-2xl font-bold text-blue-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Onboard<span className="text-yellow-600">Pro</span>
        </div>
        <Link
          to="/login"
          className="bg-blue-900 text-white px-5 py-2.5 rounded font-semibold hover:bg-blue-800 transition"
        >
          Sign In
        </Link>
      </nav>

      <section className="min-h-screen flex flex-col justify-center px-[5%] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-yellow-600/10 via-transparent to-blue-900/5 opacity-40" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-yellow-600/10 border border-yellow-600/30 text-yellow-800 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-8">
            Built exclusively for coaches & consultants
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8 text-blue-900" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.03em' }}>
            Wow Your Clients<br />From <em className="text-yellow-600">Day One</em>
          </h1>

          <p className="text-xl leading-relaxed text-gray-700 max-w-xl mb-10 font-light">
            Replace messy onboarding emails with a stunning, branded client portal. Set it up once. Let it run forever. Your clients will think you're a million-dollar operation.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              to="/signup"
              className="bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition shadow-lg inline-flex items-center gap-2"
            >
              Start Free 14-Day Trial →
            </Link>
            <a
              href="#features"
              className="border-2 border-blue-900/20 text-blue-900 px-8 py-4 rounded-lg text-lg font-medium hover:border-blue-900 hover:bg-blue-900/5 transition"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="px-[5%] py-24 bg-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">Everything You Need</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              One portal. Zero chaos.<br />Happy clients.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'Fully Branded Portal', desc: 'Upload your logo, set your colors, and add your welcome message. Your portal looks like you built it with a $50k design team.' },
              { icon: '📋', title: 'Smart Intake Forms', desc: 'Collect everything you need from day one. Goals, challenges, preferences — all in a clean form your clients actually enjoy filling out.' },
              { icon: '🗺️', title: 'Clear Next Steps', desc: 'Guide new clients through exactly what happens after they sign up. No confusion, no emails asking "what do I do now?"' },
              { icon: '📁', title: 'Resource Hub', desc: 'Share contracts, welcome guides, videos, and links all in one place. Your clients always know where to find everything.' },
              { icon: '🔗', title: 'Unique Shareable Link', desc: 'Every client gets your personal portal link. Share it via email, DM, or add it to your payment confirmation page.' },
              { icon: '📊', title: 'Client Analytics', desc: 'See exactly which clients have viewed and completed your portal. Know who needs a follow-up without guessing.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-yellow-600/30 transition">
                <div className="w-12 h-12 rounded-xl bg-yellow-600/15 flex items-center justify-center text-2xl mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] py-24 text-center bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-yellow-600/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">Get Started Today</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your next client deserves<br />a <em className="text-yellow-400">premium</em> experience
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Join 500+ coaches who've transformed their onboarding. Set up in 10 minutes. Free for 14 days.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-xl"
          >
            Start Your Free Trial →
          </Link>
          <p className="text-white/40 text-sm mt-6">
            No credit card required · Cancel anytime · Setup in 10 minutes
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 px-[5%] py-12 flex items-center justify-between flex-wrap gap-4">
        <div className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          Onboard<span className="text-yellow-600">Pro</span>
        </div>
        <div className="text-white/30 text-sm">
          © 2025 OnboardPro. All rights reserved.
        </div>
      </footer>

      <style>{`
        .bg-cream {
          background: #faf8f4;
        }
        .bg-gradient-radial {
          background: radial-gradient(ellipse 70% 60% at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 60%);
        }
      `}</style>
    </div>
  );
}
