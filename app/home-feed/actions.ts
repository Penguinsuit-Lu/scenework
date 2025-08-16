"use server"

import { createClient } from "../../lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { FeedItem } from "../../types/social"

export async function getFollowersFeed(): Promise<FeedItem[]> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return []
    }

    // Check if tables exist by trying to query them
    try {
      // Get followee IDs
      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id)

      if (followsError || !follows || follows.length === 0) {
        return []
      }

      const followeeIds = follows.map(f => f.following_id)

      // Get posts from followees
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          body,
          created_at,
          author_id
        `)
        .in('author_id', followeeIds)
        .order('created_at', { ascending: false })
        .limit(25)

      if (postsError || !posts) {
        return []
      }

      // Get author profiles for the posts
      const authorIds = [...new Set(posts.map(p => p.author_id))]
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, handle')
        .in('id', authorIds)

      if (profilesError || !profiles) {
        return []
      }

      // Create a map for quick profile lookup
      const profileMap = new Map(profiles.map(p => [p.id, p]))

      // Transform to FeedItem format
      const feedItems: FeedItem[] = posts.map(post => {
        const author = profileMap.get(post.author_id)
        return {
          id: post.id,
          body: post.body,
          created_at: post.created_at,
          author: {
            id: post.author_id,
            full_name: author?.full_name || 'Unknown User',
            handle: author?.handle || 'unknown'
          }
        }
      })

      return feedItems
    } catch (dbError) {
      // If tables don't exist yet, return empty feed
      console.log('Database tables not available yet:', dbError)
      return []
    }
  } catch (error) {
    console.log('getFollowersFeed error:', error)
    return []
  }
}

export async function createPost(body: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("You must be logged in to create posts")
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
    throw new Error(`Failed to create post: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true }
}

