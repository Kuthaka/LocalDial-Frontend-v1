'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getSearchResults } from '@/app/actions/search'
import PopularSection from '@/components/PopularSection'

export default function ExploreClient() {
  const location = useSelector((state: RootState) => state.location.currentLocation)
  const lat = useSelector((state: RootState) => state.location.latitude)
  const lng = useSelector((state: RootState) => state.location.longitude)
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const loc = location === 'Set your location' ? '' : location
      const results = await getSearchResults('', loc, lat, lng)
      setBusinesses(results)
      setLoading(false)
    }
    loadData()
  }, [location, lat, lng])

  const allCards = businesses.map(business => ({
    href: `/business/${business.username || business.id}`,
    coverImage: business.cover_url || (business.gallery_images && business.gallery_images[0]) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    logoImage: business.logo_url,
    name: business.name || 'Unnamed Business',
    handle: business.username || (business.tagline ? business.tagline.replace(/\s+/g, '').toLowerCase() : business.id.slice(0, 8)),
    description: business.description || business.tagline || 'No description available.',
    verified: business.is_verified !== false,
    category: business.primary_category,
    distance: business.distance
  }))

  const shops = allCards.filter(c => c.category === 'Shopping')
  const restaurants = allCards.filter(c => c.category === 'Restaurants')
  const banks = allCards.filter(c => c.category === 'Banks')
  const healthcare = allCards.filter(c => c.category === 'Healthcare')
  const services = allCards.filter(c => c.category === 'Services')
  const hotels = allCards.filter(c => c.category === 'Hotels')
  const beauty = allCards.filter(c => c.category === 'Beauty')
  const automotive = allCards.filter(c => c.category === 'Automotive')

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#104825] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {restaurants.length > 0 && <PopularSection title={`Popular restaurants near ${location}`} businesses={restaurants.slice(0, 8)} />}
      {shops.length > 0 && <PopularSection title={`Top shopping spots in ${location}`} businesses={shops.slice(0, 8)} />}
      {healthcare.length > 0 && <PopularSection title={`Healthcare near ${location}`} businesses={healthcare.slice(0, 8)} />}
      {services.length > 0 && <PopularSection title={`Home & Professional services in ${location}`} businesses={services.slice(0, 8)} />}
      {hotels.length > 0 && <PopularSection title={`Best hotels & stays in ${location}`} businesses={hotels.slice(0, 8)} />}
      {automotive.length > 0 && <PopularSection title={`Automotive services in ${location}`} businesses={automotive.slice(0, 8)} />}
      {beauty.length > 0 && <PopularSection title={`Beauty & Spa in ${location}`} businesses={beauty.slice(0, 8)} />}
      {banks.length > 0 && <PopularSection title={`Banks near ${location}`} businesses={banks.slice(0, 8)} />}

      {businesses.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-slate-400">No businesses found in {location}.</h3>
        </div>
      )}
    </div>
  )
}
