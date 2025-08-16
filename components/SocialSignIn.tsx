"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/ButtonNew"
import { createClient } from "../lib/supabase/client"
import { Facebook, Chrome } from "lucide-react"

export default function SocialSignIn() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSocialSignIn = async (provider: 'facebook' | 'google') => {
    setLoading(provider)
    setError("")

    try {
      const supabase = createClient()
      
      // Sign in with OAuth provider
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Request specific permissions for Facebook
            ...(provider === 'facebook' && {
              scope: 'email,public_profile'
            })
          }
        }
      })

      if (error) {
        throw error
      }

      // The redirect will happen automatically
      // User will be taken to the provider for authorization
      
    } catch (err: any) {
      console.error(`${provider} sign-in error:`, err)
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Facebook Sign In */}
      <Button
        onClick={() => handleSocialSignIn('facebook')}
        disabled={loading !== null}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        <Facebook className="w-5 h-5 mr-3" />
        {loading === 'facebook' ? "Connecting to Facebook..." : "Continue with Facebook"}
      </Button>

      {/* Google Sign In */}
      <Button
        onClick={() => handleSocialSignIn('google')}
        disabled={loading !== null}
        className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 border border-gray-300"
      >
        <Chrome className="w-5 h-5 mr-3" />
        {loading === 'google' ? "Connecting to Google..." : "Continue with Google"}
      </Button>
      
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          {error}
        </div>
      )}
      
      <div className="text-center text-sm text-white/60">
        <p>We'll import your profile picture and basic info automatically</p>
      </div>
    </div>
  )
}
