'use client'

import { useState } from 'react'
import { Plus, Camera, MapPin, Globe, Share2, Info, Building2, CheckCircle2 } from 'lucide-react'
import { updateBusinessProfile } from '@/app/actions/businessProfile'

export default function ProfileFormClient({ initialData }: { initialData: any }) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')

  const ALL_AMENITIES = [
    'Air Conditioned', 'Free WiFi', 'Family Friendly', 'Washroom', 
    'Wheelchair Accessible', 'Pet Friendly', 'Smoking Area', 'Prayer Room',
    'Accepts Credit Cards', 'Home Service Available', 'Emergency Services'
  ]

  const savedAmenities = initialData?.amenities || []

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setMessage('')
    
    // Checkboxes are automatically included in formData if they have a 'name' attribute
    const result = await updateBusinessProfile(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else {
      setMessage('Profile updated successfully!')
    }
    
    setIsPending(false)
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#1c2331]">Edit Business Profile</h2>
          <p className="text-slate-500 mt-1">Complete your profile to stand out and attract more customers.</p>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded-lg font-bold text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Form Sections */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Building2 className="w-5 h-5 text-[#104825]" />
              <h3 className="text-lg font-bold text-[#1c2331]">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                <input type="text" name="name" defaultValue={initialData?.name || ''} required className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
                <input type="text" name="tagline" defaultValue={initialData?.tagline || ''} placeholder="Your comfort, our priority" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Description / About</label>
                <textarea name="description" rows={4} defaultValue={initialData?.description || ''} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Established Year</label>
                <input type="text" name="established_year" defaultValue={initialData?.established_year || ''} placeholder="e.g. 2012" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">GST Number (Optional)</label>
                <input type="text" name="gst_number" defaultValue={initialData?.gst_number || ''} placeholder="e.g. 29ABCDE1234F1Z5" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
            </div>
          </div>

          {/* Section 2: Categories & Tags */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Info className="w-5 h-5 text-[#104825]" />
              <h3 className="text-lg font-bold text-[#1c2331]">Categories & Specializations</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Category</label>
                <select name="category" defaultValue={initialData?.primary_category || 'Home Services'} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50">
                  <option value="Home Services">Home Services</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Retail">Retail</option>
                  <option value="Health">Health & Wellness</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sub-categories & Tags (comma separated)</label>
                <input type="text" name="subCategories" defaultValue={(initialData?.sub_categories || []).join(', ')} placeholder="AC Repair, Deep Cleaning, Gas Refill" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Location */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <MapPin className="w-5 h-5 text-[#104825]" />
              <h3 className="text-lg font-bold text-[#1c2331]">Contact & Location</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Contact Number</label>
                <input type="text" name="phone" defaultValue={initialData?.primary_phone || ''} required className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" name="email" defaultValue={initialData?.primary_email || ''} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
                <textarea name="fullAddress" rows={3} defaultValue={initialData?.address_text || ''} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Latitude</label>
                <input type="text" name="latitude" defaultValue={initialData?.latitude || ''} placeholder="11.2588" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Longitude</label>
                <input type="text" name="longitude" defaultValue={initialData?.longitude || ''} placeholder="75.7804" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Google Maps URL</label>
                <input type="text" name="google_maps_url" defaultValue={initialData?.google_maps_url || ''} placeholder="https://maps.google.com/..." className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
            </div>
          </div>

          {/* Section 4: Facilities & Amenities */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <CheckCircle2 className="w-5 h-5 text-[#104825]" />
              <h3 className="text-lg font-bold text-[#1c2331]">Facilities & Amenities</h3>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Select available facilities:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_AMENITIES.map((amenity, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="amenities" 
                      value={amenity}
                      defaultChecked={savedAmenities.includes(amenity)}
                      className="w-4 h-4 text-[#104825] rounded border-slate-300 focus:ring-[#104825]" 
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#1c2331]">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Parking Information</label>
              <input type="text" name="parking_info" defaultValue={initialData?.parking_info || ''} placeholder="e.g. Free Street Parking, Valet Available" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
            </div>
          </div>

          {/* Section 5: Social & Online Presence */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <Share2 className="w-5 h-5 text-[#104825]" />
              <h3 className="text-lg font-bold text-[#1c2331]">Social & Online Presence</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Website URL</label>
                <input type="text" name="website_url" defaultValue={initialData?.website_url || ''} placeholder="https://" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
                <input type="text" name="whatsapp_number" defaultValue={initialData?.whatsapp_number || ''} placeholder="+91..." className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Instagram URL</label>
                <input type="text" name="instagram_url" defaultValue={initialData?.instagram_url || ''} placeholder="https://instagram.com/..." className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Facebook URL</label>
                <input type="text" name="facebook_url" defaultValue={initialData?.facebook_url || ''} placeholder="https://facebook.com/..." className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">YouTube URL (Optional)</label>
                <input type="text" name="youtube_url" defaultValue={initialData?.youtube_url || ''} placeholder="https://youtube.com/..." className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
            </div>
          </div>

          <button disabled={isPending} type="submit" className="w-full py-4 bg-[#104825] text-white text-lg font-black rounded-xl hover:bg-[#0c361c] transition-all shadow-xl hover:shadow-[#104825]/30 disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {/* Right Column: Media Uploads */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-[104px]">
            <h3 className="text-lg font-bold text-[#1c2331] mb-6 border-b border-slate-100 pb-4">Brand Identity</h3>
            
            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Business Logo</label>
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#104825] hover:bg-[#104825]/5 transition-colors mx-auto overflow-hidden relative">
                {initialData?.logo_url ? (
                  <img src={initialData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-500">Upload Logo</span>
                  </>
                )}
              </div>
            </div>

            {/* Cover Banner */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Cover Banner</label>
              <div className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#104825] hover:bg-[#104825]/5 transition-colors overflow-hidden relative">
                {initialData?.cover_url ? (
                  <img src={initialData.cover_url} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-500">Upload Cover</span>
                  </>
                )}
              </div>
            </div>

            {/* Photo Gallery */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-700">Gallery Photos</label>
                <span className="text-xs font-bold text-[#104825] bg-green-50 px-2 py-1 rounded-md">Max 10</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-[#104825] hover:bg-[#104825]/5 transition-colors">
                  <Plus className="w-6 h-6 text-slate-400" />
                </div>
                {(initialData?.gallery_images || []).map((img: string, i: number) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-xl border border-slate-200 relative group overflow-hidden">
                    <img src={img} alt="gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </form>
  )
}
