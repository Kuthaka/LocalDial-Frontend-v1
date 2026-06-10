import { Rocket } from 'lucide-react'

export default function BusinessDashboardBilling() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-[#104825]/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#104825]/20">
        <Rocket className="w-12 h-12 text-[#104825]" />
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-[#1c2331] tracking-tight mb-4">
        Payments & Billing
      </h2>
      <div className="inline-block px-4 py-1.5 bg-[#F4AE52]/20 text-[#d98b25] font-black rounded-full text-sm tracking-widest uppercase mb-6 border border-[#F4AE52]/30">
        Coming Soon
      </div>
      <p className="text-slate-500 max-w-lg text-lg leading-relaxed">
        Our premium subscription and wallet top-up features are launching shortly. Get ready to supercharge your business!
      </p>
    </div>
  )
}
