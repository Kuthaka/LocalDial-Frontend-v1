'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CategorySchema } from '@/validations/category'

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

export async function addCategory(formData: FormData) {
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

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const tagsStr = formData.get('tags') as string
  
  const validation = CategorySchema.safeParse({ name, description })
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  // Check for duplicates
  const { data: existing } = await supabase
    .from('system_categories')
    .select('id')
    .ilike('name', name)
    .single()

  if (existing) {
    return { error: 'A category with this name already exists' }
  }
  
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []

  const { error } = await supabase
    .from('system_categories')
    .insert([{ name, description, tags }])

  if (error) {
    return { error: error.message }
  }

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
