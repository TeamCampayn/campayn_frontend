
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HeroSection,
  FeaturesSection,
  ContactSection,
  LandingHeader,
  VerticalScrollCards,
  TestimonialsSection,
  Footer
} from '../components/landing';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { VideoCarousel } from '../components/landing/VideoCarousel';

const LandingPage = () => {
  const { user, brand, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const isAdmin = user.email === 'admin@campayn.local' || 
                      user.user_metadata?.is_admin === true ||
                      user.app_metadata?.is_admin === true;
      if (isAdmin) {
        navigate('/admin');
      } else if (brand && brand.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, brand, loading, navigate]);

  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <VideoCarousel />
      {/* Smooth gradient transition from hero to vertical cards */}
      <div className="bg-gradient-to-b from-purple-50 via-gray-50 to-white">
        <VerticalScrollCards />
      </div>
      {/* Smooth gradient transition from cards to dashboard */}
      <div className="bg-gradient-to-b from-white via-blue-50 to-purple-50">
        <DashboardPreview />
      </div>
      {/* Testimonials section */}
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
