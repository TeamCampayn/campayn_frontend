
import { LandingHeader } from '../components/landing/LandingHeader';
import { Footer } from '../components/landing/Footer';
import { AboutHero } from '../components/about/AboutHero';
import { AboutJourney } from '../components/about/AboutJourney';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <LandingHeader />
      <AboutHero />
      <AboutJourney />
      <Footer />
    </div>
  );
};

export default AboutPage;
