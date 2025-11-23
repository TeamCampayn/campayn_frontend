import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, SOCKET_URL } from '@/lib/api';
import { 
  CreditCard, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  IndianRupee,
  Calendar,
  Building2
} from 'lucide-react';

interface PendingPayment {
  campaign_id: string;
  campaign_name: string;
  brand_name: string;
  budget: number;
  payment_status: string;
  payment_amount: number;
  payment_request_sent_at?: string;
  payment_due_date?: string;
  upi_id?: string;
  payment_record_id?: string;
  upi_transaction_id?: string;
  upi_ref_number?: string;
  payment_screenshot_url?: string;
  brand_payment_notes?: string;
  payment_submitted_at?: string;
}

const AdminPaymentDashboard: React.FC = () => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  // Realtime updates via socket
  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchPendingPayments();
    socket.on('payment_updated', handler);
    return () => {
      socket.off('payment_updated', handler);
    };
  }, [socket]);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('api/payments/pending'));
      const data = await response.json();

      if (data.success) {
        setPendingPayments(data.payments);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch pending payments",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: string, hasPaymentRecord: boolean) => {
    if (status === 'pending' && !hasPaymentRecord) {
      return <Badge className="bg-yellow-500 text-white">Request Pending</Badge>;
    }
    if (status === 'pending' && hasPaymentRecord) {
      return <Badge className="bg-blue-500 text-white">Payment Submitted</Badge>;
    }
    if (status === 'processing') {
      return <Badge className="bg-blue-500 text-white">Processing</Badge>;
    }
    return <Badge className="bg-gray-500 text-white">{status}</Badge>;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Dashboard</h1>
          <p className="text-gray-600">Manage campaign payments and verifications</p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">
            {pendingPayments.length} Pending Payment{pendingPayments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {pendingPayments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending payments to review at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingPayments.map((payment) => (
            <Card key={payment.campaign_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{payment.campaign_name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>{payment.brand_name}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {getPaymentStatusBadge(payment.payment_status, !!payment.payment_record_id)}
                    {payment.payment_due_date && (
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Due: {getDaysUntilDue(payment.payment_due_date) > 0 
                            ? `${getDaysUntilDue(payment.payment_due_date)} days` 
                            : 'Overdue'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Amount Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Campaign Budget</p>
                    <p className="text-lg font-semibold">{formatCurrency(payment.budget)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Amount Due</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(payment.payment_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Platform Fee</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(payment.payment_amount - payment.budget)}
                    </p>
                  </div>
                </div>

                {/* Payment Request Status */}
                {!payment.payment_request_sent_at && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Payment request not sent yet
                      </span>
                    </div>
                  </div>
                )}

                {payment.payment_request_sent_at && !payment.payment_record_id && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Payment request sent on {new Date(payment.payment_request_sent_at).toLocaleDateString()}
                      </span>
                    </div>
                    {payment.upi_id && (
                      <p className="text-sm text-blue-700 mt-1">UPI ID: {payment.upi_id}</p>
                    )}
                  </div>
                )}

                {/* Payment Proof Status */}
                {payment.payment_record_id && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Payment proof submitted
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {payment.upi_transaction_id && (
                        <div>
                          <span className="font-medium">Transaction ID:</span> {payment.upi_transaction_id}
                        </div>
                      )}
                      {payment.upi_ref_number && (
                        <div>
                          <span className="font-medium">Ref Number:</span> {payment.upi_ref_number}
                        </div>
                      )}
                      {payment.payment_submitted_at && (
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(payment.payment_submitted_at).toLocaleDateString()}
                        </div>
                      )}
                      {payment.payment_screenshot_url && (
                        <div>
                          <a 
                            href={payment.payment_screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            View Screenshot
                          </a>
                        </div>
                      )}
                    </div>
                    {payment.brand_payment_notes && (
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <span className="font-medium">Brand Notes:</span>
                        <p className="text-green-700 mt-1">{payment.brand_payment_notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate(`/admin/campaigns/${payment.campaign_id}`)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Campaign
                  </Button>
                  
                  {payment.payment_record_id && (
                    <Button
                      onClick={() => navigate(`/admin/campaigns/${payment.campaign_id}`)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Verify Payment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentDashboard;