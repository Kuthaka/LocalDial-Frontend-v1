'use client'

import { useState } from 'react'
import { Phone, MapPin, Mail, Clock, ShieldCheck, Edit3, Globe, CheckCircle2, MessageCircle, Camera, Users, Video } from 'lucide-react'
import Link from 'next/link'

export default function OverviewClient({ profileData }: { profileData: any }) {
  // Use real data from backend, fallback to safe defaults if missing
  const businessDetails = {
    name: profileData?.name || 'Your Business Name',
    username: profileData?.username || null,
    tagline: profileData?.tagline || 'Add a tagline in profile edit',
    category: profileData?.primary_category || 'Uncategorized',
    location: profileData?.address_text || 'Location not set',
    established: profileData?.established_year || 'N/A',
    gst: profileData?.gst_number || '',
    description: profileData?.description || 'Add a description in profile edit.',
    phone: profileData?.primary_phone || 'Add phone',
    email: profileData?.primary_email || 'Add email',
    website: profileData?.website_url || '',
    whatsapp: profileData?.whatsapp_number || '',
    instagram: profileData?.instagram_url || '',
    facebook: profileData?.facebook_url || '',
    youtube: profileData?.youtube_url || '',
    parking: profileData?.parking_info || 'Not specified',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM', // Needs hours implementation
    services: profileData?.sub_categories || [],
    amenities: profileData?.amenities || [],
    cover: profileData?.cover_url || '',
    logo: profileData?.logo_url || '',
    images: profileData?.gallery_images?.length > 0 
      ? profileData.gallery_images 
      : ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80']
  }

  const [mainImage, setMainImage] = useState(businessDetails.images[0])

  return (
    <div className="flex flex-col h-full">
      {/* Cover Banner & Logo Section */}
      <div className="relative w-full h-48 sm:h-64 lg:h-80 shadow-sm flex-shrink-0">
        <img 
          src={businessDetails.cover || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'} 
          alt="Cover Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        
        <div className="absolute top-6 left-8">
          <h2 className="text-2xl font-black text-white drop-shadow-md">Overview</h2>
        </div>

        <div className="absolute bottom-6 left-8 right-8 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 justify-between">
          <div className="flex items-end gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-xl flex-shrink-0">
              <img 
                src={businessDetails.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(businessDetails.name)}&background=104825&color=fff&size=256`} 
                alt={`${businessDetails.name} Logo`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white pb-1">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md flex items-center gap-3">
                {businessDetails.name}
              </h1>
              {businessDetails.username && (
                <p className="font-bold text-green-400 mt-0.5 sm:text-lg drop-shadow">@{businessDetails.username}</p>
              )}
              {businessDetails.tagline && <p className="font-medium text-slate-200 mt-1 sm:text-base drop-shadow">{businessDetails.tagline}</p>}
            </div>
          </div>
          <Link href="/business/dashboard/profile" className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 flex-shrink-0 border border-white/20 shadow-lg">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Top Section: Gallery Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        
        {/* Left Side: Images Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square relative rounded-2xl overflow-hidden shadow-sm group border border-slate-100 w-full">
            <img 
              src={mainImage} 
              alt="Main business photo" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 z-10">
              <ShieldCheck className="w-4 h-4" /> Verified Listing
            </div>
          </div>

          {businessDetails.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 shrink-0">
              {businessDetails.images.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`aspect-square relative rounded-xl overflow-hidden shadow-sm cursor-pointer border-2 transition-all ${
                    mainImage === img ? 'border-[#104825] ring-2 ring-[#104825]/20' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 transition-colors ${mainImage === img ? 'bg-black/0' : 'bg-black/20 hover:bg-black/10'}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Business Data & Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 font-medium w-full">
              <span className="px-3 py-1.5 bg-[#104825]/10 text-[#104825] font-bold rounded-lg">{businessDetails.category}</span>
              • 
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {businessDetails.location}</span>
              • 
              <span>Est. {businessDetails.established}</span>
              {businessDetails.gst && (
                <>• <span className="text-slate-500">GST: {businessDetails.gst}</span></>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#1c2331] mb-2">About the Business</h3>
              <p className="text-slate-600 leading-relaxed">{businessDetails.description}</p>
            </div>
            
            {businessDetails.services.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-[#1c2331] mb-3">Services Offered</h3>
                <div className="flex flex-wrap gap-2.5">
                  {businessDetails.services.map((service: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-[#104825]/5 text-[#104825] rounded-xl text-sm font-bold border border-[#104825]/10">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-[#1c2331] mb-4">Quick Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>{businessDetails.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="truncate">{businessDetails.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Extended Operating Hours */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#1c2331]">Operating Hours</h3>
          </div>
          
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-600 font-medium">{day}</span>
                <span className="text-[#1c2331] font-bold">9:00 AM - 7:00 PM</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 font-medium">Sunday</span>
              <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-md text-sm">Closed</span>
            </div>
          </div>
        </div>

        {/* Business Amenities & Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#1c2331]">Business Features</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {businessDetails.amenities.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 text-sm font-medium bg-slate-50 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="font-bold text-[#1c2331] mb-2 text-sm text-slate-500">Parking Information</h4>
            <p className="text-sm font-bold text-slate-700">{businessDetails.parking}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="font-bold text-[#1c2331] mb-4">Web & Social Presence</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {businessDetails.website && (
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-[#104825] truncate">{businessDetails.website}</span>
                </div>
              )}
              {businessDetails.whatsapp && (
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-[#104825] truncate">{businessDetails.whatsapp}</span>
                </div>
              )}
              {businessDetails.instagram && (
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Camera className="w-4 h-4 text-pink-500" />
                  <span className="font-medium text-[#104825] truncate">{businessDetails.instagram}</span>
                </div>
              )}
              {businessDetails.facebook && (
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-[#104825] truncate">{businessDetails.facebook}</span>
                </div>
              )}
              {businessDetails.youtube && (
                <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 sm:col-span-2">
                  <Video className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-[#104825] truncate">{businessDetails.youtube}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

      </div>
    </div>
  )
}
