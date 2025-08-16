"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../../components/ui/ButtonNew"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { createClient } from "../../../lib/supabase/client"


export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [oauthErr, setOauthErr] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function oauth(provider: 'google' | 'facebook') {
    setOauthErr(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { 
        redirectTo: `${window.location.origin}/auth/callback` 
      }
    })
    if (error) setOauthErr(error.message)
  }

  // Check for error from URL params (e.g., from auth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      if (errorParam === 'auth_failed') {
        setError('Authentication failed. Please try again.')
      } else if (errorParam === 'unexpected') {
        setError('An unexpected error occurred. Please try again.')
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          setError(error.message)
        } else if (data.user) {
          // Successfully signed up, redirect to profiles
          router.push('/profiles')
          return
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
        } else if (data.user) {
          // Successfully signed in, redirect to profiles
          router.push('/profiles')
          return
        }
      }
      
      // If we get here, something went wrong, reset loading state
      setLoading(false)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎬</span>
          </div>
          <CardTitle className="text-2xl text-white">
            {isSignUp ? "Create Account" : "Welcome to SceneWork"}
          </CardTitle>
          <CardDescription className="text-white/80">
            {isSignUp 
              ? "Sign up with your email to get started" 
              : "Sign in with your email to access your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-amber-500 text-black hover:bg-amber-600"
              disabled={loading}
            >
              {loading ? (isSignUp ? "Creating..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-white/60">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <button
            onClick={() => oauth('google')}
            className="w-full rounded-xl bg-white text-black font-semibold py-2"
          >
            Continue with Google
          </button>

          <button
            onClick={() => oauth('facebook')}
            className="w-full rounded-xl bg-[#1877F2] text-white font-semibold py-2"
          >
            Continue with Facebook
          </button>

          {oauthErr && <div className="text-sm text-red-400 mt-2">{oauthErr}</div>}

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/70 hover:text-white text-sm underline"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
            </button>
            <div>
              <Link href="/" className="text-white/70 hover:text-white text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

