'use client'

import { useState } from 'react'
import { loginBusiness, sendOtp, verifyOtp } from '@/app/actions/auth'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Mail, Lock, ArrowRight, Loader2, Store } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

  async function handlePasswordSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await loginBusiness(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        <div className="bg-[#111844] p-8 text-white text-center">
          <Store className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
          <h1 className="text-2xl font-bold mb-2">Business Portal</h1>
          <p className="text-indigo-100/80">Manage your NearbyDirect presence</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 mb-6">
              {error}
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
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111844] focus:border-transparent transition-all"
                      placeholder="hello@yourbusiness.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#111844] hover:bg-[#111844]/90 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request OTP'}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="password-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                action={handlePasswordSubmit} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111844] focus:border-transparent transition-all"
                      placeholder="hello@yourbusiness.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111844] focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111844] hover:bg-[#111844]/90 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button 
              onClick={() => setLoginMethod(prev => prev === 'otp' ? 'password' : 'otp')}
              className="text-sm text-slate-500 font-medium hover:text-[#111844] transition-colors"
            >
              {loginMethod === 'otp' ? 'Login with Password instead' : 'Login with OTP instead'}
            </button>
            <p className="text-sm text-slate-600">
              Don't have a business account?{' '}
              <Link href="/business/signup" className="text-[#111844] font-bold hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

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
                        const nextInput = document.getElementById(`login-otp-${i+1}`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    id={`login-otp-${i}`}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 mb-6">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-[#111844] hover:bg-[#111844]/90 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify & Login'}
              </button>
              
              <div className="mt-6 flex justify-between items-center">
                 <button onClick={() => setShowOtpModal(false)} className="text-sm text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                 <p className="text-sm text-slate-500">
                  Didn't receive code? <button type="button" onClick={handleRequestOtp} className="text-[#0a84e3] font-medium hover:underline">Resend</button>
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
