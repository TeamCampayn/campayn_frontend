
import { LandingHeader } from '../components/landing/LandingHeader';
import { Footer } from '../components/landing/Footer';
import { ParticleTextEffect } from '../components/ParticleTextEffect';
import { CursorFollowButton } from '../components/CursorFollowButton';

const CreatorsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      
      {/* Hero Section with Particle Text Effect */}
      <section className="relative">
        <ParticleTextEffect words={["Collab", "Create", "Collect"]} />
        <CursorFollowButton text="Join the Waitlist" />
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
