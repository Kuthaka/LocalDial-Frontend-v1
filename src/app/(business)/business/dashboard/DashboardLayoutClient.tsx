'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Megaphone, 
  CreditCard, 
  LogOut,
  Building2
} from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function DashboardLayoutClient({ children, profile }: { children: React.ReactNode, profile: any }) {
  const pathname = usePathname()

  const navItems = [
    { id: '/business/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: '/business/dashboard/leads', label: 'Lead Management', icon: Users },
    { id: '/business/dashboard/profile', label: 'Profile & Listing', icon: Store },
    { id: '/business/dashboard/campaigns', label: 'Campaigns & Ads', icon: Megaphone },
    { id: '/business/dashboard/billing', label: 'Payments & Billing', icon: CreditCard },
  ]

  const activeLabel = navItems.find(i => i.id === pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1c2331] text-white flex flex-col shadow-2xl z-20 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#104825] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-green-50" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight truncate w-36">{profile.business_name || 'My Business'}</h1>
              <p className="text-xs text-slate-400">Vendor Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.id;
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#104825] text-white shadow-lg shadow-[#104825]/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#F4AE52]' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={logout}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[#1c2331]">
              {activeLabel}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#1c2331]">Profile Score</p>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[#104825] h-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs font-bold text-[#104825]">85%</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <span className="font-bold text-[#1c2331]">{profile.business_name?.charAt(0) || 'B'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
