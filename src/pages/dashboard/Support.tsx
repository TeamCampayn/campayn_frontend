import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  MessageSquare, 
  Mail, 
  Phone,
  FileText,
  ChevronDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I create a new campaign?",
    answer: "Go to \"My Campaigns\" and click \"Create Campaign\". Fill out the form with your campaign details, target audience preferences, budget, and content guidelines, then submit for review and quotation."
  },
  {
    question: "How long does quotation approval take?",
    answer: "Typically 24-48 hours. Our team reviews your campaign requirements and generates a competitive quote. You will receive an email and system notification once your quotation is ready for review."
  },
  {
    question: "Can I modify a campaign after creation?",
    answer: "Yes, you can request modifications to the campaign details or guidelines before accepting the quote and locking the budget. Once the campaign is active, any major changes will require support assistance."
  },
  {
    question: "How do payments and budget locks work?",
    answer: "After accepting a campaign quote, you must lock the budget using funds from your brand wallet. Payment can be processed through our integrated Razorpay payment gateway to top up your wallet."
  },
  {
    question: "What are the requirements for campaign verification?",
    answer: "All submitted campaign content (images, videos, copy) must adhere to our content guidelines. Reviewers verify accuracy, safety, and brand alignment before approving the content to go live."
  }
];

const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-space tracking-tight text-neutral-900 uppercase">Support Center</h1>
        <p className="text-xs font-space uppercase tracking-wider text-zinc-500 mt-1">Get help with your campaigns, billing, and account management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-150">
              <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
                Submit a Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isSubmitted ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle className="h-10 w-10 text-neutral-900" />
                  <div>
                    <h3 className="text-xs font-bold font-space uppercase tracking-wider text-neutral-900">Ticket Submitted Successfully</h3>
                    <p className="text-[10px] font-space uppercase tracking-wider text-zinc-500 mt-1">
                      Our support team will review your query and respond within 24 hours.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="btn-secondary-pill text-[10px] px-6 py-2 mt-4"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors"
                      >
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Wallet</option>
                        <option value="campaign">Campaign Setup</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="E.g., Wallet transaction delay"
                        className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">
                      Message / Description
                    </label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Please describe your issue in detail..."
                      className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-primary-pill w-full text-xs py-2.5 h-10 flex items-center justify-center"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Contact Cards */}
        <div className="space-y-4">
          <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl flex flex-col justify-between p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 border border-zinc-200 rounded-xl">
                <MessageSquare className="h-4 w-4 text-neutral-900" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-900">Live Chat Support</h3>
                <p className="text-[9px] font-space uppercase tracking-wider text-zinc-500 leading-normal">
                  Connect with support agents in real-time.
                </p>
              </div>
            </div>
            <button className="btn-secondary-pill w-full text-[10px] py-2 h-8 mt-2">
              Start Chat
            </button>
          </Card>

          <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl flex flex-col justify-between p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 border border-zinc-200 rounded-xl">
                <Mail className="h-4 w-4 text-neutral-900" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-900">Email Assistance</h3>
                <p className="text-[9px] font-space uppercase tracking-wider text-zinc-500 leading-normal">
                  Get a response within 24 hours.
                </p>
              </div>
            </div>
            <button className="btn-secondary-pill w-full text-[10px] py-2 h-8 mt-2">
              Send Email
            </button>
          </Card>

          <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl flex flex-col justify-between p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 border border-zinc-200 rounded-xl">
                <Phone className="h-4 w-4 text-neutral-900" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-900">Direct Line</h3>
                <p className="text-[9px] font-space uppercase tracking-wider text-zinc-500 leading-normal">
                  Available Mon-Fri, 9 AM - 6 PM IST.
                </p>
              </div>
            </div>
            <button className="btn-secondary-pill w-full text-[10px] py-2 h-8 mt-2">
              Call Now
            </button>
          </Card>

          <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl flex flex-col justify-between p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 border border-zinc-200 rounded-xl">
                <FileText className="h-4 w-4 text-neutral-900" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-900">Knowledge Base</h3>
                <p className="text-[9px] font-space uppercase tracking-wider text-zinc-500 leading-normal">
                  Read documentation and tutorials.
                </p>
              </div>
            </div>
            <button className="btn-secondary-pill w-full text-[10px] py-2 h-8 mt-2">
              Browse Guides
            </button>
          </Card>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="pt-4">
        <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-150">
            <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-zinc-150 p-0">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="transition-colors hover:bg-neutral-50/40">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-800 pr-4">
                      {item.question}
                    </span>
                    <ChevronDown 
                      className={`h-4.5 w-4.5 text-zinc-400 transform transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-neutral-900' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-40 border-b border-zinc-100' : 'max-h-0'
                    }`}
                  >
                    <p className="px-6 pb-5 pt-1 text-[10px] font-space uppercase tracking-wider text-zinc-500 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
