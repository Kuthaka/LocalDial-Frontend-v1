import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <Link 
                href={`/explore/${business.id}`} 
                key={business.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <img 
                    src={business.cover_url || business.logo_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'} 
                    alt={business.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-[#104825] shadow-sm">
                    {business.primary_category || 'Business'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-[#1c2331] group-hover:text-[#104825] transition-colors line-clamp-1">
                    {business.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {business.tagline || business.description || 'No description available.'}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{business.address_text || 'Location not specified'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
