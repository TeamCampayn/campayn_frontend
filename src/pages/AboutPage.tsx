import { LandingHeader } from '../components/landing/LandingHeader';
import { Footer } from '../components/landing/Footer';
import { AboutHero } from '../components/about/AboutHero';
import { AboutJourney } from '../components/about/AboutJourney';

const AboutPage = () => {
  return (
    <div className="theme-landing min-h-screen bg-[#f4f6f7] text-[#18181b] font-sans">
      <LandingHeader />
      <main className="space-y-4 md:space-y-6 pt-24 md:pt-28 pb-12">
        <AboutHero />
        <AboutJourney />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
