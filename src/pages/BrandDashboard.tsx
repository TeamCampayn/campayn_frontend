import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LogOut, Plus, BarChart3, Users, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { useToast } from '../hooks/use-toast'

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

  // Show loading debug if still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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

  // If user doesn't have a brand profile, show setup form
  if (user && !brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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

        {/* Setup Form */}
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Campayn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {brand?.brand_name || user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to your dashboard, {brand?.brand_name}!
            </h2>
            <p className="mt-2 text-gray-600">
              Manage your influencer marketing campaigns and track their performance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCreateCampaign}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Create Campaign</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+</div>
                <p className="text-xs text-muted-foreground">
                  Start a new influencer marketing campaign
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Currently running campaigns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  People reached across all campaigns
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                Your latest influencer marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first campaign to get started with influencer marketing.
                </p>
                <Button onClick={handleCreateCampaign}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Brand Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Brand Settings
              </CardTitle>
              <CardDescription>
                Manage your brand information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Brand Name</label>
                  <p className="text-sm text-gray-900">{brand?.brand_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <p className="text-sm text-gray-900">{brand?.brand_website || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Social Handles</label>
                  <p className="text-sm text-gray-900">{brand?.social_handles || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Niches</label>
                  <p className="text-sm text-gray-900">
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
      </main>
    </div>
  )
}

export default BrandDashboard
