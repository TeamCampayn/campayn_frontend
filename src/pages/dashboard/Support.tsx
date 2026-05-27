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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">Support</h1>
        <p className="text-xs text-gray-500 mt-1">Get help with your campaigns and account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2.5 text-blue-500" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Chat with our support team in real-time for immediate assistance.
            </p>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs py-2 px-3 h-auto border-0 shadow-sm rounded-xl font-medium">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
              <Mail className="h-4 w-4 mr-2.5 text-purple-500" />
              Email Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <Button variant="outline" className="w-full border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs py-2 px-3 h-auto rounded-xl font-medium">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
              <Phone className="h-4 w-4 mr-2.5 text-green-500" />
              Phone Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Call us for urgent matters or complex issues.
            </p>
            <div className="text-[10px] font-semibold text-gray-400 bg-gray-100/50 border border-gray-200/20 px-2.5 py-1 rounded-lg w-max">
              Available: Mon-Fri, 9 AM - 6 PM IST
            </div>
            <Button variant="outline" className="w-full border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs py-2 px-3 h-auto rounded-xl font-medium">
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
              <FileText className="h-4 w-4 mr-2.5 text-orange-500" />
              Help Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Browse our knowledge base for answers to common questions.
            </p>
            <Button variant="outline" className="w-full border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs py-2 px-3 h-auto rounded-xl font-medium">
              Browse Articles
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Card className="bg-white/80 border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-gray-100/60">
            <CardTitle className="text-sm font-semibold text-gray-700">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold text-gray-700">How do I create a new campaign?</h4>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Go to "My Campaigns" and click "Create Campaign". Fill out the form with your campaign details and submit for quotation.
                </p>
              </div>
              <div className="border-t border-gray-100/60 pt-4">
                <h4 className="text-xs font-semibold text-gray-700">How long does quotation approval take?</h4>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Typically 24-48 hours. You'll receive notifications when quotations are ready for review.
                </p>
              </div>
              <div className="border-t border-gray-100/60 pt-4">
                <h4 className="text-xs font-semibold text-gray-700">Can I modify a campaign after creation?</h4>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
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
