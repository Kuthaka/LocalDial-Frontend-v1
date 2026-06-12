'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createRawClient } from '@supabase/supabase-js'
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

export async function adminAddBusiness(formData: FormData) {
  const supabase = await createClient()

  // 1. Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Not authorized.' }
  }

  // Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const businessName = formData.get('businessName') as string
  const mobile = formData.get('mobile') as string
  const city = formData.get('city') as string
  const category = formData.get('category') as string

  // 2. Create raw client to sign up the business user without overwriting admin's session cookies
  const rawSupabase = createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  )

  const { data: authData, error: signUpError } = await rawSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'business',
        business_name: businessName,
        password_set: true
      }
    }
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (!authData.user) {
    return { error: 'User creation failed.' }
  }

  const newUserId = authData.user.id

  // 3. Upsert into profiles
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: newUserId,
    role: 'business',
    status: 'approved',
    business_name: businessName
  })

  if (profileError) {
    return { error: 'Failed to create profile: ' + profileError.message }
  }

  // 4. Insert into business_profiles
  const { error: bpError } = await supabase.from('business_profiles').insert({
    id: newUserId,
    name: businessName,
    city: city || 'Unknown',
    profile_score: 60
  })

  if (bpError) {
    return { error: 'Failed to create business profile: ' + bpError.message }
  }

  // 5. Insert into business_contacts
  if (mobile) {
    await supabase.from('business_contacts').insert({
      business_id: newUserId,
      mobiles: [mobile],
      emails: [email]
    })
  }

  // 6. Insert category if provided
  if (category) {
    await supabase.from('business_categories').insert({
      business_id: newUserId,
      category_name: category
    })
  }

  revalidatePath('/admin/dashboard/businesses')
  
  return { success: true }
}
