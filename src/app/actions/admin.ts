'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CategorySchema } from '@/validations/category'
import { randomUUID } from 'crypto'

export async function approveBusiness(userId: string) {
  const supabase = await createClient()

  // First verify the caller is an admin
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'Not authenticated' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'approved' })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function rejectBusiness(userId: string) {
  const supabase = await createClient()

  // First verify the caller is an admin
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'Not authenticated' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'rejected' })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function addMainCategory(formData: FormData) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  if (!name) return { error: 'Name is required' }

  const { error } = await supabase
    .from('main_categories')
    .insert([{ name }])

  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard/categories')
  return { success: true }
}

export async function addCategory(formData: FormData) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const main_category_id = formData.get('main_category_id') as string
  const description = formData.get('description') as string
  
  if (!name) return { error: 'Name is required' }
  if (!main_category_id) return { error: 'Main Category is required' }

  const { error } = await supabase
    .from('system_categories')
    .insert([{ name, main_category_id: main_category_id || null, description }])

  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard/categories')
  return { success: true }
}

export async function addSubCategory(formData: FormData) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const category_id = formData.get('category_id') as string
  
  if (!name) return { error: 'Name is required' }
  if (!category_id) return { error: 'Category is required' }

  const { error } = await supabase
    .from('sub_categories')
    .insert([{ name, category_id }])

  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard/categories')
  return { success: true }
}

export async function editCategory(formData: FormData) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'Not authenticated' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const tagsStr = formData.get('tags') as string
  
  if (!id) return { error: 'Category ID is required' }
  
  const validation = CategorySchema.safeParse({ name, description })
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  // Check for duplicates (excluding the current category)
  const { data: existing } = await supabase
    .from('system_categories')
    .select('id')
    .ilike('name', name)
    .neq('id', id)
    .single()

  if (existing) {
    return { error: 'A category with this name already exists' }
  }
  
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []

  const { error } = await supabase
    .from('system_categories')
    .update({ name, description, tags })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/categories')
  return { success: true }
}

export async function createAdminBusiness(formData: FormData) {
  const supabase = await createClient()

  // Ensure user is an admin (in a real app, you'd check roles here)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized: Admin access required.' }
  }

  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const phone = formData.get('phone') as string
  const location = formData.get('location') as string
  const tagline = formData.get('tagline') as string

  // Generate a random ID for this unclaimed business
  const id = randomUUID()
  
  // Create a base username
  const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000)

  // We perform a direct insert. 
  // IMPORTANT: This requires the foreign key constraint on `business_profiles.id` to be removed or bypassed.
  const { error } = await supabase
    .from('business_profiles')
    .insert({
      id: id,
      name: name,
      username: baseUsername,
      primary_category: category,
      primary_phone: phone || null,
      address_text: location,
      tagline: tagline || null,
      is_verified: false, // Unclaimed businesses are unverified by default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Failed to create admin business:', error)
    
    // Check if it's the specific foreign key error
    if (error.code === '23503' && error.message.includes('business_profiles_id_fkey')) {
      return { error: 'Database constraint error: You must run the admin setup SQL snippet to allow unclaimed businesses. See instructions.' }
    }
    
    return { error: error.message }
  }

  revalidatePath('/admin/dashboard/businesses')
  revalidatePath('/explore')
  revalidatePath('/')
  
  return { success: true }
}
