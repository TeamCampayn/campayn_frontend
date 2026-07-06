import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '../../components/landing/LandingHeader';
import { Footer } from '../../components/landing/Footer';

const DataDeletion: React.FC = () => {
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
            Data Deletion Instructions
          </h1>
          
          <p className="text-zinc-500 mb-8 font-sans text-sm md:text-base leading-relaxed">
            At Campayn, we value your privacy and provide you with full control over your data. According to Meta's (Facebook/Instagram) Platform Rules, we provide a way for you to delete your account and all associated data.
          </p>

          <div className="space-y-8 font-sans text-zinc-600 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                How to Delete Your Data
              </h2>
              <div className="space-y-4 text-zinc-600">
                <div className="flex gap-4 items-start">
                  <span className="w-8 h-8 bg-blue/10 text-blue rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                  <p className="pt-1">Go to your <span className="text-zinc-900 font-semibold">Facebook Profile Settings & Privacy</span>.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="w-8 h-8 bg-blue/10 text-blue rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                  <p className="pt-1">Click <span className="text-zinc-900 font-semibold">Apps and Websites</span> and find <span className="text-zinc-900 font-semibold">Campayn</span>.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="w-8 h-8 bg-blue/10 text-blue rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                  <p className="pt-1">Click the <span className="text-zinc-900 font-semibold">Remove</span> button.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="w-8 h-8 bg-blue/10 text-blue rounded-full flex items-center justify-center font-bold shrink-0">4</span>
                  <p className="pt-1">Alternatively, email our support team at <span className="text-blue font-bold">support@campayn.tech</span> with the subject "Data Deletion Request" and your account details.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                What Data is Deleted?
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 ml-2">
                <li>Your profile information (name, bio, contact details)</li>
                <li>Stored Instagram Access Tokens</li>
                <li>Campaign history and metrics associated with your ID</li>
                <li>Any cached media assets</li>
              </ul>
            </section>

            <div className="pt-8 border-t border-zinc-200 text-xs text-zinc-400 italic">
              Last updated: May 15, 2026. Processing of deletion requests typically takes 24-48 hours.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DataDeletion;
