import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Building2, LogOut, LayoutDashboard, Settings } from 'lucide-react'

export const metadata = {
  title: 'Business Dashboard - LocalDial',
}

export default async function BusinessDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/business/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') {
    redirect('/admin/dashboard')
  }

  if (profile?.role !== 'business' || profile?.status !== 'approved') {
    await supabase.auth.signOut()
    redirect('/business/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-[#111844] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-300" />
            <h1 className="text-xl font-bold">{profile.business_name || 'My Business'}</h1>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#111844] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-indigo-100 text-[#111844] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Profile Overview</h2>
              <p className="text-sm text-slate-500">Manage your business details</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#111844] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-indigo-100 text-[#111844] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Services & Offers</h2>
              <p className="text-sm text-slate-500">Update what you provide</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
