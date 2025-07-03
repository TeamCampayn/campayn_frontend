
import {
  HeroSection,
  FeaturesSection,
  ContactSection,
  LandingHeader,
  VerticalScrollCards
} from '../components/landing';
import { DashboardPreview } from '../components/landing/DashboardPreview';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      {/* Smooth gradient transition from hero to vertical cards */}
      <div className="bg-gradient-to-b from-purple-50 via-gray-50 to-white">
        <VerticalScrollCards />
      </div>
      {/* Smooth gradient transition from cards to dashboard */}
      <div className="bg-gradient-to-b from-white via-blue-50 to-purple-50">
        <DashboardPreview />
      </div>
      <ContactSection />
    </div>
  );
};

export default LandingPage;
