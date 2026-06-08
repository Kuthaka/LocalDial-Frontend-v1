'use server'

import { createClient } from '@/lib/supabase/server'

export async function getSystemCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('system_categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}
