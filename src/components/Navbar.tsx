"use client";

import { Phone } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 md:px-6 py-4 flex justify-between items-center z-[60] bg-[#EEEEEE]/80 backdrop-blur-md">
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-xl font-black text-slate-900 tracking-tighter">LocalDial</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-bold text-slate-600 hover:text-[#2FA084] transition-colors">Explore</a>
        <a href="#" className="text-sm font-bold text-slate-600 hover:text-[#2FA084] transition-colors">Business</a>
        <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
          Sign In
        </button>
      </div>
      <button className="md:hidden p-2 text-slate-900 flex flex-col gap-1.5">
        <div className="w-6 h-0.5 bg-slate-900"></div>
        <div className="w-6 h-0.5 bg-slate-900"></div>
        <div className="w-6 h-0.5 bg-slate-900"></div>
      </button>
    </nav>
  );
}
