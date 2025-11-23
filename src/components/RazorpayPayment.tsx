import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface RazorpayPaymentProps {
  campaignId: string;
  campaignName: string;
  amount: number;
  onSuccess?: () => void;
  onFailure?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  campaignId,
  campaignName,
  amount,
  onSuccess,
  onFailure,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus('processing');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order on backend
      const orderResponse = await axios.post('http://localhost:4000/api/payments/create-order', {
        campaignId,
        amount,
        currency: 'INR',
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || 'Failed to create order');
      }

      const { order, paymentRecordId, razorpayKeyId } = orderResponse.data;

      // Razorpay checkout options
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Campayn',
        description: `Payment for ${campaignName}`,
        image: '/favicon.ico', // Your logo
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post('http://localhost:4000/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentRecordId,
              campaignId,
            });

            if (verifyResponse.data.success) {
              setPaymentStatus('success');
              toast({
                title: 'Payment Successful!',
                description: `₹${amount.toLocaleString()} paid successfully`,
              });
              onSuccess?.();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            toast({
              title: 'Payment Verification Failed',
              description: error.message || 'Please contact support',
              variant: 'destructive',
            });
            onFailure?.(error);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        notes: {
          campaign_id: campaignId,
          campaign_name: campaignName,
        },
        theme: {
          color: '#6366f1', // Indigo color
        },
        modal: {
          ondismiss: async function () {
            setLoading(false);
            setPaymentStatus('failed');
            
            // Record payment failure
            await axios.post('http://localhost:4000/api/payments/failed', {
              paymentRecordId,
              campaignId,
              error: { description: 'Payment cancelled by user' },
            });

            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment',
              variant: 'destructive',
            });
            onFailure?.({ message: 'Payment cancelled' });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setLoading(false);
      setPaymentStatus('failed');
      toast({
        title: 'Payment Failed',
        description: error.message || 'Could not initiate payment',
        variant: 'destructive',
      });
      onFailure?.(error);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing payment...';
      case 'success':
        return 'Payment completed successfully!';
      case 'failed':
        return 'Payment failed. Please try again.';
      default:
        return 'Ready to pay';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Campaign Payment
        </CardTitle>
        <CardDescription>
          Complete payment to proceed with your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Campaign:</span>
            <span className="font-medium">{campaignName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-2xl font-bold text-indigo-600">
              ₹{amount.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            * Includes all taxes and fees
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus !== 'idle' && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            paymentStatus === 'success' ? 'bg-green-50 text-green-700' :
            paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusMessage()}</span>
          </div>
        )}

        {/* Payment Methods Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Secure Payment via Razorpay</p>
              <p className="text-xs text-blue-700">
                We accept UPI, Credit/Debit Cards, Net Banking, and Wallets
              </p>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={loading || paymentStatus === 'success'}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Payment Completed
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ₹{amount.toLocaleString()}
            </>
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500">
          By proceeding, you agree to our{' '}
          <a href="/terms" className="text-indigo-600 hover:underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/refunds" className="text-indigo-600 hover:underline">
            Refund Policy
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;
