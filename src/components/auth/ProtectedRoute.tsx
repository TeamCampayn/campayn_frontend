import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, brand, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Redirect users with incomplete or missing onboarding to /onboarding
  const isAdmin = user.email === 'admin@campayn.local' || 
                  user.user_metadata?.is_admin === true ||
                  user.app_metadata?.is_admin === true

  if (!isAdmin && location.pathname !== '/onboarding') {
    if (!brand || brand.onboarding_completed === false) {
      return <Navigate to="/onboarding" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
