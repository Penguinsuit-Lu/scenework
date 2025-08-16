"use server"

import { createClient } from "../../lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface MarketplaceListing {
  id: string
  category: 'gear' | 'location' | 'service'
  title: string
  description: string
  rate: string
  location: string
  photos?: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export async function listListings(category?: string): Promise<MarketplaceListing[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('marketplace_listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data: listings, error } = await query

  if (error) {
    console.error('Failed to fetch marketplace listings:', error)
    return []
  }

  return listings || []
}

export async function getListing(id: string): Promise<MarketplaceListing | null> {
  const supabase = await createClient()
  
  const { data: listing, error } = await supabase
    .from('marketplace_listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch marketplace listing:', error)
    return null
  }

  return listing
}

export async function createListing(listingData: Omit<MarketplaceListing, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Authentication required" }
  }

  // Validate required fields
  if (!listingData.title?.trim()) {
    return { success: false, error: "Listing title is required" }
  }

  if (!listingData.description?.trim()) {
    return { success: false, error: "Listing description is required" }
  }

  if (!listingData.rate?.trim()) {
    return { success: false, error: "Rate is required" }
  }

  if (!listingData.location?.trim()) {
    return { success: false, error: "Location is required" }
  }

  if (!listingData.category) {
    return { success: false, error: "Category is required" }
  }

  // Prepare data for insertion
  const insertData = {
    ...listingData,
    created_by: user.id,
    title: listingData.title.trim(),
    description: listingData.description.trim(),
    rate: listingData.rate.trim(),
    location: listingData.location.trim(),
    photos: listingData.photos || []
  }

  const { error: insertError } = await supabase
    .from('marketplace_listings')
    .insert(insertData)

  if (insertError) {
    console.error('Failed to create marketplace listing:', insertError)
    return { success: false, error: "Failed to create listing" }
  }

  revalidatePath('/marketplace')
  return { success: true }
}

