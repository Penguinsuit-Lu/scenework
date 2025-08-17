"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../lib/supabase/client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const signOut = async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('Sign out error:', error)
        }
        
        // Always redirect to home page after sign out attempt
        router.push('/')
      } catch (error) {
        console.error('Sign out error:', error)
        // Even if there's an error, redirect to home
        router.push('/')
      }
    }

    // Execute sign out immediately
    signOut()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Signing Out...</h2>
        <p className="text-white/60">Please wait while we sign you out.</p>
      </div>
    </div>
  )
}
