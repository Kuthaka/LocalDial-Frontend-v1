'use server'

import { createClient } from '@/lib/supabase/server'

// Helper to calculate distance in km between two coordinates
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function getSearchSuggestions(query: string, location?: string | null, lat?: number | null, lng?: number | null) {
  if (!query || query.length < 2) return []

  const supabase = await createClient()

  let q = supabase
    .from('business_profiles')
    .select('id, name, primary_category, username, address_text, cover_url, logo_url, latitude, longitude')
    .or(`name.ilike.%${query}%,primary_category.ilike.%${query}%,tagline.ilike.%${query}%`)
    
  if (lat && lng) {
    const latDiff = 25 / 111;
    const lngDiff = 25 / (111 * Math.cos(lat * (Math.PI / 180)));
    q = q.gte('latitude', lat - latDiff)
         .lte('latitude', lat + latDiff)
         .gte('longitude', lng - lngDiff)
         .lte('longitude', lng + lngDiff);
  } else if (location && location !== 'Set your location') {
    q = q.ilike('address_text', `%${location}%`)
  }

  // We fetch up to 50, sort in JS, then return 5
  const { data, error } = await q.limit(50)

  if (error) {
    console.error('Search suggestion error:', error)
    return []
  }

  let results = data || []
  
  if (lat && lng && results.length > 0) {
    results.forEach((item: any) => {
      if (item.latitude && item.longitude) {
        item.distance = getDistanceInKm(lat, lng, item.latitude, item.longitude);
      } else {
        item.distance = 999; // Put ones without coords at the end
      }
    });
    // Filter out strictly > 25km if we want, but bounding box mostly did that. 
    // Wait, bounding box corners could be > 25km (up to ~35km). Let's strictly filter:
    results = results.filter((item: any) => item.distance <= 25 || item.distance === 999);
    results.sort((a: any, b: any) => a.distance - b.distance);
  }

  return results.slice(0, 5);
}

export async function getSearchResults(query: string, location?: string | null, lat?: number | null, lng?: number | null) {
  const supabase = await createClient()

  let q = supabase
    .from('business_profiles')
    .select('*')

  if (query) {
    q = q.or(`name.ilike.%${query}%,primary_category.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (lat && lng) {
    const latDiff = 25 / 111;
    const lngDiff = 25 / (111 * Math.cos(lat * (Math.PI / 180)));
    q = q.gte('latitude', lat - latDiff)
         .lte('latitude', lat + latDiff)
         .gte('longitude', lng - lngDiff)
         .lte('longitude', lng + lngDiff);
  } else if (location && location !== 'Set your location') {
    q = q.ilike('address_text', `%${location}%`)
  }

  const { data, error } = await q.limit(200)

  if (error) {
    console.error('Search results error:', error)
    return []
  }

  let results = data || []

  if (lat && lng && results.length > 0) {
    results.forEach((item: any) => {
      if (item.latitude && item.longitude) {
        item.distance = getDistanceInKm(lat, lng, item.latitude, item.longitude);
      } else {
        item.distance = 999;
      }
    });
    
    results = results.filter((item: any) => item.distance <= 25 || item.distance === 999);
    results.sort((a: any, b: any) => a.distance - b.distance);
  } else {
    results.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return results
}
