import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Campayn ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our influencer marketing platform.
              </p>
              <p className="mb-4">
                By using Campayn, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
              <p className="mb-4">When you register or use our services, we collect:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Name, email address, password</li>
                <li><strong>Profile Information:</strong> Business name, website, social media handles</li>
                <li><strong>Contact Details:</strong> Phone number, billing address</li>
                <li><strong>Payment Information:</strong> Bank account details, UPI ID (processed securely through Razorpay)</li>
                <li><strong>Identity Verification:</strong> Business documents, tax information (for creators)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Instagram Data</h3>
              <p className="mb-4">With your permission, we collect:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Public profile information (username, bio, profile picture)</li>
                <li>Follower count and engagement metrics</li>
                <li>Media content (posts, reels, stories)</li>
                <li>Performance analytics (likes, comments, views)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.3 Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Campaign creation and management activities</li>
                <li>Content submissions and approvals</li>
                <li>Messages and communications on the platform</li>
                <li>Search queries and browsing behavior</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.4 Technical Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log data and usage patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 To Provide Services</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Create and manage your account</li>
                <li>Connect brands with creators</li>
                <li>Process campaign creation and management</li>
                <li>Facilitate content review and approval</li>
                <li>Process payments and financial transactions</li>
                <li>Provide customer support</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 To Improve Our Platform</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Analyze usage patterns and trends</li>
                <li>Develop new features and functionality</li>
                <li>Personalize user experience</li>
                <li>Conduct research and analytics</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.3 For Communication</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Send transactional emails (confirmations, notifications)</li>
                <li>Provide campaign updates and alerts</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Respond to inquiries and support requests</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.4 For Security and Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Detect and prevent fraud</li>
                <li>Ensure platform security</li>
                <li>Enforce our Terms and Conditions</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold mb-3">4.1 With Other Users</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Brands can view creator profiles and public Instagram data</li>
                <li>Creators can view brand campaign information</li>
                <li>Campaign-related communications are visible to relevant parties</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.2 With Service Providers</h3>
              <p className="mb-4">We share information with trusted third parties:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Payment Processors:</strong> Razorpay for payment processing</li>
                <li><strong>Cloud Services:</strong> Supabase for database and authentication</li>
                <li><strong>Social Media APIs:</strong> Instagram/Facebook for analytics</li>
                <li><strong>Analytics Providers:</strong> To understand platform usage</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.3 For Legal Reasons</h3>
              <p className="mb-4">We may disclose information:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>To comply with legal obligations</li>
                <li>In response to lawful requests by authorities</li>
                <li>To protect our rights and property</li>
                <li>To prevent fraud or security threats</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.4 Business Transfers</h3>
              <p className="mb-4">
                In case of merger, acquisition, or sale of assets, user information may be transferred. We will notify you via email or platform notice of any such change.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="mb-4">We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit (SSL/TLS)</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and updates</li>
                <li>Payment data handled by PCI-compliant processors</li>
                <li>Employee access restricted on need-to-know basis</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Access and Update</h3>
              <p className="mb-4">
                You can access and update your personal information through your account settings.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Data Portability</h3>
              <p className="mb-4">
                You can request a copy of your personal data in a machine-readable format.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.3 Account Deletion</h3>
              <p className="mb-4">
                You can delete your account at any time. Note that some information may be retained for legal or legitimate business purposes.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.4 Marketing Communications</h3>
              <p className="mb-4">
                You can opt out of marketing emails by clicking "unsubscribe" in any email or updating your preferences.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.5 Cookie Management</h3>
              <p className="mb-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p className="mb-4">We retain your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>As long as your account is active</li>
                <li>As necessary to provide services</li>
                <li>To comply with legal obligations</li>
                <li>For legitimate business purposes (analytics, dispute resolution)</li>
              </ul>
              <p className="mt-4">
                After account deletion, we may retain anonymized or aggregated data for analytics and platform improvement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
              <p className="mb-4">
                Our platform may contain links to third-party websites (Instagram, payment gateways, etc.). We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="mb-4">
                Campayn is not intended for users under 18 years of age. We do not knowingly collect information from children. If we become aware of such collection, we will delete the information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Cookies and Tracking Technologies</h2>
              <p className="mb-4">We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                <li><strong>Analytics Cookies:</strong> To understand usage patterns</li>
                <li><strong>Preference Cookies:</strong> To remember your settings</li>
                <li><strong>Marketing Cookies:</strong> For targeted advertising (with consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notification. The "Last updated" date at the top indicates the most recent revision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
              <p className="mb-4">
                For questions or concerns about this Privacy Policy or our data practices:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> privacy@campayn.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@campayn.com</li>
                <li><strong>Address:</strong> Campayn India Pvt Ltd, Bangalore, India</li>
                <li><strong>Phone:</strong> +91-XXX-XXX-XXXX</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Compliance</h2>
              <p className="mb-4">
                This Privacy Policy complies with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Information Technology Act, 2000 (India)</li>
                <li>Information Technology (Reasonable Security Practices) Rules, 2011</li>
                <li>General Data Protection Regulation (GDPR) principles</li>
                <li>Payment gateway requirements (Razorpay, RBI guidelines)</li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Your Consent:</strong> By using Campayn, you consent to our Privacy Policy and agree to its terms. You can withdraw consent at any time by deleting your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
