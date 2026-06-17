import { getSearchResults } from '@/app/actions/search'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Star, ShieldCheck, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const loc = typeof resolvedParams.loc === 'string' ? resolvedParams.loc : ''
  const lat = typeof resolvedParams.lat === 'string' ? parseFloat(resolvedParams.lat) : null
  const lng = typeof resolvedParams.lng === 'string' ? parseFloat(resolvedParams.lng) : null

  const results = await getSearchResults(q, loc, lat, lng)

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-[#1c2331]">
              {q ? `Results for "${q}"` : 'All Businesses'}
              {loc && loc !== 'Set your location' && <span className="text-slate-400"> in {loc}</span>}
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Found {results.length} matching {results.length === 1 ? 'business' : 'businesses'}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((business: any) => (
                <Link 
                  href={`/business/${business.username || business.id}`} 
                  key={business.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group"
                >
                  <div className="h-48 relative bg-slate-100 overflow-hidden">
                    <img 
                      src={business.cover_url || (business.gallery_images && business.gallery_images[0]) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'} 
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-sm text-xs font-bold px-2.5 py-1 rounded-md text-[#1c2331]">
                      {business.primary_category || 'Service'}
                    </div>
                    {business.is_verified !== false && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden shadow-sm">
                        <img 
                          src={business.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(business.name)}&background=1c2331&color=fff`} 
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-black text-[#1c2331] truncate group-hover:text-[#F4AE52] transition-colors">{business.name}</h3>
                        {business.tagline && (
                          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{business.tagline}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium max-w-[70%]">
                        <MapPin className="w-4 h-4 text-[#104825] flex-shrink-0" />
                        <span className="truncate">{business.address_text || business.city || 'Location unavailable'}</span>
                        {business.distance !== undefined && business.distance !== 999 && (
                          <span className="text-xs text-[#104825] bg-green-50 px-1.5 py-0.5 rounded ml-1 font-bold">
                            {business.distance.toFixed(1)} km
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-600 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-[#1c2331] mb-2">No businesses found</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto">
                We couldn't find any businesses matching "{q}" {loc && loc !== 'Set your location' && `in ${loc}`}. Try adjusting your search terms or exploring a different location.
              </p>
              <Link href="/explore" className="inline-flex items-center gap-2 mt-8 bg-[#104825] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0c361c] transition-colors shadow-lg shadow-[#104825]/20">
                Explore All Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
