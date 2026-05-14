"use client";

import { useState } from "react";
import { Search, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--background)] flex flex-col items-center justify-center transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center">
        {/* Decorative background elements using the palette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full -z-10 opacity-40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8BDFDD] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F48F68] rounded-full blur-[140px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-16 h-16 bg-[#F48F68] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
              <Phone className="text-white w-8 h-8" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter"
          >
            Find what you need, <br />
            <span className="text-[#F48F68]">right in your city.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-700 mb-12 max-w-2xl mx-auto font-medium"
          >
            Discover over 50,000 verified local businesses, from hidden gems to essential services.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-4xl mx-auto w-full"
          >
            <div className="p-3 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-2 border border-white/50">
              <div className="flex-[1.5] flex items-center px-6 gap-4">
                <Search className="text-[#F48F68] w-6 h-6" />
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="w-full py-5 bg-transparent outline-none text-slate-900 text-lg placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden md:block w-[1px] h-12 bg-slate-200 self-center" />
              <div className="flex-1 flex items-center px-6 gap-4">
                <MapPin className="text-[#8BDFDD] w-6 h-6" />
                <input 
                  type="text" 
                  placeholder="San Francisco, CA" 
                  className="w-full py-5 bg-transparent outline-none text-slate-900 text-lg placeholder:text-slate-400"
                />
              </div>
              <button className="bg-[#F48F68] text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-[#e37d56] transition-all shadow-lg shadow-orange-500/30 active:scale-95">
                Search
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Restaurants', 'Plumbers', 'Clinics', 'Groceries', 'Electricians'].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-[#FFE394]/30 text-slate-800 rounded-full text-sm font-bold border border-[#FFE394]/50 cursor-pointer hover:bg-[#FFE394]/50 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
