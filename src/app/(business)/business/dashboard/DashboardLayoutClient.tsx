'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Lock,
  LogOut,
  Building2,
  AlertTriangle,
  X
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardLayoutClient({ children, profile, hasPasswordSet }: { children: React.ReactNode, profile: any, hasPasswordSet: boolean }) {
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { id: '/business/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: '/business/dashboard/leads', label: 'Lead Management', icon: Users },
    { id: '/business/dashboard/profile', label: 'Profile & Listing', icon: Store },
    { id: '/business/dashboard/security', label: 'Security & Login', icon: Lock },
  ]

  const activeLabel = navItems.find(i => i.id === pathname)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col p-4 md:p-6 gap-6">
      {/* Top Header - Floating */}
      <header className="h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-between px-8 sticky top-4 md:top-6 z-30 shadow-sm flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#104825] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-green-50" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1c2331]">
                NearbyDirect Business
              </h2>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#1c2331]">Profile Score</p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#104825] h-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs font-bold text-[#104825]">85%</span>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 hover:ring-2 hover:ring-[#104825] transition-all cursor-pointer"
            >
              <span className="font-bold text-[#1c2331]">{profile.business_name?.charAt(0) || 'B'}</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100">
                  <p className="font-bold text-[#1c2331] truncate">{profile.business_name || 'My Business'}</p>
                </div>
                <form action={logout}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container below Header */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 max-w-full items-start">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#1c2331] text-white flex-col shadow-2xl z-20 sticky top-[104px] md:top-[128px] md:h-[calc(100vh-9.5rem)] rounded-2xl flex-shrink-0 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div>
            <h1 className="font-bold text-lg leading-tight truncate">{profile.business_name || 'My Business'}</h1>
            <p className="text-xs text-slate-400">Vendor Dashboard</p>
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

        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[calc(100vh-9.5rem)] w-full overflow-hidden">
          {/* Dynamic Content Area Header */}
          {pathname !== '/business/dashboard' && (
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-black text-[#1c2331]">
                {activeLabel}
              </h2>
            </div>
          )}
          <div className={`flex-1 overflow-y-auto pb-24 md:pb-8 ${pathname === '/business/dashboard' ? '' : 'p-8'}`}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-[#1c2331] rounded-2xl shadow-2xl z-40 flex justify-between px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.id;
          return (
            <Link
              key={item.id}
              href={item.id}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white/10 text-[#F4AE52]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>

      {/* Password Setup Reminder Toast */}
      <AnimatePresence>
        {!hasPasswordSet && (
          <motion.div 
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-6 right-4 md:right-6 bg-white rounded-2xl shadow-2xl border-l-4 border-[#F4AE52] p-4 max-w-sm z-50 flex gap-4 items-start"
          >
            <div className="bg-orange-50 p-2 rounded-full flex-shrink-0 text-[#F4AE52]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#1c2331] text-sm mb-1">Set up your password</h4>
              <p className="text-xs text-slate-500 mb-3">You are currently using OTP to login. Set a password for easier access to your dashboard.</p>
              <Link 
                href="/business/dashboard/security" 
                className="text-xs font-bold text-white bg-[#104825] px-4 py-2 rounded-lg hover:bg-[#0c361c] transition-colors inline-block"
              >
                Setup Password
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
