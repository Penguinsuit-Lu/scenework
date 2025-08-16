"use client"

import { useState, useEffect } from "react"
import { Button } from "./ButtonNew"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { createClient } from "../../lib/supabase/client"

interface FollowButtonProps {
  profileId: string
  className?: string
}

export function FollowButton({ profileId, className = "" }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      
      if (user) {
        // Check if already following
        const { data: followData } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', profileId)
          .single()
        
        setIsFollowing(!!followData)
      }
    }
    
    checkAuth()
  }, [profileId])

  const handleFollow = async () => {
    if (!currentUser) return
    
    setIsLoading(true)
    const supabase = createClient()
    
    if (isFollowing) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', profileId)
      
      if (!error) {
        setIsFollowing(false)
      }
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: currentUser.id,
          following_id: profileId
        })
      
      if (!error) {
        setIsFollowing(true)
      }
    }
    
    setIsLoading(false)
  }

  // Don't show button for own profile
  if (currentUser?.id === profileId) {
    return null
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading || !currentUser}
      variant={isFollowing ? "outline" : "default"}
      className={`${className} ${
        isFollowing 
          ? "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-white" 
          : "bg-amber-500 hover:bg-amber-600"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  )
}
