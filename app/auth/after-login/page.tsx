"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "../../../lib/supabase/client"

export default function AfterLoginPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        // Check if user is authenticated
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (session?.user) {
          // User is authenticated, redirect to profiles page
          setStatus("success")
          setMessage("Successfully signed in! Redirecting...")
          
          setTimeout(() => {
            router.push('/profiles')
          }, 1500)
        } else {
          // No session, redirect to sign-in
          setStatus("error")
          setMessage("No active session found. Redirecting to sign-in...")
          
          setTimeout(() => {
            router.push('/auth/sign-in')
          }, 1500)
        }
      } catch (error: any) {
        console.error('After login error:', error)
        setStatus("error")
        setMessage("Authentication error. Redirecting to sign-in...")
        
        setTimeout(() => {
          router.push('/auth/sign-in')
        }, 1500)
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          {status === "loading" && <span className="text-2xl">⏳</span>}
          {status === "success" && <span className="text-2xl">✅</span>}
          {status === "error" && <span className="text-2xl">❌</span>}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          {status === "loading" && "Processing..."}
          {status === "success" && "Success!"}
          {status === "error" && "Error"}
        </h2>
        
        <p className="text-white/60 mb-4">{message}</p>
      </div>
    </div>
  )
}
