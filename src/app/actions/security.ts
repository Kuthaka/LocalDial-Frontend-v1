'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyAndSetPassword(email: string, token: string, password: string) {
  const supabase = await createClient()

  // Verify the OTP first
  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (verifyError) {
    return { error: 'Invalid or expired OTP: ' + verifyError.message }
  }

  if (!data?.user) {
    return { error: 'Authentication failed.' }
  }

  // Set the password and flag
  const { error: updateError } = await supabase.auth.updateUser({
    password: password,
    data: {
      password_set: true
    }
  })

  if (updateError) {
    return { error: 'Failed to set password: ' + updateError.message }
  }

  revalidatePath('/', 'layout')
  
  return { success: true }
}
