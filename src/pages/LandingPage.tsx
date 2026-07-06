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
