import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getApiUrl } from '../lib/api'
import { useToast } from '../hooks/use-toast'
import { 
  Loader2, 
  Globe, 
  Sparkles, 
  Users, 
  Target, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Building,
  CheckCircle2,
  Building2,
  Tv,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  LogOut
} from 'lucide-react'

// Steps:
// 1. Core Info & Website Scraper
// 2. Brand Story & Industry
// 3. Audience & Demographics
// 4. Marketing Details

interface Demographics {
  gender_focus: string
  primary_age_group: string
  geographic_focus: string
}

interface BrandOnboardingData {
  brand_name: string
  brand_website: string
  social_handles: string
  company_size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  industry: 'fashion' | 'tech' | 'food' | 'fitness' | 'travel' | 'finance' | 'education' | 'other'
  brand_description: string
  niches: string[]
  marketing_goals: string[]
  monthly_budget: 'under-5k' | '5k-25k' | '25k-50k' | '50k-100k' | '100k-500k' | '500k+'
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

const Onboarding: React.FC = () => {
  const { user, brand, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [isScraping, setIsScraping] = useState(false)
  const [scrapingLogs, setScrapingLogs] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState<BrandOnboardingData>({
    brand_name: '',
    brand_website: '',
    social_handles: '',
    company_size: '1-10',
    industry: 'other',
    brand_description: '',
    niches: [],
    marketing_goals: [],
    monthly_budget: 'under-5k',
    experience_level: 'beginner',
  })

  // Redirect if already onboarded
  useEffect(() => {
    if (brand && brand.onboarding_completed) {
      navigate('/dashboard', { replace: true })
    }
  }, [brand, navigate])

  // Populate default brand name from email if empty
  useEffect(() => {
    if (user && !formData.brand_name) {
      const defaultName = user.email ? user.email.split('@')[0] : 'Brand'
      setFormData(prev => ({
        ...prev,
        brand_name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1)
      }))
    }
  }, [user])

  const addScrapingLog = (message: string, delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setScrapingLogs(prev => [...prev, message])
        resolve()
      }, delay)
    })
  }

  // Trigger Playwright + LLM website scraper
  const handleAutoFill = async () => {
    if (!formData.brand_website) {
      toast({
        title: 'Website Required',
        description: 'Please enter your brand website URL first.',
        variant: 'destructive',
      })
      return
    }

    setIsScraping(true)
    setScrapingLogs([])

    try {
      await addScrapingLog('🚀 Launching headless browser context...', 300)
      await addScrapingLog('🌐 Navigating to website and rendering JavaScript...', 600)
      
      const response = await fetch(getApiUrl('api/brand/onboarding/autofill'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ websiteUrl: formData.brand_website })
      })

      await addScrapingLog('🧹 Sanitizing DOM tree: stripping script, link, and tracker nodes...', 400)
      await addScrapingLog('🤖 Querying OpenRouter model router for structural brand details...', 800)

      if (!response.ok) {
        throw new Error('Autofill request failed')
      }

      const resData = await response.json()
      
      if (resData.success && resData.data) {
        const payload = resData.data
        await addScrapingLog('✨ Extraction complete! Mapping structured data...', 400)

        // Map niche to industry value
        let mappedIndustry: any = 'other'
        const rawNiche = (payload.niche || '').toLowerCase()
        if (rawNiche.includes('fashion') || rawNiche.includes('beauty') || rawNiche.includes('cosmetics')) {
          mappedIndustry = 'fashion'
        } else if (rawNiche.includes('tech') || rawNiche.includes('software')) {
          mappedIndustry = 'tech'
        } else if (rawNiche.includes('food') || rawNiche.includes('beverage') || rawNiche.includes('drink')) {
          mappedIndustry = 'food'
        } else if (rawNiche.includes('fitness') || rawNiche.includes('wellness') || rawNiche.includes('health')) {
          mappedIndustry = 'fitness'
        } else if (rawNiche.includes('travel') || rawNiche.includes('lifestyle')) {
          mappedIndustry = 'travel'
        } else if (rawNiche.includes('finance')) {
          mappedIndustry = 'finance'
        } else if (rawNiche.includes('education')) {
          mappedIndustry = 'education'
        }

        // Map target audience niches
        const rawGens = payload.target_generations || []
        const mappedNiches: string[] = []
        if (rawGens.includes('Gen Z') || rawGens.includes('genz')) mappedNiches.push('gen-z')
        if (rawGens.includes('Millennials')) mappedNiches.push('millennials')
        if (rawGens.includes('Gen X')) mappedNiches.push('gen-x')

        const gender = (payload.demographics?.gender_focus || '').toLowerCase()
        if (gender === 'female') {
          mappedNiches.push('women')
        } else if (gender === 'male') {
          mappedNiches.push('men')
        } else {
          mappedNiches.push('women', 'men')
        }

        // Update form state
        setFormData(prev => ({
          ...prev,
          brand_name: payload.brand_name || prev.brand_name,
          brand_description: payload.description || prev.brand_description,
          industry: mappedIndustry,
          niches: [...new Set([...prev.niches, ...mappedNiches])]
        }))

        toast({
          title: 'Scraping successful! 🎉',
          description: `Extracted data for ${payload.brand_name || 'your brand'}.`,
        })

        // Auto move to step 2 after a brief delay
        setTimeout(() => {
          setStep(2)
          setIsScraping(false)
        }, 1200)

      } else {
        throw new Error(resData.error || 'Invalid scraper output structure')
      }

    } catch (err: any) {
      console.error('Error autofilling:', err)
      toast({
        title: 'Auto-fill failed',
        description: 'We couldn\'t scan the website. Please fill in the details manually.',
        variant: 'destructive',
      })
      setIsScraping(false)
    }
  }

  // Handle step submission and final database save
  const handleFinalSubmit = async () => {
    if (!user) return
    setIsSubmitting(true)

    try {
      // Update in Supabase brands table
      const { error } = await supabase
        .from('brands')
        .update({
          brand_name: formData.brand_name,
          brand_website: formData.brand_website,
          social_handles: formData.social_handles,
          niches: formData.niches,
          company_size: formData.company_size,
          industry: formData.industry,
          brand_description: formData.brand_description,
          marketing_goals: formData.marketing_goals,
          monthly_budget: formData.monthly_budget,
          experience_level: formData.experience_level,
          onboarding_completed: true,
        })
        .eq('user_id', user.id)

      if (error) throw error

      // Refresh auth context so brand is updated locally
      // Wait, let's call the `fetchBrandData` context action if it exists
      // The context has `fetchBrandData` but it is not public. Wait, let's check!
      // In AuthContext.tsx:
      // fetchBrandData is NOT inside the returned value of AuthContext!
      // Wait, let's check what is in AuthContextType:
      // signIn, signUp, signOut, createBrandProfile.
      // Ah! But wait, when the session/user updates, it auto-refetches. Or we can reload the window to force a context re-fetch.
      // Wait, can we reload the window? Yes! Doing window.location.reload() or navigating directly will trigger the state change cleanly.
      // Wait, let's look at `contexts/AuthContext.tsx` definition of `AuthContextType` on line 22:
      // It has: user, brand, session, loading, signIn, signUp, signOut, createBrandProfile.
      // Wait, we can also just call `window.location.href = '/dashboard'` which will force a clean re-initialization and fetch the updated brand record from the DB!
      // That is extremely robust and avoids state mismatch.

      toast({
        title: 'Welcome aboard! 🚀',
        description: 'Your brand profile has been created successfully.',
      })

      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)

    } catch (err: any) {
      console.error('Onboarding submission error:', err)
      toast({
        title: 'Submission failed',
        description: err.message || 'Failed to update brand profile. Please try again.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.brand_name) {
        toast({
          title: 'Brand Name Required',
          description: 'Please enter your brand name to continue.',
          variant: 'destructive',
        })
        return
      }
    }
    if (step === 2) {
      if (!formData.brand_description || formData.brand_description.length < 10) {
        toast({
          title: 'Description Required',
          description: 'Please describe your brand in at least 10 characters.',
          variant: 'destructive',
        })
        return
      }
    }
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const toggleNiche = (nicheId: string) => {
    setFormData(prev => ({
      ...prev,
      niches: prev.niches.includes(nicheId)
        ? prev.niches.filter(n => n !== nicheId)
        : [...prev.niches, nicheId]
    }))
  }

  const toggleGoal = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      marketing_goals: prev.marketing_goals.includes(goalId)
        ? prev.marketing_goals.filter(g => g !== goalId)
        : [...prev.marketing_goals, goalId]
    }))
  }

  const renderProgressBar = () => {
    const pct = ((step - 1) / 3) * 100
    return (
      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mb-8">
        <div 
          className="bg-black h-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f6f7] grain flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Top Navigation Bar with Sign Out */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4 px-2 animate-in fade-in duration-300">
        <span className="text-xs font-bold font-space uppercase text-zinc-500 tracking-wider">Campayn Setup</span>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-bold font-space uppercase transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white border border-zinc-200/80 shadow-sm rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        
        {/* Progress Bar & Stepper Indicator */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-space uppercase bg-zinc-100 text-zinc-500 px-2 py-1 rounded-md">
              Step {step} of 4
            </span>
            <span className="text-xs font-bold font-space uppercase text-zinc-400">
              {step === 1 && 'Brand Identity'}
              {step === 2 && 'Brand Story'}
              {step === 3 && 'Target Audience'}
              {step === 4 && 'Goals & Scale'}
            </span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  s === step 
                    ? 'bg-black w-4' 
                    : s < step 
                      ? 'bg-emerald-500' 
                      : 'bg-zinc-200'
                }`}
              />
            ))}
          </div>
        </div>

        {renderProgressBar()}

        {/* STEP 1: IDENTITY & WEBSITE SCRAPING */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-space uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                <Globe className="h-6 w-6 text-black" />
                Tell us about your Brand
              </h1>
              <p className="text-xs text-zinc-500 font-space uppercase tracking-wider mt-1.5">
                Enter your website, and our AI scraper will autofill your profile tags instantly.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Brand Website URL</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="https://yourbrand.com"
                      value={formData.brand_website}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand_website: e.target.value }))}
                      disabled={isScraping}
                      className="w-full pl-10 pr-4 py-2.5 h-11 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    disabled={isScraping || !formData.brand_website}
                    className="btn-secondary-pill h-11 px-5 py-0 flex items-center justify-center gap-1.5 text-xs font-bold uppercase font-space bg-zinc-50 border-zinc-200 hover:bg-zinc-100 disabled:opacity-50"
                  >
                    {isScraping ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-black" />
                        Scan & Auto-Fill
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Official Brand Name</label>
                <input
                  type="text"
                  placeholder="Enter your brand name"
                  value={formData.brand_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                  className="w-full px-4 py-2.5 h-11 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Social Handles (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. @yourbrand (Instagram), @brandchannel"
                  value={formData.social_handles}
                  onChange={(e) => setFormData(prev => ({ ...prev, social_handles: e.target.value }))}
                  className="w-full px-4 py-2.5 h-11 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: STORY & INDUSTRY */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-space uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-black" />
                Brand Story & Niche
              </h1>
              <p className="text-xs text-zinc-500 font-space uppercase tracking-wider mt-1.5">
                Tell us about your brand's unique proposition and core category.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Category / Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value as any }))}
                  className="w-full px-4 py-2.5 h-11 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                >
                  <option value="fashion">Fashion & Beauty</option>
                  <option value="tech">Technology & Apps</option>
                  <option value="food">Food & Beverage</option>
                  <option value="fitness">Fitness & Wellness</option>
                  <option value="travel">Travel & Lifestyle</option>
                  <option value="finance">Finance & fintech</option>
                  <option value="education">Education</option>
                  <option value="other">Other / General</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Brand Description</label>
                <textarea
                  placeholder="Describe your brand values, what you sell, and your unique selling points..."
                  value={formData.brand_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand_description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white min-h-[100px]"
                />
                <p className="text-[9px] font-space text-zinc-400 uppercase tracking-wider mt-1.5">Minimum 10 characters required</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: AUDIENCE & DEMOGRAPHICS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-space uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-black" />
                Target Demographics
              </h1>
              <p className="text-xs text-zinc-500 font-space uppercase tracking-wider mt-1.5">
                Who are you trying to reach? Select all target segments that apply.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-3">Target Generational Cohorts</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'gen-z', label: 'Gen Z (18-26)' },
                    { id: 'millennials', label: 'Millennials (27-42)' },
                    { id: 'gen-x', label: 'Gen X (43-58)' },
                    { id: 'women', label: 'Women focus' },
                    { id: 'men', label: 'Men focus' },
                    { id: 'parents', label: 'Parents' },
                    { id: 'professionals', label: 'Professionals' },
                    { id: 'students', label: 'Students' },
                  ].map((cohort) => {
                    const isSelected = formData.niches.includes(cohort.id)
                    return (
                      <button
                        type="button"
                        key={cohort.id}
                        onClick={() => toggleNiche(cohort.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left font-space text-xs uppercase font-bold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-black/5 border-black text-black shadow-sm' 
                            : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        <span>{cohort.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-black shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: GOALS, BUDGET & EXPERIENCE */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-space uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                <Target className="h-6 w-6 text-black" />
                Campaign Budget & Goals
              </h1>
              <p className="text-xs text-zinc-500 font-space uppercase tracking-wider mt-1.5">
                Set your estimated monthly budget parameters and primary goal metrics.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Company Size</label>
                  <select
                    value={formData.company_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_size: e.target.value as any }))}
                    className="w-full px-4 py-2.5 h-11 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                  >
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-1000">201-1000 Employees</option>
                    <option value="1000+">1000+ Employees</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Monthly Budget</label>
                  <select
                    value={formData.monthly_budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthly_budget: e.target.value as any }))}
                    className="w-full px-4 py-2.5 h-11 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                  >
                    <option value="under-5k">Under ₹5,000</option>
                    <option value="5k-25k">₹5,000 - ₹25,000</option>
                    <option value="25k-50k">₹25,000 - ₹50,000</option>
                    <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                    <option value="100k-500k">₹1,00,000 - ₹5,00,000</option>
                    <option value="500k+">₹5,00,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">Campaign Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value as any }))}
                  className="w-full px-4 py-2.5 h-11 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                >
                  <option value="beginner">Beginner (First few campaigns)</option>
                  <option value="intermediate">Intermediate (Ran 2-5 campaigns)</option>
                  <option value="advanced">Advanced (Frequent campaigner)</option>
                  <option value="expert">Expert (Agency level/Continuous)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-3">Primary Marketing Goals</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'brand-awareness', label: 'Brand Awareness' },
                    { id: 'lead-generation', label: 'Lead Generation' },
                    { id: 'sales', label: 'Sales & Conversions' },
                    { id: 'engagement', label: 'Community Engagement' },
                    { id: 'product-launch', label: 'Product Launch' },
                    { id: 'event-promotion', label: 'Event Promotion' },
                  ].map((goal) => {
                    const isSelected = formData.marketing_goals.includes(goal.id)
                    return (
                      <button
                        type="button"
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left font-space text-[10px] uppercase font-bold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-black/5 border-black text-black shadow-sm' 
                            : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        <span>{goal.label}</span>
                        {isSelected && <Check className="h-3 w-3 text-black shrink-0 ml-1.5" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Navigation Buttons */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-zinc-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn-secondary-pill flex items-center gap-1.5 text-xs font-bold uppercase font-space bg-white border border-zinc-200 hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary-pill flex items-center gap-1.5 text-xs font-bold uppercase font-space"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="btn-primary-pill flex items-center gap-1.5 text-xs font-bold uppercase font-space border-transparent shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  Complete Setup
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Onboarding
