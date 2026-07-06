import { useRef, useState } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { Footer } from '../components/landing/Footer';
import { ParticleTextEffect } from '../components/ParticleTextEffect';
import { CursorFollowButton } from '../components/CursorFollowButton';
import { CreatorJourneyTimeline } from '../components/CreatorJourneyTimeline';
import { CreatorContactForm } from '../components/CreatorContactForm';
import { toast } from 'sonner';
import { ArrowUpRight, Sparkle } from 'lucide-react';
import { supabase } from '../lib/supabase';

/* ─── Inline Waitlist Section ────────────────────────────────────────────── */
function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist_submissions')
        .insert({ email: email.trim(), source: 'creators_page' });

      if (error) {
        console.error('Waitlist insert error:', error);
        toast.error('Failed to join. Please try again.');
      } else {
        toast.success("Welcome aboard! We'll be in touch soon.");
        setEmail('');
      }
    } catch (err) {
      console.error('Waitlist submission error:', err);
      toast.error('Failed to join. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <section id="waitlist-section" className="px-3 py-4 md:px-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#030303] px-6 py-16 text-white md:px-12 md:py-24 border border-zinc-800/80">

        {/* Left Gold Circles */}
        <svg className="absolute -left-16 -top-16 h-72 w-72 md:h-[28rem] md:w-[28rem] pointer-events-none select-none z-0" viewBox="0 0 400 400" fill="none">
          <circle cx="0" cy="0" r="140" stroke="url(#wl-gold-left)" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="200" stroke="url(#wl-gold-left)" strokeWidth="2" />
          <circle cx="0" cy="0" r="260" stroke="url(#wl-gold-left)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="wl-gold-left" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#EAB308" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#A16207" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Right Gold Circles */}
        <svg className="absolute -right-16 -bottom-16 h-72 w-72 md:h-[28rem] md:w-[28rem] pointer-events-none select-none z-0" viewBox="0 0 400 400" fill="none">
          <circle cx="400" cy="400" r="140" stroke="url(#wl-gold-right)" strokeWidth="2.5" />
          <circle cx="400" cy="400" r="200" stroke="url(#wl-gold-right)" strokeWidth="2" />
          <circle cx="400" cy="400" r="260" stroke="url(#wl-gold-right)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="wl-gold-right" x1="400" y1="400" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#EAB308" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#A16207" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 mb-8">
            <Sparkle className="size-3.5 fill-[#d2fc15] text-[#d2fc15]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Creator Waitlist
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-sans font-bold text-white text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.05] tracking-tight mb-5">
            Join the Creator<br />
            <span className="text-[#d2fc15]">Revolution</span>
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10 font-sans">
            Be among the first creators to experience the future of brand partnerships.
            Early access to exclusive campaigns, better rates, and innovative collaboration tools.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={loading}
              className="flex-1 w-full rounded-full border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-600 transition-colors font-sans"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#0d0d0f] hover:bg-[#131316] hover:border-zinc-700 px-6 py-3 text-sm font-medium text-[#f4f4f5] transition-all whitespace-nowrap font-sans disabled:opacity-60"
            >
              {loading ? 'Joining...' : 'Join Creator Waitlist'}
              <ArrowUpRight className="size-4 text-zinc-400" />
            </button>
          </form>

          {/* Social proof hint */}
          <p className="mt-6 text-xs text-zinc-600 font-sans">
            No spam. Unsubscribe anytime. Join 2,000+ creators already waiting.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
const CreatorsPage = () => {
  const heroRef = useRef<HTMLElement>(null);

  const backgroundVideos = [
    {
      url: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/vibha_2s.mp4',
      poster: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/vibha_frame.png'
    },
    {
      url: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/mayankIngle_2s.mp4',
      poster: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/mayankIngle_frame.png'
    },
    {
      url: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/shortenedVideos/shefaliThapa_2s.mp4',
      poster: 'https://oneimpressionproductioncrm.s3.ap-south-1.amazonaws.com/AmplifyLanding/conceptinsta/extractedFrames/shefaliThapa_frame.png'
    }
  ];

  return (
    <div className="theme-landing min-h-screen bg-[#f4f6f7] text-[#18181b] font-sans">
      <LandingHeader />
      
      {/* Hero Section — untouched */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 z-20">
          {backgroundVideos.map((video, index) => (
            <video
              key={index}
              className={`absolute w-48 h-64 object-cover rounded-xl border-4 border-white/30 shadow-2xl md:opacity-30 opacity-10 ${
                index === 0 ? 'top-24 left-8 rotate-12' : 
                index === 1 ? 'top-40 right-12 -rotate-6' : 
                'bottom-32 left-16 rotate-3'
              }`}
              poster={video.poster}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
            >
              <source src={video.url} type="video/mp4" />
            </video>
          ))}
        </div>
        <div className="relative z-10 md:opacity-100 opacity-100">
          <ParticleTextEffect words={["Collab", "Create", "Collect"]} />
        </div>
        <div className="hidden md:block">
          <CursorFollowButton text="Join the Waitlist" containerRef={heroRef} />
        </div>
        <div className="md:hidden fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <CursorFollowButton text="Join the Waitlist" />
        </div>
      </section>

      {/* Creator Journey — now a standalone section with its own bg-panel card */}
      <CreatorJourneyTimeline />

      {/* Waitlist Section */}
      <WaitlistSection />
      
      {/* Creator Contact Section */}
      <CreatorContactForm />
      
      <Footer />
    </div>
  );
};

export default CreatorsPage;
