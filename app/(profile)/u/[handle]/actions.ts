"use server"

import { createClient } from "../../../../lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function followUser(targetUserId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to follow users")
  }

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      followee_id: targetUserId
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // Unique constraint violation - already following
      return { success: true, alreadyFollowing: true }
    }
    throw new Error(`Failed to follow user: ${error.message}`)
  }

  revalidatePath(`/u/[handle]`)
  return { success: true, alreadyFollowing: false }
}

export async function unfollowUser(targetUserId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to unfollow users")
  }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('followee_id', targetUserId)

  if (error) {
    throw new Error(`Failed to unfollow user: ${error.message}`)
  }

  revalidatePath(`/u/[handle]`)
  return { success: true }
}

export async function isFollowing(targetUserId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return false
  }

  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', user.id)
    .eq('followee_id', targetUserId)
    .single()

  return !!data
}


