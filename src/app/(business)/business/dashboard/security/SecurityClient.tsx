'use client'

import { useState } from 'react'
import { Lock, Mail, Loader2, ArrowRight, CheckCircle2, Shield, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendOtp } from '@/app/actions/auth'
import { verifyAndSetPassword } from '@/app/actions/security'
import { useRouter } from 'next/navigation'

export default function SecurityClient({ email, hasPasswordSet }: { email: string, hasPasswordSet: boolean }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    setError(null)

    // Request an OTP to the user's email
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
    setSuccess(null)
    
    const token = otp.join('')
    const result = await verifyAndSetPassword(email, token, password)
    
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowOtpModal(false)
      setSuccess('Your password has been set successfully! Redirecting...')
      setPassword('')
      setConfirmPassword('')
      setOtp(['', '', '', '', '', ''])
      
      setTimeout(() => {
        router.push('/business/dashboard')
      }, 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#104825]/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[#104825]/10 rounded-2xl flex items-center justify-center text-[#104825]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1c2331]">Account Security</h2>
            <p className="text-sm font-medium text-slate-500">Manage your login preferences and password</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100 flex items-start gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-bold">{success}</p>
          </div>
        )}

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1c2331] text-[15px] mb-1">Login Email</h3>
            <p className="text-sm text-slate-500 font-medium">{email}</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
            <Mail className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#1c2331] block ml-1">
              {hasPasswordSet ? 'Change Password' : 'Set New Password'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#104825] transition-colors" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#104825]/10 focus:border-[#104825] transition-all text-[15px] shadow-sm"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="relative group mt-5">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#104825] transition-colors" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#104825]/10 focus:border-[#104825] transition-all text-[15px] shadow-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 6 || confirmPassword.length < 6}
            className="w-full md:w-auto bg-[#104825] hover:bg-[#0c361c] text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-[15px] shadow-[0_8px_30px_rgba(16,72,37,0.2)] hover:shadow-[0_8px_30px_rgba(16,72,37,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to verify'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-[380px] w-full border border-slate-100 relative"
            >
              <div className="w-16 h-16 bg-[#104825]/10 text-[#104825] rounded-full flex items-center justify-center mb-6 mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#1c2331] mb-2 text-center">Verify it's you</h2>
              <p className="text-slate-600 mb-6 text-center text-sm font-medium leading-snug">We've sent a 6-digit code to <br/><strong className="text-[#104825]">{email}</strong><br/>to authorize this change.</p>
              
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
                        const nextInput = document.getElementById(`security-otp-${i+1}`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    id={`security-otp-${i}`}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-start gap-2 mb-6">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-[#104825] hover:bg-[#0c361c] text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 text-[15px] shadow-[0_8px_30px_rgba(16,72,37,0.2)] hover:shadow-[0_8px_30px_rgba(16,72,37,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Save Password'}
              </button>
              
              <div className="mt-6 flex justify-center items-center">
                 <button onClick={() => setShowOtpModal(false)} className="text-sm text-slate-500 hover:text-[#1c2331] font-bold transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
