"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Phone, MapPin, ChevronDown, User, Menu, X, HelpCircle, Info, Mail, Map, ArrowUpRight, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import LocationModal from "./LocationModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSearchSuggestions } from '@/app/actions/search';

export default function Navbar() {
  const [bgScrolled, setBgScrolled] = useState(false);
  const [isLangEn, setIsLangEn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useSelector((state: RootState) => state.location.currentLocation);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setBgScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await getSearchSuggestions(searchQuery, location);
      setSuggestions(res);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, location]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[60] transition-colors duration-300 ${
      bgScrolled ? "bg-[#C1EBE9]/95 backdrop-blur-md border-b border-[#a8d9d7] shadow-lg" : "bg-[#C1EBE9] md:bg-transparent"
    }`}>
      {/* 1. Top Bar (Thin) - Both Desktop & Mobile */}
      <div className="bg-black border-b border-white/10 text-white text-[10px] md:text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-6">
            <a href="tel:+441642343343" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
              <Phone size={12} className="text-white" /> +44 1642 343 343
            </a>
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 hover:text-[#F4AE52] transition-colors cursor-pointer max-w-[200px]"
            >
              <MapPin size={12} className="text-current flex-shrink-0" /> 
              <span className="truncate">{isMounted ? (location || "Set your location") : "Set your location"}</span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-green-400 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> New businesses available near you
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-0.5 border border-white/10">
              <span className="pl-2 pr-1 text-[10px] font-medium text-white/70 uppercase tracking-wider">Lang:</span>
              <button onClick={() => setIsLangEn(true)} className={`px-2 py-0.5 rounded-full transition-all ${isLangEn ? 'bg-white text-black font-bold' : 'text-white/80'}`}>EN</button>
              <button onClick={() => setIsLangEn(false)} className={`px-2 py-0.5 rounded-full transition-all ${!isLangEn ? 'bg-white text-black font-bold' : 'text-white/80'}`}>AR</button>
            </div>
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white/70 cursor-pointer transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white/70 cursor-pointer transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white/70 cursor-pointer transition-colors"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Bar (Thick) - Desktop & Mobile */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center gap-4">
        {/* Logo and Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <span className="text-2xl font-black text-black tracking-wide">NearbyDirect</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/explore" className="font-bold text-slate-800 hover:text-[#F4AE52] transition-colors">
              Explore
            </Link>
            <Link href="/categories" className="font-bold text-slate-800 hover:text-[#F4AE52] transition-colors">
              Categories
            </Link>
          </div>
        </div>

        {/* CTA, Search, User, Hamburger */}
        <div className="flex items-center gap-4 lg:gap-5 flex-shrink-0 ml-auto">
          {/* List Your Business CTA */}
          <div className="relative hidden sm:block mr-2 mt-1">
            <Link href="/business/signup" className="bg-[#F4AE52] text-slate-900 font-bold px-4 py-2 rounded-full text-sm hover:bg-[#e09c40] transition-colors shadow-sm">
              List Your Business
            </Link>
            <div className="absolute -top-3 -right-2 bg-green-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-md transform rotate-[10deg] border border-white">
              FREE
            </div>
          </div>

          {/* Search Input */}
          <div className="relative hidden md:block">
            <div className="flex items-center bg-white border-2 border-slate-300 rounded-full px-3 py-1.5 w-64 xl:w-80 hover:border-slate-400 transition-colors focus-within:bg-white focus-within:border-[#F4AE52] shadow-sm">
              <Search className="w-4 h-4 text-slate-600 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setShowSuggestions(false)
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(location && location !== 'Set your location' ? location : '')}`)
                  }
                }}
                placeholder="SERVICE OR PLACE NAME" 
                className="w-full bg-transparent border-none outline-none text-black placeholder:text-slate-500 text-xs font-bold uppercase" 
              />
              {isSearching ? (
                <div className="w-3 h-3 rounded-full border-2 border-[#F4AE52] border-t-transparent animate-spin ml-2 flex-shrink-0"></div>
              ) : (
                <div className="text-[10px] border border-slate-300 px-1.5 py-0.5 rounded text-slate-600 ml-2 whitespace-nowrap bg-slate-50 font-mono flex-shrink-0">Enter</div>
              )}
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (searchQuery.length >= 2) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 w-[360px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col"
                >
                  {suggestions.length > 0 ? (
                    <>
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSearchQuery(item.name)
                            setShowSuggestions(false)
                            router.push(`/business/${item.username || item.id}`)
                          }}
                          className="flex items-start text-left gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors w-full"
                        >
                          <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                            <img src={item.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1c2331&color=fff`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                            <p className="text-xs text-slate-500 font-medium truncate">{item.primary_category || item.address_text || 'Business'}</p>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setShowSuggestions(false)
                          router.push(`/search?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(location && location !== 'Set your location' ? location : '')}`)
                        }}
                        className="w-full text-center py-3 text-xs font-bold text-[#104825] hover:bg-[#104825]/5 transition-colors border-t border-slate-100"
                      >
                        See all results for "{searchQuery}"
                      </button>
                    </>
                  ) : (
                    <div className="p-5 text-center">
                      {!isSearching && (
                        <p className="text-sm text-slate-500 font-medium">No matches found for "{searchQuery}"</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Search className="md:hidden w-5 h-5 text-black hover:text-[#F4AE52] cursor-pointer transition-colors" />
          
          <Link href="/business/login" className="text-black hover:text-[#F4AE52] transition-colors" title="Login">
            <User className="w-6 h-6 stroke-[2.5]" />
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-black hover:text-[#F4AE52] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-5 gap-4">
              <Link href="/business/signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#F4AE52] text-center text-slate-900 font-bold px-4 py-3 rounded-lg text-sm hover:bg-[#e09c40] transition-colors shadow-sm">
                List Your Business (FREE)
              </Link>
              <div className="h-px bg-slate-100 w-full my-1"></div>
              <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-800 font-bold p-3 hover:bg-slate-50 rounded-lg">
                <Globe className="w-5 h-5 text-slate-400" /> Explore All Businesses
              </Link>
              <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-800 font-bold p-3 hover:bg-slate-50 rounded-lg">
                <List className="w-5 h-5 text-slate-400" /> Categories
              </Link>
              <Link href="/business/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-800 font-bold p-3 hover:bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-slate-400" /> Login / Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </nav>
  );
}
