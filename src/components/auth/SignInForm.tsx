import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../hooks/use-toast'
import { supabase } from '../../lib/supabase'
import { Loader2, Eye, EyeOff, Sparkle } from 'lucide-react'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: (user?: any) => void
  onSwitchToSignUp?: () => void
}

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
    />
    <path
      fill="#34A853"
      d="M16.04 15.345c-1.077.732-2.432 1.164-4.04 1.164-2.955 0-5.46-1.982-6.355-4.65L1.62 14.978C3.664 19.005 7.827 21.818 12.636 21.818c3.082 0 5.927-1.036 8.01-2.827l-4.605-3.646Z"
    />
    <path
      fill="#4285F4"
      d="M23.49 12.273c0-.773-.073-1.52-.2-2.245H12v4.518h6.445c-.277 1.482-1.114 2.736-2.38 3.586l4.605 3.645c2.69-2.482 4.82-6.136 4.82-9.49Z"
    />
    <path
      fill="#FBBC05"
      d="M5.685 11.86c0-.573.095-1.127.277-1.65l-4.027-3.114A11.903 11.903 0 0 0 0 12c0 1.83.414 3.568 1.155 5.127l4.032-3.19c-.182-.533-.277-1.087-.277-1.66c0-.142-.014-.282-.027-.418Z"
    />
  </svg>
)

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess, onSwitchToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const { toast } = useToast()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    try {
      const user = await signIn(data.email, data.password)

      // Show different message for admin vs regular users
      if (user?.email === 'admin@campayn.local') {
        toast({
          title: 'Welcome back, Admin!',
          description: 'Redirecting to admin dashboard...',
        })
      } else {
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in to your account.',
        })
      }
      
      // Pass the actual user data for immediate admin detection
      onSuccess?.(user)
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error: any) {
      toast({
        title: 'Google authentication failed',
        description: error.message || 'Could not connect to Google',
        variant: 'destructive',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border border-zinc-200/80 shadow-none rounded-2xl bg-white/80 backdrop-blur-md">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-display text-2xl tracking-tight text-foreground">Campayn</span>
          <Sparkle className="size-4 fill-[#1ea0ff] text-[#1ea0ff]" />
        </div>
        <CardTitle className="text-xl font-bold font-space uppercase tracking-tight text-neutral-900">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-xs font-space text-zinc-500 uppercase tracking-wider">
          Sign in to your brand account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="h-10 rounded-xl border-zinc-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-space uppercase tracking-wide text-rose-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="h-10 rounded-xl border-zinc-200 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-zinc-400 hover:text-zinc-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-space uppercase tracking-wide text-rose-500" />
                </FormItem>
              )}
            />

            <button 
              type="submit" 
              className="w-full btn-primary-pill py-2.5 h-auto text-xs uppercase font-space tracking-wider" 
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign In
              </span>
            </button>
          </form>
        </Form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200" />
          </div>
          <span className="relative px-3 bg-white text-[10px] uppercase font-space tracking-wider text-zinc-400">
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 border border-zinc-200 rounded-full py-2.5 px-5 transition-all duration-200 uppercase tracking-wider text-xs font-bold text-neutral-800"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
          ) : (
            <GoogleIcon />
          )}
          Google
        </button>

        <div className="mt-5 text-center text-xs font-space uppercase tracking-wider text-zinc-500">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-black hover:underline font-bold"
            onClick={onSwitchToSignUp}
          >
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignInForm
