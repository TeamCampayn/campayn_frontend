import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignInForm from '../components/auth/SignInForm'
import SignUpForm from '../components/auth/SignUpForm'
import { useAuth } from '../contexts/AuthContext'

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

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
        console.log('Already logged in admin user, redirecting to admin dashboard')
        navigate('/admin')
      } else {
        console.log('Already logged in regular user, redirecting to brand dashboard')
        navigate('/dashboard')
      }
    }
  }, [user, navigate])

  const handleAuthSuccess = (authUser?: any) => {
    // Use the passed user or current user
    const userToCheck = authUser || user
    
    // Check if it's admin by email (immediate) or wait for full user context
    if (userToCheck?.email === 'admin@campayn.local' || isAdminUser(userToCheck)) {
      console.log('Admin user detected, redirecting to admin dashboard')
      navigate('/admin')
    } else {
      console.log('Regular user detected, redirecting to brand dashboard')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
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
