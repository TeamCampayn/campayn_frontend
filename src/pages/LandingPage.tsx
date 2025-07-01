
import {
  HeroSection,
  OnboardingProcess,
  FeaturesSection,
  ContactSection,
  LandingHeader,
  VerticalScrollCards
} from '../components/landing';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <LandingHeader />
        <HeroSection />
        <OnboardingProcess />
      </div>
      
      <VerticalScrollCards />
      
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <FeaturesSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default LandingPage;
