import Link from 'next/link'

export default function BusinessDashboardBilling() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1c2331] mb-6 border-b border-slate-100 pb-4">Wallet Balance</h3>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-black text-[#104825]">₹0</span>
            <span className="text-slate-500 font-medium mb-1">.00</span>
          </div>
          <button className="w-full py-3 bg-[#104825] text-white font-bold rounded-xl hover:bg-[#0c361c] transition-all shadow-md">
            Top Up Wallet
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1c2331] mb-6 border-b border-slate-100 pb-4">Subscription Plan</h3>
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mb-3 inline-block">FREE PLAN</span>
              <h4 className="text-xl font-bold text-[#1c2331]">Basic Listing</h4>
            </div>
          </div>
          <Link href="/business/dashboard/campaigns" className="block text-center w-full py-3 bg-[#F4AE52] text-[#1c2331] font-bold rounded-xl hover:bg-[#e09b3e] transition-all shadow-md">
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </div>
  )
}
