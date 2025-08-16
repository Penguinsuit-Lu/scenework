import Link from "next/link"
import { Badge } from "./ui/badge"
import { Star, MapPin, Award } from "lucide-react"

interface Profile {
  id: string
  handle: string
  full_name: string
  role: string
  location: string
  bio: string
  skills: string[]
  rating: number
  profile_picture_url: string | null
}

interface ProfileCardProps {
  profile: Profile
  className?: string
}

export function ProfileCard({ profile, className = "" }: ProfileCardProps) {
  return (
    <Link href={`/u/${profile.handle}`}>
      <div className={`group bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:border-amber-400/40 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 ${className}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {profile.profile_picture_url ? (
                <img 
                  src={profile.profile_picture_url} 
                  alt={profile.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                profile.full_name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors">
                {profile.full_name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Award className="w-4 h-4" />
                <span>{profile.role}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
            <span className="text-white font-medium text-sm">
              {profile.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-white/60 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{profile.location}</span>
        </div>

        {/* Bio */}
        <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
          {profile.bio}
        </p>

        {/* Skills */}
                <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 4).map((skill, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-amber-500/30 text-amber-200 border-amber-500/40 hover:bg-amber-500/50"
            >
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 4 && (
            <Badge variant="outline" className="text-white/60 border-white/30">
              +{profile.skills.length - 4} more
            </Badge>
          )}
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  )
}
