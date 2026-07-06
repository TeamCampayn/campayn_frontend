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
import { Loader2, Eye, EyeOff } from 'lucide-react'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: (user?: any) => void
  onSwitchToSignUp?: () => void
}

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess, onSwitchToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
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

  return (
    <Card className="w-full max-w-md mx-auto border border-zinc-200/80 shadow-none rounded-2xl bg-white/80 backdrop-blur-md">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-space font-bold text-base leading-none mb-3">
          <span>+</span>
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
