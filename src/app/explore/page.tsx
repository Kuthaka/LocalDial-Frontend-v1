import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BusinessCard from '@/components/BusinessCard'

export const metadata = {
  title: 'Explore Businesses | LocalDial',
}

export default async function ExplorePage() {
  const supabase = await createClient()

  // Fetch all business profiles
  const { data: businesses, error } = await supabase
    .from('business_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="w-full pb-20">
      {/* Grid */}
      <main className="max-w-6xl mx-auto py-8 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#1c2331] tracking-tight mb-8">Explore Everything</h1>
        {!businesses || businesses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-slate-400">No businesses found yet.</h3>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            {businesses.map((business) => (
              <Link href={`/explore/${business.id}`} key={business.id} className="block hover:scale-[1.02] transition-transform duration-300">
                <BusinessCard 
                  coverImage={business.cover_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                  logoImage={business.logo_url}
                  name={business.name || 'Unnamed Business'}
                  handle={business.tagline ? business.tagline.replace(/\s+/g, '').toLowerCase() : business.id.slice(0, 8)}
                  description={business.description || business.tagline || 'No description available.'}
                  verified={business.is_verified !== false}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
