
import { useRef } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { Footer } from '../components/landing/Footer';
import { ParticleTextEffect } from '../components/ParticleTextEffect';
import { CursorFollowButton } from '../components/CursorFollowButton';
import { CreatorJourneyTimeline } from '../components/CreatorJourneyTimeline';
import WaitlistComponent from '../components/ui/waiting-list';

const CreatorsPage = () => {
  const heroRef = useRef<HTMLElement>(null);

  // Background videos from the carousel
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
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      
      {/* Hero Section with Particle Text Effect and Background Videos */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Background Videos */}
        <div className="absolute inset-0 z-20">
          {backgroundVideos.map((video, index) => (
            <video
              key={index}
              className={`absolute w-48 h-64 object-cover rounded-xl border-4 border-white/30 shadow-2xl opacity-30 md:opacity-30 opacity-10 ${
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

        {/* Particle Text Effect */}
        <div className="relative z-10 md:opacity-100 opacity-90">
          <ParticleTextEffect words={["Collab", "Create", "Collect"]} />
        </div>
        
        {/* Desktop cursor follow button */}
        <div className="hidden md:block">
          <CursorFollowButton text="Join the Waitlist" containerRef={heroRef} />
        </div>
        
        {/* Mobile fixed button */}
        <div className="md:hidden fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <CursorFollowButton text="Join the Waitlist" />
        </div>
      </section>

      {/* Creator Journey Timeline Section */}
      <CreatorJourneyTimeline />
      
      {/* Waitlist Section */}
      <div id="waitlist-section">
        <WaitlistComponent 
          title="Join the Creator Revolution"
          subtitle="Be among the first creators to experience the future of brand partnerships. Get early access to exclusive campaigns, better rates, and innovative collaboration tools."
          placeholder="Enter your email address"
          buttonText={{
            idle: "Join Creator Waitlist",
            loading: "Joining...",
            success: "Welcome aboard!",
          }}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default CreatorsPage;
