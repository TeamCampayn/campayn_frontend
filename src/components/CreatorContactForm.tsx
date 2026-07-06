
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, MessageSquare, User, Sparkle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  platform: z.string().min(1, 'Please specify your platform'),
  followers: z.string().min(1, 'Please provide follower count'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export const CreatorContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('creator_contact_submissions')
        .insert({
          name: data.name,
          email: data.email,
          platform: data.platform,
          followers: data.followers,
          message: data.message,
        });

      if (error) {
        console.error('Contact form error:', error);
        toast.error('Failed to send message. Please try again.');
      } else {
        toast.success("Message sent successfully! We'll get back to you soon.");
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-3 pb-4 pt-2 md:px-4">
      <div className="grain rounded-[2rem] bg-panel border border-foreground/10 shadow-sm px-6 py-12 md:px-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 border border-foreground/10 bg-background/60 px-4 py-2 rounded-full mb-5">
              <Sparkle className="w-3.5 h-3.5 fill-blue text-blue" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/60">
                Contact Information
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-zinc-900 mb-4 tracking-tight">
              Ready to Collaborate?
            </h2>
            <p className="font-sans text-base md:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              Have questions about joining our platform? Want to discuss partnership opportunities?
              We'd love to hear from you and help you grow your creator journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="font-heading text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Let's Connect</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-zinc-900 text-sm mb-0.5">Email Us</h4>
                    <p className="font-sans text-sm text-zinc-500">contact@campayn.in</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-zinc-900 text-sm mb-0.5">Quick Response</h4>
                    <p className="font-sans text-sm text-zinc-500">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-zinc-900 text-sm mb-0.5">Dedicated Support</h4>
                    <p className="font-sans text-sm text-zinc-500">Personal support for every creator</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-zinc-200/80 rounded-[1.5rem] p-7 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-zinc-900 mb-6 tracking-tight">Send us a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="John Doe"
                      className="font-sans border-zinc-200 bg-zinc-50 focus:border-zinc-900 focus:ring-0 rounded-xl text-zinc-900 placeholder:text-zinc-400 text-sm"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 font-sans">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      className="font-sans border-zinc-200 bg-zinc-50 focus:border-zinc-900 focus:ring-0 rounded-xl text-zinc-900 placeholder:text-zinc-400 text-sm"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 font-sans">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="platform" className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Primary Platform
                    </Label>
                    <Input
                      id="platform"
                      {...register('platform')}
                      placeholder="Instagram, YouTube, etc."
                      className="font-sans border-zinc-200 bg-zinc-50 focus:border-zinc-900 focus:ring-0 rounded-xl text-zinc-900 placeholder:text-zinc-400 text-sm"
                    />
                    {errors.platform && (
                      <p className="text-xs text-red-500 font-sans">{errors.platform.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="followers" className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Follower Count
                    </Label>
                    <Input
                      id="followers"
                      {...register('followers')}
                      placeholder="10K, 100K, 1M+"
                      className="font-sans border-zinc-200 bg-zinc-50 focus:border-zinc-900 focus:ring-0 rounded-xl text-zinc-900 placeholder:text-zinc-400 text-sm"
                    />
                    {errors.followers && (
                      <p className="text-xs text-red-500 font-sans">{errors.followers.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    placeholder="Tell us about yourself, your content, and how we can help you grow..."
                    rows={5}
                    className="font-sans border-zinc-200 bg-zinc-50 focus:border-zinc-900 focus:ring-0 rounded-xl text-zinc-900 placeholder:text-zinc-400 text-sm resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 font-sans">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-heading font-bold text-sm py-3 rounded-2xl transition-all duration-200 shadow-sm tracking-tight"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
