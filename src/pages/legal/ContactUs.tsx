import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '../../components/landing/LandingHeader';
import { Footer } from '../../components/landing/Footer';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="theme-landing min-h-screen bg-[#f4f6f7] text-[#18181b] font-sans">
      <LandingHeader />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-16">
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
            Contact Us
          </h1>
          <p className="text-zinc-500 mb-8 font-sans text-sm md:text-base">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8 font-sans text-zinc-700">
            {/* General Inquiries */}
            <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-5 w-5 text-blue" />
                <h3 className="font-heading text-lg font-bold text-zinc-900">General Inquiries</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-4">For general questions and information</p>
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> info@campayn.com</p>
                <p className="text-zinc-500">Response time: Within 24 hours</p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                <h3 className="font-heading text-lg font-bold text-zinc-900">Technical Support</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-4">Need help with the platform?</p>
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> support@campayn.com</p>
                <p className="text-zinc-500">Response time: Within 2-4 hours for urgent issues</p>
              </div>
            </div>

            {/* Sales */}
            <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <h3 className="font-heading text-lg font-bold text-zinc-900">Sales & Partnerships</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-4">Interested in partnering with us?</p>
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> sales@campayn.com</p>
                <p><strong>Phone:</strong> +91-XXX-XXX-XXXX</p>
                <p className="text-zinc-500">Business hours: Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
            </div>

            {/* Office Address */}
            <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <h3 className="font-heading text-lg font-bold text-zinc-900">Office Address</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-4">Visit us or send mail</p>
              <p className="text-sm leading-relaxed text-zinc-600">
                Campayn India Pvt Ltd<br />
                IIT Roorkee Campus<br />
                Roorkee, Uttarakhand - 247667<br />
                India
              </p>
            </div>
          </div>

          {/* Department-Specific Contacts */}
          <div className="border-t border-zinc-200 pt-8 mt-8">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-6 tracking-tight">Department Contacts</h2>
            
            <div className="grid gap-4 font-sans text-sm text-zinc-600">
              <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-white border border-zinc-200/80 rounded-[1.5rem]">
                <div className="min-w-[200px]">
                  <h3 className="font-heading font-bold text-zinc-900">Creator Support</h3>
                  <p className="text-xs text-zinc-500">For influencers and content creators</p>
                </div>
                <div>
                  <p><strong>Email:</strong> creators@campayn.com</p>
                  <p className="text-zinc-500 mt-1">Help with profile setup, campaigns, payments, and analytics</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-white border border-zinc-200/80 rounded-[1.5rem]">
                <div className="min-w-[200px]">
                  <h3 className="font-heading font-bold text-zinc-900">Brand Support</h3>
                  <p className="text-xs text-zinc-500">For brands and businesses</p>
                </div>
                <div>
                  <p><strong>Email:</strong> brands@campayn.com</p>
                  <p className="text-zinc-500 mt-1">Campaign creation, creator selection, content review, and reporting</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-white border border-zinc-200/80 rounded-[1.5rem]">
                <div className="min-w-[200px]">
                  <h3 className="font-heading font-bold text-zinc-900">Payment Issues</h3>
                  <p className="text-xs text-zinc-500">Billing and payment queries</p>
                </div>
                <div>
                  <p><strong>Email:</strong> payments@campayn.com</p>
                  <p className="text-zinc-500 mt-1">Transaction issues, refunds, invoices, and payment status</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-white border border-zinc-200/80 rounded-[1.5rem]">
                <div className="min-w-[200px]">
                  <h3 className="font-heading font-bold text-zinc-900">Legal & Compliance</h3>
                  <p className="text-xs text-zinc-500">Legal matters and compliance</p>
                </div>
                <div>
                  <p><strong>Email:</strong> legal@campayn.com</p>
                  <p className="text-zinc-500 mt-1">Terms, privacy, disputes, and legal documentation</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-white border border-zinc-200/80 rounded-[1.5rem]">
                <div className="min-w-[200px]">
                  <h3 className="font-heading font-bold text-zinc-900">Data Protection</h3>
                  <p className="text-xs text-zinc-500">Privacy and data concerns</p>
                </div>
                <div>
                  <p><strong>Email:</strong> privacy@campayn.com</p>
                  <p className="text-zinc-500 mt-1">Data access, deletion requests, and privacy inquiries</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-white border border-zinc-200/80 rounded-[1.5rem]">
                <div className="min-w-[200px]">
                  <h3 className="font-heading font-bold text-zinc-900">Media & Press</h3>
                  <p className="text-xs text-zinc-500">Press inquiries and media requests</p>
                </div>
                <div>
                  <p><strong>Email:</strong> press@campayn.com</p>
                  <p className="text-zinc-500 mt-1">Press releases, interviews, and media partnerships</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t border-zinc-200 pt-8 mt-8 font-sans">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">Connect With Us</h2>
            <p className="text-zinc-500 mb-5">
              Follow us on social media for updates, tips, and industry insights:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://instagram.com/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-zinc-200 bg-white font-semibold text-zinc-700 rounded-full hover:bg-zinc-50 transition-colors shadow-sm text-sm"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-zinc-200 bg-white font-semibold text-zinc-700 rounded-full hover:bg-zinc-50 transition-colors shadow-sm text-sm"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 border border-zinc-200 bg-white font-semibold text-zinc-700 rounded-full hover:bg-zinc-50 transition-colors shadow-sm text-sm"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="border-t border-zinc-200 pt-8 mt-8 font-sans">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">Before You Contact</h2>
            <p className="text-zinc-500 mb-5">
              You might find answers to common questions in our FAQ section or support documentation:
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/support')}
                className="rounded-full border-zinc-200 bg-white font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Visit Support Center
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/faq')}
                className="rounded-full border-zinc-200 bg-white font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                View FAQ
              </Button>
            </div>
          </div>

          {/* Business Hours */}
          <div className="border-t border-zinc-200 pt-8 mt-8 font-sans text-sm text-zinc-600">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">Business Hours</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading font-bold text-zinc-800 mb-2">Customer Support</h3>
                <ul className="space-y-1 pl-0 list-none">
                  <li><strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM IST</li>
                  <li><strong>Saturday:</strong> 10:00 AM - 6:00 PM IST</li>
                  <li><strong>Sunday:</strong> Email support only</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-bold text-zinc-800 mb-2">Sales & Partnerships</h3>
                <ul className="space-y-1 pl-0 list-none">
                  <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</li>
                  <li><strong>Saturday & Sunday:</strong> Closed</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-4 italic">
              * Email support is available 24/7. Urgent technical issues are prioritized even outside business hours.
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="mt-8 p-5 bg-red-50 border border-red-200/60 rounded-2xl font-sans">
            <h3 className="font-heading font-bold text-red-950 mb-2">Emergency Support</h3>
            <p className="text-sm text-red-900">
              For critical platform issues affecting live campaigns, contact:{' '}
              <strong>emergency@campayn.com</strong> or call <strong>+91-XXX-XXX-XXXX</strong> (24/7 emergency line)
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
