"use client"

import { useState, useEffect } from "react"
import { ProfileCard } from "../../components/ProfileCard"
import { textureStyle, ThemeCSSVars } from "../../components/texture"
import type { SceneTheme } from "../../types/profile"
import { 
  Search, 
  Filter, 
  Users, 
  Sparkles,
  Grid3X3,
  List,
  Star,
  Zap,
  MapPin,
  Calendar,
  Award,
  Edit,
  MessageCircle
} from "lucide-react"
import { createClient } from "../../lib/supabase/client"
import { Button } from "../../components/ui/ButtonNew"
import Link from "next/link"

// Sample theme for the profiles page
const profilesTheme: SceneTheme = {
  layout: 'standard',
  accentColor: '#F59E0B', // Amber
  secondaryColor: '#06B6D4', // Cyan
  textColor: '#F8FAFC', // Slate-50
  cardColor: 'rgba(30, 41, 59, 0.8)', // Slate-800 with transparency
  texture: 'dots',
  backgroundOpacity: 0.95,
  modules: [
    { id: 'pinned', enabled: true },
    { id: 'top_films', enabled: true },
    { id: 'about', enabled: true },
    { id: 'skills', enabled: true }
  ]
}

// Sample profiles data
const sampleProfiles = [
  {
    id: '1',
    handle: 'alex_cinematographer',
    full_name: 'Alex Chen',
    role: 'Cinematographer',
    location: 'Los Angeles, CA',
    bio: 'Award-winning DP with 15+ years in indie and commercial film. Specializing in natural lighting and intimate storytelling.',
    skills: ['Cinematography', 'Lighting', 'Color Grading', 'Steadicam'],
    rating: 4.8,
    profile_picture_url: null
  },
  {
    id: '2',
    handle: 'sarah_editor',
    full_name: 'Sarah Rodriguez',
    role: 'Film Editor',
    location: 'New York, NY',
    bio: 'Creative editor with a passion for narrative flow and emotional storytelling. Worked on 50+ short films and documentaries.',
    skills: ['Film Editing', 'Sound Design', 'Color Correction', 'Motion Graphics'],
    rating: 4.9,
    profile_picture_url: null
  },
  {
    id: '3',
    handle: 'mike_sound',
    full_name: 'Mike Thompson',
    role: 'Sound Designer',
    location: 'Austin, TX',
    bio: 'Experienced sound designer and mixer. Creating immersive audio experiences for films, games, and interactive media.',
    skills: ['Sound Design', 'Audio Mixing', 'Foley', 'ADR'],
    rating: 4.7,
    profile_picture_url: null
  },
  {
    id: '4',
    handle: 'jessica_producer',
    full_name: 'Jessica Kim',
    role: 'Producer',
    location: 'Atlanta, GA',
    bio: 'Independent film producer with a track record of successful festival runs and distribution deals.',
    skills: ['Producing', 'Budgeting', 'Casting', 'Distribution'],
    rating: 4.6,
    profile_picture_url: null
  }
]

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'recent'>('rating')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.log('No user found:', userError.message)
          setCurrentUser(null)
        } else if (user) {
          setCurrentUser(user)
        }
      } catch (error) {
        console.log('Auth check error:', error)
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const filteredProfiles = sampleProfiles.filter(profile => {
    const matchesSearch = profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = selectedRole === 'all' || profile.role.toLowerCase() === selectedRole.toLowerCase()
    
    return matchesSearch && matchesRole
  })

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.full_name.localeCompare(b.full_name)
      case 'recent':
        return 0 // Would be based on join date in real app
      default:
        return 0
    }
  })

  const roles = ['all', 'cinematographer', 'film editor', 'sound designer', 'producer', 'actor', 'director']

  return (
    <>
      <ThemeCSSVars theme={profilesTheme} />
      <div 
        className="min-h-screen bg-black relative overflow-hidden"
        style={textureStyle(profilesTheme)}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Header Section */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                Meet the <span className="text-amber-400">Crew</span>
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Empowering indie filmmakers to create their masterpiece. Discover your cast or join a crew, and start rolling on your next project.
              </p>
            </div>

            {/* User Actions */}
            {currentUser ? (
              <div className="flex justify-center gap-4 mb-8">
                <Link href="/profile/edit">
                  <Button variant="brand" className="px-6 py-3">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit My Profile
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="outline" className="px-6 py-3">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center mb-8">
                <p className="text-white/60 mb-4">Join the community to connect with other creatives</p>
                <Link href="/auth/sign-in">
                  <Button variant="brand" className="px-6 py-3">
                    <Users className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="relative z-10 container mx-auto px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search by name, role, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role} value={role} className="bg-slate-800 text-white">
                      {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                >
                  <option value="rating" className="bg-slate-800 text-white">Sort by Rating</option>
                  <option value="name" className="bg-slate-800 text-white">Sort by Name</option>
                  <option value="recent" className="bg-slate-800 text-white">Sort by Recent</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-white/60 text-sm">
                  {filteredProfiles.length} of {sampleProfiles.length} profiles
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profiles Grid */}
        <section className="relative z-10 container mx-auto px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            {filteredProfiles.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-white/60" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No profiles found</h3>
                <p className="text-white/60 mb-8">Try adjusting your search terms or filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedRole('all')
                  }}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {sortedProfiles.map((profile) => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile}
                    className={viewMode === 'list' ? 'flex-row items-center space-x-4' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 container mx-auto px-4 pb-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-3xl border border-amber-400/30 p-12">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to <span className="text-yellow-300">Connect</span>?
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Join thousands of creative professionals and start building your next amazing project
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile/edit">
                  <Button variant="brand" className="px-8 py-4">
                    <Zap className="w-5 h-5 mr-2" />
                    Create Your Profile
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" className="px-8 py-4">
                    <Star className="w-5 h-5 mr-2" />
                    Browse Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
