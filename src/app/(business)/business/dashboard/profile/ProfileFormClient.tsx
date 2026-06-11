'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Plus, Camera, MapPin, Globe, Share2, Info, Building2, CheckCircle2, X, Loader2, Navigation } from 'lucide-react'
import { updateBusinessProfile, checkUsernameAvailability, saveBusinessLocation } from '@/app/actions/businessProfile'
import ImageCropperModal from '@/components/ImageCropperModal'
import toast, { Toaster } from 'react-hot-toast'

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false, loading: () => <div className="w-full h-[380px] bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400 font-bold">Loading map...</div> })

export default function ProfileFormClient({ initialData, categoriesList }: { initialData: any, categoriesList: any[] }) {
  const [isPending, setIsPending] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [tags, setTags] = useState<string[]>(initialData?.sub_categories || [])
  const [tagInput, setTagInput] = useState('')

  // Location state
  const [lat, setLat] = useState<number | string>(initialData?.latitude || '')
  const [lng, setLng] = useState<number | string>(initialData?.longitude || '')
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const [addressText, setAddressText] = useState(initialData?.address_text || '')
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialData?.google_maps_url || '')

  // Username validation state
  const [username, setUsername] = useState(initialData?.username || '')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (!username) {
      setUsernameAvailable(null)
      return
    }

    if (username === initialData?.username) {
      setUsernameAvailable(true)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsCheckingUsername(true)
      const res = await checkUsernameAvailability(username, initialData?.id || null)
      setUsernameAvailable(res.available)
      setIsCheckingUsername(false)
    }, 600)

    return () => clearTimeout(delayDebounceFn)
  }, [username, initialData?.username, initialData?.id])

  // Media states
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null)
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.cover_url || null)
  
  // Real File states for Logo and Cover (to submit cropped files)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  
  // Gallery states
  const [existingGallery, setExistingGallery] = useState<string[]>(initialData?.gallery_images || [])
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])

  const logoRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  // Cropper Queue state
  interface CropItem { file: File, target: 'logo' | 'cover' | 'gallery' }
  const [cropQueue, setCropQueue] = useState<CropItem[]>([])
  const [activeCropSrc, setActiveCropSrc] = useState<string | null>(null)

  useEffect(() => {
    if (cropQueue.length > 0 && cropQueue[0]?.file instanceof Blob) {
      try {
        const url = URL.createObjectURL(cropQueue[0].file)
        setActiveCropSrc(url)
        return () => URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error creating object URL:", error)
        setActiveCropSrc(null)
      }
    } else {
      setActiveCropSrc(null)
    }
  }, [cropQueue])

  const handleCropComplete = (croppedFile: File) => {
    const currentTarget = cropQueue[0].target
    if (currentTarget === 'logo') {
      setLogoFile(croppedFile)
      setLogoPreview(URL.createObjectURL(croppedFile))
    } else if (currentTarget === 'cover') {
      setCoverFile(croppedFile)
      setCoverPreview(URL.createObjectURL(croppedFile))
    } else if (currentTarget === 'gallery') {
      setNewGalleryFiles(prev => [...prev, croppedFile])
    }
    // move to next item
    setCropQueue(prev => prev.slice(1))
  }

  const handleCropCancel = () => {
    setCropQueue(prev => prev.slice(1))
  }

  const ALL_AMENITIES = [
    'Air Conditioned', 'Free WiFi', 'Family Friendly', 'Washroom', 
    'Wheelchair Accessible', 'Pet Friendly', 'Smoking Area', 'Prayer Room',
    'Accepts Credit Cards', 'Home Service Available', 'Emergency Services'
  ]

  const savedAmenities = initialData?.amenities || []

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim().replace(/,/g, '')
      if (newTag && !tags.includes(newTag)) {
        if (tags.length >= 15) {
          alert('Maximum 15 tags allowed.')
          return
        }
        if (newTag.length > 50) {
          alert('A single tag cannot exceed 50 characters.')
          return
        }
        if (tags.join(',').length + newTag.length > 200) {
          alert('Total tags length cannot exceed 200 characters.')
          return
        }
        setTags([...tags, newTag])
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCropQueue(prev => [...prev, { file, target: 'logo' }])
    }
    if (logoRef.current) logoRef.current.value = ''
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCropQueue(prev => [...prev, { file, target: 'cover' }])
    }
    if (coverRef.current) coverRef.current.value = ''
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      if (existingGallery.length + newGalleryFiles.length + cropQueue.filter(q => q.target === 'gallery').length + filesArray.length > 10) {
        alert('You can only upload up to 10 gallery photos.')
        if (galleryRef.current) galleryRef.current.value = ''
        return
      }
      setCropQueue(prev => [...prev, ...filesArray.map(f => ({ file: f, target: 'gallery' as const }))])
    }
    if (galleryRef.current) galleryRef.current.value = ''
  }

  const removeExistingGalleryImage = (index: number) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewGalleryImage = (index: number) => {
    setNewGalleryFiles(prev => prev.filter((_, i) => i !== index))
  }

  function detectCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }
    setIsDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        setIsDetectingLocation(false)
        toast.success('Location detected! You can drag the pin to fine-tune.')
      },
      () => {
        toast.error('Could not detect your location. Please allow location access.')
        setIsDetectingLocation(false)
      }
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const formUsername = formData.get('username') as string

    if (!formUsername) {
      toast.error('Username is required.')
      return
    }

    if (usernameAvailable === false) {
      toast.error('Please choose an available username before saving.')
      return
    }

    setIsPending(true)
    const loadingToast = toast.loading('Uploading images & saving changes. Please wait...')
    
    // Add tags explicitly before passing to action
    formData.set('subCategories', tags.join(','))

    // Add lat/lng from state (not form field, since it's controlled)
    formData.set('latitude', String(lat))
    formData.set('longitude', String(lng))

    // Add gallery state manually to formData
    formData.set('existingGallery', JSON.stringify(existingGallery))
    
    // Append actual files
    if (logoFile) formData.set('logoFile', logoFile)
    if (coverFile) formData.set('coverFile', coverFile)
    
    newGalleryFiles.forEach(file => {
      formData.append('newGalleryFiles', file)
    })
    
    const result = await updateBusinessProfile(formData)
    
    if (result.error) {
      toast.error(result.error, { id: loadingToast, duration: 6000 })
    } else {
      toast.success('Changes saved successfully!', { id: loadingToast })
      setShowSuccessModal(true)
    }
    
    setIsPending(false)
  }

  // Prevent form submission on enter key inside the whole form
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault()
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <form onSubmit={onSubmit} onKeyDown={handleKeyDown} className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#1c2331]">Edit Business Profile</h2>
          <p className="text-slate-500 mt-1">Complete your profile to stand out and attract more customers.</p>
        </div>
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
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                <input type="text" name="name" defaultValue={initialData?.name || ''} required className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Business Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                  <input 
                    type="text" 
                    name="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                    required 
                    placeholder="your_business"
                    className={`w-full pl-8 pr-10 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50 ${
                      usernameAvailable === false ? 'border-red-500' : 
                      usernameAvailable === true ? 'border-green-500' : 'border-slate-200'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCheckingUsername && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                    {!isCheckingUsername && usernameAvailable === true && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {!isCheckingUsername && usernameAvailable === false && <X className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
                {usernameAvailable === false && (
                  <p className="text-red-500 text-xs font-bold mt-1.5">Username is already taken.</p>
                )}
                {usernameAvailable === true && username !== initialData?.username && (
                  <p className="text-green-600 text-xs font-bold mt-1.5">Username is available!</p>
                )}
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
                <select name="category" defaultValue={initialData?.primary_category || ''} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50">
                  <option value="" disabled>Select a Category</option>
                  {categoriesList?.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  {(!categoriesList || categoriesList.length === 0) && (
                    <option value="Home Services">Home Services</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sub-categories & Tags (Press Enter to add)</label>
                <div className="flex flex-wrap gap-2 mb-3 bg-slate-50 p-2 border border-slate-200 rounded-xl min-h-[50px]">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#104825] text-white text-sm font-bold rounded-lg shadow-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length < 15 ? "Add a tag..." : "Max tags reached"}
                    disabled={tags.length >= 15}
                    maxLength={50}
                    className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none focus:ring-0 p-1 text-sm text-slate-700" 
                  />
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>{tags.length} / 15 tags</span>
                  <span>{tags.join(',').length} / 200 chars limit</span>
                </div>
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

              {/* Step 1: Full Address */}
              <div className="md:col-span-2 p-4 rounded-xl border border-[#104825]/20 bg-[#104825]/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#104825] text-white text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
                  <label className="text-sm font-bold text-[#1c2331]">Type Your Full Address</label>
                </div>
                <textarea
                  name="fullAddress"
                  rows={3}
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="e.g. 12, MG Road, Near City Mall, Kozhikode, Kerala - 673001"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-white"
                />
                <p className="text-xs text-slate-500 mt-2 font-medium">This address text is shown publicly on your business page under the map.</p>
              </div>

              {/* Step 2: Map Pin */}
              <div className="md:col-span-2 p-4 rounded-xl border border-[#104825]/20 bg-[#104825]/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#104825] text-white text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <p className="text-sm font-bold text-[#1c2331]">Drop a Pin on the Map</p>
                      <p className="text-xs text-slate-500 font-medium">Click anywhere or drag the pin. Customers will click "Get Directions" to navigate here.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={detectCurrentLocation}
                    disabled={isDetectingLocation}
                    className="flex items-center gap-2 bg-[#104825] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#0c361c] transition-colors disabled:opacity-60 flex-shrink-0 ml-4"
                  >
                    {isDetectingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                    {isDetectingLocation ? 'Detecting...' : 'Use My Location'}
                  </button>
                </div>
                <LocationPicker
                  initialLat={lat}
                  initialLng={lng}
                  onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng) }}
                />
                <div className="flex gap-4 mt-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Latitude (saved automatically)</label>
                    <input type="text" readOnly value={lat || 'Not pinned yet'} className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 font-mono" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Longitude (saved automatically)</label>
                    <input type="text" readOnly value={lng || 'Not pinned yet'} className="w-full p-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 font-mono" />
                  </div>
                </div>
              </div>

              {/* Step 3: Optional Google Maps URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Custom Google Maps URL <span className="font-normal text-slate-400 text-xs">(Optional)</span>
                </label>
                <p className="text-xs text-slate-400 mb-2 font-medium">Paste your specific Google Maps business link. If empty, the pin coordinates above are used for directions.</p>
                <input
                  type="text"
                  name="google_maps_url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50"
                />
              </div>

              {/* Save Location Button */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  disabled={isSavingLocation}
                  onClick={async () => {
                    if (!lat || !lng) {
                      toast.error('Please drop a pin on the map first.')
                      return
                    }
                    setIsSavingLocation(true)
                    const loadingToast = toast.loading('Saving location...')
                    const result = await saveBusinessLocation({
                      address_text: addressText,
                      latitude: parseFloat(String(lat)),
                      longitude: parseFloat(String(lng)),
                      google_maps_url: googleMapsUrl,
                    })
                    if (result.error) {
                      toast.error(result.error, { id: loadingToast })
                    } else {
                      toast.success('Location saved successfully!', { id: loadingToast })
                    }
                    setIsSavingLocation(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#104825] hover:bg-[#0c361c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
                >
                  {isSavingLocation ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving Location...</>
                  ) : (
                    <><MapPin className="w-4 h-4" /> Save Location</>
                  )}
                </button>
                {(lat && lng) && (
                  <p className="text-center text-xs text-green-600 font-bold mt-2 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pin set at {Number(lat).toFixed(5)}, {Number(lng).toFixed(5)}
                  </p>
                )}
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

          <button disabled={isPending} type="submit" className="w-full py-4 bg-[#104825] text-white text-lg font-black rounded-xl hover:bg-[#0c361c] transition-all shadow-xl hover:shadow-[#104825]/30 disabled:opacity-70 flex items-center justify-center gap-3">
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>

        {/* Right Column: Media Uploads */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-[104px]">
            <h3 className="text-lg font-bold text-[#1c2331] mb-6 border-b border-slate-100 pb-4">Brand Identity</h3>
            
            {/* Hidden Inputs */}
            <input type="file" name="logoFile" accept="image/*" hidden ref={logoRef} onChange={handleLogoChange} />
            <input type="file" name="coverFile" accept="image/*" hidden ref={coverRef} onChange={handleCoverChange} />
            <input type="file" accept="image/*" multiple hidden ref={galleryRef} onChange={handleGalleryChange} />

            {/* Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">Business Logo</label>
              <div 
                onClick={() => logoRef.current?.click()}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#104825] hover:bg-[#104825]/5 transition-colors mx-auto overflow-hidden relative group"
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
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
              <div 
                onClick={() => coverRef.current?.click()}
                className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#104825] hover:bg-[#104825]/5 transition-colors overflow-hidden relative group"
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
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
                <span className="text-xs font-bold text-[#104825] bg-green-50 px-2 py-1 rounded-md">
                  {existingGallery.length + newGalleryFiles.length} / 10
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Add Photo Button */}
                {(existingGallery.length + newGalleryFiles.length) < 10 && (
                  <div 
                    onClick={() => galleryRef.current?.click()}
                    className="aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-[#104825] hover:bg-[#104825]/5 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                
                {/* Existing Gallery Images */}
                {existingGallery.map((imgUrl, i) => (
                  <div key={`ext-${i}`} className="aspect-square bg-slate-200 rounded-xl border border-slate-200 relative group overflow-hidden">
                    <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeExistingGalleryImage(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* New Gallery Previews */}
                {newGalleryFiles.map((file, i) => (
                  <div key={`new-${i}`} className="aspect-square bg-slate-200 rounded-xl border border-slate-200 relative group overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt={`New Gallery ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none"></div>
                    <button 
                      type="button" 
                      onClick={() => removeNewGalleryImage(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 pointer-events-auto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* Image Cropper Modal */}
      {cropQueue.length > 0 && activeCropSrc && (
        <ImageCropperModal
          isOpen={true}
          onClose={handleCropCancel}
          imageSrc={activeCropSrc}
          aspect={cropQueue[0].target === 'cover' ? 21 / 9 : 1}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-[#1c2331] mb-2">Changes Saved!</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Your business profile has been successfully updated. These changes are now live on your profile overview.
            </p>
            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button 
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Keep Editing
              </button>
              <a 
                href="/business/dashboard"
                className="flex-1 px-6 py-3 bg-[#104825] text-white font-bold rounded-xl hover:bg-[#0c361c] transition-colors shadow-lg hover:shadow-[#104825]/30 text-center flex items-center justify-center"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </form>
    </>
  )
}
