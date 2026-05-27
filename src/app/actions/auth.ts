'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function loginBusiness(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check profile status
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role !== 'business') {
    await supabase.auth.signOut()
    return { error: 'Not authorized as a business.' }
  }

  if (profile?.status === 'pending') {
    await supabase.auth.signOut()
    return { error: 'Your business account is pending approval by an administrator.' }
  }

  if (profile?.status === 'rejected') {
    await supabase.auth.signOut()
    return { error: 'Your business account was rejected.' }
  }

  revalidatePath('/', 'layout')
  redirect('/business/dashboard')
}

export async function signupBusiness(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const businessName = formData.get('businessName') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'business',
        business_name: businessName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Force signout immediately since they are pending approval
  await supabase.auth.signOut()

  return { success: 'Registration successful. Please wait for an administrator to approve your account.' }
}

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'Not authorized as an admin.' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
