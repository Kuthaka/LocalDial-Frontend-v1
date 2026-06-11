'use server'

import { createClient } from '@/lib/supabase/server'

export async function getSearchSuggestions(query: string, location?: string | null) {
  if (!query || query.length < 2) return []

  const supabase = await createClient()

  let q = supabase
    .from('business_profiles')
    .select('id, name, primary_category, username, address_text, is_verified, cover_url, logo_url')
    .or(`name.ilike.%${query}%,primary_category.ilike.%${query}%,tagline.ilike.%${query}%`)
    
  if (location && location !== 'Set your location') {
    // If a specific location is set, only show businesses in that location
    q = q.ilike('address_text', `%${location}%`)
  }

  const { data, error } = await q.limit(5)

  if (error) {
    console.error('Search suggestion error:', error)
    return []
  }

  return data || []
}

export async function getSearchResults(query: string, location?: string | null) {
  const supabase = await createClient()

  let q = supabase
    .from('business_profiles')
    .select('*')

  if (query) {
    q = q.or(`name.ilike.%${query}%,primary_category.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (location && location !== 'Set your location') {
    q = q.ilike('address_text', `%${location}%`)
  }

  const { data, error } = await q.order('is_verified', { ascending: false }).order('created_at', { ascending: false })

  if (error) {
    console.error('Search results error:', error)
    return []
  }

  return data || []
}
