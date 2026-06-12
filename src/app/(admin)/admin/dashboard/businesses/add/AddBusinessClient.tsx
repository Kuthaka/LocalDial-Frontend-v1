'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Phone, MapPin, Tag, Lock, Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'
import { adminAddBusiness } from '@/app/actions/admin'
import Link from 'next/link'

interface Category {
  id: string;
  name: string;
}

export default function AddBusinessClient({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    mobile: '',
    city: '',
    category: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value))

    const result = await adminAddBusiness(fd)

    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/dashboard/businesses')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[#1c2331] mb-2">Business Added Successfully!</h2>
        <p className="text-slate-500 font-medium">The new business profile has been created and approved. Redirecting to directory...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/dashboard/businesses" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1c2331] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1c2331]">Add New Business</h1>
            <p className="text-slate-500 font-medium text-sm">Directly create and approve a business account</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3 mb-8">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Business Details */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Business Info</h3>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Business Name *</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input required name="businessName" value={formData.businessName} onChange={handleChange} type="text" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-[15px]" placeholder="Acme Corp" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Contact Email *</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-[15px]" placeholder="contact@acme.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input name="mobile" value={formData.mobile} onChange={handleChange} type="tel" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-[15px]" placeholder="9876543210" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1c2331] block ml-1">City</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input name="city" value={formData.city} onChange={handleChange} type="text" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-[15px]" placeholder="Mumbai" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Primary Category</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    list="admin-categories-list" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    type="text" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-[15px]" 
                    placeholder="Search and select category..." 
                    autoComplete="off"
                  />
                  <datalist id="admin-categories-list">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Authentication Details */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">Authentication</h3>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Password *</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input required minLength={6} name="password" value={formData.password} onChange={handleChange} type="password" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-[15px]" placeholder="Minimum 6 characters" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1c2331] block ml-1">Confirm Password *</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input required minLength={6} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-[15px]" placeholder="Confirm password" />
                </div>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mt-6">
                <p className="text-xs text-indigo-800/80 font-medium leading-relaxed">
                  <strong>Note:</strong> Creating a business here bypasses email OTP verification. The business will be instantly approved and can log in immediately using the email and password you provide.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-600/20"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Creating Business...' : 'Create Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
