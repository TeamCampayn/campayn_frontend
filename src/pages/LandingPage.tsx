
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <LandingHeader />
      <HeroSection />
      <VerticalScrollCards />
      <DashboardPreview />
      <ContactSection />
    </div>
  );
};

export default LandingPage;
