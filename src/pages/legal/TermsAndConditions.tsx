import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '../../components/landing/LandingHeader';
import { Footer } from '../../components/landing/Footer';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="theme-landing min-h-screen bg-[#f4f6f7] text-[#18181b] font-sans">
      <LandingHeader />
      
      <main className="max-w-4xl mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-16">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-8 rounded-full border-zinc-200 bg-white font-sans text-sm font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2 text-zinc-500" />
          Back
        </Button>

        <div className="grain rounded-[2rem] bg-panel p-8 md:p-12 border border-foreground/10 shadow-sm">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-zinc-900 mb-2 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-zinc-500 font-sans text-sm mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 font-sans text-zinc-600 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                1. Introduction
              </h2>
              <p>
                Welcome to Campayn ("we," "our," or "us"). These Terms and Conditions govern your use of our influencer marketing platform and services. By accessing or using Campayn, you agree to be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                2. Definitions
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Platform:</strong> The Campayn website and all related services</li>
                <li><strong>Brand:</strong> Businesses or individuals who create campaigns</li>
                <li><strong>Creator:</strong> Influencers who participate in campaigns</li>
                <li><strong>Campaign:</strong> Marketing initiatives created by brands</li>
                <li><strong>Content:</strong> Any material created or shared through the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                3. Account Registration
              </h2>
              <p className="mb-4">
                To use our services, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                4. Services
              </h2>
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">4.1 For Brands</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Create and manage influencer marketing campaigns</li>
                <li>Browse and connect with verified creators</li>
                <li>Review and approve content submissions</li>
                <li>Track campaign performance and analytics</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">4.2 For Creators</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Get discovered by brands for campaigns</li>
                <li>Submit content for brand approval</li>
                <li>Receive payments for completed campaigns</li>
                <li>Access performance analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                5. Payment Terms
              </h2>
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">5.1 Brand Payments</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Brands must pay campaign fees upfront</li>
                <li>All payments are processed securely through Razorpay</li>
                <li>Campaign fees are non-refundable once creators are assigned</li>
                <li>Payments must be made within the specified timeframe</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">5.2 Creator Payments</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creators receive payment upon successful campaign completion</li>
                <li>Payment is released after content approval and posting</li>
                <li>Processing time: 5-7 business days after approval</li>
                <li>Bank details must be accurate for successful transfers</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                6. Content Guidelines
              </h2>
              <p className="mb-4">
                All content must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with Instagram's Terms of Service and Community Guidelines</li>
                <li>Be original and not infringe on third-party rights</li>
                <li>Clearly disclose sponsored partnerships (#ad, #sponsored)</li>
                <li>Meet the brand's campaign requirements and guidelines</li>
                <li>Not contain offensive, illegal, or harmful material</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                7. Intellectual Property
              </h2>
              <p className="mb-4">
                <strong>7.1 Platform Content:</strong> All platform features, designs, and technology are owned by Campayn.
              </p>
              <p className="mb-4">
                <strong>7.2 User Content:</strong> Creators retain ownership of their content but grant brands usage rights as specified in individual campaign agreements.
              </p>
              <p className="mb-4">
                <strong>7.3 Brand Assets:</strong> Brands retain ownership of their trademarks, logos, and marketing materials.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                8. Prohibited Activities
              </h2>
              <p className="mb-4">Users must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for fraudulent purposes</li>
                <li>Create fake accounts or impersonate others</li>
                <li>Share or sell account access</li>
                <li>Attempt to bypass security measures</li>
                <li>Scrape or data mine platform information</li>
                <li>Engage in spam or harassment</li>
                <li>Use bots or automated tools without authorization</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                9. Dispute Resolution
              </h2>
              <p className="mb-4">
                <strong>9.1 Platform Mediation:</strong> Campayn administrators will mediate disputes between brands and creators.
              </p>
              <p className="mb-4">
                <strong>9.2 Escalation:</strong> Unresolved disputes may be escalated to binding arbitration under Indian law.
              </p>
              <p className="mb-4">
                <strong>9.3 Jurisdiction:</strong> All legal matters are subject to the jurisdiction of courts in India.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                10. Limitation of Liability
              </h2>
              <p className="mb-4">
                Campayn is not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Content created by users</li>
                <li>Disputes between brands and creators</li>
                <li>Third-party platform changes (Instagram API, etc.)</li>
                <li>Loss of data or service interruptions</li>
                <li>Indirect, consequential, or punitive damages</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                11. Service Modifications
              </h2>
              <p className="mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or discontinue services with notice</li>
                <li>Update pricing and fee structures</li>
                <li>Change platform features and functionality</li>
                <li>Suspend accounts that violate terms</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                12. Termination
              </h2>
              <p className="mb-4">
                <strong>12.1 By Users:</strong> You may terminate your account at any time through account settings.
              </p>
              <p className="mb-4">
                <strong>12.2 By Campayn:</strong> We may suspend or terminate accounts that violate these terms or engage in harmful activities.
              </p>
              <p className="mb-4">
                <strong>12.3 Effect:</strong> Upon termination, you lose access to all platform services. Outstanding payments will be processed according to our payment terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                13. Data Protection
              </h2>
              <p className="mb-4">
                Your use of the platform is also governed by our Privacy Policy. We collect, use, and protect your data in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                14. Changes to Terms
              </h2>
              <p className="mb-4">
                We may update these Terms and Conditions periodically. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or platform notifications.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                15. Contact Information
              </h2>
              <p className="mb-4">
                For questions about these Terms and Conditions, please contact us:
              </p>
              <ul className="list-none space-y-2 pl-0">
                <li><strong>Email:</strong> legal@campayn.com</li>
                <li><strong>Address:</strong> Campayn India Pvt Ltd, Delhi, India</li>
                <li><strong>Phone:</strong> +91-9165043258</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                16. Governing Law
              </h2>
              <p className="mb-4">
                These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.
              </p>
            </section>

            <div className="mt-8 p-5 bg-blue/5 border border-blue/20 rounded-2xl">
              <p className="text-sm text-zinc-800">
                <strong>Acceptance:</strong> By using Campayn, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
