import { createClient } from "../../../lib/supabase/server"
import Link from "next/link"
import { Button } from "../../../components/ui/ButtonNew"
import { 
  MapPin, 
  Star, 
  User, 
  Image, 
  Play,
  MessageCircle
} from "lucide-react"

// Sample profile data for now
const sampleProfiles: Record<string, any> = {
  'alex_cinematographer': {
    id: '1',
    handle: 'alex_cinematographer',
    full_name: 'Alex Chen',
    role: 'Cinematographer',
    location: 'Los Angeles, CA',
    bio: 'Award-winning DP with 15+ years in indie and commercial film. Specializing in natural lighting and intimate storytelling.',
    rating: 4.8,
    review_count: 24,
    skills: ['Cinematography', 'Lighting', 'Color Grading', 'Steadicam'],
    pinned_work: [
      {
        type: 'image',
        title: 'Cinematic Lighting Setup',
        url: '/api/placeholder/300/200'
      },
      {
        type: 'video',
        title: 'Behind the Scenes: The Last Light',
        url: '/api/placeholder/300/200'
      }
    ],
    favorite_movies: [
      { title: 'The Last Light', year: 2023 },
      { title: 'Urban Dreams', year: 2022 }
    ],
    portfolio: [
      {
        type: 'image',
        title: 'Cinematic Lighting Setup',
        url: '/api/placeholder/300/200'
      },
      {
        type: 'video',
        title: 'Behind the Scenes: The Last Light',
        url: '/api/placeholder/300/200'
      }
    ]
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  
  // For now, use sample data
  const profile = sampleProfiles[handle] || {
    id: '1',
    handle: 'user',
    full_name: 'User',
    role: 'Filmmaker',
    location: 'Location',
    bio: 'Bio coming soon...',
    rating: 0,
    review_count: 0,
    skills: [],
    pinned_work: [],
    favorite_movies: [],
    portfolio: []
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-white">
                    {profile.full_name.charAt(0)}
                  </span>
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name}</h1>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <User className="w-4 h-4" />
                      <span>{profile.role}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  </div>

                  <p className="text-white/80 mb-4 leading-relaxed">{profile.bio}</p>

                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className="text-white font-semibold">{profile.rating} ({profile.review_count} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 w-20">Role:</span>
                  <span className="text-white">{profile.role}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 w-20">Location:</span>
                  <span className="text-white">{profile.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 w-20">Rating:</span>
                  <span className="text-white">{profile.rating}/5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            {/* Pinned Work */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Pinned Work</h2>
              <div className="space-y-4">
                {profile.pinned_work.map((item: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {item.type === 'image' ? (
                        <>
                          <Image className="w-8 h-8 text-gray-400" />
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Image
                          </div>
                        </>
                      ) : (
                        <>
                          <Play className="w-8 h-8 text-gray-400" />
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            4K
                          </div>
                        </>
                      )}
                    </div>
                    <h3 className="text-white font-medium mt-2">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Movies */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Favorite Movies</h2>
              <div className="space-y-2">
                {profile.favorite_movies.map((movie: any, index: number) => (
                  <div key={index} className="text-white">
                    {movie.title} ({movie.year})
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Portfolio</h2>
              <div className="space-y-4">
                {profile.portfolio.map((item: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {item.type === 'image' ? (
                        <>
                          <Image className="w-8 h-8 text-gray-400" />
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Image
                          </div>
                        </>
                      ) : (
                        <>
                          <Play className="w-8 h-8 text-gray-400" />
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            4K
                          </div>
                        </>
                      )}
                    </div>
                    <h3 className="text-white font-medium mt-2">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>
              <div className="text-gray-400">No posts yet.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
