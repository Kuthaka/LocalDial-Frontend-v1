import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PopularSection from '@/components/PopularSection'

export const metadata = {
  title: 'Explore Businesses | LocalDial',
}

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  const supabase = await createClient()

  // Fetch all business profiles
  const { data: businesses, error } = await supabase
    .from('business_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const allCards = (businesses || []).map(business => ({
    href: `/business/${business.username || business.id}`,
    coverImage: business.cover_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    logoImage: business.logo_url,
    name: business.name || 'Unnamed Business',
    handle: business.username || (business.tagline ? business.tagline.replace(/\s+/g, '').toLowerCase() : business.id.slice(0, 8)),
    description: business.description || business.tagline || 'No description available.',
    verified: business.is_verified !== false,
  }))

  // Create slices of the array so each section looks populated even with few db records
  const shops = allCards.slice(0, 6)
  const restaurants = allCards.length > 2 ? allCards.slice(1, 7) : allCards
  const banks = allCards.length > 3 ? allCards.slice(2, 8) : allCards
  const healthcare = allCards.length > 4 ? allCards.slice(3, 9) : allCards
  const services = allCards.slice(0, 5)

  return (
    <div className="w-full pb-20 overflow-hidden">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <h1 className="text-3xl md:text-4xl font-black text-[#1c2331] tracking-tight mb-2">Explore Everything</h1>
          <p className="text-slate-500 font-medium mb-4">Discover top-rated places across every category</p>
        </div>

        {!businesses || businesses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-slate-400">No businesses found yet.</h3>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <PopularSection title="Popular shops near you" businesses={shops} />
            <PopularSection title="Popular restaurants near you" businesses={restaurants} />
            <PopularSection title="Popular banks near you" businesses={banks} />
            <PopularSection title="Top healthcare providers" businesses={healthcare} />
            <PopularSection title="Trending home services" businesses={services} />
          </div>
        )}
      </main>
    </div>
  )
}
