'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getBusinessProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch the full business profile
  const { data: profile } = await supabase
    .from('business_profiles')
    .select(`
      *,
      business_contacts(mobiles, emails, whatsapps),
      business_categories(category_name)
    `)
    .eq('id', user.id)
    .single()

  return profile
}

export async function updateBusinessProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Extract basic fields
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const tagline = formData.get('tagline') as string
  const established_year = formData.get('established_year') as string
  const gst_number = formData.get('gst_number') as string
  
  // Categories
  const category = formData.get('category') as string
  const subCategories = (formData.get('subCategories') as string)?.split(',').map(s => s.trim()).filter(Boolean) || []
  
  // Contact & Location
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const fullAddress = formData.get('fullAddress') as string
  const latitude = parseFloat(formData.get('latitude') as string) || null
  const longitude = parseFloat(formData.get('longitude') as string) || null
  const google_maps_url = formData.get('google_maps_url') as string
  
  // Amenities & Parking
  const parking_info = formData.get('parking_info') as string
  const amenities = formData.getAll('amenities') as string[] // Checkboxes

  // Socials
  const website_url = formData.get('website_url') as string
  const whatsapp_number = formData.get('whatsapp_number') as string
  const instagram_url = formData.get('instagram_url') as string
  const facebook_url = formData.get('facebook_url') as string
  const youtube_url = formData.get('youtube_url') as string

  // Note: Logo, Cover, and Gallery uploads usually happen via Supabase Storage.
  // For this action, we'll assume they pass URLs or we just handle text fields.

  const { error } = await supabase
    .from('business_profiles')
    .update({
      name,
      description,
      tagline,
      established_year,
      gst_number,
      address_text: fullAddress,
      latitude,
      longitude,
      google_maps_url,
      parking_info,
      amenities, // Assuming Postgres array
      website_url,
      whatsapp_number,
      instagram_url,
      facebook_url,
      youtube_url,
      primary_category: category,
      sub_categories: subCategories, // Assuming Postgres array
      primary_phone: phone,
      primary_email: email
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/business/dashboard', 'layout')
  return { success: true }
}
