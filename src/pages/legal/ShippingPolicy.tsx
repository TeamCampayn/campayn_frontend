import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '../../components/landing/LandingHeader';
import { Footer } from '../../components/landing/Footer';

const ShippingPolicy: React.FC = () => {
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
            Shipping and Delivery Policy
          </h1>
          <p className="text-zinc-500 font-sans text-sm mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 font-sans text-zinc-600 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                1. Service Nature
              </h2>
              <p>
                Campayn is a digital influencer marketing platform that provides software-as-a-service (SaaS) solutions. We do not sell or ship physical products. All our services are delivered digitally and instantly upon registration and payment.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                2. Digital Service Delivery
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">2.1 Immediate Access</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Platform access is granted immediately upon account creation</li>
                <li>No physical shipping or delivery required</li>
                <li>Services are accessible 24/7 via web browser</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">2.2 Campaign Creation</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Brand users can create campaigns instantly after payment</li>
                <li>Admin reviews and creator recommendations typically within 24-48 hours</li>
                <li>Digital notifications sent via email and platform alerts</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">2.3 Creator Onboarding</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creators get instant access to platform upon approval</li>
                <li>Profile creation and Instagram linking available immediately</li>
                <li>Campaign opportunities visible in real-time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                3. Product Sampling (When Applicable)
              </h2>
              <p className="mb-4">
                In some campaigns, brands may need to ship physical products to creators for review or promotion:
              </p>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">3.1 Brand Responsibility</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Brands are responsible for shipping products directly to creators</li>
                <li>Campayn facilitates address exchange but does not handle shipping</li>
                <li>Shipping costs are borne by the brand</li>
                <li>Brands must use reliable courier services</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">3.2 Delivery Timeframes</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Metro Cities:</strong> 2-5 business days</li>
                <li><strong>Tier 2 Cities:</strong> 3-7 business days</li>
                <li><strong>Remote Areas:</strong> 5-10 business days</li>
              </ul>
              <p className="mb-4 text-sm italic">
                Note: These are general guidelines. Actual delivery times depend on the courier service chosen by the brand and location accessibility.
              </p>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">3.3 Tracking and Confirmation</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Brands should provide tracking numbers to creators</li>
                <li>Creators should confirm receipt through the platform</li>
                <li>Content creation timeline begins after product receipt</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">3.4 Shipping Issues</h3>
              <p className="mb-4">If products are damaged or not delivered:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Creator should notify the brand within 24 hours</li>
                <li>Brand must arrange replacement or alternative solution</li>
                <li>Campaign timeline may be extended by mutual agreement</li>
                <li>Campayn can mediate disputes but is not liable for shipping issues</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                4. Data and Analytics Delivery
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">4.1 Real-Time Analytics</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Instagram insights synced automatically</li>
                <li>Campaign performance data updated in real-time</li>
                <li>Analytics dashboard accessible instantly</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">4.2 Reports</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Campaign reports generated automatically</li>
                <li>Downloadable in PDF/Excel format</li>
                <li>Available within 24 hours of campaign completion</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                5. Payment Delivery
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">5.1 For Creators</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Payment processing: 5-7 business days after content approval</li>
                <li>Payments transferred directly to bank account or UPI</li>
                <li>Email notification sent upon successful transfer</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">5.2 For Brands</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment invoices generated instantly</li>
                <li>Receipt sent via email immediately after payment</li>
                <li>GST invoices (when applicable) delivered within 24 hours</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                6. Content Delivery
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">6.1 Content Submission</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Creators upload content directly to platform</li>
                <li>Brands receive instant notification of submissions</li>
                <li>Review and approval process begins immediately</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">6.2 Content Publication</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Creators publish approved content on Instagram</li>
                <li>Post URLs shared via platform within 24 hours of posting</li>
                <li>Performance tracking begins immediately after posting</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">6.3 Content Rights</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Digital content rights transferred as per campaign agreement</li>
                <li>Brands can download approved content from platform</li>
                <li>High-resolution files available upon request</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                7. Service Availability
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">7.1 Platform Uptime</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Target uptime: 99.9%</li>
                <li>Scheduled maintenance announced 48 hours in advance</li>
                <li>Status updates available on status page</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">7.2 Support Delivery</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email Support:</strong> Response within 24 hours</li>
                <li><strong>Critical Issues:</strong> Response within 2-4 hours</li>
                <li><strong>In-Platform Chat:</strong> Available during business hours</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                8. Geographic Coverage
              </h2>
              <p className="mb-4">
                <strong>Primary Service Area:</strong> India (all states and territories)
              </p>
              <p className="mb-4">
                <strong>Digital Services:</strong> Accessible globally via internet connection
              </p>
              <p className="mb-4">
                <strong>Physical Product Shipping:</strong> Limited to serviceable pin codes as determined by brand's chosen courier partner
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                9. Delays and Issues
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">9.1 Digital Service Delays</h3>
              <p className="mb-4">Rare delays may occur due to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Instagram API rate limits or downtime</li>
                <li>Payment gateway processing times</li>
                <li>Third-party service disruptions</li>
                <li>Technical maintenance</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-4">9.2 Physical Shipping Delays</h3>
              <p className="mb-4">May occur due to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Weather conditions or natural disasters</li>
                <li>Courier service delays</li>
                <li>Incorrect address information</li>
                <li>Regional restrictions or holidays</li>
              </ul>
              <p className="mb-4">
                For shipping-related issues, creators should contact the brand directly. Campayn will mediate if resolution is not reached.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                10. International Considerations
              </h2>
              <p className="mb-4">
                While Campayn's digital platform is accessible globally:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Primary operations focus on Indian market</li>
                <li>International campaigns subject to brand's shipping capabilities</li>
                <li>Additional customs duties and taxes may apply for cross-border shipments</li>
                <li>International shipping costs and timelines determined by brands</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                11. Contact for Delivery Issues
              </h2>
              <p className="mb-4">
                For questions or concerns regarding service delivery:
              </p>
              <ul className="list-none space-y-2 pl-0">
                <li><strong>Email:</strong> support@campayn.com</li>
                <li><strong>Platform:</strong> Use in-app support chat</li>
                <li><strong>Phone:</strong> +91-XXX-XXX-XXXX (Mon-Fri, 9 AM - 6 PM IST)</li>
              </ul>
            </section>

            <div className="mt-8 p-5 bg-blue/5 border border-blue/20 rounded-2xl">
              <p className="text-sm text-zinc-800">
                <strong>Important Note:</strong> Campayn is a digital platform service. Any physical product shipping is managed directly between brands and creators. Campayn facilitates but does not control or guarantee physical deliveries.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
