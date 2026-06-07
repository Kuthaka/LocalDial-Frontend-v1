import { Plus } from 'lucide-react'

export default function BusinessDashboardProfile() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#1c2331] mb-6 border-b border-slate-100 pb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
            <input type="text" defaultValue="My Business" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Primary Phone</label>
            <input type="text" defaultValue="+91 9876543210" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
            <textarea rows={3} defaultValue="123 Main Street, Calicut" className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#104825] bg-slate-50"></textarea>
          </div>
        </div>
        <button className="mt-6 px-6 py-3 bg-[#104825] text-white font-bold rounded-xl hover:bg-[#0c361c] transition-all shadow-md">
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-[#1c2331]">Photo Gallery</h3>
          <button className="flex items-center gap-2 text-sm font-bold text-[#104825] hover:underline">
            <Plus className="w-4 h-4" /> Add Photos
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-[#104825] hover:bg-[#104825]/5 transition-colors">
            <Plus className="w-8 h-8 text-slate-400" />
          </div>
          {[1,2,3].map(i => (
            <div key={i} className="aspect-square bg-slate-200 rounded-xl border border-slate-200 relative group overflow-hidden">
              <img src={`https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&w=300&q=80`} alt="gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
