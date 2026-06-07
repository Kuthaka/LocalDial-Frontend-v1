import { Megaphone } from 'lucide-react'

export default function BusinessDashboardCampaigns() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1c2331] to-[#2a3449] rounded-2xl shadow-lg p-8 text-white flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-2 text-[#F4AE52]">Boost Your Visibility</h2>
          <p className="text-slate-300 max-w-md">Reach 5x more customers by upgrading to a Premium Listing or running targeted keyword ads in your city.</p>
        </div>
        <button className="mt-6 md:mt-0 px-8 py-4 bg-[#F4AE52] text-[#1c2331] font-black rounded-xl hover:bg-[#e09b3e] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Start Campaign
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#1c2331] mb-6">Active Ad Campaigns</h3>
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-slate-700">No active campaigns</h4>
          <p className="text-slate-500 mt-2">You are currently relying on organic discovery.</p>
        </div>
      </div>
    </div>
  )
}
