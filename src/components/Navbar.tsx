"use client";

import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[60] bg-[#000000]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl font-light text-white tracking-wide">Nearby Direct</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Categories</a>
          <button className="text-slate-300 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#000000]"></span>
          </button>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</a>
          <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-black hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            For businesses
          </button>
        </div>
        <button className="md:hidden p-2 flex flex-col gap-1.5">
          <div className="w-6 h-0.5 bg-white rounded-full"></div>
          <div className="w-6 h-0.5 bg-white rounded-full"></div>
          <div className="w-6 h-0.5 bg-white rounded-full"></div>
        </button>
      </div>
    </nav>
  );
}
