'use client'

import { useState } from 'react'
import { loginBusiness, sendOtp, verifyOtp } from '@/app/actions/auth'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, Store, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function BusinessLogin() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!email) return
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

  const handleVerifyOtp = async () => {
    setLoading(true)
    setError(null)
    
    const token = otp.join('')
    const result = await verifyOtp(email, token, true)
    
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowOtpModal(false)
      router.push('/business/dashboard')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await loginBusiness(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative flex items-center bg-cover bg-center" style={{ backgroundImage: "url('/banners/business-login.png')" }}>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center lg:justify-end pt-24 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-[380px] lg:mt-24 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 mb-12 lg:mb-0"
          >
            <div className="bg-white/60 p-6 relative overflow-hidden border-b border-slate-100">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#104825]/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
              <h1 className="text-2xl font-black mb-1.5 relative z-10 text-[#1c2331]">Welcome <span className="text-[#104825]">Back</span></h1>
              <p className="text-slate-600 text-sm font-medium relative z-10 leading-snug">Sign in to manage your NearbyDirect presence.</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-start gap-2 mb-5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {loginMethod === 'otp' ? (
                  <motion.form 
                    key="otp-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleRequestOtp} 
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#104825] transition-colors" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#104825]/10 focus:border-[#104825] transition-all text-[15px] shadow-sm"
                          placeholder="hello@yourbusiness.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full bg-[#104825] hover:bg-[#0c361c] text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-[15px] shadow-[0_8px_30px_rgba(16,72,37,0.2)] hover:shadow-[0_8px_30px_rgba(16,72,37,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Requesting...
                        </>
                      ) : 'Request OTP'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="password-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handlePasswordSubmit} 
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#104825] transition-colors" />
                        <input
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#104825]/10 focus:border-[#104825] transition-all text-[15px] shadow-sm"
                          placeholder="hello@yourbusiness.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#104825] transition-colors" />
                        <input
                          name="password"
                          type="password"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#104825]/10 focus:border-[#104825] transition-all text-[15px] shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#104825] hover:bg-[#0c361c] text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-[15px] shadow-[0_8px_30px_rgba(16,72,37,0.2)] hover:shadow-[0_8px_30px_rgba(16,72,37,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
                        </>
                      ) : (
                        <>
                          Sign In <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="pt-4 mt-6 text-center">
                <button 
                  onClick={() => setLoginMethod(prev => prev === 'otp' ? 'password' : 'otp')}
                  className="text-[13px] text-slate-500 font-medium hover:text-[#104825] transition-colors mb-4 block w-full"
                >
                  {loginMethod === 'otp' ? 'Login with Password instead' : 'Login with OTP instead'}
                </button>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[13px] text-[#1c2331] font-medium">
                    Don't have a business account?{' '}
                    <Link href="/business/signup" className="text-[#104825] font-bold hover:underline ml-1">
                      Register now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-[380px] w-full border border-slate-100"
            >
              <div className="w-16 h-16 bg-[#104825]/10 text-[#104825] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#1c2331] mb-2 text-center">Verify your email</h2>
              <p className="text-slate-600 mb-6 text-center text-sm font-medium leading-snug">We've sent a 6-digit code to <br/><strong className="text-[#104825]">{email}</strong></p>
              
              <div className="flex gap-2 justify-between mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-[#104825]/10 focus:border-[#104825] outline-none bg-white transition-all shadow-sm"
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp]; newOtp[i] = e.target.value; setOtp(newOtp);
                      if (e.target.value && i < 5) {
                        const nextInput = document.getElementById(`login-otp-${i+1}`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    id={`login-otp-${i}`}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-start gap-2 mb-6">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-[#104825] hover:bg-[#0c361c] text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 text-[15px] shadow-[0_8px_30px_rgba(16,72,37,0.2)] hover:shadow-[0_8px_30px_rgba(16,72,37,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                  </>
                ) : 'Verify & Login'}
              </button>
              
              <div className="mt-6 flex justify-between items-center">
                 <button onClick={() => setShowOtpModal(false)} className="text-sm text-slate-500 hover:text-[#1c2331] font-medium transition-colors">Cancel</button>
                 <p className="text-sm text-slate-500">
                  Didn't receive code? <button type="button" onClick={handleRequestOtp} className="text-[#104825] font-bold hover:underline">Resend</button>
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
