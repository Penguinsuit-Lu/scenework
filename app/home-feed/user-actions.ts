"use server"

import { createClient } from "../../lib/supabase/server"

export async function getMe() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { user: null, profile: null }
    }

    // Get user profile - handle case where table doesn't exist yet
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, handle, role, location, rating, ratings_count')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        return { user: { id: user.id }, profile: null }
      }

      return { user: { id: user.id }, profile }
    } catch (dbError) {
      // If profiles table doesn't exist yet, just return user without profile
      console.log('Profiles table not available yet:', dbError)
      return { user: { id: user.id }, profile: null }
    }
  } catch (error) {
    console.log('getMe error:', error)
    return { user: null, profile: null }
  }
}

