import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  LogOut, 
  Plus, 
  BarChart3, 
  Users, 
  Settings, 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  CreditCard, 
  RefreshCw, 
  Loader2 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { useToast } from '../hooks/use-toast'
import { supabase } from '../lib/supabase'
import { getApiUrl } from '../lib/api'

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

const BrandDashboard: React.FC = () => {
  const { user, brand, signOut, createBrandProfile, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [brandFormData, setBrandFormData] = useState({
    brand_name: '',
    brand_website: '',
    social_handles: '',
  })

  const [wallet, setWallet] = useState<{ balance: number; currency: string } | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isWalletLoading, setIsWalletLoading] = useState(true)
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'settings'>('overview')
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
      setIsWalletLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletAndTransactions();

    if (!brand?.id) return;

    // Realtime subscription on brand wallet and transaction updates
    const channel = supabase
      .channel(`brand_wallet_realtime_${brand.id}`)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleCreateCampaign = () => {
    navigate('/create-campaign')
  }

  const handleCreateProfile = async () => {
    if (!brandFormData.brand_name || !brandFormData.brand_website) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in brand name and website',
        variant: 'destructive',
      })
      return
    }

    setIsCreatingProfile(true)
    try {
      const { error } = await createBrandProfile({
        brand_name: brandFormData.brand_name,
        brand_website: brandFormData.brand_website,
        social_handles: brandFormData.social_handles,
        niches: [],
      })

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create brand profile',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Brand profile created successfully!',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingProfile(false)
    }
  }

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

  // Setup form if profile missing
  if (user && !brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Campayn</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.email}
                </span>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Brand Profile</CardTitle>
              <CardDescription>
                Let's set up your brand information to get started with campaigns.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Brand Name *</label>
                <Input
                  value={brandFormData.brand_name}
                  onChange={(e) => setBrandFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                  placeholder="Enter your brand name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brand Website *</label>
                <Input
                  value={brandFormData.brand_website}
                  onChange={(e) => setBrandFormData(prev => ({ ...prev, brand_website: e.target.value }))}
                  placeholder="https://yourbrand.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Social Handles (Optional)</label>
                <Input
                  value={brandFormData.social_handles}
                  onChange={(e) => setBrandFormData(prev => ({ ...prev, social_handles: e.target.value }))}
                  placeholder="@yourbrand, @other_handle"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleCreateProfile} 
                disabled={isCreatingProfile}
                className="w-full"
              >
                {isCreatingProfile ? 'Creating Profile...' : 'Create Brand Profile'}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-black text-indigo-600 tracking-tight">Campayn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-semibold">
                Welcome, {brand?.brand_name}
              </span>
              <Button variant="outline" onClick={handleSignOut} className="text-xs">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'wallet'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Welcome Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to your dashboard, {brand?.brand_name}!
              </h2>
              <p className="mt-1 text-gray-600 text-sm">
                Manage your influencer marketing campaigns and track their performance.
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('wallet')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Wallet Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {isWalletLoading ? '...' : `₹${wallet?.balance?.toLocaleString() || '0'}`}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Available for campaign funding
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCreateCampaign}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Create Campaign</CardTitle>
                  <Plus className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">+</div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Start a new influencer squad campaign
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Campaigns</CardTitle>
                  <BarChart3 className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Currently running campaigns
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Reach</CardTitle>
                  <Users className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    People reached across all campaigns
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Campaigns list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold">Recent Campaigns</CardTitle>
                <CardDescription>
                  Your latest influencer marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Create your first campaign to get started with influencer marketing.
                  </p>
                  <Button onClick={handleCreateCampaign} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Escrow Wallet</h2>
              <p className="mt-1 text-gray-600 text-sm">
                Fund your secure virtual wallet and monitor differential payouts to creators.
              </p>
            </div>

            {/* Wallet Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Balance Display Card */}
              <Card className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white shadow-xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Wallet size={120} />
                </div>
                <CardHeader>
                  <CardTitle className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                    Virtual Escrow Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-8 flex flex-col justify-between h-44">
                  <div>
                    <span className="text-4xl font-extrabold tracking-tight">
                      ₹{wallet?.balance?.toLocaleString() || '0.00'}
                    </span>
                    <p className="text-xs text-indigo-200 mt-2 font-medium">
                      This balance is securely locked in platform escrow for payout releases.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold bg-white/10 px-3 py-1 rounded-full w-fit">
                    <CreditCard size={12} />
                    <span>Auto-created Virtual Wallet</span>
                  </div>
                </CardContent>
              </Card>

              {/* Add money Form Card */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold">Add Funds to Wallet</CardTitle>
                  <CardDescription>
                    Instantly simulate a topup to credit your brand escrow virtual balance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Presets */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preset Options</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[5000, 10000, 25000].map((val) => (
                        <button
                          key={val}
                          onClick={() => handleDeposit(val)}
                          disabled={isDepositing}
                          className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 active:scale-95 transition-all"
                        >
                          + ₹{val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom input */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Or Enter Custom Amount (INR)</label>
                    <div className="flex gap-3 mt-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="pl-8"
                          disabled={isDepositing}
                        />
                      </div>
                      <Button 
                        onClick={() => handleDeposit()}
                        disabled={isDepositing}
                        className="bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-sm flex items-center gap-2"
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
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-gray-900 font-bold flex items-center gap-2">
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
                  className="text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw size={12} className={isWalletLoading ? 'animate-spin' : ''} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-gray-500 text-xs font-bold uppercase tracking-wider">
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
                          <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">
                            No transactions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((t) => {
                          const isPayout = t.type === 'payout';
                          const formattedDate = new Date(t.created_at).toLocaleString();
                          
                          return (
                            <tr key={t.id} className="hover:bg-gray-50/50">
                              <td className="py-4 font-mono text-xs font-semibold text-gray-600">
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
                              <td className="py-4 font-medium text-gray-900">
                                {t.description || (isPayout ? 'Payout to Creator' : 'Wallet Deposit')}
                              </td>
                              <td className="py-4">
                                <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border">
                                  {t.status}
                                </span>
                              </td>
                              <td className="py-4 text-gray-500 text-xs font-medium">
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
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Brand Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 font-bold">
                  <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                  Brand Settings
                </CardTitle>
                <CardDescription>
                  Manage your brand information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Brand Name</label>
                    <p className="text-sm text-gray-900 font-semibold">{brand?.brand_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-sm text-gray-900 font-semibold">{brand?.brand_website || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Social Handles</label>
                    <p className="text-sm text-gray-900 font-semibold">{brand?.social_handles || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Niches</label>
                    <p className="text-sm text-gray-900 font-semibold">
                      {brand?.niches && brand.niches.length > 0 
                        ? brand.niches.join(', ') 
                        : 'Not set'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default BrandDashboard
