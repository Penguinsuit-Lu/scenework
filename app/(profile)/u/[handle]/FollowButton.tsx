"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../../components/ui/ButtonNew"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { followUser, unfollowUser, isFollowing } from "./actions"
import { createClient } from "../../../../lib/supabase/client"

interface FollowButtonProps {
  targetUserId: string
}

export function FollowButton({ targetUserId }: FollowButtonProps) {
  const [following, setFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const checkAuthAndFollowing = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      
      if (user) {
        try {
          const followingStatus = await isFollowing(targetUserId)
          setFollowing(followingStatus)
        } catch (error) {
          console.error("Failed to check following status:", error)
        }
      }
    }
    
    checkAuthAndFollowing()
  }, [targetUserId])

  const handleFollow = async () => {
    if (!currentUser) return
    
    setIsLoading(true)
    
    try {
      if (following) {
        // Unfollow
        await unfollowUser(targetUserId)
        setFollowing(false)
      } else {
        // Follow
        await followUser(targetUserId)
        setFollowing(true)
      }
    } catch (error) {
      console.error("Follow action failed:", error)
      // Revert optimistic update on error
      setFollowing(!following)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show button for own profile
  if (currentUser?.id === targetUserId) {
    return null
  }

  // Don't show button if not logged in
  if (!currentUser) {
    return null
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={following ? "outline" : "default"}
      className={
        following 
          ? "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-white" 
          : "bg-amber-500 hover:bg-amber-600"
      }
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : following ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Following
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
