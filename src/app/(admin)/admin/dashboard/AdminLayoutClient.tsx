'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield,
  LayoutDashboard,
  Tags,
  Users,
  Settings,
  LogOut,
  Building2,
  PlusCircle
} from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function AdminLayoutClient({ children, userEmail }: { children: React.ReactNode, userEmail: string }) {
  const pathname = usePathname()

  const navItems = [
    { id: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: '/admin/dashboard/businesses', label: 'Business Directory', icon: Building2 },
    { id: '/admin/dashboard/businesses/add', label: 'Add Business', icon: PlusCircle },
    { id: '/admin/dashboard/categories', label: 'Categories', icon: Tags },
    { id: '/admin/dashboard/users', label: 'User Management', icon: Users },
    { id: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const activeLabel = navItems.find(i => i.id === pathname)?.label || 'Admin Panel'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111844] rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <Shield className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight truncate">Master Admin</h1>
              <p className="text-xs text-slate-400 truncate w-32">{userEmail}</p>
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
                    ? 'bg-[#111844] text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
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
            <h2 className="text-2xl font-black text-slate-900">
              {activeLabel}
            </h2>
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
