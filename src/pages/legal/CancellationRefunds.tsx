import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '../../components/landing/LandingHeader';
import { Footer } from '../../components/landing/Footer';

const CancellationRefunds: React.FC = () => {
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
            Cancellation and Refund Policy
          </h1>
          <p className="text-zinc-500 font-sans text-sm mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 font-sans text-zinc-600 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                1. Overview
              </h2>
              <p>
                This Cancellation and Refund Policy outlines the terms under which brands and creators can cancel campaigns or request refunds. We strive to be fair to all parties while maintaining the integrity of our platform.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                2. Brand Campaign Cancellations
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">2.1 Before Creator Assignment</h3>
              <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-5 mb-4">
                <p className="font-bold text-emerald-950 mb-2">Full Refund Eligible</p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-emerald-900">
                  <li>Campaign can be cancelled before admin assigns creators</li>
                  <li>100% refund of campaign payment</li>
                  <li>Processing time: 5-7 business days</li>
                  <li>Refund issued to original payment method</li>
                </ul>
              </div>
              <p className="text-sm mb-6">
                <strong>How to cancel:</strong> Go to campaign details and click "Cancel Campaign" or contact support@campayn.com
              </p>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">2.2 After Creator Assignment (Before Content Creation)</h3>
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 mb-4">
                <p className="font-bold text-amber-950 mb-2">Partial Refund (70%)</p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-amber-900">
                  <li>Creators have been recommended/approved but haven't started work</li>
                  <li>70% refund of campaign payment</li>
                  <li>30% retained as platform and creator coordination fee</li>
                  <li>Processing time: 7-10 business days</li>
                </ul>
              </div>
              <p className="text-sm mb-6">
                <strong>Reason for partial refund:</strong> Resources have been allocated for creator coordination, contracts, and admin time.
              </p>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">2.3 After Content Submission</h3>
              <div className="bg-red-50 border border-red-200/60 rounded-2xl p-5 mb-4">
                <p className="font-bold text-red-950 mb-2">No Refund</p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-red-900">
                  <li>Creators have submitted content for review</li>
                  <li>Work has been completed as per agreement</li>
                  <li>Campaign cannot be cancelled at this stage</li>
                  <li>Payment must be completed to creators</li>
                </ul>
              </div>
              <p className="text-sm mb-6">
                <strong>Exception:</strong> If content doesn't meet agreed specifications, you can request revisions or reject specific submissions (subject to campaign terms).
              </p>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">2.4 After Content Publication</h3>
              <div className="bg-red-50 border border-red-200/60 rounded-2xl p-5 mb-4">
                <p className="font-bold text-red-950 mb-2">No Refund or Cancellation</p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-red-900">
                  <li>Content is live on Instagram</li>
                  <li>Campaign objectives being met</li>
                  <li>All payments are final</li>
                  <li>No cancellation possible</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                3. Creator Withdrawals
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">3.1 Before Accepting Campaign</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Creators can decline campaign invitations without penalty</li>
                <li>No financial commitment at this stage</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">3.2 After Accepting (Before Content Creation)</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Creators should notify brand and admin immediately</li>
                <li>Valid reasons: medical emergency, technical issues, force majeure</li>
                <li>May affect future campaign opportunities</li>
                <li>No payment for cancelled commitment</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">3.3 After Content Submission</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Creator cannot withdraw at this stage</li>
                <li>Must complete campaign as agreed</li>
                <li>Failure to complete may result in:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>No payment for the campaign</li>
                    <li>Account suspension or termination</li>
                    <li>Legal action for breach of contract (in severe cases)</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                4. Refund Process
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">4.1 How to Request a Refund</h3>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Log in to your Campayn account</li>
                <li>Navigate to the campaign you want to cancel</li>
                <li>Click "Request Cancellation" or "Request Refund"</li>
                <li>Provide reason for cancellation (optional but helpful)</li>
                <li>Submit request</li>
              </ol>
              <p className="mb-4 text-sm">
                <strong>Alternatively:</strong> Email payments@campayn.com with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-sm">
                <li>Campaign ID</li>
                <li>Reason for refund</li>
                <li>Original payment transaction ID</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">4.2 Refund Timeline</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Request Review:</strong> 1-2 business days</li>
                <li><strong>Approval Notification:</strong> Via email within 24 hours of review</li>
                <li><strong>Refund Processing:</strong> 5-7 business days for most payment methods</li>
                <li><strong>Bank Credit:</strong> May take additional 2-3 days depending on your bank</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">4.3 Refund Methods</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Refunds issued to original payment method only</li>
                <li>Credit/Debit Card: 5-7 business days</li>
                <li>UPI: 3-5 business days</li>
                <li>Net Banking: 5-7 business days</li>
                <li>No cash refunds available</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                5. Special Circumstances
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">5.1 Technical Issues</h3>
              <p className="mb-4">If platform technical issues prevent campaign execution:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Full refund or campaign extension offered</li>
                <li>Decision at brand's discretion</li>
                <li>Admin will coordinate resolution</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">5.2 Creator Non-Performance</h3>
              <p className="mb-4">If assigned creator fails to deliver:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Replacement creator assigned at no extra cost</li>
                <li>Campaign timeline extended if needed</li>
                <li>Partial refund if replacement not possible (case-by-case basis)</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">5.3 Force Majeure</h3>
              <p className="mb-4">In cases of natural disasters, pandemics, or other unforeseeable events:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Campaign pause option available</li>
                <li>Extensions granted without penalty</li>
                <li>Refunds considered on case-by-case basis</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">5.4 Policy Violations</h3>
              <p className="mb-4">If brand or creator violates platform policies:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Campaign may be terminated immediately</li>
                <li>Refunds decided based on violation severity</li>
                <li>Account may be suspended or permanently banned</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                6. Payment Failures
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">6.1 Failed Transactions</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>If payment fails but amount is debited, refund automatic within 5-7 business days</li>
                <li>Contact support if not received after 10 business days</li>
                <li>Provide transaction ID and bank statement for failed transaction</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">6.2 Double Payments</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Accidentally charged twice? We'll refund the duplicate immediately</li>
                <li>Contact payments@campayn.com with both transaction IDs</li>
                <li>Refund processed within 3-5 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                7. Non-Refundable Items
              </h2>
              <p className="mb-4">The following are non-refundable under any circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Platform Fees:</strong> Service charges for using Campayn platform</li>
                <li><strong>Payment Gateway Charges:</strong> Transaction fees charged by Razorpay/banks</li>
                <li><strong>Completed Services:</strong> Payments for successfully completed campaigns</li>
                <li><strong>Premium Features:</strong> Once used (upgraded analytics, priority support, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                8. Dispute Resolution
              </h2>
              
              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">8.1 Internal Review</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>All refund disputes first reviewed by Campayn admin team</li>
                <li>Both parties given opportunity to present their case</li>
                <li>Decision typically made within 5-7 business days</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">8.2 Mediation</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Complex disputes referred to senior management</li>
                <li>Neutral mediation provided at no extra cost</li>
                <li>Goal: Fair resolution for all parties</li>
              </ul>

              <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 mt-6">8.3 Legal Recourse</h3>
              <p className="mb-4">
                If internal resolution fails, parties may pursue legal remedies as per Terms and Conditions. All disputes subject to jurisdiction of courts in Bangalore, India.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                9. Modification of Services
              </h2>
              <p className="mb-4">
                If Campayn discontinues or significantly modifies its services:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Active campaigns will be honored and completed</li>
                <li>Refunds offered for campaigns that cannot be fulfilled</li>
                <li>60 days notice provided for major changes</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                10. Tax Implications
              </h2>
              <p className="mb-4">
                <strong>Important:</strong> GST or other taxes charged on original payment may not be refunded if service was partially rendered. Refund amount reflects service consumed. Consult your tax advisor for tax treatment of refunds.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                11. Contact for Refund Issues
              </h2>
              <p className="mb-4">
                For questions or issues regarding cancellations and refunds:
              </p>
              <ul className="list-none space-y-2 pl-0">
                <li><strong>Email:</strong> payments@campayn.com</li>
                <li><strong>Email (Disputes):</strong> disputes@campayn.com</li>
                <li><strong>Phone:</strong> +91-XXX-XXX-XXXX (Mon-Fri, 9 AM - 6 PM IST)</li>
                <li><strong>In-Platform:</strong> Campaign details page → "Request Support"</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                12. Policy Updates
              </h2>
              <p className="mb-4">
                This Cancellation and Refund Policy may be updated periodically. Changes will be communicated via:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Email notification to all registered users</li>
                <li>Platform announcement banner</li>
                <li>Updated "Last updated" date at top of this page</li>
              </ul>
              <p className="mb-4">
                Continued use of the platform after policy changes constitutes acceptance of the new terms.
              </p>
            </section>

            <div className="mt-8 p-5 bg-blue/5 border border-blue/20 rounded-2xl">
              <p className="text-sm text-zinc-800 mb-2">
                <strong>Summary of Refund Eligibility:</strong>
              </p>
              <ul className="text-sm space-y-1 text-zinc-700 pl-0 list-none">
                <li>✅ <strong>100% refund:</strong> Before creator assignment</li>
                <li>⚠️ <strong>70% refund:</strong> After creator assignment, before work starts</li>
                <li>❌ <strong>No refund:</strong> After content submission or publication</li>
              </ul>
            </div>

            <div className="mt-4 p-5 bg-amber-50 border border-amber-200/60 rounded-2xl">
              <p className="text-sm text-zinc-800">
                <strong>Need to Cancel?</strong> Do it early! The sooner you cancel, the more you'll get refunded. We understand plans change, but please consider the work creators and our team have put in.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CancellationRefunds;
