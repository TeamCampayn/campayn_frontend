import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SignInForm from '../components/auth/SignInForm'
import SignUpForm from '../components/auth/SignUpForm'
import { useAuth } from '../contexts/AuthContext'

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const [isSignUp, setIsSignUp] = useState(mode === 'signup')
  
  // Sync state if mode param changes (e.g. user toggles navigation while on page)
  React.useEffect(() => {
    setIsSignUp(mode === 'signup')
  }, [mode])

  const navigate = useNavigate()
  const { user, brand } = useAuth()

  // Check if user is admin
  const isAdminUser = (user: any) => {
    return user?.email === 'admin@campayn.local' || 
           user?.user_metadata?.is_admin === true ||
           user?.app_metadata?.is_admin === true
  }

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (isAdminUser(user)) {
        navigate('/admin')
      } else if (brand && brand.onboarding_completed === false) {
        navigate('/onboarding')
      } else if (brand && brand.onboarding_completed === true) {
        navigate('/dashboard')
      }
    }
  }, [user, brand, navigate])

  const handleAuthSuccess = (authUser?: any) => {
    // Use the passed user or current user
    const userToCheck = authUser || user
    
    // Check if it's admin by email (immediate) or wait for full user context
    if (userToCheck?.email === 'admin@campayn.local' || isAdminUser(userToCheck)) {
      navigate('/admin')
    } else if (brand && brand.onboarding_completed === false) {
      navigate('/onboarding')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f7] grain flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUpForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setIsSignUp(false)}
          />
        ) : (
          <SignInForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setIsSignUp(true)}
          />
        )}
      </div>
    </div>
  )
}

export default Auth
