'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  ArrowLeft, Share2, Heart, Check, MapPin, Phone, Mail,
  Globe, MessageCircle, ChevronRight, Star, ShieldCheck,
  Clock, CalendarDays, LayoutGrid, Info, Wrench, Image as ImageIcon, BookOpen,
  X, ChevronLeft
} from 'lucide-react'

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-slate-100 rounded-2xl animate-pulse" />,
})

const TABS = ['Overview', 'Quick Info', 'Services', 'Photos', 'Reviews'] as const
type Tab = typeof TABS[number]

export default function BusinessDetailsClient({ business }: { business: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [liked, setLiked] = useState(false)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  const handleViewMore = () => {
    setActiveTab('Photos')
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Build gallery immutably — only gallery photos, no cover banner
  const rawGallery: string[] = [
    ...(business.gallery_images || []),
  ]
  const defaultImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516280440502-6294b08709ec?auto=format&fit=crop&w=800&q=80',
  ]
  const allImages = rawGallery.length > 0 ? rawGallery : defaultImages
  const displayImages = [...allImages, ...defaultImages].slice(0, 5)
  const extraCount = allImages.length > 5 ? allImages.length - 5 : 0

  const whatsappUrl = business.whatsapp_number
    ? `https://wa.me/${business.whatsapp_number.replace(/\D/g, '')}`
    : null

  return (
    <div className="font-sans min-h-screen bg-[#f5f6f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-4">
          <Link href="/" className="hover:text-[#104825] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/explore" className="hover:text-[#104825] transition-colors">Explore</Link>
          {business.primary_category && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-500">{business.primary_category}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1c2331] font-bold">{business.name}</span>
        </nav>

        {/* ── PHOTO MOSAIC ── */}
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-5 h-[280px] sm:h-[360px]">
          {/* Main large image */}
          <div 
            className="col-span-2 row-span-2 relative cursor-pointer group"
            onClick={() => setViewerIndex(0)}
          >
            <img src={displayImages[0]} alt="Main" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
          </div>
          {/* 2nd image */}
          <div className="relative cursor-pointer group" onClick={() => setViewerIndex(1)}>
            <img src={displayImages[1]} alt="Gallery 2" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
          </div>
          {/* 3rd image */}
          <div className="relative cursor-pointer group" onClick={() => setViewerIndex(2)}>
            <img src={displayImages[2]} alt="Gallery 3" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
          </div>
          {/* 4th image */}
          <div className="relative cursor-pointer group" onClick={() => setViewerIndex(3)}>
            <img src={displayImages[3]} alt="Gallery 4" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
          </div>
          {/* 5th image with +N overlay */}
          <div className="relative cursor-pointer group" onClick={extraCount > 0 ? handleViewMore : () => setViewerIndex(4)}>
            <img src={displayImages[4]} alt="Gallery 5" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
            {extraCount > 0 && (
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center hover:bg-black/60 transition-colors">
                <span className="text-white text-2xl font-black">+{extraCount}</span>
                <span className="text-white/80 text-xs font-bold mt-1">View Photos</span>
              </div>
            )}
          </div>
        </div>

        {/* ── BUSINESS HEADER ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-14 h-14 rounded-xl border-2 border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0 shadow-sm">
                <img
                  src={business.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(business.name || 'B')}&background=1c2331&color=fff&size=128`}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-[#1c2331]">{business.name}</h1>
                  {business.is_verified !== false && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-black tracking-widest uppercase">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> Verified
                    </span>
                  )}
                </div>
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500 font-medium">
                  {business.address_text && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#104825]" />
                      {business.address_text}
                    </span>
                  )}
                  {business.established_year && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Est. {business.established_year}
                      </span>
                    </>
                  )}
                  {business.primary_category && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="px-2 py-0.5 bg-[#1c2331]/8 text-[#1c2331] rounded-full font-bold text-[10px] uppercase tracking-wider border border-[#1c2331]/10">
                        {business.primary_category}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Save / Share */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setLiked(l => !l)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
              </button>
              <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 transition-all">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
            {business.primary_phone && (
              <a
                href={`tel:${business.primary_phone}`}
                className="flex items-center gap-2 bg-[#104825] hover:bg-[#0c361c] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                {business.primary_phone}
              </a>
            )}
            {business.primary_email && (
              <a
                href={`mailto:${business.primary_email}`}
                className="flex items-center gap-2 bg-[#1c2331] hover:bg-black text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Enquire Now
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            )}
            {business.website_url && (
              <a
                href={business.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div ref={tabsRef} className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 mb-5 sticky top-[72px] z-20">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab === 'Overview' ? LayoutGrid : tab === 'Quick Info' ? Info : tab === 'Services' ? Wrench : tab === 'Photos' ? ImageIcon : BookOpen
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab
                      ? 'border-[#104825] text-[#104825]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── MAIN CONTENT + SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* LEFT: Tab Content */}
          <div className="space-y-5">

            {/* Overview Tab */}
            {activeTab === 'Overview' && (
              <>
                {/* About */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-black text-[#1c2331] mb-3">About the Business</h2>
                  <p className="text-slate-600 leading-relaxed">
                    {business.description || "This business hasn't added a description yet."}
                  </p>
                </div>

                {/* Services / Tags */}
                {business.sub_categories && business.sub_categories.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-black text-[#1c2331] mb-4">Services & Specializations</h2>
                    <div className="flex flex-wrap gap-2">
                      {business.sub_categories.map((tag: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-[#104825]/8 text-[#104825] border border-[#104825]/15 rounded-xl text-sm font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {business.amenities && business.amenities.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-black text-[#1c2331] mb-4">Amenities & Features</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {business.amenities.map((a: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-green-600 stroke-[3]" />
                          </div>
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map */}
                {business.latitude && business.longitude && (
                  <MapView
                    lat={parseFloat(business.latitude)}
                    lng={parseFloat(business.longitude)}
                    businessName={business.name}
                    address={business.address_text}
                    googleMapsUrl={business.google_maps_url}
                  />
                )}
              </>
            )}

            {/* Quick Info Tab */}
            {activeTab === 'Quick Info' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-black text-[#1c2331] mb-5">Quick Information</h2>
                <div className="space-y-4 divide-y divide-slate-100">
                  {[
                    { label: 'Business Name', value: business.name },
                    { label: 'Category', value: business.primary_category },
                    { label: 'Established', value: business.established_year },
                    { label: 'GST Number', value: business.gst_number },
                    { label: 'Parking', value: business.parking_info },
                    { label: 'Phone', value: business.primary_phone },
                    { label: 'Email', value: business.primary_email },
                    { label: 'Website', value: business.website_url },
                    { label: 'Address', value: business.address_text },
                  ].filter(r => r.value).map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider w-32 flex-shrink-0">{row.label}</span>
                      <span className="text-sm font-semibold text-[#1c2331] text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'Services' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-black text-[#1c2331] mb-4">Services Offered</h2>
                {business.sub_categories && business.sub_categories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {business.sub_categories.map((s: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-[#104825]/10 flex items-center justify-center flex-shrink-0">
                          <Wrench className="w-4 h-4 text-[#104825]" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No services listed yet.</p>
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'Photos' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-black text-[#1c2331] mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'Reviews' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-black text-[#1c2331] mb-2">Customer Reviews</h2>
                <p className="text-slate-400 text-sm">Reviews coming soon.</p>
              </div>
            )}

          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-4">

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-base font-black text-[#1c2331] mb-4">Contact</h3>
              <div className="space-y-3">
                {business.primary_phone && (
                  <a href={`tel:${business.primary_phone}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-bold text-[#104825] group-hover:underline">{business.primary_phone}</span>
                  </a>
                )}
                {business.primary_email && (
                  <a href={`mailto:${business.primary_email}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-blue-600 truncate group-hover:underline">{business.primary_email}</span>
                  </a>
                )}
                {business.website_url && (
                  <a href={business.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 transition-colors">
                      <Globe className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 truncate group-hover:underline">{business.website_url}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Address Card */}
            {business.address_text && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-base font-black text-[#1c2331] mb-3">Address</h3>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#104825]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#104825]" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{business.address_text}</p>
                </div>
              </div>
            )}

            {/* Verified badge card */}
            {business.is_verified !== false && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-green-800">Verified Business</p>
                  <p className="text-xs text-green-600 font-medium">This listing has been verified by our team.</p>
                </div>
              </div>
            )}

            {/* Map Sidebar */}
            {business.latitude && business.longitude && (
              <MapView
                lat={parseFloat(business.latitude)}
                lng={parseFloat(business.longitude)}
                businessName={business.name}
                address={business.address_text}
                googleMapsUrl={business.google_maps_url}
              />
            )}

          </div>
        </div>

      </div>

      {/* ── FULLSCREEN IMAGE VIEWER ── */}
      {viewerIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={() => setViewerIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-[110]"
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              setViewerIndex(prev => prev! > 0 ? prev! - 1 : allImages.length - 1)
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-[110]"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] px-16 flex items-center justify-center" onClick={() => setViewerIndex(null)}>
            <img 
              src={allImages[viewerIndex]} 
              alt="Fullscreen View" 
              className="max-w-full max-h-full object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              setViewerIndex(prev => prev! < allImages.length - 1 ? prev! + 1 : 0)
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-[110]"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm">
            {viewerIndex + 1} / {allImages.length}
          </div>
        </div>
      )}

    </div>
  )
}
