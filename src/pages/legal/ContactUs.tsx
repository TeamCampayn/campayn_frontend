import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have questions? We're here to help. Reach out to us through any of the channels below.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* General Inquiries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  General Inquiries
                </CardTitle>
                <CardDescription>For general questions and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> info@campayn.com
                </p>
                <p className="text-sm text-gray-600">
                  Response time: Within 24 hours
                </p>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Technical Support
                </CardTitle>
                <CardDescription>Need help with the platform?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> support@campayn.com
                </p>
                <p className="text-sm text-gray-600">
                  Response time: Within 2-4 hours for urgent issues
                </p>
              </CardContent>
            </Card>

            {/* Sales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  Sales & Partnerships
                </CardTitle>
                <CardDescription>Interested in partnering with us?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> sales@campayn.com
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> +91-XXX-XXX-XXXX
                </p>
                <p className="text-sm text-gray-600">
                  Business hours: Mon-Fri, 9 AM - 6 PM IST
                </p>
              </CardContent>
            </Card>

            {/* Office Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Office Address
                </CardTitle>
                <CardDescription>Visit us or send mail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  Campayn India Pvt Ltd<br />
                  [Building Name]<br />
                  [Street Address]<br />
                  Bangalore, Karnataka - [PIN Code]<br />
                  India
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Department-Specific Contacts */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">Department Contacts</h2>
            
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">Creator Support</h3>
                  <p className="text-sm text-gray-600">For influencers and content creators</p>
                </div>
                <div className="text-sm">
                  <p><strong>Email:</strong> creators@campayn.com</p>
                  <p className="text-gray-600 mt-1">Help with profile setup, campaigns, payments, and analytics</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">Brand Support</h3>
                  <p className="text-sm text-gray-600">For brands and businesses</p>
                </div>
                <div className="text-sm">
                  <p><strong>Email:</strong> brands@campayn.com</p>
                  <p className="text-gray-600 mt-1">Campaign creation, creator selection, content review, and reporting</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">Payment Issues</h3>
                  <p className="text-sm text-gray-600">Billing and payment queries</p>
                </div>
                <div className="text-sm">
                  <p><strong>Email:</strong> payments@campayn.com</p>
                  <p className="text-gray-600 mt-1">Transaction issues, refunds, invoices, and payment status</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">Legal & Compliance</h3>
                  <p className="text-sm text-gray-600">Legal matters and compliance</p>
                </div>
                <div className="text-sm">
                  <p><strong>Email:</strong> legal@campayn.com</p>
                  <p className="text-gray-600 mt-1">Terms, privacy, disputes, and legal documentation</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">Data Protection</h3>
                  <p className="text-sm text-gray-600">Privacy and data concerns</p>
                </div>
                <div className="text-sm">
                  <p><strong>Email:</strong> privacy@campayn.com</p>
                  <p className="text-gray-600 mt-1">Data access, deletion requests, and privacy inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="min-w-[200px]">
                  <h3 className="font-semibold">Media & Press</h3>
                  <p className="text-sm text-gray-600">Press inquiries and media requests</p>
                </div>
                <div className="text-sm">
                  <p><strong>Email:</strong> press@campayn.com</p>
                  <p className="text-gray-600 mt-1">Press releases, interviews, and media partnerships</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
            <p className="text-gray-600 mb-4">
              Follow us on social media for updates, tips, and industry insights:
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/campayn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Twitter
              </a>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Before You Contact</h2>
            <p className="text-gray-600 mb-4">
              You might find answers to common questions in our FAQ section or support documentation:
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/support')}
              >
                Visit Support Center
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/faq')}
              >
                View FAQ
              </Button>
            </div>
          </div>

          {/* Business Hours */}
          <div className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li><strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM IST</li>
                  <li><strong>Saturday:</strong> 10:00 AM - 6:00 PM IST</li>
                  <li><strong>Sunday:</strong> Email support only</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sales & Partnerships</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</li>
                  <li><strong>Saturday & Sunday:</strong> Closed</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              * Email support is available 24/7. Urgent technical issues are prioritized even outside business hours.
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">Emergency Support</h3>
            <p className="text-sm text-red-800">
              For critical platform issues affecting live campaigns, contact:{' '}
              <strong>emergency@campayn.com</strong> or call <strong>+91-XXX-XXX-XXXX</strong> (24/7 emergency line)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
