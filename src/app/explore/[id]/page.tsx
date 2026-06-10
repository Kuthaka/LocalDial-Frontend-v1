import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BusinessDetailsClient from './BusinessDetailsClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  const { data } = await supabase
    .from('business_profiles')
    .select('name, tagline')
    .eq('id', resolvedParams.id)
    .single()

  return {
    title: data ? `${data.name} | LocalDial` : 'Business Details',
    description: data?.tagline || 'View business details on LocalDial',
  }
}

export default async function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  
  const { data: business, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !business) {
    notFound()
  }

  return <BusinessDetailsClient business={business} />
}
