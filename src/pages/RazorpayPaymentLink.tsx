import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
          <div className="flex items-center gap-2 text-yellow-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Payment Pending</span>
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Awaiting Verification</span>
          </div>
        );
      case 'verified':
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Payment Verified</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{status}</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Payment information not found</p>
            <Button onClick={() => navigate('/campaigns')} className="mt-4 mx-auto block">
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaymentCompleted = paymentInfo.payment_status === 'verified' || paymentInfo.payment_status === 'completed';
  const isPaymentSubmitted = paymentInfo.payment_status === 'submitted';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/campaigns')}
          className="mb-6"
        >
          ← Back to Campaigns
        </Button>

        <div className="space-y-6">
          {/* Campaign Info */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Payment</CardTitle>
              <CardDescription>Complete payment for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Campaign Name</p>
                  <p className="font-semibold">{paymentInfo.campaign_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Amount</p>
                  <p className="font-semibold text-2xl text-blue-600">
                    ₹{paymentInfo.payment_amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                {getStatusBadge(paymentInfo.payment_status)}
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {!isPaymentCompleted && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How to Pay:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Click the "Open Payment Link" button below</li>
                    <li>Complete the payment on Razorpay's secure page</li>
                    <li>After payment, copy the Payment ID from Razorpay</li>
                    <li>Return here and enter the Payment ID in the form below</li>
                    <li>Submit for verification</li>
                  </ol>
                </div>

                {/* Payment Link */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Razorpay Payment Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={RAZORPAY_PAYMENT_LINK}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="flex items-center gap-2"
                    >
                      {linkCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <a
                    href={RAZORPAY_PAYMENT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="w-full md:w-auto flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open Payment Link
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Submission Form */}
          {!isPaymentCompleted && !isPaymentSubmitted && (
            <Card>
              <CardHeader>
                <CardTitle>Submit Payment Details</CardTitle>
                <CardDescription>
                  After completing payment, enter your Razorpay Payment ID below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-id">
                      Razorpay Payment ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="payment-id"
                      placeholder="pay_XXXXXXXXXXXX"
                      value={razorpayPaymentId}
                      onChange={(e) => setRazorpayPaymentId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      You'll find this on your payment receipt or Razorpay confirmation page
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information about the payment..."
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Submitting...' : 'Submit Payment for Verification'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Submitted Payment Info */}
          {isPaymentSubmitted && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">Payment Submitted</CardTitle>
                <CardDescription className="text-blue-700">
                  Your payment is being verified by our admin team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-blue-800">Razorpay Payment ID</p>
                  <p className="font-mono font-semibold text-blue-900">
                    {paymentInfo.razorpay_payment_id}
                  </p>
                </div>
                {paymentInfo.payment_submitted_at && (
                  <div>
                    <p className="text-sm text-blue-800">Submitted At</p>
                    <p className="font-semibold text-blue-900">
                      {new Date(paymentInfo.payment_submitted_at).toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-sm text-blue-800">
                    ⏱️ Verification typically takes 1-2 hours during business hours
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verified Payment Info */}
          {isPaymentCompleted && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Payment Verified
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your payment has been verified successfully
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-green-800">Razorpay Payment ID</p>
                  <p className="font-mono font-semibold text-green-900">
                    {paymentInfo.razorpay_payment_id}
                  </p>
                </div>
                {paymentInfo.payment_verified_at && (
                  <div>
                    <p className="text-sm text-green-800">Verified At</p>
                    <p className="font-semibold text-green-900">
                      {new Date(paymentInfo.payment_verified_at).toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="pt-3 border-t border-green-200">
                  <Button onClick={() => navigate(`/campaigns/${campaignId}`)} className="w-full">
                    View Campaign Details
                  </Button>
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
