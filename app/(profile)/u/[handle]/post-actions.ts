"use server"

import { createClient } from "../../../../lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUserPosts(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, body, created_at')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(25)

    if (error) {
      console.error('Failed to fetch user posts:', error)
      return []
    }

    return posts || []
  } catch (error) {
    // If posts table doesn't exist yet, return empty array
    console.log('Posts table not available yet, returning empty posts array')
    return []
  }
}

export async function createProfilePost(body: string, profileId: string) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error("You must be logged in to create posts")
    }

    // Ensure current user can only post on their own profile
    if (user.id !== profileId) {
      throw new Error("You can only post on your own profile")
    }

    const trimmedBody = body.trim()
    if (!trimmedBody) {
      throw new Error("Post cannot be empty")
    }

    if (trimmedBody.length > 1000) {
      throw new Error("Post cannot exceed 1000 characters")
    }

    const { error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        body: trimmedBody
      })

    if (error) {
      console.error('Failed to create post:', error)
      throw new Error("Failed to create post")
    }

    // Revalidate the profile page to show the new post
    revalidatePath(`/u/${profileId}`)
  } catch (error) {
    // If posts table doesn't exist yet, just log and continue
    console.log('Posts table not available yet, cannot create post')
    throw new Error("Posts feature not available yet - database setup in progress")
  }
}

