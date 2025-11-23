import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone,
  FileText
} from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
        <p className="text-gray-600">Get help with your campaigns and account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Chat with our support team in real-time for immediate assistance.
            </p>
            <Button className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Phone Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Call us for urgent matters or complex issues.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Available: Mon-Fri, 9 AM - 6 PM IST
            </div>
            <Button variant="outline" className="w-full">
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Help Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Browse our knowledge base for answers to common questions.
            </p>
            <Button variant="outline" className="w-full">
              Browse Articles
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">How do I create a new campaign?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Go to "My Campaigns" and click "Create Campaign". Fill out the form with your campaign details and submit for quotation.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">How long does quotation approval take?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Typically 24-48 hours. You'll receive notifications when quotations are ready for review.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Can I modify a campaign after creation?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Yes, you can request changes to quotations or modify campaign details before going live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
