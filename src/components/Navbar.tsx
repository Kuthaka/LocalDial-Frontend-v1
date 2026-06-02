"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Phone, MapPin, ChevronDown, User, Menu, HelpCircle, Info, Mail, Map, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [bgScrolled, setBgScrolled] = useState(false);
  const [isLangEn, setIsLangEn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setBgScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[60] transition-colors duration-300 ${
      bgScrolled ? "bg-[#4B5694]/95 backdrop-blur-md border-b border-white/5 shadow-lg" : "bg-[#4B5694] md:bg-transparent"
    }`}>
      {/* 1. Top Bar (Thin) - Both Desktop & Mobile */}
      <div className="bg-[#4B5694] border-b border-white/10 text-slate-300 text-[10px] md:text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-6">
            <a href="tel:+441642343343" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={12} /> +44 1642 343 343
            </a>
            <div className="hidden md:flex items-center gap-1.5">
              <MapPin size={12} /> Discover Local Businesses
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[#7288AE]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7288AE] animate-pulse"></div> New deals added today
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-0.5 border border-white/10">
              <span className="pl-2 pr-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider">Lang:</span>
              <button onClick={() => setIsLangEn(true)} className={`px-2 py-0.5 rounded-full transition-all ${isLangEn ? 'bg-white text-black font-bold' : 'text-slate-300'}`}>EN</button>
              <button onClick={() => setIsLangEn(false)} className={`px-2 py-0.5 rounded-full transition-all ${!isLangEn ? 'bg-white text-black font-bold' : 'text-slate-300'}`}>AR</button>
            </div>
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white cursor-pointer"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white cursor-pointer"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white cursor-pointer"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Bar (Thick) - Desktop & Mobile */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <span className="text-2xl font-black text-white tracking-wide">LocalDial</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 font-medium text-[13px] text-slate-200 ml-4">
          <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">Home Services <ChevronDown size={14} /></Link>
          <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">Education <ChevronDown size={14} /></Link>
          <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">Beauty & Spa <ChevronDown size={14} /></Link>
          <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">Healthcare <ChevronDown size={14} /></Link>
          <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">Restaurants <ChevronDown size={14} /></Link>
        </div>

        {/* Search, User, Hamburger */}
        <div className="flex items-center gap-4 lg:gap-5 flex-shrink-0 ml-auto">
          {/* Search Input */}
          <div className="hidden md:flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1.5 w-64 xl:w-80 hover:bg-white/15 transition-colors focus-within:bg-white/15 focus-within:border-white/30">
            <Search className="w-4 h-4 text-slate-300 mr-2 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="SERVICE OR PLACE NAME" 
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-400 text-xs font-medium uppercase" 
            />
            <div className="text-[10px] border border-white/20 px-1.5 py-0.5 rounded text-slate-400 ml-2 whitespace-nowrap bg-black/20 font-mono">Ctrl+K</div>
          </div>
          
          <Search className="md:hidden w-5 h-5 text-slate-300 hover:text-white cursor-pointer transition-colors" />
          
          <Link href="/business/login" className="text-slate-300 hover:text-white transition-colors" title="Login">
            <User className="w-5 h-5" />
          </Link>
          
          <button className="lg:hidden p-1.5 text-slate-300 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Bar (Thin) - Desktop Only */}
      <div className="hidden lg:block bg-[#4B5694]/80 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-xs font-medium text-slate-300">
          <div className="flex items-center gap-6">
            <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors"><HelpCircle size={14} /> Help & guides</Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors"><Map size={14} /> Area guide</Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors"><Search size={14} /> Identify a service</Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors"><Info size={14} /> About</Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail size={14} /> Contact</Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#7288AE] font-medium">
              <Globe size={14} /> FREE BUSINESS LISTING
            </div>
            <Link href="/business/signup" className="flex items-center gap-1.5 text-white hover:text-orange-400 transition-colors uppercase tracking-wider font-bold border-l border-white/10 pl-6">
              BUSINESS PORTAL <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
