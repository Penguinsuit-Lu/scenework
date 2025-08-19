"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../../lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { saveTheme, saveTopFilms, updateProfile, checkHandleAvailability } from "../actions"
import ThemeEditor from "../../../components/ThemeEditor"
import TopFilmsEditor from "../../../components/TopFilmsEditor"
import { Button } from "../../../components/ui/ButtonNew"
import type { SceneTheme, TopFilm } from "../../../types/profile"

type TabType = 'profile' | 'top-films';

interface ProfileFormData {
  full_name: string
  handle: string
  role: string
  bio: string
  location: string
  skills: string[]
}

export default function ProfileEditPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    full_name: '',
    handle: '',
    role: '',
    bio: '',
    location: '',
    skills: []
  })
  const [handleError, setHandleError] = useState<string>('')
  const [isCheckingHandle, setIsCheckingHandle] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        console.log('🔄 Starting profile edit page load...')
        
        const supabase = createClient()
        console.log('✅ Supabase client created')
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('❌ Error getting user:', userError)
          setError('Authentication error. Please sign in again.')
          setLoading(false)
          return
        }
        
        if (!user) {
          console.log('❌ No user found, redirecting to sign in')
          router.push('/auth/sign-in')
          return
        }
        
        console.log('✅ User found:', user.id)
        setUser(user)
        
        // Try to fetch profile data
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profileError) {
            console.log('⚠️ Profile not found, creating basic profile...')
            // Create basic profile
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || 'Your Name',
                handle: user.user_metadata?.handle || `user_${user.id.slice(0, 8)}`,
                role: 'Creative Professional',
                location: 'Location not set',
                bio: 'Tell us about yourself and your work.',
                skills: [],
                top_films: []
              })
              .select()
              .single()
            
            if (createError) {
              console.error('❌ Error creating profile:', createError)
              setError('Database setup required. Please contact support.')
              setLoading(false)
              return
            }
            
            setProfile(newProfile)
            setProfileFormData({
              full_name: newProfile.full_name || '',
              handle: newProfile.handle || '',
              role: newProfile.role || '',
              bio: newProfile.bio || '',
              location: newProfile.location || '',
              skills: newProfile.skills || []
            })
          } else {
            setProfile(profileData)
            setProfileFormData({
              full_name: profileData.full_name || '',
              handle: profileData.handle || '',
              role: profileData.role || '',
              bio: profileData.bio || '',
              location: profileData.location || '',
              skills: profileData.skills || []
            })
          }
        } catch (dbError) {
          console.error('❌ Database error:', dbError)
          setError('Database not available. Please try again later.')
          setLoading(false)
          return
        }
        
        setLoading(false)
      } catch (error) {
        console.error('❌ Profile edit page error:', error)
        setError('Failed to load profile. Please try again.')
        setLoading(false)
      }
    }

    getUserAndProfile()
  }, [router])

  const handleSave = async () => {
    if (!user) return
    
    setSaveStatus('saving')
    setError('')
    
    try {
      await updateProfile(profileFormData)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error: any) {
      console.error('❌ Save error:', error)
      setError(error.message || 'Failed to save profile')
      setSaveStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Profile...</h2>
          <p className="text-white/60">Please wait while we load your profile.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-white/60 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Your Profile</h1>
          <p className="text-white/60">Customize your SceneWork profile and theme</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {saveStatus === 'success' && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-400">Profile saved successfully!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('top-films')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'top-films'
                ? 'bg-amber-500 text-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Top Films
          </button>
        </div>

        {/* Profile Info Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profileFormData.full_name}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Handle *
                  </label>
                  <input
                    type="text"
                    value={profileFormData.handle}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, handle: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="your_handle"
                  />
                  {handleError && <p className="text-red-400 text-sm mt-1">{handleError}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={profileFormData.role}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Director, Actor, DP, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileFormData.location}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="City, State"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Bio
                </label>
                <textarea
                  value={profileFormData.bio}
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Tell us about yourself and your work..."
                />
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg"
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Top Films Tab */}
        {activeTab === 'top-films' && (
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top Films</h2>
            <TopFilmsEditor
              initial={profile?.top_films || []}
                                 onSave={async (films) => {
                     try {
                       await saveTopFilms(films)
                       setProfile((prev: any) => ({ ...prev, top_films: films }))
                     } catch (error: any) {
                       setError(error.message)
                     }
                   }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
