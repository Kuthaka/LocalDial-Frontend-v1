"use client";

import { useState } from "react";
import { X, Search, MapPin, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LocationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [search, setSearch] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Select Location</h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-5 pb-4">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:bg-white focus-within:border-[#F4AE52] focus-within:ring-4 focus-within:ring-[#F4AE52]/10 transition-all">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search for city, area, or zip code..."
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium text-sm md:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <button className="flex items-center gap-3 w-full mt-4 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group border border-slate-100 shadow-sm active:scale-[0.98]">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-blue-600 text-sm">Use current location</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Allow access to device location</p>
                </div>
              </button>
            </div>

            {/* Popular Locations */}
            <div className="flex-1 overflow-y-auto max-h-[40vh] p-5 pt-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Cities</h3>
              <div className="space-y-1">
                {["San Francisco, CA", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Austin, TX"].map((city) => (
                  <button key={city} onClick={onClose} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-left transition-colors">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-700">{city}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
