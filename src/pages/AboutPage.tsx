
import { LandingHeader } from '../components/landing/LandingHeader';
import { Footer } from '../components/landing/Footer';
import { AboutHero } from '../components/about/AboutHero';
import { AboutMission } from '../components/about/AboutMission';
import { AboutTeam } from '../components/about/AboutTeam';
import { AboutValues } from '../components/about/AboutValues';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <LandingHeader />
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
      <Footer />
    </div>
  );
};

export default AboutPage;
