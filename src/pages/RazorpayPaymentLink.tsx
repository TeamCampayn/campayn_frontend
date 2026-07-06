import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/lib/api';

const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@campaynprivatelimited';

interface PaymentInfo {
  campaign_id: string;
  campaign_name: string;
  budget: number;
  payment_status: string;
  payment_amount: number;
  razorpay_payment_id?: string;
  payment_notes?: string;
  payment_submitted_at?: string;
  payment_verified_at?: string;
}

const RazorpayPaymentLink: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user, brand } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Form fields
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    if (campaignId) {
      fetchPaymentInfo();
    }
  }, [campaignId]);

  const fetchPaymentInfo = async () => {
    try {
      const response = await fetch(getApiUrl(`api/campaigns/${campaignId}/payment-info`), {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentInfo(data.payment);
      } else {
        throw new Error('Failed to fetch payment info');
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(RAZORPAY_PAYMENT_LINK);
      setLinkCopied(true);
      toast({
        title: 'Copied!',
        description: 'Payment link copied to clipboard',
      });
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!razorpayPaymentId.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter the Razorpay Payment ID',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(getApiUrl(`api/campaigns/${campaignId}/submit-razorpay-payment`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: razorpayPaymentId.trim(),
          payment_notes: paymentNotes.trim(),
          brand_id: brand?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Payment details submitted. Waiting for admin verification.',
        });
        fetchPaymentInfo(); // Refresh payment info
        setRazorpayPaymentId('');
        setPaymentNotes('');
      } else {
        throw new Error(data.error || 'Failed to submit payment');
      }
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit payment details',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-space uppercase tracking-wider text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full w-max">
            <Clock className="h-3.5 w-3.5" />
            <span>Payment Pending</span>
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-space uppercase tracking-wider text-zinc-800 bg-zinc-50 border border-zinc-300 px-3 py-1.5 rounded-full w-max">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Awaiting Verification</span>
          </div>
        );
      case 'verified':
      case 'completed':
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-space uppercase tracking-wider text-white bg-zinc-950 px-3 py-1.5 rounded-full w-max">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Payment Verified</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-bold font-space uppercase tracking-wider text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full w-max">
            <Clock className="h-3.5 w-3.5" />
            <span>{status}</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-950 mx-auto"></div>
          <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden p-6">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-neutral-800" />
            <div>
              <h2 className="text-xs font-bold font-space uppercase tracking-wider text-neutral-850">Payment Info Not Found</h2>
              <p className="text-[10px] font-space uppercase tracking-wider text-zinc-500 mt-1">We couldn't retrieve the payment record for this campaign.</p>
            </div>
            <button 
              onClick={() => navigate('/campaigns')} 
              className="btn-primary-pill text-xs py-2.5 px-6 mt-2"
            >
              Back to Campaigns
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaymentCompleted = paymentInfo.payment_status === 'verified' || paymentInfo.payment_status === 'completed';
  const isPaymentSubmitted = paymentInfo.payment_status === 'submitted';

  return (
    <div className="min-h-screen bg-white py-8 lg:py-12 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate('/campaigns')}
          className="btn-secondary-pill text-xs py-2 px-5 h-9 flex items-center mb-8"
        >
          ← Back to Campaigns
        </button>

        <div className="space-y-8">
          {/* Campaign Info */}
          <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-150">
              <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">Campaign Payment</CardTitle>
              <CardDescription className="text-[10px] font-space uppercase tracking-wider text-zinc-500">Complete payment for your campaign budget</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Campaign Name</p>
                  <p className="text-xs font-bold font-space uppercase tracking-wider text-neutral-900">{paymentInfo.campaign_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Payment Amount</p>
                  <p className="text-2xl font-bold font-space tracking-tight text-neutral-900">
                    ₹{paymentInfo.payment_amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-150">
                {getStatusBadge(paymentInfo.payment_status)}
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {!isPaymentCompleted && (
            <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-zinc-150">
                <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3">
                  <h4 className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-900">Step-by-Step Payment Guide:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-[10px] font-space uppercase tracking-wider text-zinc-500 leading-relaxed">
                    <li>Click <span className="text-neutral-900 font-bold">"Open Payment Link"</span> to navigate to Razorpay.</li>
                    <li>Complete the payment of <span className="text-neutral-900 font-bold">₹{paymentInfo.payment_amount.toLocaleString()}</span> securely.</li>
                    <li>Once successful, copy the <span className="text-neutral-900 font-bold">Payment ID</span> (starts with <code className="font-mono bg-zinc-200 px-1 rounded">pay_...</code>).</li>
                    <li>Submit the Payment ID in the form below for verification.</li>
                  </ol>
                </div>

                {/* Payment Link */}
                <div className="space-y-3">
                  <label className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Razorpay Payment Link</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={RAZORPAY_PAYMENT_LINK}
                      readOnly
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="btn-secondary-pill text-xs py-2.5 px-5 h-10 flex items-center justify-center gap-1.5"
                    >
                      {linkCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-neutral-900" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-neutral-900" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="pt-2">
                    <a
                      href={RAZORPAY_PAYMENT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full sm:w-auto"
                    >
                      <button className="btn-primary-pill w-full sm:w-auto text-xs py-2.5 px-6 h-10 flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Open Payment Link
                      </button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Submission Form */}
          {!isPaymentCompleted && !isPaymentSubmitted && (
            <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-zinc-150">
                <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">Submit Payment Details</CardTitle>
                <CardDescription className="text-[10px] font-space uppercase tracking-wider text-zinc-500">
                  After completing the transfer, enter your Razorpay Payment ID to verify your transaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitPayment} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="payment-id" className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">
                      Razorpay Payment ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="payment-id"
                      required
                      placeholder="E.g., pay_PxR7N2kL90a1Bc"
                      value={razorpayPaymentId}
                      onChange={(e) => setRazorpayPaymentId(e.target.value)}
                      className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors"
                    />
                    <p className="text-[9px] text-zinc-400 font-space uppercase tracking-wider mt-1">
                      Available on your Razorpay email receipt or success confirmation page.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="notes" className="block text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Additional Notes (Optional)</label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Enter any additional details about this transfer..."
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="w-full bg-transparent border border-zinc-200 focus:border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs font-space uppercase tracking-wider outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="btn-primary-pill w-full text-xs py-2.5 h-10 flex items-center justify-center"
                    >
                      {submitting ? 'Submitting Details...' : 'Submit Payment for Verification'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Submitted Payment Info */}
          {isPaymentSubmitted && (
            <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden bg-zinc-50/40">
              <CardHeader className="pb-3 border-b border-zinc-150">
                <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">Payment Submitted</CardTitle>
                <CardDescription className="text-[10px] font-space uppercase tracking-wider text-zinc-500">
                  Our operations team is currently verifying your transaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Razorpay Payment ID</p>
                  <p className="text-xs font-mono font-bold text-neutral-900">
                    {paymentInfo.razorpay_payment_id}
                  </p>
                </div>
                {paymentInfo.payment_submitted_at && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Submitted At</p>
                    <p className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
                      {new Date(paymentInfo.payment_submitted_at).toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="pt-4 border-t border-zinc-150 text-[10px] font-space uppercase tracking-wider text-zinc-500 leading-normal flex items-center gap-2">
                  <Clock className="h-4 w-4 text-black flex-shrink-0" />
                  <span>Verification typically completes within 1-2 hours during business hours.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verified Payment Info */}
          {isPaymentCompleted && (
            <Card className="bg-white border border-zinc-200 shadow-none rounded-2xl overflow-hidden bg-zinc-50/40">
              <CardHeader className="pb-3 border-b border-zinc-150">
                <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-black" />
                  Payment Verified
                </CardTitle>
                <CardDescription className="text-[10px] font-space uppercase tracking-wider text-zinc-500">
                  Your payment has been successfully recorded and applied.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Razorpay Payment ID</p>
                  <p className="text-xs font-mono font-bold text-neutral-900">
                    {paymentInfo.razorpay_payment_id}
                  </p>
                </div>
                {paymentInfo.payment_verified_at && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold font-space uppercase tracking-wider text-zinc-500">Verified At</p>
                    <p className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800">
                      {new Date(paymentInfo.payment_verified_at).toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="pt-3 border-t border-zinc-150">
                  <button 
                    onClick={() => navigate(`/campaigns/${campaignId}`)} 
                    className="btn-primary-pill w-full text-xs py-2.5 h-10 flex items-center justify-center"
                  >
                    View Campaign Details
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RazorpayPaymentLink;
