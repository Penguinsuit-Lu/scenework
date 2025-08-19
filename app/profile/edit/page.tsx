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
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
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
        
        // Add timeout protection
        const timeoutId = setTimeout(() => {
          console.warn('⏰ Profile edit loading timeout - forcing completion')
          setLoading(false)
        }, 5000)
        
        console.log('🔑 Creating Supabase client...')
      const supabase = createClient()
        console.log('✅ Supabase client created')
        
        console.log('👤 Getting current user...')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('❌ Error getting user:', userError)
          clearTimeout(timeoutId)
          return
        }
        
        if (user) {
          console.log('✅ User found:', user.id)
      setUser(user)
          
          // Fetch user's profile data
          console.log('📋 Fetching profile data...')
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profileError) {
            console.error('❌ Error fetching profile:', profileError)
            // Create basic profile if none exists
            if (profileError.code === 'PGRST116') {
              console.log('🆕 Creating basic profile...')
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
              } else {
                console.log('✅ Basic profile created:', newProfile)
                setProfile(newProfile)
                setProfileFormData({
                  full_name: newProfile.full_name || '',
                  handle: newProfile.handle || '',
                  role: newProfile.role || '',
                  bio: newProfile.bio || '',
                  location: newProfile.location || '',
                  skills: newProfile.skills || []
                })
              }
            }
          } else {
            console.log('✅ Profile loaded:', profileData)
            setProfile(profileData)
            
            // Initialize form data
            setProfileFormData({
              full_name: profileData.full_name || '',
              handle: profileData.handle || '',
              role: profileData.role || '',
              bio: profileData.bio || '',
              location: profileData.location || '',
              skills: profileData.skills || []
            })
          }
        } else {
          console.log('ℹ️ No user found - showing sign-in prompt')
          // Don't set loading to false here, let the timeout handle it
          // or the user can click the debug button
        }
        
        clearTimeout(timeoutId)
        console.log('🏁 Profile edit page load completed')
      } catch (error) {
        console.error('💥 Unexpected error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    console.log('🚀 Profile edit useEffect triggered')
    getUserAndProfile()
    
    // Backup timeout
    const backupTimeout = setTimeout(() => {
      console.warn('🚨 Backup timeout - forcing completion')
      setLoading(false)
    }, 3000)
    
    return () => clearTimeout(backupTimeout)
  }, [])

  const handleProfileFormChange = (field: keyof ProfileFormData, value: string | string[]) => {
    setProfileFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear handle error when user starts typing
    if (field === 'handle') {
      setHandleError('')
    }
  }

  const handleHandleBlur = async () => {
    const handle = profileFormData.handle.trim()
    
    if (!handle) return
    
    // Validate handle format
    const handleRegex = /^[a-z0-9_]+$/
    if (!handleRegex.test(handle)) {
      setHandleError('Handle must contain only lowercase letters, numbers, and underscores')
      return
    }
    
    if (handle.length < 3 || handle.length > 20) {
      setHandleError('Handle must be between 3 and 20 characters')
      return
    }
    
    // Check if handle is different from current
    if (profile?.handle === handle) {
      setHandleError('')
      return
    }
    
    setIsCheckingHandle(true)
    try {
      const isAvailable = await checkHandleAvailability(handle, user!.id)
      if (!isAvailable) {
        setHandleError('Handle is already taken')
      } else {
        setHandleError('')
      }
    } catch (error) {
      setHandleError('Failed to check handle availability')
    } finally {
      setIsCheckingHandle(false)
    }
  }

  const handleProfileSave = async () => {
    // Validate required fields
    if (!profileFormData.full_name.trim()) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
      return
    }
    
    if (!profileFormData.handle.trim()) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
      return
    }
    
    if (!profileFormData.role.trim()) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
      return
    }
    
    if (handleError) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
      return
    }

    setSaveStatus('saving')
    try {
      await updateProfile(profileFormData)
      setSaveStatus('success')
      
      // Update local profile state
      setProfile((prev: any) => ({ ...prev, ...profileFormData }))
      
      // Show success message briefly
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 5000)
    }
  }

  const handleThemeSave = async (theme: SceneTheme) => {
    setSaveStatus('saving')
    try {
      await saveTheme(theme)
      setSaveStatus('success')
      // Update local profile state
      setProfile((prev: any) => ({ ...prev, theme }))
      
      // Show success message briefly
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save theme:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 5000)
    }
  }

  const handleTopFilmsSave = async (films: TopFilm[]) => {
    setSaveStatus('saving')
    try {
      await saveTopFilms(films)
      setSaveStatus('success')
      // Update local profile state
      setProfile((prev: any) => ({ ...prev, top_films: films }))
      
      // Show success message briefly
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save top films:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 5000)
    }
  }

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      const supabase = createClient()
      
      // Upload to Supabase Storage
      const fileName = `profile-pictures/${user?.id}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file)

      if (error) {
        console.error('Upload error:', error)
        alert('Failed to upload image')
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName)

      // Update profile with new picture URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user?.id)

      if (updateError) {
        console.error('Update error:', updateError)
        alert('Failed to update profile')
        return
      }

      // Update local state
      setProfile((prev: any) => ({ ...prev, profile_picture_url: publicUrl }))
      alert('Profile picture updated successfully!')
      
    } catch (error) {
      console.error('Profile picture upload error:', error)
      alert('Failed to upload profile picture')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-white/80 mb-6">You need to sign in to edit your profile</p>
          <div className="space-y-4">
            <a 
              href="/auth/sign-in"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
            >
              Sign In
            </a>
            <div className="mt-4">
              <button 
                onClick={() => {
                  console.log('🔄 Manual profile edit bypass clicked')
                  // Force a basic user and profile for testing
                  setUser({ id: 'test-user' } as User)
                  setProfile({
                    id: 'test-user',
                    full_name: 'Test User',
                    handle: 'test_user',
                    role: 'Creative Professional',
                    location: 'Location not set',
                    bio: 'This is a test profile to bypass loading issues.',
                    skills: [],
                    top_films: []
                  })
                  setProfileFormData({
                    full_name: 'Test User',
                    handle: 'test_user',
                    role: 'Creative Professional',
                    location: 'Location not set',
                    bio: 'This is a test profile to bypass loading issues.',
                    skills: []
                  })
                }}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Skip Loading (Debug)
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const defaultTheme: SceneTheme = {
    layout: 'standard',
    accentColor: '#F59E0B',
    secondaryColor: '#34D399',
    textColor: '#F5F7F7',
    cardColor: '#13171A',
    texture: 'none',
    backgroundOpacity: 0.9,
    modules: [
      { id: 'pinned', enabled: true },
      { id: 'top_films', enabled: true },
      { id: 'about', enabled: true },
      { id: 'skills', enabled: true }
    ]
  }

  const currentTheme = profile?.theme ? { ...defaultTheme, ...profile.theme } : defaultTheme

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Edit Your Profile</h1>
          <p className="text-white/80">Customize your SceneWork profile and theme</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('top-films')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'top-films'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              Top Films
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {saveStatus === 'success' && (
          <div className="mb-6 bg-amber-500/20 border border-amber-500/50 rounded-2xl p-4 text-center">
            <p className="text-amber-400 font-medium">Profile saved successfully! 🎉</p>
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-center">
            <p className="text-red-400 font-medium">Failed to save profile. Please check your inputs and try again.</p>
          </div>
        )}
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Profile Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Profile Information</h2>
                
                <div className="space-y-4 max-w-2xl mx-auto">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileFormData.full_name}
                      onChange={(e) => handleProfileFormChange('full_name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Handle */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Handle *
                    </label>
                    <input
                      type="text"
                      value={profileFormData.handle}
                      onChange={(e) => handleProfileFormChange('handle', e.target.value)}
                      onBlur={handleHandleBlur}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-white/50 focus:outline-none transition-colors ${
                        handleError 
                          ? 'border-red-500/50 focus:border-red-400/50' 
                          : 'border-white/10 focus:border-amber-400/50'
                      }`}
                      placeholder="your_handle"
                    />
                    {handleError && (
                      <p className="text-red-400 text-sm mt-1">{handleError}</p>
                    )}
                    {isCheckingHandle && (
                      <p className="text-amber-400 text-sm mt-1">Checking handle availability...</p>
                    )}
                    <p className="text-white/60 text-xs mt-1">
                      3-20 characters, lowercase letters, numbers, and underscores only
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={profileFormData.role}
                      onChange={(e) => handleProfileFormChange('role', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50 transition-colors"
                      placeholder="e.g., Director, DP, Editor, Actor"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileFormData.bio}
                      onChange={(e) => handleProfileFormChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                      placeholder="Tell us about yourself and your work..."
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileFormData.location}
                      onChange={(e) => handleProfileFormChange('location', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-amber-400/50 transition-colors"
                      placeholder="e.g., Los Angeles, CA"
                    />
                  </div>

                  {/* Profile Picture Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Current Profile Picture Preview */}
                      <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                        {profile?.profile_picture_url ? (
                          <img 
                            src={profile.profile_picture_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-black text-white">
                            {profileFormData.full_name ? getInitials(profileFormData.full_name) : 'U'}
                          </span>
                        )}
                      </div>
                      
                      {/* Upload Input */}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          id="profile-picture-upload"
                        />
                        <label
                          htmlFor="profile-picture-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Upload Photo
                        </label>
                        <p className="text-white/60 text-xs mt-2">
                          JPG, PNG or GIF. Max 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleProfileSave}
                      variant="brand"
                      className="w-full"
                      disabled={saveStatus === 'saving'}
                    >
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Theme Section */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Theme Customization</h3>
                <ThemeEditor 
                  initial={currentTheme} 
                  onSave={handleThemeSave} 
                />
              </div>
            </div>
          )}
          
          {activeTab === 'top-films' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Manage Your Top Films</h2>
              <TopFilmsEditor 
                initial={profile?.top_films || []} 
                onSave={handleTopFilmsSave} 
              />
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
