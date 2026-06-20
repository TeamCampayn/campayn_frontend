import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  CreditCard, 
  RefreshCw, 
  Loader2 
} from 'lucide-react'
import { Input } from '../../components/ui/input'
import { useToast } from '../../hooks/use-toast'
import { supabase } from '../../lib/supabase'
import { getApiUrl } from '../../lib/api'

interface Transaction {
  id: string;
  brand_id: string;
  amount: number;
  type: 'topup' | 'payout' | string;
  status: string;
  reference_id: string | null;
  description: string;
  created_at: string;
}

const WalletPage: React.FC = () => {
  const { brand } = useAuth()
  const { toast } = useToast()
  const [wallet, setWallet] = useState<{ balance: number; currency: string } | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway. Please reload.',
        variant: 'destructive'
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [toast]);

  // Fetch wallet balance and transactions
  const fetchWalletAndTransactions = async () => {
    if (!brand?.id) return;
    try {
      const response = await fetch(getApiUrl(`api/brand/wallet?brandId=${brand.id}`));
      const data = await response.json();
      if (data.success) {
        setWallet(data.wallet);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching wallet & transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletAndTransactions();

    if (!brand?.id) return;

    // Realtime subscription on brand wallet and transaction updates
    const channel = supabase
      .channel(`brand_wallet_page_realtime_${brand.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'brand_wallets', 
        filter: `brand_id=eq.${brand.id}` 
      }, () => {
        fetchWalletAndTransactions();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'brand_transactions', 
        filter: `brand_id=eq.${brand.id}` 
      }, () => {
        fetchWalletAndTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brand?.id]);

  const handleDeposit = async (amountToDeposit?: number) => {
    const amt = amountToDeposit || Number(depositAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please specify a valid amount greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    if (!razorpayLoaded) {
      toast({
        title: 'Please wait',
        description: 'Payment gateway is loading...',
        variant: 'default'
      });
      return;
    }

    setIsDepositing(true);
    try {
      // 1. Create Razorpay order on backend
      const orderResponse = await fetch(getApiUrl('api/brand/wallet/create-deposit-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandId: brand?.id,
          amount: amt
        })
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create deposit order');
      }

      const order = orderData.order;

      // 2. If it's a Sandbox Mock Order, simulate success
      if (order.id.startsWith('order_mock_')) {
        toast({
          title: 'Sandbox Simulation Mode',
          description: `Processing mock wallet deposit for ₹${amt.toLocaleString('en-IN')}...`,
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        const verifyResponse = await fetch(getApiUrl('api/brand/wallet/verify-deposit'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            brandId: brand?.id,
            amount: amt,
            razorpay_order_id: order.id,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'mock_signature'
          })
        });

        const verifyData = await verifyResponse.json();
        if (verifyResponse.ok && verifyData.success) {
          toast({
            title: 'Deposit Successful! 🎉',
            description: `₹${amt.toLocaleString()} added to your virtual wallet! (Sandbox)`,
          });
          setDepositAmount('');
          fetchWalletAndTransactions();
        } else {
          throw new Error(verifyData.error || 'Verification failed');
        }
        setIsDepositing(false);
        return;
      }

      // 3. Otherwise, open the real Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_T3kVFyGMu3jhtP',
        amount: order.amount,
        currency: order.currency,
        name: 'Campayn Wallet',
        description: `Wallet Deposit: ₹${amt.toLocaleString()}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            setIsDepositing(true);
            const verifyResponse = await fetch(getApiUrl('api/brand/wallet/verify-deposit'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                brandId: brand?.id,
                amount: amt,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyResponse.ok && verifyData.success) {
              toast({
                title: 'Deposit Successful! 🎉',
                description: `₹${amt.toLocaleString()} successfully deposited into your virtual wallet!`,
              });
              setDepositAmount('');
              fetchWalletAndTransactions();
            } else {
              toast({
                title: 'Deposit Verification Failed',
                description: verifyData.error || 'Could not verify payment.',
                variant: 'destructive',
              });
            }
          } catch (verifyErr: any) {
            toast({
              title: 'Verification Error',
              description: verifyErr.message,
              variant: 'destructive',
            });
          } finally {
            setIsDepositing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsDepositing(false);
            toast({
              title: 'Deposit Cancelled',
              description: 'You closed the payment popup.',
            });
          }
        },
        prefill: {
          name: brand?.brand_name || '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (failedResponse: any) {
        setIsDepositing(false);
        toast({
          title: 'Deposit Failed',
          description: failedResponse.error.description || 'Payment failed.',
          variant: 'destructive',
        });
      });
      rzp.open();

    } catch (err: any) {
      toast({
        title: 'Payment Error',
        description: err.message || 'Could not process deposit.',
        variant: 'destructive',
      });
      setIsDepositing(false);
    }
  };

  if (!brand) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-semibold">Loading brand account...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-800">My Escrow Wallet</h2>
        <p className="mt-1 text-gray-500 text-sm">
          Fund your secure virtual wallet and monitor differential payouts to creators.
        </p>
      </div>

      {/* Wallet Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balance Display Card */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white shadow-xl relative overflow-hidden h-full rounded-2xl border-0">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Wallet size={150} />
          </div>
          <CardHeader>
            <CardTitle className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              Virtual Escrow Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-8 flex flex-col justify-between h-48">
            <div>
              <span className="text-4xl font-extrabold tracking-tight">
                ₹{isLoading ? '...' : (wallet?.balance?.toLocaleString() || '0.00')}
              </span>
              <p className="text-xs text-indigo-200 mt-2 font-medium">
                This balance is securely locked in platform escrow for payout releases.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold bg-white/10 px-3 py-1 rounded-full w-fit">
              <CreditCard size={12} />
              <span>Auto-created Virtual Wallet</span>
            </div>
          </CardContent>
        </Card>

        {/* Add money Form Card */}
        <Card className="lg:col-span-2 shadow-sm border border-gray-200/50 rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800 font-bold">Add Funds to Wallet</CardTitle>
            <CardDescription>
              Instantly simulate a topup to credit your brand escrow virtual balance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Presets */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preset Options</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[5000, 10000, 25000].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleDeposit(val)}
                    disabled={isDepositing}
                    className="py-2.5 px-4 bg-gray-50 border border-gray-200/60 rounded-xl text-sm font-bold text-gray-700 hover:bg-indigo-50/50 hover:border-indigo-200 active:scale-95 transition-all"
                  >
                    + ₹{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom input */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or Enter Custom Amount (INR)</label>
              <div className="flex gap-3 mt-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="pl-8 rounded-xl border-gray-200"
                    disabled={isDepositing}
                  />
                </div>
                <Button 
                  onClick={() => handleDeposit()}
                  disabled={isDepositing}
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm flex items-center gap-2 rounded-xl px-5"
                >
                  {isDepositing ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4" />
                      Deposit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction history log */}
      <Card className="shadow-sm border border-gray-200/50 rounded-2xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-gray-800 font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-600" />
              Transaction Ledger
            </CardTitle>
            <CardDescription>
              Chronological record of all wallet top-ups and creator payouts.
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchWalletAndTransactions}
            className="text-xs font-semibold flex items-center gap-1.5 rounded-xl"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3">Reference ID</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Details / Recipient Creator</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => {
                    const isPayout = t.type === 'payout';
                    const formattedDate = new Date(t.created_at).toLocaleString();
                    
                    return (
                      <tr key={t.id} className="hover:bg-gray-50/50">
                        <td className="py-4 font-mono text-xs font-semibold text-gray-500">
                          {t.reference_id || t.id.substring(0, 8)}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isPayout 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/50' 
                              : 'bg-green-50 text-green-700 border border-green-200/50'
                          }`}>
                            {isPayout ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                            {t.type}
                          </span>
                        </td>
                        <td className="py-4 font-medium text-gray-800">
                          {t.description || (isPayout ? 'Payout to Creator' : 'Wallet Deposit')}
                        </td>
                        <td className="py-4">
                          <span className="inline-flex px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-full border border-gray-200/50">
                            {t.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400 text-xs font-medium">
                          {formattedDate}
                        </td>
                        <td className={`py-4 text-right font-black text-base ${
                          isPayout ? 'text-rose-600' : 'text-green-600'
                        }`}>
                          {isPayout ? '-' : '+'}₹{Number(t.amount).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WalletPage
