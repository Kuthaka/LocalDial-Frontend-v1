import { MoreVertical } from 'lucide-react'

export default function BusinessDashboardLeads() {
  const mockLeads = [
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', location: 'Kakkanchery', service: 'AC Repair', status: 'New', time: '2 hours ago' },
    { id: 2, name: 'Priya Menon', phone: '+91 87654 32109', location: 'Calicut City', service: 'Deep Cleaning', status: 'Contacted', time: '5 hours ago' },
    { id: 3, name: 'Arjun K', phone: '+91 76543 21098', location: 'Ramanattukara', service: 'AC Installation', status: 'Converted', time: '1 day ago' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-[#1c2331]">All Inquiries</h3>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-[#104825]">
            <option>All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Converted</option>
          </select>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {mockLeads.map(lead => (
          <div key={lead.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-bold text-[#1c2331] text-lg">{lead.name}</h4>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                  lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                  lead.status === 'Contacted' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {lead.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">{lead.service} • {lead.location} • {lead.time}</p>
              <p className="text-sm font-bold text-[#1c2331] mt-2">{lead.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-[#104825] text-white text-sm font-bold rounded-lg hover:bg-[#0c361c] transition-colors shadow-sm">Call</button>
              <button className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors shadow-sm">WhatsApp</button>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
