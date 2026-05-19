"use client";

import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 400px is roughly where the main hero search bar disappears and the second section starts
      setScrolled(window.scrollY > 400); 
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-[60] bg-[#000000]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <span className="text-2xl font-light text-white tracking-wide">Nearby Direct</span>
        </div>

        {/* Center / Search Area */}
        <div className="hidden md:flex flex-1 justify-end items-center mr-2 h-10">
          <AnimatePresence mode="wait">
            {scrolled ? (
              <motion.div 
                key="search-bar"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%", maxWidth: "20rem" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-1.5 h-full overflow-hidden"
              >
                <Search className="w-4 h-4 text-slate-300 mr-2 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search places, businesses..." 
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-400 text-sm" 
                />
              </motion.div>
            ) : (
              <motion.button 
                key="search-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="text-slate-300 hover:text-white transition-colors p-1.5"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
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
