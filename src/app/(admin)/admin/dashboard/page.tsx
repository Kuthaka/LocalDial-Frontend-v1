import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { approveBusiness, rejectBusiness } from '@/app/actions/admin'
import { logout } from '@/app/actions/auth'
import { Shield, Building2, Check, X, LogOut, Clock, Mail } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard - NearbyDirect',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Authenticate Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // 2. Fetch Businesses
  const { data: businesses } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'business')
    .order('created_at', { ascending: false })

  const pendingBusinesses = businesses?.filter(b => b.status === 'pending') || []
  const otherBusinesses = businesses?.filter(b => b.status !== 'pending') || []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#111844]" />
            <h1 className="text-xl font-bold">Master Admin</h1>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area - Pending Approvals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-900">Pending Approvals ({pendingBusinesses.length})</h2>
              </div>
              
              <div className="divide-y divide-slate-100">
                {pendingBusinesses.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    No pending businesses to review.
                  </div>
                ) : (
                  pendingBusinesses.map((business) => (
                    <div key={business.id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <h3 className="font-semibold text-slate-900">{business.business_name || 'Unnamed Business'}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="w-4 h-4" />
                          <p>{business.email}</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Applied: {new Date(business.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                        <form action={async () => {
                          'use server'
                          await approveBusiness(business.id)
                        }} className="flex-1 sm:flex-none">
                          <button className="w-full flex items-center justify-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-[#111844] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                        </form>
                        
                        <form action={async () => {
                          'use server'
                          await rejectBusiness(business.id)
                        }} className="flex-1 sm:flex-none">
                          <button className="w-full flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Processed Businesses */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Recently Processed</h2>
              </div>
              
              <div className="divide-y divide-slate-100">
                {otherBusinesses.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No processed businesses yet.
                  </div>
                ) : (
                  otherBusinesses.slice(0, 10).map((business) => (
                    <div key={business.id} className="p-4 flex items-center justify-between">
                      <div className="truncate pr-4">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {business.business_name || business.email}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{business.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        business.status === 'approved' 
                          ? 'bg-indigo-100 text-[#111844]/90' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
