
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://mailing-service-zeta.vercel.app/api/generic-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          heading: 'Contact Us Brands Form'
        }),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Let's Start Something Amazing
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your brand's reach? Connect with creators who'll bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/40 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-slate-800 font-semibold">Email Us</div>
                    <div className="text-slate-600">contact@campayn.in</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <h4 className="text-xl font-bold mb-4">Why Choose Campayn?</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                  <span>AI-powered creator matching</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-purple-200" />
                  <span>Real-time campaign analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-pink-200" />
                  <span>Automated workflow management</span>
                </li>
                <li className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                  <span>Transparent pricing & payments</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/40 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12 bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-slate-700 font-medium">
                    Company Name
                  </Label>
                  <Input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="h-12 bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 font-medium">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    placeholder="Tell us about your campaign goals, target audience, and what you'd like to achieve..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  <Send className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
