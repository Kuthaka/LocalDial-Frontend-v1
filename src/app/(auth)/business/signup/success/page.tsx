'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function SignupSuccess() {
  const [businessName, setBusinessName] = useState('')
  const [photosCount, setPhotosCount] = useState(0)
  const [categoriesCount, setCategoriesCount] = useState(0)

  useEffect(() => {
    try {
      const details = JSON.parse(window.sessionStorage.getItem('business_signup_details') || '{}')
      const categories = JSON.parse(window.sessionStorage.getItem('business_signup_categories') || '[]')
      // Note: photos are not easily saved in sessionStorage, but we can assume 0 or handle logic if needed
      setBusinessName(details.name || 'Account')
      setCategoriesCount(categories.length || 0)

      // Clear session storage now that we've read it
      window.sessionStorage.removeItem('business_signup_email')
      window.sessionStorage.removeItem('business_signup_details')
      window.sessionStorage.removeItem('business_signup_contacts')
      window.sessionStorage.removeItem('business_signup_sameAsMobile')
      window.sessionStorage.removeItem('business_signup_timings')
      window.sessionStorage.removeItem('business_signup_categories')
    } catch (e) {
      console.error(e)
    }
  }, [])

  const profileScore = 60 + (categoriesCount > 0 ? 15 : 0) + (photosCount > 0 ? 15 : 0)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-28 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 text-center relative overflow-hidden mt-8"
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
          
          <h1 className="text-3xl font-black text-[#1c2331] mb-4">Congratulations! 🎉</h1>
          <p className="text-lg text-slate-600 mb-2">Your business <strong>{businessName}</strong> is now registered.</p>
          <p className="text-slate-500 mb-8">You are now part of the NearbyDirect network. Customers can now discover your services easily!</p>
          
          <div className="bg-gradient-to-br from-[#104825] to-[#0c361c] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <Star className="absolute -right-10 -top-10 w-40 h-40 text-white opacity-5" />
            <h3 className="text-lg font-medium text-green-100 mb-2">Your Business Profile Score</h3>
            <div className="flex items-end justify-center gap-2 mb-4">
              <span className="text-6xl font-black text-[#F4AE52]">
                {profileScore}%
              </span>
            </div>
            <div className="w-full bg-green-900/50 h-3 rounded-full overflow-hidden">
              <div className="bg-[#F4AE52] h-full transition-all duration-1000" style={{ width: `${profileScore}%` }}></div>
            </div>
            <p className="text-sm text-green-200 mt-4">
              Excellent! Your profile is set up and ready to go.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/business/dashboard" className="px-8 py-4 bg-[#104825] hover:bg-[#0c361c] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              Go to Dashboard
            </Link>
            <Link href="/business/login" className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-[#1c2331] font-bold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0">
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}
