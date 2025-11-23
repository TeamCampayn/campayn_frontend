import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getApiUrl } from '@/lib/api';

interface PendingPayment {
  campaign_id: string;
  campaign_name: string;
  brand_name: string;
  budget: number;
  payment_amount: number;
  razorpay_payment_id: string;
  payment_notes?: string;
  payment_submitted_at: string;
  payment_status: string;
}

const AdminRazorpayVerification: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Dialog states
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch(getApiUrl('api/admin/razorpay-payments/pending'), {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingPayments(data.payments || []);
      } else {
        throw new Error('Failed to fetch pending payments');
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setVerifyDialogOpen(true);
  };

  const handleRejectClick = (payment: PendingPayment) => {
    setSelectedPayment(payment);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const verifyPayment = async () => {
    if (!selectedPayment) return;

    setProcessing(selectedPayment.campaign_id);

    try {
      const response = await fetch(
        getApiUrl(`api/admin/campaigns/${selectedPayment.campaign_id}/verify-razorpay-payment`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.id}`,
          },
          body: JSON.stringify({
            admin_id: user?.id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Payment verified successfully',
        });
        fetchPendingPayments(); // Refresh list
        setVerifyDialogOpen(false);
      } else {
        throw new Error(data.error || 'Failed to verify payment');
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify payment',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
      setSelectedPayment(null);
    }
  };

  const rejectPayment = async () => {
    if (!selectedPayment || !rejectionReason.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(selectedPayment.campaign_id);

    try {
      const response = await fetch(
        getApiUrl(`api/admin/campaigns/${selectedPayment.campaign_id}/reject-razorpay-payment`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.id}`,
          },
          body: JSON.stringify({
            admin_id: user?.id,
            rejection_reason: rejectionReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Payment Rejected',
          description: 'Brand has been notified',
        });
        fetchPendingPayments(); // Refresh list
        setRejectDialogOpen(false);
      } else {
        throw new Error(data.error || 'Failed to reject payment');
      }
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject payment',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
      setSelectedPayment(null);
      setRejectionReason('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Razorpay Payment Verification</h1>
            <p className="text-gray-600 mt-1">Verify brand payment submissions</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchPendingPayments}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {pendingPayments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending payment verifications at the moment</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <Card key={payment.campaign_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{payment.campaign_name}</CardTitle>
                      <CardDescription className="mt-1">
                        Brand: <span className="font-semibold">{payment.brand_name}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Verification
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Payment Amount</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{payment.payment_amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Razorpay Payment ID</p>
                      <p className="font-mono font-semibold text-sm break-all">
                        {payment.razorpay_payment_id}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Submitted At</p>
                      <p className="font-semibold">
                        {new Date(payment.payment_submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {payment.payment_notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Brand Notes:</p>
                      <p className="text-sm text-blue-800">{payment.payment_notes}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <a
                      href={`https://dashboard.razorpay.com/app/payments/${payment.razorpay_payment_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Verify on Razorpay Dashboard
                      </Button>
                    </a>
                    <Button
                      onClick={() => handleVerifyClick(payment)}
                      disabled={processing === payment.campaign_id}
                      className="flex-1 bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {processing === payment.campaign_id ? 'Processing...' : 'Verify Payment'}
                    </Button>
                    <Button
                      onClick={() => handleRejectClick(payment)}
                      disabled={processing === payment.campaign_id}
                      variant="destructive"
                      className="flex-1 flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Verify Confirmation Dialog */}
        <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Payment</DialogTitle>
              <DialogDescription>
                Are you sure you want to verify this payment? This will activate the campaign.
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-3 py-4">
                <div>
                  <p className="text-sm text-gray-600">Campaign</p>
                  <p className="font-semibold">{selectedPayment.campaign_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Amount</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{selectedPayment.payment_amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Razorpay Payment ID</p>
                  <p className="font-mono text-sm">{selectedPayment.razorpay_payment_id}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={verifyPayment} disabled={processing !== null}>
                {processing ? 'Verifying...' : 'Confirm Verification'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Payment</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this payment. The brand will be notified.
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm text-gray-600">Campaign</p>
                  <p className="font-semibold">{selectedPayment.campaign_name}</p>
                </div>
                <div>
                  <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="E.g., Payment ID not found, Incorrect amount, etc."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={rejectPayment}
                disabled={processing !== null || !rejectionReason.trim()}
              >
                {processing ? 'Rejecting...' : 'Reject Payment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminRazorpayVerification;
