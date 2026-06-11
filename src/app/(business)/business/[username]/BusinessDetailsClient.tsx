'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Share2, Heart, Check, MapPin, Phone, Mail, Globe, Tag } from 'lucide-react'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false, loading: () => <div className="w-full h-[300px] bg-slate-100 rounded-2xl animate-pulse" /> })

export default function BusinessDetailsClient({ business }: { business: any }) {
  const defaultImages = [
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516280440502-6294b08709ec?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  ]

  // Build gallery immutably — cover first, then gallery images, pad with defaults
  const rawGallery: string[] = [
    ...(business.cover_url ? [business.cover_url] : []),
    ...(business.gallery_images || []),
  ]
  const images = rawGallery.length >= 4
    ? rawGallery.slice(0, 4)
    : [...rawGallery, ...defaultImages].slice(0, 4)

  const [mainImage, setMainImage] = useState(images[0])

  return (
    <div className="font-sans pb-20">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 pt-4 sm:pt-8">
        
        {/* Back Link */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
          
          {/* Left Column: Gallery Card */}
          <div className="bg-white rounded-[2rem] p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col-reverse sm:flex-row gap-4 h-[600px]">
            {/* Thumbnails (Left side) */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-24 flex-shrink-0">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative w-20 h-20 sm:w-full sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    mainImage === img ? 'border-[#1c2331] ring-2 ring-slate-200' : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 rounded-3xl overflow-hidden bg-slate-100 h-full">
              <img 
                src={mainImage} 
                alt="Main view" 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Action Buttons Top Right */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all shadow-lg border border-white/40">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all shadow-lg border border-white/40">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Info Card using Reference Styling */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full min-h-[600px]">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-black text-[#1c2331] tracking-tight">{business.name || 'Unnamed Business'}</h1>
                {business.is_verified !== false && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] rounded text-[10px] font-black tracking-widest uppercase flex-shrink-0 mt-1">
                    <Check className="w-3 h-3 stroke-[3]" /> VERIFIED
                  </span>
                )}
              </div>
              {business.tagline && (
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <Tag className="w-4 h-4" />
                  {business.tagline}
                </div>
              )}
            </div>

            {/* Categories / Tags replacing "Service Type" */}
            {(business.primary_category || (business.sub_categories && business.sub_categories.length > 0)) && (
              <div className="mb-10">
                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {business.primary_category && (
                    <div className="bg-[#1c2331] text-white border border-[#1c2331] px-4 py-2.5 rounded-2xl font-bold text-[11px] tracking-wider uppercase shadow-md">
                      {business.primary_category}
                    </div>
                  )}
                  {business.sub_categories?.map((cat: string, idx: number) => (
                    <div key={idx} className="bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-4 py-2.5 rounded-2xl font-bold text-[11px] tracking-wider uppercase transition-colors">
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Cards replacing Pricing Cards */}
            <div className="space-y-4 flex-1">
              
              {/* Active Style Card: About Us */}
              <div className="relative border-2 border-[#1c2331] rounded-3xl p-5 shadow-sm">
                <div className="absolute top-4 right-4">
                  <Globe className="w-5 h-5 text-[#1c2331]" />
                </div>
                <h4 className="text-xs font-bold tracking-widest text-[#1c2331] uppercase mb-3">About Us</h4>
                <p className="text-slate-700 font-medium leading-relaxed text-sm">
                  {business.description || 'No description provided by this business.'}
                </p>
              </div>

              {/* Inactive Style Card: Contact Info */}
              <div className="border border-slate-100 bg-[#f8fafc] rounded-3xl p-5">
                <h4 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4">Contact & Location</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[#1c2331] font-bold text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    {business.primary_phone || 'Phone unavailable'}
                  </div>
                  <div className="flex items-center gap-3 text-[#1c2331] font-bold text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="truncate">{business.primary_email || 'Email unavailable'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-[#1c2331] font-bold text-sm pt-1">
                    <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="leading-tight mt-1">{business.address_text || 'Location not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Inactive Style Card: Amenities */}
              {business.amenities && business.amenities.length > 0 && (
                <div className="border border-slate-100 bg-[#f8fafc] rounded-3xl p-5">
                  <h4 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">Amenities & Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {business.amenities.map((amenity: string, idx: number) => (
                      <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                        <Check className="w-3 h-3 text-green-500" /> {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Map Section - only show if coordinates exist */}
        {business.latitude && business.longitude && (
          <div className="mt-8">
            <MapView
              lat={parseFloat(business.latitude)}
              lng={parseFloat(business.longitude)}
              businessName={business.name}
              address={business.address_text}
              googleMapsUrl={business.google_maps_url}
            />
          </div>
        )}

      </div>
    </div>
  )
}
