"use client";

import { useState, useEffect } from "react";
import { X, Search, MapPin, Navigation, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@/hooks/useLocation";

export default function LocationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [globalLocation, setGlobalLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync search input with global location when modal opens
  useEffect(() => {
    if (isOpen && globalLocation) {
      setSearch(globalLocation);
    }
  }, [isOpen, globalLocation]);

  // Free OpenStreetMap Nominatim API for forward geocoding (search)
  useEffect(() => {
    if (!search || search.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=5`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setIsSearching(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const finalizeLocation = (locName: string) => {
    setSearch(locName);
    setGlobalLocation(locName);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 700);
  };

  // Native Browser Geolocation + OpenStreetMap Reverse Geocoding
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.county || data.display_name.split(',')[0];
          
          finalizeLocation(city);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
      }
    );
  };

  const handleSelectLocation = (locName: string) => {
    finalizeLocation(locName);
  };

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
                {isSearching ? <Loader2 className="w-5 h-5 text-[#F4AE52] mr-3 animate-spin" /> : <Search className="w-5 h-5 text-slate-400 mr-3" />}
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search for city, area, or zip code..."
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium text-sm md:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-3 w-full mt-4 p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group border border-slate-100 shadow-sm active:scale-[0.98] disabled:opacity-70 relative overflow-hidden"
              >
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-blue-600 text-sm">{isLocating ? 'Locating...' : 'Use current location'}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Allow access to device location</p>
                </div>

                {/* Success Overlay */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-green-500 flex items-center justify-center gap-2 text-white font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Location Saved!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Suggestions / Popular Locations */}
            <div className="flex-1 overflow-y-auto max-h-[40vh] p-5 pt-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {suggestions.length > 0 ? "Search Results" : "Popular Cities"}
              </h3>
              <div className="space-y-1">
                {suggestions.length > 0 ? (
                  suggestions.map((loc, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSelectLocation(loc.display_name.split(',')[0])} 
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-[#104825]" />
                      <span className="font-medium text-slate-700 text-sm line-clamp-1">{loc.display_name}</span>
                    </button>
                  ))
                ) : (
                  ["San Francisco, CA", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Austin, TX"].map((city) => (
                    <button 
                      key={city} 
                      onClick={() => handleSelectLocation(city)} 
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-700 text-sm">{city}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
