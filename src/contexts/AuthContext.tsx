import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface Brand {
  id: string
  user_id: string
  brand_name: string
  brand_website: string
  social_handles: string
  niches: any[]
  company_size?: string
  industry?: string
  brand_description?: string
  marketing_goals?: string[]
  monthly_budget?: string
  experience_level?: string
  onboarding_completed?: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  brand: Brand | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string, brandData?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  createBrandProfile: (brandData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Try to fetch brand data, but don't block the UI
          fetchBrandData(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        setLoading(true)
        fetchBrandData(session.user.id)
      } else {
        setBrand(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchBrandData = async (userId: string) => {
    try {
      const { data: brands, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching brand data:', error)
        setBrand(null)
        return
      }

      if (!brands || brands.length === 0) {
        // Create a minimal brand profile
        const defaultName = (user?.email?.split('@')[0] || 'Brand') as string
        const { data: created, error: insertErr } = await supabase
          .from('brands')
          .insert({
            user_id: userId,
            brand_name: defaultName,
            brand_website: '',
            social_handles: '',
            niches: [],
            company_size: '1-10',
            industry: 'other',
            brand_description: '',
            experience_level: 'beginner',
            onboarding_completed: false,
          })
          .select('*')
          .single()

        if (insertErr) {
          console.error('Auto-create brand failed:', insertErr)
          setBrand(null)
        } else {
          setBrand(created)
        }
      } else {
        // If multiple profiles exist (due to past DB bugs), select the oldest/first one to ensure consistency
        setBrand(brands[0])
      }
    } catch (error) {
      console.error('Error in fetchBrandData:', error)
      setBrand(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data.user
  }

  const signUp = async (email: string, password: string, brandData?: any): Promise<{ error: any }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        return { error }
      }
      
      // Store brand data in localStorage for later use (after email confirmation)
      if (brandData) {
        localStorage.setItem('pendingBrandData', JSON.stringify(brandData))
      }
      
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setBrand(null)
    setSession(null)
  }

  const createBrandProfile = async (brandData: any) => {
    if (!user) throw new Error('No user logged in')
    
    const { data, error } = await supabase
      .from('brands')
      .insert({
        user_id: user.id,
        ...brandData,
      })
      .select('*')
      .single()

    if (error) throw error
    setBrand(data)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        brand,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        createBrandProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}