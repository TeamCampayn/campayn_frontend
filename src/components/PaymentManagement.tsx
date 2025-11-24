import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl, SOCKET_URL } from '@/lib/api';
import { 
  CreditCard, 
  QrCode, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  IndianRupee,
  Upload,
  FileImage
} from 'lucide-react';

interface PaymentManagementProps {
  campaignId: string;
  userType: 'admin' | 'brand';
  onPaymentUpdate?: () => void;
}

interface PaymentInfo {
  campaign_id: string;
  campaign_name: string;
  brand_name: string;
  budget: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'processing' | 'completed' | 'failed';
  payment_amount: number;
  payment_request_sent_at?: string;
  payment_due_date?: string;
  upi_id?: string;
  qr_code_url?: string;
  payment_instructions?: string;
  payment_record_id?: string;
  upi_transaction_id?: string;
  upi_ref_number?: string;
  payment_screenshot_url?: string;
  brand_payment_notes?: string;
  admin_verified_by?: string;
  admin_verified_at?: string;
  admin_verification_notes?: string;
  payment_submitted_at?: string;
  has_payment_record: boolean;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({
  campaignId,
  userType,
  onPaymentUpdate
}) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, brand } = useAuth();
  const { socket } = useSocket();

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    upi_id: '',
    qr_code_url: '',
    payment_instructions: ''
  });

  // Brand form state
  const [brandForm, setBrandForm] = useState({
    upi_transaction_id: '',
    upi_ref_number: '',
    payment_screenshot_url: '',
    brand_payment_notes: ''
  });

  // Admin verification state
  const [verificationForm, setVerificationForm] = useState({
    verified: false,
    admin_verification_notes: ''
  });

  useEffect(() => {
    fetchPaymentInfo();
  }, [campaignId]);

  // Realtime updates via socket
  useEffect(() => {
    if (!socket) return;
    const handler = (payload: any) => {
      if (payload?.campaign_id === campaignId) {
        fetchPaymentInfo();
        onPaymentUpdate?.();
      }
    };
    socket.on('payment_updated', handler);
    return () => {
      socket.off('payment_updated', handler);
    };
  }, [socket, campaignId]);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`api/campaigns/${campaignId}/payment`));
      const data = await response.json();

      if (data.success) {
        setPaymentInfo(data.payment);
        
        // Pre-fill forms with existing data
        if (data.payment.upi_id) {
          setAdminForm({
            upi_id: data.payment.upi_id || '',
            qr_code_url: data.payment.qr_code_url || '',
            payment_instructions: data.payment.payment_instructions || ''
          });
        }

        if (data.payment.upi_transaction_id) {
          setBrandForm({
            upi_transaction_id: data.payment.upi_transaction_id || '',
            upi_ref_number: data.payment.upi_ref_number || '',
            payment_screenshot_url: data.payment.payment_screenshot_url || '',
            brand_payment_notes: data.payment.brand_payment_notes || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendPaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminForm.upi_id.trim()) {
      toast({
        title: "Error",
        description: "UPI ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:4000/api/campaigns/${campaignId}/payment-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...adminForm,
          admin_id: user?.id || 'admin-user-id'
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Payment request sent successfully",
        });
        fetchPaymentInfo();
        onPaymentUpdate?.();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send payment request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending payment request:', error);
      toast({
        title: "Error",
        description: "Failed to send payment request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brandForm.upi_transaction_id.trim()) {
      toast({
        title: "Error",
        description: "UPI Transaction ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:4000/api/campaigns/${campaignId}/payment-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...brandForm,
          brand_id: brand?.id || user?.id || 'brand-user-id'
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Payment proof submitted successfully",
        });
        fetchPaymentInfo();
        onPaymentUpdate?.();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit payment proof",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting payment proof:', error);
      toast({
        title: "Error",
        description: "Failed to submit payment proof",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyPayment = async (verified: boolean) => {
    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:4000/api/campaigns/${campaignId}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verified,
          admin_verification_notes: verificationForm.admin_verification_notes,
          admin_id: user?.id || 'admin-user-id'
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: verified ? "Payment verified successfully" : "Payment rejected",
        });
        fetchPaymentInfo();
        onPaymentUpdate?.();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to verify payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Error",
        description: "Failed to verify payment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Payment Pending' },
      processing: { color: 'bg-blue-500', text: 'Processing' },
      paid: { color: 'bg-green-500', text: 'Paid' },
      completed: { color: 'bg-green-500', text: 'Verified' },
      failed: { color: 'bg-red-500', text: 'Failed' },
      refunded: { color: 'bg-gray-500', text: 'Refunded' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!paymentInfo) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p className="text-gray-500">Payment information not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Campaign</p>
              <p className="text-lg font-semibold">{paymentInfo.campaign_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Brand</p>
              <p className="text-lg">{paymentInfo.brand_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Campaign Budget</p>
              <p className="text-lg">{formatCurrency(paymentInfo.budget)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Total Amount Due</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(paymentInfo.payment_amount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Payment Status</p>
              {getPaymentStatusBadge(paymentInfo.payment_status)}
            </div>
            {paymentInfo.payment_due_date && (
              <div>
                <p className="text-sm font-medium text-gray-700">Due Date</p>
                <p className="text-lg">
                  {new Date(paymentInfo.payment_due_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin: Send Payment Request */}
      {userType === 'admin' && !paymentInfo.payment_request_sent_at && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Payment Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendPaymentRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., merchant@paytm"
                  value={adminForm.upi_id}
                  onChange={(e) => setAdminForm({...adminForm, upi_id: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/qr-code.png"
                  value={adminForm.qr_code_url}
                  onChange={(e) => setAdminForm({...adminForm, qr_code_url: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Instructions
                </label>
                <Textarea
                  placeholder="Additional payment instructions for the brand..."
                  rows={3}
                  value={adminForm.payment_instructions}
                  onChange={(e) => setAdminForm({...adminForm, payment_instructions: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Payment Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Show Payment Request Details */}
      {paymentInfo.payment_request_sent_at && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Payment Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                Payment request sent on: {new Date(paymentInfo.payment_request_sent_at).toLocaleDateString()}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">UPI ID:</span> {paymentInfo.upi_id}
                </div>
                {paymentInfo.qr_code_url && (
                  <div>
                    <span className="font-medium">QR Code:</span>{' '}
                    <a 
                      href={paymentInfo.qr_code_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View QR Code
                    </a>
                  </div>
                )}
                {paymentInfo.payment_instructions && (
                  <div>
                    <span className="font-medium">Instructions:</span>
                    <p className="text-gray-700 mt-1">{paymentInfo.payment_instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brand: Submit Payment Proof */}
      {userType === 'brand' && paymentInfo.payment_request_sent_at && !paymentInfo.admin_verified_at && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Submit Payment Proof
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPaymentProof} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI Transaction ID *
                </label>
                <Input
                  type="text"
                  placeholder="Enter UPI transaction ID"
                  value={brandForm.upi_transaction_id}
                  onChange={(e) => setBrandForm({...brandForm, upi_transaction_id: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI Reference Number (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Enter UPI reference number"
                  value={brandForm.upi_ref_number}
                  onChange={(e) => setBrandForm({...brandForm, upi_ref_number: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Screenshot URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/screenshot.png"
                  value={brandForm.payment_screenshot_url}
                  onChange={(e) => setBrandForm({...brandForm, payment_screenshot_url: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <Textarea
                  placeholder="Any additional information about the payment..."
                  rows={3}
                  value={brandForm.brand_payment_notes}
                  onChange={(e) => setBrandForm({...brandForm, brand_payment_notes: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Payment Proof
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Show Payment Proof Details */}
      {paymentInfo.has_payment_record && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Payment Proof Submitted
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 mb-2">
                Payment proof submitted on: {paymentInfo.payment_submitted_at && new Date(paymentInfo.payment_submitted_at).toLocaleDateString()}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Transaction ID:</span> {paymentInfo.upi_transaction_id}
                </div>
                {paymentInfo.upi_ref_number && (
                  <div>
                    <span className="font-medium">Reference Number:</span> {paymentInfo.upi_ref_number}
                  </div>
                )}
                {paymentInfo.payment_screenshot_url && (
                  <div>
                    <span className="font-medium">Screenshot:</span>{' '}
                    <a 
                      href={paymentInfo.payment_screenshot_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Screenshot
                    </a>
                  </div>
                )}
                {paymentInfo.brand_payment_notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-gray-700 mt-1">{paymentInfo.brand_payment_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin: Verify Payment */}
      {userType === 'admin' && paymentInfo.has_payment_record && !paymentInfo.admin_verified_at && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Verify Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Show proof summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {paymentInfo.upi_transaction_id && (
                  <div>
                    <span className="font-medium">Transaction ID:</span> {paymentInfo.upi_transaction_id}
                  </div>
                )}
                {paymentInfo.upi_ref_number && (
                  <div>
                    <span className="font-medium">Ref Number:</span> {paymentInfo.upi_ref_number}
                  </div>
                )}
                {paymentInfo.payment_submitted_at && (
                  <div>
                    <span className="font-medium">Submitted:</span>{' '}
                    {new Date(paymentInfo.payment_submitted_at).toLocaleString()}
                  </div>
                )}
                {paymentInfo.payment_screenshot_url && (
                  <div>
                    <a 
                      href={paymentInfo.payment_screenshot_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Screenshot
                    </a>
                  </div>
                )}
              </div>
              {paymentInfo.brand_payment_notes && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <span className="font-medium">Brand Notes:</span>
                  <p className="text-blue-800 mt-1">{paymentInfo.brand_payment_notes}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Notes
              </label>
              <Textarea
                placeholder="Add verification notes..."
                rows={3}
                value={verificationForm.admin_verification_notes}
                onChange={(e) => setVerificationForm({...verificationForm, admin_verification_notes: e.target.value})}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleVerifyPayment(true)}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Verify & Approve
              </Button>
              <Button 
                onClick={() => handleVerifyPayment(false)}
                disabled={submitting}
                variant="destructive"
                className="flex-1"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Verification Status */}
      {paymentInfo.admin_verified_at && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {paymentInfo.payment_status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Payment {paymentInfo.payment_status === 'completed' ? 'Verified' : 'Rejected'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${
              paymentInfo.payment_status === 'completed' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className={`text-sm mb-2 ${
                paymentInfo.payment_status === 'completed' ? 'text-green-700' : 'text-red-700'
              }`}>
                Payment {paymentInfo.payment_status === 'completed' ? 'verified' : 'rejected'} on: {new Date(paymentInfo.admin_verified_at).toLocaleDateString()}
              </p>
              {paymentInfo.admin_verification_notes && (
                <div>
                  <span className="font-medium">Admin Notes:</span>
                  <p className="text-gray-700 mt-1">{paymentInfo.admin_verification_notes}</p>
                </div>
              )}
              {paymentInfo.payment_status === 'completed' && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-medium">
                    🎉 Campaign has moved to Content Approval phase!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentManagement;