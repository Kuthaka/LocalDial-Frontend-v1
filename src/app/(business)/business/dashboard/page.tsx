'use client'

import { useState } from 'react'
import { Phone, MapPin, Mail, Clock, ShieldCheck, Edit3, Globe, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function BusinessDashboardOverview() {
  // Mock data representing details fed from the onboarding process
  const businessDetails = {
    name: 'Cool Breeze Aircon Services',
    category: 'AC Repair & Services',
    location: 'Calicut City, Kerala',
    description: 'We are a leading provider of AC repair and maintenance services in Calicut. With over 10 years of experience, our certified technicians ensure your air conditioning units run efficiently all year round. We handle installations, deep cleaning, gas refilling, and emergency repairs.',
    phone: '+91 98765 43210',
    email: 'contact@coolbreeze.com',
    website: 'www.coolbreeze.com',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    services: ['AC Installation', 'Deep Cleaning', 'Gas Refill', 'Compressor Repair', 'AMC Maintenance'],
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80'
    ]
  }

  const [mainImage, setMainImage] = useState(businessDetails.images[0])

  return (
    <div className="space-y-8">
      {/* Top Section: Gallery Left, Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Images Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-video relative rounded-2xl overflow-hidden shadow-sm group border border-slate-100">
            <img 
              src={mainImage} 
              alt="Main business photo" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Verified Listing
            </div>
          </div>

          {/* Thumbnails below main image */}
          <div className="grid grid-cols-4 gap-4">
            {businessDetails.images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`aspect-square relative rounded-xl overflow-hidden shadow-sm cursor-pointer border-2 transition-all ${
                  mainImage === img ? 'border-[#104825] ring-2 ring-[#104825]/20' : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img 
                  src={img} 
                  alt={`Business photo thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 transition-colors ${mainImage === img ? 'bg-black/0' : 'bg-black/20 hover:bg-black/10'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Business Data & Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-[#1c2331] tracking-tight">{businessDetails.name}</h1>
              <p className="text-slate-500 font-medium mt-2 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-sm">{businessDetails.category}</span>
                • 
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {businessDetails.location}</span>
              </p>
            </div>
            <Link href="/business/dashboard/profile" className="px-5 py-2.5 bg-slate-100 text-[#1c2331] hover:bg-slate-200 font-bold rounded-xl transition-colors flex items-center gap-2 flex-shrink-0">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#1c2331] mb-2">About the Business</h3>
              <p className="text-slate-600 leading-relaxed">
                {businessDetails.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[#1c2331] mb-3">Services Offered</h3>
              <div className="flex flex-wrap gap-2.5">
                {businessDetails.services.map((service, idx) => (
                  <span key={idx} className="px-4 py-2 bg-[#104825]/5 text-[#104825] rounded-xl text-sm font-bold border border-[#104825]/10">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
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

      {/* More Data / Extended Details Section */}
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
            {[
              'Accepts Credit Cards',
              'Free Wi-Fi',
              'Wheelchair Accessible',
              'Home Service Available',
              'Parking Available',
              'Emergency Services'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 text-sm font-medium bg-slate-50 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="font-bold text-[#1c2331] mb-4">Web Presence</h4>
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-[#104825] hover:underline">{businessDetails.website}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
