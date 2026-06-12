import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayoutClient from './DashboardLayoutClient'

export const metadata = {
  title: 'Business Dashboard - NearbyDirect',
}

export default async function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/business/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    redirect('/admin/dashboard')
  }

  if (profile?.role !== 'business') {
    await supabase.auth.signOut()
    redirect('/business/login')
  }

  const hasPasswordSet = user.user_metadata?.password_set === true;

  return <DashboardLayoutClient profile={profile} hasPasswordSet={hasPasswordSet}>{children}</DashboardLayoutClient>
}
