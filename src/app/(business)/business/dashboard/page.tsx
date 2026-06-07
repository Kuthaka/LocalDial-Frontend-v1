import { PhoneCall, Eye, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function BusinessDashboardOverview() {
  const mockLeads = [
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', location: 'Kakkanchery', service: 'AC Repair', status: 'New', time: '2 hours ago' },
    { id: 2, name: 'Priya Menon', phone: '+91 87654 32109', location: 'Calicut City', service: 'Deep Cleaning', status: 'Contacted', time: '5 hours ago' },
    { id: 3, name: 'Arjun K', phone: '+91 76543 21098', location: 'Ramanattukara', service: 'AC Installation', status: 'Converted', time: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Inquiries', value: '124', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Direct Calls', value: '48', icon: PhoneCall, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Profile Views', value: '1,240', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Conversion Rate', value: '12.5%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-[#1c2331]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1c2331]">Recent Leads</h3>
            <Link href="/business/dashboard/leads" className="text-sm font-bold text-[#104825] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {mockLeads.slice(0,2).map(lead => (
              <div key={lead.id} className="p-4 border border-slate-100 rounded-xl hover:border-[#104825]/30 transition-colors bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-[#1c2331]">{lead.name}</h4>
                    <p className="text-sm text-slate-500">{lead.service} • {lead.location}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                    {lead.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button className="px-4 py-2 bg-[#104825] text-white text-xs font-bold rounded-lg hover:bg-[#0c361c] transition-colors">Call Now</button>
                  <button className="px-4 py-2 bg-slate-200 text-[#1c2331] text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors">WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Completeness Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1c2331] mb-6">Profile Setup</h3>
          <div className="space-y-4">
            {[
              { label: 'Basic Info Added', done: true },
              { label: 'Contact Numbers Verified', done: true },
              { label: 'Business Hours Set', done: true },
              { label: 'Photos Uploaded', done: false },
              { label: 'Services Listed', done: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.done ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                )}
                <span className={`text-sm font-medium ${item.done ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
              </div>
            ))}
          </div>
          <Link href="/business/dashboard/profile" className="block text-center w-full mt-8 py-3 bg-slate-100 text-[#1c2331] text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors">
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
