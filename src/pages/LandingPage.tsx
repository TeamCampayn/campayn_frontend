import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LandingHeader,
  HeroSection,
  Marquee,
  Brands,
  ContentSection,
  Regions,
  CTA,
  Steps,
  VideoCarousel,
  TestimonialsSection,
  Footer
} from '../components/landing';

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
    <div className="theme-landing min-h-screen">
      <LandingHeader />
      <main className="space-y-4 md:space-y-6 pt-4 pb-12">
        <HeroSection />
        <VideoCarousel />
        <Marquee />
        <Brands />
        <ContentSection />
        <Regions />
        <CTA />
        <Steps />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
