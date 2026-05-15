import React from 'react';

const DataDeletion: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto bg-zinc-900/50 rounded-3xl p-8 md:p-12 border border-zinc-800 shadow-2xl">
        <h1 className="text-4xl font-black mb-8 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
          DATA DELETION INSTRUCTIONS
        </h1>
        
        <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
          At Campayn, we value your privacy and provide you with full control over your data. According to Meta's (Facebook/Instagram) Platform Rules, we provide a way for you to delete your account and all associated data.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">How to Delete Your Data</h2>
          <div className="space-y-4 text-zinc-400">
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
              <p>Go to your <span className="text-white font-medium">Facebook Profile Settings & Privacy</span>.</p>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
              <p>Click <span className="text-white font-medium">Apps and Websites</span> and find <span className="text-white font-medium">Campayn</span>.</p>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
              <p>Click the <span className="text-white font-medium">Remove</span> button.</p>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
              <p>Alternatively, email our support team at <span className="text-emerald-400">support@campayn.tech</span> with the subject "Data Deletion Request" and your account details.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">What Data is Deleted?</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
            <li>Your profile information (name, bio, contact details)</li>
            <li>Stored Instagram Access Tokens</li>
            <li>Campaign history and metrics associated with your ID</li>
            <li>Any cached media assets</li>
          </ul>
        </section>

        <div className="pt-8 border-t border-zinc-800 text-sm text-zinc-500 italic">
          Last updated: May 15, 2026. Processing of deletion requests typically takes 24-48 hours.
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;
