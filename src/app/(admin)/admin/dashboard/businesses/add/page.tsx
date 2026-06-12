import { createClient } from '@/lib/supabase/server'
import AddBusinessClient from './AddBusinessClient'

export default async function AdminAddBusinessPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('system_categories')
    .select('id, name')
    .order('name', { ascending: true })

  return <AddBusinessClient categories={categories || []} />
}
