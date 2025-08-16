"use server";

import { createClient } from "../../lib/supabase/server";
import { cookies } from "next/headers";
import type { SceneTheme, TopFilm } from "../../types/profile";

const ALLOWED_TEXTURES = ['none', 'diagonal', 'dots', 'grid', 'paper'] as const;

export async function saveTheme(theme: SceneTheme): Promise<void> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  // Validate theme data
  if (!theme || typeof theme !== 'object') {
    throw new Error("Invalid theme data");
  }

  // Validate texture
  if (!ALLOWED_TEXTURES.includes(theme.texture as any)) {
    throw new Error("Invalid texture value");
  }

  // Validate colors (basic hex color validation)
  const colorRegex = /^#[0-9A-F]{6}$/i;
  if (!colorRegex.test(theme.accentColor) || 
      !colorRegex.test(theme.secondaryColor) || 
      !colorRegex.test(theme.textColor) || 
      !colorRegex.test(theme.cardColor)) {
    throw new Error("Invalid color format");
  }

  // Validate background opacity
  if (typeof theme.backgroundOpacity !== 'number' || 
      theme.backgroundOpacity < 0.6 || 
      theme.backgroundOpacity > 1) {
    throw new Error("Background opacity must be between 0.6 and 1");
  }

  // Validate layout
  if (theme.layout !== 'myspace' && theme.layout !== 'standard') {
    throw new Error("Invalid layout value");
  }

  // Validate modules
  if (!Array.isArray(theme.modules) || theme.modules.length === 0) {
    throw new Error("Modules array is required");
  }

  const validModuleIds = ['pinned', 'top_films', 'about', 'skills'];
  for (const module of theme.modules) {
    if (!validModuleIds.includes(module.id) || typeof module.enabled !== 'boolean') {
      throw new Error("Invalid module configuration");
    }
  }

  // Update the user's profile theme
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ theme: theme })
    .eq('id', user.id);

  if (updateError) {
    console.error('Failed to update theme:', updateError);
    throw new Error("Failed to save theme");
  }
}

export async function saveTopFilms(films: TopFilm[]): Promise<void> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  // Validate and sanitize films
  if (!Array.isArray(films)) {
    throw new Error("Invalid films data");
  }

  // Limit to maximum 8 films
  const limitedFilms = films.slice(0, 8);

  // Validate each film
  for (const film of limitedFilms) {
    if (!film.title || typeof film.title !== 'string' || film.title.trim().length === 0) {
      throw new Error("Film title is required");
    }

    if (film.title.length > 100) {
      throw new Error("Film title too long");
    }

    if (film.year && (typeof film.year !== 'number' || film.year < 1900 || film.year > 2030)) {
      throw new Error("Invalid film year");
    }
  }

  // Update the user's profile top_films
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ top_films: limitedFilms })
    .eq('id', user.id);

  if (updateError) {
    console.error('Failed to update top films:', updateError);
    throw new Error("Failed to save top films");
  }
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Not signed in")
  
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  
  if (error) throw error
  
  return profile
}

export async function checkHandleAvailability(handle: string, currentUserId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('handle', handle)
    .neq('id', currentUserId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking handle availability:', error)
    throw new Error("Failed to check handle availability")
  }
  
  // If data exists, handle is taken; if no data (PGRST116), handle is available
  return !data
}

export async function updateProfile(profileData: {
  full_name: string
  handle: string
  role: string
  bio?: string
  location?: string
  skills?: string[]
}): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error("Authentication required")
  }

  // Validate required fields
  if (!profileData.full_name || !profileData.full_name.trim()) {
    throw new Error("Full name is required")
  }

  if (!profileData.handle || !profileData.handle.trim()) {
    throw new Error("Handle is required")
  }

  if (!profileData.role || !profileData.role.trim()) {
    throw new Error("Role is required")
  }

  // Validate handle format
  const handleRegex = /^[a-z0-9_]+$/
  if (!handleRegex.test(profileData.handle)) {
    throw new Error("Handle must contain only lowercase letters, numbers, and underscores")
  }

  if (profileData.handle.length < 3 || profileData.handle.length > 20) {
    throw new Error("Handle must be between 3 and 20 characters")
  }

  // Check handle availability
  const isHandleAvailable = await checkHandleAvailability(profileData.handle, user.id)
  if (!isHandleAvailable) {
    throw new Error("Handle is already taken")
  }

  // Sanitize and prepare data
  const sanitizedData = {
    full_name: profileData.full_name.trim(),
    handle: profileData.handle.trim().toLowerCase(),
    role: profileData.role.trim(),
    bio: profileData.bio?.trim() || null,
    location: profileData.location?.trim() || null,
    skills: profileData.skills || []
  }

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update(sanitizedData)
    .eq('id', user.id)

  if (updateError) {
    console.error('Failed to update profile:', updateError)
    throw new Error("Failed to update profile")
  }
}
