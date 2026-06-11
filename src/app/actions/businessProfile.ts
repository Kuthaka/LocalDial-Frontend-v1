'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkUsernameAvailability(username: string, currentUserId: string | null = null) {
  const supabase = await createClient()
  
  let query = supabase
    .from('business_profiles')
    .select('id')
    .eq('username', username)
    
  if (currentUserId) {
    query = query.neq('id', currentUserId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking username:', error)
    return { available: false, error: 'Database error' }
  }

  return { available: data.length === 0 }
}

export async function saveBusinessLocation(data: {
  address_text: string
  latitude: number | null
  longitude: number | null
  google_maps_url: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('business_profiles')
    .update({
      address_text: data.address_text || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      google_maps_url: data.google_maps_url || null,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/business/dashboard', 'layout')
  return { success: true }
}


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

  // Helper to upload a file to Cloudinary
  async function uploadMedia(file: File | null, pathPrefix: string): Promise<string | null> {
    if (!file) return null;
    
    const cloudName = process.env.CLOUDINARY_NAME;
    const uploadPreset = process.env.UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Missing Cloudinary environment variables');
      return null;
    }

    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('upload_preset', uploadPreset);
      // Optional: add a specific folder or public_id based on user.id
      cloudinaryFormData.append('folder', `nearbydirect/business_${user!.id}`);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryFormData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Cloudinary Upload Error:', data);
        return null;
      }

      return data.secure_url; // Returns the public Cloudinary URL
    } catch (error) {
      console.error('Failed to upload to Cloudinary:', error);
      return null;
    }
  }

  // Extract basic fields
  const name = formData.get('name') as string
  const username = formData.get('username') as string
  const description = formData.get('description') as string
  const tagline = formData.get('tagline') as string
  const established_year = formData.get('established_year') as string
  const gst_number = formData.get('gst_number') as string
  
  // Validate username availability securely on server before saving
  if (username) {
    const isAvailable = await checkUsernameAvailability(username, user.id);
    if (!isAvailable.available) {
      return { error: 'Username is already taken. Please choose another one.' }
    }
  }

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
  const amenities = formData.getAll('amenities') as string[]

  // Socials
  const website_url = formData.get('website_url') as string
  const whatsapp_number = formData.get('whatsapp_number') as string
  const instagram_url = formData.get('instagram_url') as string
  const facebook_url = formData.get('facebook_url') as string
  const youtube_url = formData.get('youtube_url') as string

  // Handle Images
  const logoFile = formData.get('logoFile') as File | null;
  const coverFile = formData.get('coverFile') as File | null;
  const newGalleryFiles = formData.getAll('newGalleryFiles') as File[];
  const existingGallery = JSON.parse((formData.get('existingGallery') as string) || '[]');

  const logo_url = await uploadMedia(logoFile, 'logo');
  const cover_url = await uploadMedia(coverFile, 'cover');

  // Upload new gallery files
  const newlyUploadedGalleryUrls: string[] = [];
  for (let i = 0; i < newGalleryFiles.length; i++) {
    const url = await uploadMedia(newGalleryFiles[i], `gallery_${i}`);
    if (url) newlyUploadedGalleryUrls.push(url);
  }

  const finalGallery = [...existingGallery, ...newlyUploadedGalleryUrls];

  // Build the update payload
  const updatePayload: any = {
    name,
    username,
    description,
    tagline,
    established_year,
    gst_number,
    address_text: fullAddress,
    latitude,
    longitude,
    google_maps_url,
    parking_info,
    amenities,
    website_url,
    whatsapp_number,
    instagram_url,
    facebook_url,
    youtube_url,
    primary_category: category,
    sub_categories: subCategories,
    primary_phone: phone,
    primary_email: email,
    gallery_images: finalGallery
  };

  if (logo_url) updatePayload.logo_url = logo_url;
  if (cover_url) updatePayload.cover_url = cover_url;

  // Use upsert to create the row if it doesn't exist for this user,
  // or update it if it does. This fixes the issue if the row was accidentally missing.
  const { data: updatedData, error } = await supabase
    .from('business_profiles')
    .upsert({ 
      id: user.id, 
      ...updatePayload 
    })
    .select(); // Select to ensure it returns the modified row

  if (error) {
    return { error: error.message }
  }

  if (!updatedData || updatedData.length === 0) {
    return { error: "Database rejected the save. Please check Supabase Row Level Security (RLS) policies for 'business_profiles' table. You must have INSERT/UPDATE policies if RLS is enabled." }
  }

  revalidatePath('/business/dashboard', 'layout')
  revalidatePath('/business/dashboard/profile', 'page')
  return { success: true }
}
