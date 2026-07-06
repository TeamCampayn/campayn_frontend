import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useToast } from '../../hooks/use-toast'
import { supabase } from '../../lib/supabase'
import { getApiUrl } from '../../lib/api'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  CreditCard, 
  RefreshCw, 
  Loader2,
  Copy,
  Coins,
  ShieldCheck
} from 'lucide-react'

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
      const razorpayKeyId = orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_T3kVFyGMu3jhtP';

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
        key: razorpayKeyId,
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
          color: '#000000'
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Reference ID copied to clipboard.',
    });
  };

  if (!brand) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center min-h-[400px] flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 text-black animate-spin mx-auto mb-4" />
        <p className="text-xs font-space uppercase tracking-wider text-zinc-500">Loading brand account...</p>
      </div>
    );
  }
 
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-space tracking-tight text-neutral-900 uppercase">Escrow Wallet</h2>
          <p className="mt-1 text-xs text-neutral-500 font-space uppercase tracking-wider">
            Secure virtual wallet for campaign funding, automated payouts, and transaction audits.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-neutral-800 self-start md:self-auto">
          <ShieldCheck className="h-4 w-4 text-neutral-700 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-space">Secured by Razorpay Escrow</span>
        </div>
      </div>
 
      {/* Wallet Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balance Display Card */}
        <Card className="lg:col-span-1 bg-neutral-900 text-white shadow-sm relative overflow-hidden h-full rounded-2xl border border-neutral-800 group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-105 transition-all duration-700">
            <Wallet size={150} />
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-neutral-400 text-[10px] font-bold font-space uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-neutral-300" />
              Virtual Escrow Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-6 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold font-space tracking-tight text-white">
                  {isLoading ? '...' : `₹${(wallet?.balance || 0).toLocaleString('en-IN')}`}
                </span>
                <span className="text-xs font-bold font-space text-neutral-400">INR</span>
              </div>
              <p className="text-[10px] font-space text-neutral-400 mt-4 leading-relaxed uppercase tracking-wider">
                This balance is safely locked in platform escrow and is automatically released to creators upon approved post content submissions.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-[9px] font-bold font-space uppercase tracking-wider bg-white/10 px-3.5 py-1.5 rounded-full w-fit text-white border border-white/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Active Virtual Account</span>
            </div>
          </CardContent>
        </Card>
 
        {/* Add money Form Card */}
        <Card className="lg:col-span-2 bg-white border border-neutral-200/80 shadow-sm rounded-2xl">
          <CardHeader className="pb-3 border-b border-neutral-100/60">
            <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-neutral-700" />
              Add Funds to Wallet
            </CardTitle>
            <CardDescription className="text-[10px] font-space text-neutral-400 mt-1 uppercase tracking-wider">
              Top up your balance instantly using credit cards, UPI, net banking, or simulated Sandbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-5">
            {/* Presets */}
            <div>
              <label className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-450 block mb-2">Preset Options</label>
              <div className="grid grid-cols-3 gap-3">
                {[5000, 10000, 25000].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleDeposit(val)}
                    disabled={isDepositing}
                    className="py-2.5 px-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-bold font-space uppercase tracking-wider text-zinc-800 active:scale-98 transition-all duration-200 disabled:opacity-50"
                  >
                    + ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
 
            {/* Custom input */}
            <div>
              <label className="text-[10px] font-bold font-space uppercase tracking-wider text-neutral-450 block mb-2">Or Enter Custom Amount (INR)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">₹</span>
                  <Input
                    type="number"
                    placeholder="Enter amount (e.g., 5000)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="pl-8 h-10 rounded-xl border-neutral-200/80 focus:border-black focus:ring-black/20 font-space text-xs"
                    disabled={isDepositing}
                  />
                </div>
                <button 
                  onClick={() => handleDeposit()}
                  disabled={isDepositing}
                  className="btn-primary-pill py-2.5 px-6 h-10 text-xs font-bold uppercase font-space tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all duration-200 disabled:opacity-75"
                >
                  {isDepositing ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Deposit
                    </>
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
 
      {/* Transaction history log */}
      <Card className="bg-white border border-neutral-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100/60 p-6 bg-neutral-50/20">
          <div>
            <CardTitle className="text-xs font-bold font-space uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <History className="h-4 w-4 text-neutral-700" />
              Transaction Ledger
            </CardTitle>
            <CardDescription className="text-[10px] font-space text-neutral-400 mt-1 uppercase tracking-wider">
              Chronological record of all wallet deposits, commitments, and creator releases.
            </CardDescription>
          </div>
          <button 
            onClick={fetchWalletAndTransactions}
            className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 hover:border-neutral-300 rounded-xl text-xs font-bold font-space uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 transition-all duration-200 active:scale-95 bg-white shadow-sm"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] font-bold uppercase tracking-wider bg-neutral-50/10">
                  <th className="py-4 pl-6 font-space">Reference ID</th>
                  <th className="py-4 font-space">Type</th>
                  <th className="py-4 font-space">Details / Recipient Creator</th>
                  <th className="py-4 font-space">Status</th>
                  <th className="py-4 font-space">Date & Time</th>
                  <th className="py-4 pr-6 text-right font-space">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100/80 text-xs text-neutral-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[10px] font-bold font-space uppercase tracking-wider text-neutral-400">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => {
                    const isDebit = t.type?.toLowerCase() === 'payout' || t.type?.toLowerCase() === 'debit';
                    const formattedDate = new Date(t.created_at).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    });
                    const shortRefId = t.reference_id || t.id.substring(0, 8);
                    
                    return (
                      <tr key={t.id} className="hover:bg-neutral-50/30 transition-colors border-b border-neutral-100 last:border-0 group">
                        <td className="py-4 pl-6">
                          <button
                            onClick={() => copyToClipboard(t.reference_id || t.id)}
                            className="font-mono text-[10px] font-semibold text-neutral-400 hover:text-neutral-900 flex items-center gap-1.5 transition-colors focus:outline-none"
                            title="Click to copy Reference ID"
                          >
                            <span>{shortRefId}</span>
                            <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold font-space uppercase tracking-wider border ${
                            isDebit 
                              ? 'bg-neutral-50 text-neutral-600 border-neutral-200' 
                              : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                          }`}>
                            {isDebit ? <ArrowDownRight size={10} className="text-neutral-500" /> : <ArrowUpRight size={10} className="text-neutral-700" />}
                            {t.type}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-semibold font-sans text-xs text-neutral-800 leading-tight">
                            {t.description || (isDebit ? 'Payout to Creator' : 'Wallet Deposit')}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-space uppercase tracking-wider border ${
                            t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60'
                              : t.status?.toLowerCase() === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-100/60 animate-pulse'
                              : 'bg-red-50 text-red-700 border-red-100/60'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'success'
                                ? 'bg-emerald-500'
                                : t.status?.toLowerCase() === 'pending'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`} />
                            {t.status}
                          </span>
                        </td>
                        <td className="py-4 text-neutral-400 text-[10px] font-bold font-space uppercase tracking-wider">
                          {formattedDate}
                        </td>
                        <td className={`py-4 pr-6 text-right font-bold font-space text-sm ${
                          isDebit ? 'text-neutral-800' : 'text-emerald-600 font-bold'
                        }`}>
                          {isDebit ? '-' : '+'}₹{Number(t.amount).toLocaleString('en-IN')}
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
 
export default WalletPage;
