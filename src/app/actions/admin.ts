'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  
  if (!name) return { error: 'Name is required' }
  
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []

  // Assumes a table 'system_categories' exists
  const { error } = await supabase
    .from('system_categories')
    .insert([{ name, description, tags }])

  if (error) {
    // If table doesn't exist, this will gracefully return the error to the UI
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
  
  if (!id || !name) return { error: 'ID and Name are required' }
  
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
