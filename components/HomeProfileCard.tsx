"use client"

import Link from "next/link"
import { Button } from "./ui/ButtonNew"

interface Profile {
  full_name: string
  handle: string
  role?: string
  location?: string
  rating?: number
  ratings_count?: number
}

interface Me {
  user: { id: string } | null
  profile: Profile | null
}

interface HomeProfileCardProps {
  me: Me
}

export default function HomeProfileCard({ me }: HomeProfileCardProps) {
  if (!me.user) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
        <p className="text-sm text-gray-300 mb-3">
          Sign in to personalize your feed
        </p>
        <Link href="/auth/sign-in">
          <Button variant="brand" size="sm">
            Sign In
          </Button>
        </Link>
      </div>
    )
  }

  const { profile } = me
  if (!profile) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-semibold text-lg">
            ?
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  const initials = profile.full_name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-semibold text-lg">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{profile.full_name}</h3>
          <p className="text-sm text-gray-400">@{profile.handle}</p>
          {(profile.role || profile.location) && (
            <p className="text-xs text-gray-500 truncate">
              {[profile.role, profile.location].filter(Boolean).join(' • ')}
            </p>
          )}
          {profile.rating && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-amber-400">★</span>
              <span className="text-xs text-gray-400">
                {profile.rating.toFixed(1)}
                {profile.ratings_count && ` (${profile.ratings_count})`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


