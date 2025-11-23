
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";

const Help = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
          <p className="text-slate-600 mt-1">Get help with your Campayn dashboard and campaigns</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span>Documentation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Browse our comprehensive guides and tutorials.
            </p>
            <Button variant="outline" className="w-full">
              View Docs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <span>Live Chat</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Chat with our support team in real-time.
            </p>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-500" />
              <span>Email Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-sm mb-4">
              Send us an email and we'll get back to you soon.
            </p>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                question: "How do I launch a new campaign?",
                answer: "Click the 'Launch Campaign' button on the dashboard or go to Campaigns > Create Campaign. Fill in your campaign details, select creators, and set your budget."
              },
              {
                question: "How can I track campaign performance?",
                answer: "Visit the Analytics section for detailed performance metrics, or check the Dashboard for a quick overview of all your campaigns."
              },
              {
                question: "How do payments to creators work?",
                answer: "Payments are processed through the Budget & Payments section. You can set up automatic payments or process them manually based on campaign milestones."
              },
              {
                question: "Can I export campaign data?",
                answer: "Yes, go to Reports & Exports to generate custom reports in PDF or CSV format. You can also schedule regular report deliveries."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                <h3 className="font-medium text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
