
import {
  HeroSection,
  OnboardingProcess,
  FeaturesSection,
  ContactSection,
  LandingHeader
} from '../components/landing';

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
