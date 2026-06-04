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

export async function registerBusinessComplete(formData: any) {
  const { businessDetails, contacts, timings, categories } = formData
  const supabase = await createClient()

  // 1. Get the currently authenticated user (logged in via OTP at Step 1)
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Authentication required. Please verify your email again.' }
  }

  const userId = user.id

  // 2. Update user metadata to set role as business
  await supabase.auth.updateUser({
    data: {
      role: 'business',
      business_name: businessDetails.name,
    }
  })

  // 3. Insert Business Profile
  const { error: profileError } = await supabase.from('business_profiles').insert({
    id: userId,
    name: businessDetails.name,
    pincode: businessDetails.pincode,
    plot_no: businessDetails.plot,
    building_name: businessDetails.building,
    street_name: businessDetails.street,
    landmark: businessDetails.landmark,
    area: businessDetails.area,
    city: businessDetails.city,
    state: businessDetails.state,
    profile_score: 60 + (categories.length > 0 ? 15 : 0)
  })

  if (profileError) {
    return { error: 'Failed to save business profile: ' + profileError.message }
  }

  // 3. Insert Contacts
  const { error: contactsError } = await supabase.from('business_contacts').insert({
    business_id: userId,
    contact_person: contacts.person,
    mobiles: contacts.mobiles.filter(Boolean),
    whatsapps: contacts.whatsapps.filter(Boolean),
    landlines: contacts.landlines.filter(Boolean),
    emails: contacts.emails.filter(Boolean)
  })

  if (contactsError) {
    console.error(contactsError)
  }

  // 4. Insert Timings
  const timingInserts = timings.selectedDays.map((day: string) => ({
    business_id: userId,
    day_of_week: day,
    open_time: timings.slots[0]?.open || null, // Simplified for now
    close_time: timings.slots[0]?.close || null,
    is_closed: false
  }))
  
  if (timingInserts.length > 0) {
    await supabase.from('business_timings').insert(timingInserts)
  }

  // 5. Insert Categories
  const categoryInserts = categories.map((cat: string) => ({
    business_id: userId,
    category_name: cat
  }))
  
  if (categoryInserts.length > 0) {
    await supabase.from('business_categories').insert(categoryInserts)
  }

  return { success: true }
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

export async function sendOtp(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    }
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOtp(email: string, token: string, isLogin: boolean = false) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: error.message }
  }

  if (isLogin && data?.user) {
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
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
