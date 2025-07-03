
import { useRef } from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { Footer } from '../components/landing/Footer';
import { ParticleTextEffect } from '../components/ParticleTextEffect';
import { CursorFollowButton } from '../components/CursorFollowButton';

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
              className={`absolute w-48 h-64 object-cover rounded-xl border-4 border-white/30 shadow-2xl opacity-30 ${
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
          
          {/* Gradient overlay to blend videos with background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-gray-50/60 to-gray-50/80"></div>
        </div>

        {/* Particle Text Effect */}
        <div className="relative z-10">
          <ParticleTextEffect words={["Collab", "Create", "Collect"]} />
        </div>
        
        <CursorFollowButton text="Join the Waitlist" containerRef={heroRef} />
      </section>
      
      {/* Content sections would go here */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Join Our Creator Community
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with brands, showcase your creativity, and monetize your influence. 
            Our platform empowers creators to build meaningful partnerships and grow their audience.
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CreatorsPage;
