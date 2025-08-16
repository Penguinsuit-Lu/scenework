"use client"

import { useState, useEffect } from "react"
import { testSupabaseConnection } from "../../lib/supabase/test-connection"

export default function TestConnectionPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    try {
      const result = await testSupabaseConnection()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
                <span className="ml-2 text-gray-300">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
                <span className="ml-2 text-gray-300">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Connection Test</h2>
            <button 
              onClick={runTest}
              disabled={loading}
              className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            {testResult && (
              <div className="mt-4 p-3 rounded bg-gray-700">
                <div className="font-semibold">
                  Status: {testResult.success ? '✅ Success' : '❌ Failed'}
                </div>
                {testResult.error && (
                  <div className="text-red-400 mt-2">
                    Error: {testResult.error}
                  </div>
                )}
                {testResult.session && (
                  <div className="text-green-400 mt-2">
                    Session: {testResult.session.user?.id || 'No user'}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
              <li>Check if your Supabase project is running and accessible</li>
              <li>Verify the URL and key in your .env.local file</li>
              <li>Check browser console for CORS errors</li>
              <li>Ensure your Supabase project allows your domain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
