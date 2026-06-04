'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { sendOtp, verifyOtp, registerBusinessComplete } from '@/app/actions/auth'
import {
  Building2,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle,
  MapPin,
  Phone,
  Clock,
  Camera,
  Star,
  Plus,
  Trash2,
  ChevronDown,
  Info,
  Smartphone,
  PhoneCall
} from 'lucide-react'

// Dummy categories for selection
const SUGGESTED_CATEGORIES = [
  'Food Emporiums',
  'Food Delivery Restaurants',
  'Foot Massage Spas',
  'Foot & Ankle Doctors',
  'Food Allergy Diagnostic Centers',
  'Foot X Ray Centers',
  'Foot Wear Dealers',
  'Food Container Printing Services'
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Custom hook to persist state in sessionStorage (avoids hydration errors)
function useSessionState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const stickyValue = window.sessionStorage.getItem(key)
    if (stickyValue !== null) {
      try {
        setValue(JSON.parse(stickyValue))
      } catch (e) {
        console.error('Error parsing session storage', e)
      }
    }
  }, [key])

  useEffect(() => {
    if (isMounted) {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value, isMounted])

  return [value, setValue]
}

// Moved StepContainer OUTSIDE the main component to prevent re-renders and input losing focus
const StepContainer = ({ children, title, subtitle, step }: { children: React.ReactNode, title: string, subtitle?: string, step: number }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
    <div className="w-full max-w-2xl">
      {/* Progress bar */}
      {step > 1 && step < 7 && (
        <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="bg-[#111844] h-full"
            initial={{ width: `${((step - 2) / 5) * 100}%` }}
            animate={{ width: `${((step - 1) / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-[#111844] p-6 text-white">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-indigo-100/80 mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </motion.div>
    </div>
  </div>
)

function BusinessSignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlStep = parseInt(searchParams.get('step') || '1', 10)
  
  // Keep step sync with URL for browser history ("session like pages")
  const step = isNaN(urlStep) || urlStep < 1 || urlStep > 7 ? 1 : urlStep

  const [loading, setLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showTimingConfirmModal, setShowTimingConfirmModal] = useState(false)
  
  // Form State using Session Storage
  const [email, setEmail] = useSessionState('business_signup_email', '')
  const [otp, setOtp] = useState(['', '', '', '', '', '']) // Don't persist OTP
  
  const [businessDetails, setBusinessDetails] = useSessionState('business_signup_details', {
    name: '',
    pincode: '',
    plot: '',
    building: '',
    street: '',
    landmark: '',
    area: '',
    city: '',
    state: ''
  })
  
  const [contacts, setContacts] = useSessionState('business_signup_contacts', {
    person: '',
    mobiles: [''],
    whatsapps: [''],
    landlines: [''],
    emails: ['']
  })
  const [sameAsMobile, setSameAsMobile] = useSessionState('business_signup_sameAsMobile', false)

  const [timings, setTimings] = useSessionState('business_signup_timings', {
    selectedDays: [] as string[],
    slots: [{ open: '', close: '' }]
  })

  const [categories, setCategories] = useSessionState<string[]>('business_signup_categories', [])
  const [categorySearch, setCategorySearch] = useState('')

  // Files can't be easily stored in sessionStorage, keep in memory
  const [photos, setPhotos] = useState<File[]>([])

  const [error, setError] = useState<string | null>(null)

  const handleNextStep = () => {
    setError(null)
    const nextStep = step + 1
    router.push(`/business/signup?step=${nextStep}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const result = await sendOtp(email)
    
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowOtpModal(true)
    }
  }

  const handleOtpVerify = async () => {
    setLoading(true)
    setError(null)
    
    const token = otp.join('')
    const result = await verifyOtp(email, token, false)
    
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowOtpModal(false)
      handleNextStep()
    }
  }

  const handleBusinessDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessDetails.name || !businessDetails.pincode) return
    handleNextStep()
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleNextStep()
  }

  const handleTimingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowTimingConfirmModal(true)
  }

  const confirmTimings = () => {
    setShowTimingConfirmModal(false)
    handleNextStep()
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleNextStep()
  }

  const handlePhotosSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = {
      businessDetails,
      contacts,
      timings,
      categories
    }

    const result = await registerBusinessComplete(formData)

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      // Clear session storage on success
      window.sessionStorage.removeItem('business_signup_email')
      window.sessionStorage.removeItem('business_signup_details')
      window.sessionStorage.removeItem('business_signup_contacts')
      window.sessionStorage.removeItem('business_signup_sameAsMobile')
      window.sessionStorage.removeItem('business_signup_timings')
      window.sessionStorage.removeItem('business_signup_categories')
      handleNextStep()
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepContainer key="step1" step={step} title="List Your Business for FREE" subtitle="with LocalDial - Reach thousands of customers daily.">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Enter Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111844] focus:border-transparent transition-all text-lg"
                    placeholder="e.g. contact@yourbusiness.com"
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#111844] hover:bg-[#111844]/90 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Start Now'}
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="pt-4 border-t border-slate-100 mt-6 text-center">
                <p className="text-sm text-slate-600">
                  By continuing, you agree to our Terms of Use and Privacy Policy.
                </p>
                <p className="mt-4 text-sm text-slate-600">
                  Already registered? <Link href="/business/login" className="text-[#111844] font-bold hover:underline">Sign in</Link>
                </p>
              </div>
            </form>
          </StepContainer>
        )}

        {step === 2 && (
          <StepContainer key="step2" step={step} title="Enter Your Business Details" subtitle="Help customers find your exact location.">
            <form onSubmit={handleBusinessDetailsSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <input
                  required
                  placeholder="Business Name *"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                  value={businessDetails.name}
                  onChange={e => setBusinessDetails({...businessDetails, name: e.target.value})}
                />
                <input
                  required
                  placeholder="Pincode *"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                  value={businessDetails.pincode}
                  onChange={e => setBusinessDetails({...businessDetails, pincode: e.target.value})}
                />
                <input
                  placeholder="Plot No. / Bldg No. / Wing / Shop No. / Floor"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                  value={businessDetails.plot}
                  onChange={e => setBusinessDetails({...businessDetails, plot: e.target.value})}
                />
                <input
                  placeholder="Building Name / Market / Colony / Society"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                  value={businessDetails.building}
                  onChange={e => setBusinessDetails({...businessDetails, building: e.target.value})}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    placeholder="Street / Road Name"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                    value={businessDetails.street}
                    onChange={e => setBusinessDetails({...businessDetails, street: e.target.value})}
                  />
                  <input
                    placeholder="Landmark"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                    value={businessDetails.landmark}
                    onChange={e => setBusinessDetails({...businessDetails, landmark: e.target.value})}
                  />
                </div>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none bg-white text-slate-600"
                  value={businessDetails.area}
                  onChange={e => setBusinessDetails({...businessDetails, area: e.target.value})}
                >
                  <option value="">Select Area</option>
                  <option value="downtown">Downtown</option>
                  <option value="uptown">Uptown</option>
                  <option value="suburb">Suburb</option>
                </select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    placeholder="City"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                    value={businessDetails.city}
                    onChange={e => setBusinessDetails({...businessDetails, city: e.target.value})}
                  />
                  <input
                    placeholder="State"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                    value={businessDetails.state}
                    onChange={e => setBusinessDetails({...businessDetails, state: e.target.value})}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0a84e3] hover:bg-[#0971c2] text-white font-bold py-3 px-4 rounded-lg transition-all mt-6"
              >
                Save and Continue
              </button>
            </form>
          </StepContainer>
        )}

        {step === 3 && (
          <StepContainer key="step3" step={step} title="Add Contact Details" subtitle="How customers and LocalDial can reach you.">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="flex gap-4">
                <select className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none bg-white w-24">
                  <option>Mr</option>
                  <option>Ms</option>
                  <option>Mrs</option>
                </select>
                <input
                  required
                  placeholder="Contact Person"
                  className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                  value={contacts.person}
                  onChange={e => setContacts({...contacts, person: e.target.value})}
                />
              </div>

              {/* Mobile Numbers */}
              <div className="space-y-3">
                {contacts.mobiles.map((mob, idx) => (
                  <div key={`mob-${idx}`} className="flex gap-2">
                    <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50 w-24 justify-center">
                      <span className="text-xl">🇮🇳</span>
                      <span className="text-sm font-medium">+91</span>
                    </div>
                    <input
                      placeholder="Mobile Number"
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                      value={mob}
                      onChange={e => {
                        const newArr = [...contacts.mobiles]; newArr[idx] = e.target.value;
                        setContacts({...contacts, mobiles: newArr})
                      }}
                    />
                    {idx > 0 && (
                      <button type="button" onClick={() => setContacts({...contacts, mobiles: contacts.mobiles.filter((_, i) => i !== idx)})} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setContacts({...contacts, mobiles: [...contacts.mobiles, '']})} className="text-[#0a84e3] font-medium text-sm flex items-center gap-1 hover:underline">
                  + Add Another Mobile Number
                </button>
              </div>

              {/* WhatsApp Numbers */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">WhatsApp Number</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={sameAsMobile} onChange={(e) => setSameAsMobile(e.target.checked)} className="w-4 h-4 text-[#0a84e3] rounded" />
                    <span className="text-sm text-[#0a84e3] font-medium">Same As Mobile Number</span>
                  </label>
                </div>
                {!sameAsMobile && contacts.whatsapps.map((wa, idx) => (
                  <div key={`wa-${idx}`} className="flex gap-2">
                    <div className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50 w-24 justify-center">
                      <span className="text-xl">🇮🇳</span>
                      <span className="text-sm font-medium">+91</span>
                    </div>
                    <input
                      placeholder="WhatsApp Number"
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                      value={wa}
                      onChange={e => {
                        const newArr = [...contacts.whatsapps]; newArr[idx] = e.target.value;
                        setContacts({...contacts, whatsapps: newArr})
                      }}
                    />
                    {idx > 0 && (
                      <button type="button" onClick={() => setContacts({...contacts, whatsapps: contacts.whatsapps.filter((_, i) => i !== idx)})} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {!sameAsMobile && (
                  <button type="button" onClick={() => setContacts({...contacts, whatsapps: [...contacts.whatsapps, '']})} className="text-[#0a84e3] font-medium text-sm flex items-center gap-1 hover:underline">
                    + Add WhatsApp Number
                  </button>
                )}
              </div>

              {/* Landline Numbers */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {contacts.landlines.map((ll, idx) => (
                  <div key={`ll-${idx}`} className="flex gap-2">
                    <input
                      placeholder="Landline Number with STD code"
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                      value={ll}
                      onChange={e => {
                        const newArr = [...contacts.landlines]; newArr[idx] = e.target.value;
                        setContacts({...contacts, landlines: newArr})
                      }}
                    />
                    {idx > 0 && (
                      <button type="button" onClick={() => setContacts({...contacts, landlines: contacts.landlines.filter((_, i) => i !== idx)})} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setContacts({...contacts, landlines: [...contacts.landlines, '']})} className="text-[#0a84e3] font-medium text-sm flex items-center gap-1 hover:underline">
                  + Add Landline Number
                </button>
              </div>

              {/* Emails */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {contacts.emails.map((em, idx) => (
                  <div key={`em-${idx}`} className="flex gap-2">
                    <input
                      placeholder="Email Address"
                      type="email"
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none"
                      value={em}
                      onChange={e => {
                        const newArr = [...contacts.emails]; newArr[idx] = e.target.value;
                        setContacts({...contacts, emails: newArr})
                      }}
                    />
                    {idx > 0 && (
                      <button type="button" onClick={() => setContacts({...contacts, emails: contacts.emails.filter((_, i) => i !== idx)})} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setContacts({...contacts, emails: [...contacts.emails, '']})} className="text-[#0a84e3] font-medium text-sm flex items-center gap-1 hover:underline">
                  + Add Another Email
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0a84e3] hover:bg-[#0971c2] text-white font-bold py-3 px-4 rounded-lg transition-all mt-6"
              >
                Save and Continue
              </button>
            </form>
          </StepContainer>
        )}

        {step === 4 && (
          <StepContainer key="step4" step={step} title="Add Business Timings" subtitle="Let your customers know when you are open for business">
            <form onSubmit={handleTimingSubmit} className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-slate-800 mb-4">Select Days of the Week</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newDays = timings.selectedDays.includes(day)
                          ? timings.selectedDays.filter(d => d !== day)
                          : [...timings.selectedDays, day];
                        setTimings({...timings, selectedDays: newDays})
                      }}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-medium transition-all
                        ${timings.selectedDays.includes(day) 
                          ? 'bg-[#111844] text-white border-[#111844]' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer w-max">
                  <input 
                    type="checkbox" 
                    checked={timings.selectedDays.length === 7} 
                    onChange={(e) => setTimings({...timings, selectedDays: e.target.checked ? DAYS : []})} 
                    className="w-4 h-4 text-[#0a84e3] rounded" 
                  />
                  <span className="text-sm text-[#0a84e3] font-medium">Select All Days</span>
                </label>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {timings.slots.map((slot, idx) => (
                  <div key={`slot-${idx}`} className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500 font-medium">Open at</label>
                      <select 
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none bg-white text-slate-700"
                        value={slot.open}
                        onChange={(e) => {
                          const newSlots = [...timings.slots]
                          newSlots[idx].open = e.target.value
                          setTimings({...timings, slots: newSlots})
                        }}
                      >
                        <option value="">Select</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                      </select>
                    </div>
                    <div className="flex-1 relative">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-500 font-medium">Close at</label>
                      <select 
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#111844] outline-none bg-white text-slate-700"
                        value={slot.close}
                        onChange={(e) => {
                          const newSlots = [...timings.slots]
                          newSlots[idx].close = e.target.value
                          setTimings({...timings, slots: newSlots})
                        }}
                      >
                        <option value="">Select</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="09:00 PM">09:00 PM</option>
                      </select>
                    </div>
                    {idx > 0 && (
                      <button type="button" onClick={() => setTimings({...timings, slots: timings.slots.filter((_, i) => i !== idx)})} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setTimings({...timings, slots: [...timings.slots, {open:'', close:''}]})} className="text-[#0a84e3] font-medium text-sm flex items-center gap-1 hover:underline">
                  + Add Another Time Slot
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0a84e3] hover:bg-[#0971c2] text-white font-bold py-3 px-4 rounded-lg transition-all mt-6"
              >
                Save and Continue
              </button>
            </form>
          </StepContainer>
        )}

        {step === 5 && (
          <StepContainer key="step5" step={step} title="Add Business Category" subtitle="Choose the right business categories so your customer can easily find you">
            <form onSubmit={handleCategorySubmit} className="space-y-6">
              
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat, idx) => (
                  <span key={idx} className="bg-blue-50 text-[#111844] px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100">
                    {cat}
                    <button type="button" onClick={() => setCategories(categories.filter(c => c !== cat))} className="text-blue-400 hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  placeholder="Search and select categories (e.g. Restaurants)"
                  className="w-full pl-10 pr-10 p-3 border border-[#0a84e3] rounded-lg focus:ring-2 focus:ring-[#111844] outline-none shadow-sm"
                  value={categorySearch}
                  onChange={e => setCategorySearch(e.target.value)}
                />
                {categorySearch && (
                  <button type="button" onClick={() => setCategorySearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    ×
                  </button>
                )}
                
                {/* Search Dropdown */}
                {categorySearch && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                    {SUGGESTED_CATEGORIES.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).map((cat, idx) => (
                      <div 
                        key={idx} 
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 text-sm font-medium border-b last:border-0"
                        onClick={() => {
                          if(!categories.includes(cat)) setCategories([...categories, cat])
                          setCategorySearch('')
                        }}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {categories.length > 0 && (
                <div className="pt-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Suggested Categories based on your selection</h4>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_CATEGORIES.slice(0, 5).filter(c => !categories.includes(c)).map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCategories([...categories, cat])}
                        className="border border-slate-200 text-slate-600 hover:border-[#0a84e3] hover:text-[#0a84e3] px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                      >
                        + {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0a84e3] hover:bg-[#0971c2] text-white font-bold py-3 px-4 rounded-lg transition-all mt-6"
              >
                Save and Continue
              </button>
            </form>
          </StepContainer>
        )}

        {step === 6 && (
          <StepContainer key="step6" step={step} title="Add Photos" subtitle="Showcase your business. Listings with photos get 3x more views!">
            <form onSubmit={handlePhotosSubmit} className="space-y-6">
              
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                  if(e.target.files) setPhotos([...photos, ...Array.from(e.target.files)])
                }} />
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Click to Upload Photos</h3>
                <p className="text-sm text-slate-500">or drag and drop your files here</p>
                <p className="text-xs text-slate-400 mt-4">Supports JPG, PNG up to 5MB</p>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((p, i) => (
                    <div key={i} className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs px-2 text-center break-all">
                         {p.name.slice(0, 15)}...
                      </div>
                      <button type="button" onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePhotosSubmit}
                  className="w-1/3 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-bold py-3 px-4 rounded-lg transition-all"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={loading || photos.length === 0}
                  className="w-2/3 bg-[#0a84e3] hover:bg-[#0971c2] text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                </button>
              </div>
            </form>
          </StepContainer>
        )}

        {step === 7 && (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12" key="step7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 text-center relative overflow-hidden"
            >
              {/* Confetti Background effect */}
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
                {/* Pulse ring */}
                <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
              </div>
              
              <h1 className="text-3xl font-black text-[#111844] mb-4">Congratulations! 🎉</h1>
              <p className="text-lg text-slate-600 mb-2">Your business <strong>{businessDetails.name || 'Account'}</strong> is now registered.</p>
              <p className="text-slate-500 mb-8">You are now part of the LocalDial network. Customers can now discover your services easily!</p>
              
              <div className="bg-gradient-to-br from-[#111844] to-[#1e2a78] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                <Star className="absolute -right-10 -top-10 w-40 h-40 text-white opacity-5" />
                <h3 className="text-lg font-medium text-indigo-100 mb-2">Your Business Profile Score</h3>
                <div className="flex items-end justify-center gap-2 mb-4">
                  <span className="text-6xl font-black text-amber-400">
                    {60 + (photos.length > 0 ? 15 : 0) + (categories.length > 0 ? 15 : 0)}%
                  </span>
                </div>
                <div className="w-full bg-indigo-900/50 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${60 + (photos.length > 0 ? 15 : 0) + (categories.length > 0 ? 15 : 0)}%` }}></div>
                </div>
                <p className="text-sm text-indigo-200 mt-4">
                  {photos.length === 0 ? "Add photos to reach 100% and get more views!" : "Excellent! Your profile is highly optimized."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/business/dashboard" className="px-8 py-4 bg-[#111844] hover:bg-[#0a0e29] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                  Go to Dashboard
                </Link>
                <Link href="/" className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify your email</h2>
              <p className="text-slate-600 mb-6">We've sent a 6-digit code to <strong className="text-slate-800">{email}</strong></p>
              
              <div className="flex gap-2 justify-between mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#111844] focus:border-transparent outline-none bg-slate-50"
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp]; newOtp[i] = e.target.value; setOtp(newOtp);
                      if (e.target.value && i < 5) {
                        const nextInput = document.getElementById(`otp-${i+1}`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    id={`otp-${i}`}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 mb-6">
                  {error}
                </div>
              )}

              <button
                onClick={handleOtpVerify}
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-[#111844] hover:bg-[#111844]/90 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify & Continue'}
              </button>
              
              <p className="text-center mt-6 text-sm text-slate-500">
                Didn't receive the code? <button type="button" onClick={handleEmailSubmit} className="text-[#0a84e3] font-medium hover:underline">Resend OTP</button>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Timing Confirmation Modal */}
      <AnimatePresence>
        {showTimingConfirmModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Confirm Timings?</h2>
              <p className="text-slate-600 mb-8">
                Your business will be shown as OPEN from {timings.slots[0]?.open || '09:00 AM'} to {timings.slots[0]?.close || '06:00 PM'} on {timings.selectedDays.length} selected days. Are these timings correct?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTimingConfirmModal(false)}
                  className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={confirmTimings}
                  className="flex-1 bg-[#111844] hover:bg-[#111844]/90 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Yes, Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

function SearchIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}

// Wrapper to provide Suspense boundary for useSearchParams
export default function BusinessSignup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#111844]" />
      </div>
    }>
      <BusinessSignupContent />
    </Suspense>
  )
}
