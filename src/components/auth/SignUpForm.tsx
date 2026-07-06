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
import { Loader2, Eye, EyeOff } from 'lucide-react'

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpFormData = z.infer<typeof signUpSchema>

interface SignUpFormProps {
  onSuccess?: () => void
  onSwitchToSignIn?: () => void
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onSwitchToSignIn }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    try {
      const { error } = await signUp(data.email, data.password)

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message || 'An error occurred during sign up',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Account created successfully!',
          description: 'Please wait, redirecting to onboarding...',
        })
        onSuccess?.()
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast({
        title: 'Sign up failed',
        description: error?.message || 'An unexpected error occurred',
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
          Create Brand Account
        </CardTitle>
        <CardDescription className="text-xs font-space text-zinc-500 uppercase tracking-wider">
          Sign up to access our influencer marketplace
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
                      placeholder="e.g. hello@yourbrand.com"
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
                        placeholder="Choose a strong password"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-space">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        className="h-10 rounded-xl border-zinc-200 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-zinc-400 hover:text-zinc-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
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
                Create Account
              </span>
            </button>
          </form>
        </Form>

        <div className="mt-5 text-center text-xs font-space uppercase tracking-wider text-zinc-500">
          Already have an account?{' '}
          <button
            type="button"
            className="text-black hover:underline font-bold"
            onClick={onSwitchToSignIn}
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignUpForm
