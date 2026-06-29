import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/api';
import { CreditCard, CheckCircle, XCircle, Loader2, IndianRupee } from 'lucide-react';

interface RazorpayCheckoutProps {
  campaignId: string;
  amount: number;
  campaignName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  campaignId,
  amount,
  campaignName,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway. Please refresh the page.',
        variant: 'destructive'
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  // Check existing payment status
  useEffect(() => {
    checkPaymentStatus();
  }, [campaignId]);

  const checkPaymentStatus = async () => {
    try {
      const url = getApiUrl(`api/campaigns/${campaignId}/payment-status`);
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.payment) {
        setPaymentStatus(data.payment.status);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const createOrder = async () => {
    try {
      const url = getApiUrl(`api/campaigns/${campaignId}/create-payment-order`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `campaign_${campaignId}_${Date.now()}`
        }),
      });

      const data = await response.json();

      if (!data.success) {
        const detail = data.gateway_details?.description || data.gateway_details?.error?.description || data.error || 'Failed to create order';
        const code = data.gateway_details?.code || data.error_type || 'order_error';
        throw new Error(`[${code}] ${detail}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const url = getApiUrl(`api/campaigns/${campaignId}/verify-payment`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast({
        title: 'Please wait',
        description: 'Payment gateway is loading...',
        variant: 'default'
      });
      return;
    }

    try {
      setLoading(true);

      const orderData = await createOrder();
      const order = orderData.order;
      const razorpayKeyId = orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_T3kVFyGMu3jhtP';

      if (order.id.startsWith('order_mock_')) {
        toast({
          title: 'Sandbox Simulation Mode',
          description: `Processing mock UPI transaction for ₹${amount.toLocaleString('en-IN')}...`,
        });
        
        // Wait 1.5 seconds to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verify mock payment
        await verifyPayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature',
        });

        setPaymentStatus('paid');
        
        toast({
          title: 'Payment Successful! 🎉',
          description: `Payment of ₹${amount.toLocaleString('en-IN')} completed successfully (Sandbox)`,
        });

        onSuccess?.();
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Campayn',
        description: campaignName,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setPaymentStatus('paid');
            
            toast({
              title: 'Payment Successful! 🎉',
              description: `Payment of ₹${amount} completed successfully`,
            });

            onSuccess?.();
          } catch (error: any) {
            toast({
              title: 'Payment Verification Failed',
              description: error.message || 'Please contact support',
              variant: 'destructive'
            });
            onError?.(error);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment',
              variant: 'default'
            });
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          campaign_id: campaignId,
          campaign_name: campaignName
        },
        theme: {
          color: '#3B82F6' // Blue color matching your app theme
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        setLoading(false);
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Please try again',
          variant: 'destructive'
        });
        onError?.(new Error(response.error.description));
      });

      rzp.open();

    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive'
      });
      onError?.(error);
    }
  };

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Complete your payment to proceed with the campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Campaign</p>
            <p className="font-semibold">{campaignName}</p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              <IndianRupee className="h-5 w-5" />
              {amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {paymentStatus === 'paid' ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Payment Completed</p>
                <p className="text-sm">Your campaign is now active</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={handlePayment}
              disabled={loading || !razorpayLoaded}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !razorpayLoaded ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading Payment Gateway...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{amount.toLocaleString('en-IN')}
                </>
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>Secure payment powered by Razorpay</p>
              <p>Supports UPI, Cards, Net Banking, and Wallets</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RazorpayCheckout;
