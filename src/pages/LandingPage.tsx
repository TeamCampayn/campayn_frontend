
import { HeroSection } from '../components/landing/HeroSection';
import { OnboardingProcess } from '../components/landing/OnboardingProcess';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { ContactSection } from '../components/landing/ContactSection';
import { LandingHeader } from '../components/landing/LandingHeader';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <LandingHeader />
      <HeroSection />
      <OnboardingProcess />
      <FeaturesSection />
      <ContactSection />
    </div>
  );
};

export default LandingPage;
