"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [bgScrolled, setBgScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 400px is roughly where the main hero search bar disappears and the second section starts
      setScrolled(window.scrollY > 400); 
      setBgScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[60] transition-colors duration-300 ${
      bgScrolled ? "bg-[#0a1f18]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
    }`}>
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
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-slate-300" />
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <button className="text-white">EN</button>
              <span className="text-slate-600">|</span>
              <button className="text-slate-400 hover:text-white transition-colors">AR</button>
            </div>
          </div>
          <Link href="/business/signup" className="flex items-center gap-2 px-4 py-2 bg-white rounded-md text-sm font-bold text-black hover:bg-slate-100 transition-all shadow-sm">
            List Your Business <span className="bg-orange-400 text-white text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Free</span>
          </Link>
          <Link href="/business/login" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors title='Login to Business Portal'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
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
