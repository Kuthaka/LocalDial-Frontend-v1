import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BusinessDetailsClient from './BusinessDetailsClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedParams.username)
  let query = supabase.from('business_profiles').select('name, tagline')
  
  if (isUuid) {
    query = query.or(`username.eq.${resolvedParams.username},id.eq.${resolvedParams.username}`)
  } else {
    query = query.eq('username', resolvedParams.username)
  }
  
  const { data } = await query.single()

  return {
    title: data ? `${data.name} | LocalDial` : 'Business Details',
    description: data?.tagline || 'View business details on LocalDial',
  }
}

export default async function BusinessDetailsPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  console.log('--- ROUTE HIT --- params:', resolvedParams);

  const supabase = await createClient()
  
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedParams.username)
  let query = supabase.from('business_profiles').select('*')
  
  if (isUuid) {
    query = query.or(`username.eq.${resolvedParams.username},id.eq.${resolvedParams.username}`)
  } else {
    query = query.eq('username', resolvedParams.username)
  }

  const { data: business, error } = await query.single()
  console.log('--- DB RESULT --- business:', business?.id, 'error:', error);

  if (error || !business) {
    console.log('--- TRIGGERING 404 ---');
    notFound()
  }

  return <BusinessDetailsClient business={business} />
}
