import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, IndianRupee, CreditCard } from 'lucide-react';
import RazorpayPayment from './RazorpayPayment';
import axios from 'axios';

interface PaymentManagementRazorpayProps {
  campaignId: string;
  campaignName: string;
  amount: number;
  userType: 'admin' | 'brand';
  onPaymentSuccess?: () => void;
}

interface PaymentRecord {
  id: string;
  campaign_id: string;
  amount: number;
  currency: string;
  payment_status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_method?: string;
  payment_completed_at?: string;
  created_at: string;
}

const PaymentManagementRazorpay: React.FC<PaymentManagementRazorpayProps> = ({
  campaignId,
  campaignName,
  amount,
  userType,
  onPaymentSuccess,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, [campaignId]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/payments/${campaignId}`);
      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment Successful!',
      description: 'Your campaign payment has been completed.',
    });
    fetchPayments();
    onPaymentSuccess?.();
  };

  const handlePaymentFailure = (error: any) => {
    toast({
      title: 'Payment Failed',
      description: error.message || 'Something went wrong',
      variant: 'destructive',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string; icon: React.ReactNode }> = {
      completed: {
        variant: 'default',
        label: 'Paid',
        icon: <CheckCircle className="h-3 w-3" />,
      },
      pending: {
        variant: 'secondary',
        label: 'Pending',
        icon: <Clock className="h-3 w-3" />,
      },
      failed: {
        variant: 'destructive',
        label: 'Failed',
        icon: <XCircle className="h-3 w-3" />,
      },
      refunded: {
        variant: 'outline',
        label: 'Refunded',
        icon: <IndianRupee className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const latestPayment = payments[0];
  const isPaid = latestPayment?.payment_status === 'completed';

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Status Overview */}
      {latestPayment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Status</span>
              {getStatusBadge(latestPayment.payment_status)}
            </CardTitle>
            <CardDescription>Current payment information for this campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold">₹{latestPayment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium capitalize">{latestPayment.payment_method || 'N/A'}</p>
              </div>
            </div>

            {latestPayment.razorpay_payment_id && (
              <div>
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {latestPayment.razorpay_payment_id}
                </p>
              </div>
            )}

            {latestPayment.payment_completed_at && (
              <div>
                <p className="text-sm text-gray-600">Completed At</p>
                <p className="text-sm">
                  {new Date(latestPayment.payment_completed_at).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Action for Brand */}
      {userType === 'brand' && !isPaid && (
        <RazorpayPayment
          campaignId={campaignId}
          campaignName={campaignName}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      )}

      {/* Success Message for Paid Campaigns */}
      {isPaid && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Payment Completed</h3>
                <p className="text-sm text-green-700">
                  Your campaign payment has been successfully processed. You can now proceed with content approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin View - Payment History */}
      {userType === 'admin' && payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All payment transactions for this campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
                      {getStatusBadge(payment.payment_status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                    {payment.razorpay_payment_id && (
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        {payment.razorpay_payment_id}
                      </p>
                    )}
                  </div>
                  {payment.payment_method && (
                    <Badge variant="outline" className="capitalize">
                      {payment.payment_method}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Payments Yet */}
      {payments.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No Payments Yet</h3>
            <p className="text-sm text-gray-600">
              {userType === 'brand'
                ? 'Complete the payment to proceed with your campaign'
                : 'Waiting for brand to complete payment'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentManagementRazorpay;
