import { createClient } from '@/lib/supabase/server'
import SecurityClient from './SecurityClient'

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const hasPasswordSet = user.user_metadata?.password_set === true

  return (
    <SecurityClient email={user.email!} hasPasswordSet={hasPasswordSet} />
  )
}
