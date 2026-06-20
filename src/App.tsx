import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import CreatorsPage from './pages/CreatorsPage';
import AboutPage from './pages/AboutPage';
import Auth from './pages/Auth';
import BrandDashboard from './pages/BrandDashboard';
import CreateCampaign from './pages/CreateCampaign';
import { AuthProvider } from './contexts/AuthContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Dashboard Layout and Pages
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import MyCampaigns from './pages/dashboard/MyCampaigns';
import CampaignDetail from './pages/dashboard/CampaignDetail';
import ExploreCreators from './pages/dashboard/ExploreCreators';
import CreatorProfile from './pages/dashboard/CreatorProfile';
import Support from './pages/dashboard/Support';
import BrandAnalytics from './pages/dashboard/BrandAnalytics';
import WalletPage from './pages/dashboard/WalletPage';

import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AdminCreators from './pages/AdminCreators';
import AdminCampaignDetail from './pages/AdminCampaignDetail';
import AdminPaymentDashboard from './pages/AdminPaymentDashboard';
import AdminContentReview from './pages/AdminContentReview';
import BrandContentReview from './pages/BrandContentReview';
import CampaignAnalytics from './pages/dashboard/CampaignAnalytics';

// Multi-Phase Campaign Components
import CampaignManagement from './components/CampaignManagement';
import AdminCreatorSelection from './components/AdminCreatorSelection';
import AdminLinkManager from './components/AdminLinkManager';

// Legal Pages
import TermsAndConditions from './pages/legal/TermsAndConditions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import ShippingPolicy from './pages/legal/ShippingPolicy';
import ContactUs from './pages/legal/ContactUs';
import CancellationRefunds from './pages/legal/CancellationRefunds';
import DataDeletion from './pages/legal/DataDeletion';

// Razorpay Payment Link Pages
import RazorpayPaymentLink from './pages/RazorpayPaymentLink';
import AdminRazorpayVerification from './pages/AdminRazorpayVerification';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <RealtimeProvider>
            <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/creators" element={<CreatorsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Brand Dashboard (Legacy - for brand profile setup) */}
              <Route path="/brand-dashboard" element={
                <ProtectedRoute>
                  <BrandDashboard />
                </ProtectedRoute>
              } />
              
              {/* Main Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Overview />} />
                <Route path="campaigns" element={<MyCampaigns />} />
                <Route path="campaigns/:id" element={<CampaignDetail />} />
                <Route path="campaigns/:id/analytics" element={<CampaignAnalytics />} />
                <Route path="explore-creators" element={<ExploreCreators />} />
                <Route path="creator-profile/:igHandle" element={<CreatorProfile />} />
                <Route path="creators/:id" element={<CreatorProfile />} />
                <Route path="analytics" element={<BrandAnalytics />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="support" element={<Support />} />
                {/* Brand content review for a specific campaign */}
                <Route path="campaigns/:id/content" element={<BrandContentReview />} />
              </Route>
              
              {/* Legacy routes redirect to new dashboard */}
              <Route path="/campaigns" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<MyCampaigns />} />
                <Route path=":id" element={<CampaignDetail />} />
              </Route>
              
              {/* Create Campaign */}
              <Route path="/create-campaign" element={
                <ProtectedRoute>
                  <CreateCampaign />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              {/* Multi-Phase Campaign Routes */}
              <Route path="/admin/campaigns" element={
                <AdminProtectedRoute>
                  <CampaignManagement />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/campaigns/:id" element={
                <AdminProtectedRoute>
                  <AdminCampaignDetail />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/campaigns/:campaignId/creators" element={
                <AdminProtectedRoute>
                  <AdminCreatorSelection />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/campaigns/:campaignId/payment" element={
                <AdminProtectedRoute>
                  <AdminCampaignDetail />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/campaigns/:id/content" element={
                <AdminProtectedRoute>
                  <AdminContentReview />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/campaigns/:id/links" element={
                <AdminProtectedRoute>
                  <AdminLinkManager />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/creators" element={
                <AdminProtectedRoute>
                  <AdminCreators />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <AdminProtectedRoute>
                  <AdminPaymentDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/razorpay-verification" element={
                <AdminProtectedRoute>
                  <AdminRazorpayVerification />
                </AdminProtectedRoute>
              } />
              
              {/* Brand Payment Routes */}
              <Route path="/campaigns/:campaignId/payment" element={
                <ProtectedRoute>
                  <RazorpayPaymentLink />
                </ProtectedRoute>
              } />
              
              {/* Legal Pages - Public Access */}
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/refunds" element={<CancellationRefunds />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              
            </Routes>
          </Router>
          </RealtimeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;