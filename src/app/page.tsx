"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Phone, ArrowLeft, Clock, TrendingUp, Star, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { getSearchSuggestions, getSearchResults } from '@/app/actions/search';

import DiscoverCities from "@/components/DiscoverCities";
import FeaturedPlaces from "@/components/FeaturedPlaces";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import LocationModal from "@/components/LocationModal";
import PopularSection from "@/components/PopularSection";
import FAQSection from "@/components/FAQSection";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import QuickCategories from "@/components/QuickCategories";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const location = useSelector((state: RootState) => state.location.currentLocation);
  const isLocating = useSelector((state: RootState) => state.location.isLocating);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [liveSuggestions, setLiveSuggestions] = useState<any[]>([]);
  const [homeRestaurants, setHomeRestaurants] = useState<any[]>([]);
  const [homeBanks, setHomeBanks] = useState<any[]>([]);

  useEffect(() => {
    if (!isLocating && (!location || location === 'Set your location')) {
      setIsLocationModalOpen(true);
    }
  }, [location, isLocating]);

  useEffect(() => {
    async function loadHomeData() {
      const loc = location === 'Set your location' ? '' : location;
      const results = await getSearchResults('', loc);
      
      if (results && results.length > 0) {
        const allCards = results.map((business: any) => ({
          href: `/business/${business.username || business.id}`,
          coverImage: business.cover_url || (business.gallery_images && business.gallery_images[0]) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          logoImage: business.logo_url,
          name: business.name || 'Unnamed Business',
          handle: business.username || (business.tagline ? business.tagline.replace(/\\s+/g, '').toLowerCase() : business.id.slice(0, 8)),
          description: business.description || business.tagline || 'No description available.',
          verified: business.is_verified !== false,
          category: business.primary_category
        }));

        const r = allCards.filter((c: any) => c.category === 'Restaurants');
        const b = allCards.filter((c: any) => c.category === 'Healthcare'); // fallback for banks since seed data uses Healthcare

        if (r.length > 0) setHomeRestaurants(r.slice(0, 4));
        if (b.length > 0) setHomeBanks(b.slice(0, 4));
      }
    }
    loadHomeData();
  }, [location]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setLiveSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await getSearchSuggestions(searchQuery, location);
      setLiveSuggestions(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, location]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(location && location !== 'Set your location' ? location : '')}`);
    }
  };

  const defaultSuggestions = [
    { title: "Best Pizza nearby", type: "trending", category: "Food" },
    { title: "Plumbers in San Francisco", type: "recent", category: "Services" },
    { title: "Top rated Clinics", type: "trending", category: "Medical" },
    { title: "Organic Grocery stores", type: "recent", category: "Shopping" },
    { title: "24/7 Electricians", type: "trending", category: "Emergency" },
  ];

  const categories = [
    { name: "Restaurants", icon: "🍕", color: "bg-orange-100" },
    { name: "Healthcare", icon: "🏥", color: "bg-blue-100" },
    { name: "Plumbing", icon: "🔧", color: "bg-indigo-100" },
    { name: "Beauty", icon: "💅", color: "bg-pink-100" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col items-center relative overflow-x-hidden transition-colors duration-500 z-0">
      
      {/* Light hero background matching the image */}
      <div 
        className="absolute top-0 left-0 w-full h-[90vh] md:h-[95vh] bg-cover bg-center bg-no-repeat -z-10 rounded-b-[3rem] md:rounded-b-[4rem] overflow-hidden bg-[url('/banners/banner-mob.png')] md:bg-[url('/banners/banner001.png')]" 
      >
        {/* Very subtle overlay in case background needs blending */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] md:backdrop-blur-none"></div>
      </div>

      <div className="w-full max-w-7xl px-4 md:px-6 relative flex flex-col flex-1">
        <Navbar />
        {/* Search Header Area */}
        <motion.div 
          layout
          transition={{ 
            layout: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.2 }
          }}
          className={`w-full flex flex-col items-center justify-start ${isSearching ? 'pt-32 md:pt-36' : 'pt-32 md:pt-36 pb-20 min-h-[90vh] md:min-h-[95vh]'}`}
        >
          {/* Back button only when searching */}
          <AnimatePresence>
            {isSearching && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setIsSearching(false)}
                className="mb-2 flex items-center gap-2 text-[#111844] font-bold text-sm md:text-base hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                Back to Home
              </motion.button>
            )}
          </AnimatePresence>

          {/* Hero Content */}
          {!isSearching && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center mb-6 md:mb-8 z-10 relative w-full"
            >
              {/* Custom location pin icon at the top */}
              <div className="mb-2">
                <img 
                  src="/icons/location-point-icon-png.webp" 
                  alt="Location Pin" 
                  className="w-8 h-8 md:w-9 md:h-9 object-contain"
                />
              </div>
              
              <h3 className="text-sm md:text-base text-[#1c2331] font-medium mb-3 flex items-center gap-1">
                Welcome to <span className="font-bold text-[#104825]">Nearby Direct</span>
              </h3>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1c2331] mb-4 tracking-tight max-w-3xl leading-[1.1]">
                Find <span className="text-[#104825]">Everything</span><br/>Around You
              </h1>
              
              <p className="text-sm md:text-base text-slate-600 font-medium max-w-[260px] md:max-w-md mb-6 mx-auto">
                Discover local businesses, services, and more –<br className="hidden md:block"/>all in one place.
              </p>
            </motion.div>
          )}

          {/* Search Bar Container */}
          <motion.div 
            layout
            className="relative z-50 w-full max-w-3xl mx-auto px-4 md:px-0"
          >
            <div className={`bg-white shadow-[0_15px_40px_rgba(0,0,0,0.18)] md:shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col md:flex-row overflow-hidden border-2 border-slate-200 md:border md:border-black/10 transition-all duration-500 ${isSearching ? 'rounded-2xl' : 'rounded-3xl md:rounded-full'} p-2 md:p-2.5 items-center`}>
              
              {/* Query Input */}
              <div className="flex-1 flex items-center px-4 md:px-6 py-3 w-full">
                <Search className="text-slate-400 w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 flex-shrink-0" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search for businesses, services, or categories..." 
                  onFocus={() => setIsSearching(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  className="w-full bg-transparent outline-none text-[#1c2331] text-sm md:text-[15px] placeholder:text-slate-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px h-10 bg-slate-200 mx-2"></div>

              {/* Location Input & Button */}
              <div className="flex items-center justify-between w-full md:w-auto px-4 md:px-2 py-3 md:py-0 border-t md:border-t-0 border-slate-100 mt-2 md:mt-0 gap-4 md:gap-6">
                <div 
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center text-slate-500 hover:text-slate-800 cursor-pointer transition-colors px-2 md:px-4 max-w-[120px] md:max-w-[160px]"
                >
                  <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-[15px] whitespace-nowrap truncate">{location || "Near me"}</span>
                </div>
                
                <button 
                  onClick={handleSearchSubmit}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#104825] hover:bg-[#0c361c] flex items-center justify-center text-white flex-shrink-0 transition-colors shadow-lg shadow-[#104825]/20"
                >
                  <Search className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </motion.div>


        </motion.div>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mt-8 flex-1 pb-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {/* Popular Categories */}
                  <div className="order-2 md:order-1">
                    <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4">Popular Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                      {categories.map((cat) => (
                        <motion.div
                          key={cat.name}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className={`w-8 h-8 md:w-10 md:h-10 ${cat.color} rounded-xl flex items-center justify-center text-lg md:text-xl`}>{cat.icon}</span>
                            <span className="font-bold text-slate-700 text-sm md:text-base">{cat.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 hidden md:block" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions List */}
                  <div className="md:col-span-2 order-1 md:order-2">
                    <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4">
                      {searchQuery.length >= 2 ? 'Live Search Results' : 'Quick Suggestions'}
                    </h3>
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                      {searchQuery.length >= 2 ? (
                        liveSuggestions.length > 0 ? (
                          <>
                            {liveSuggestions.map((item, i) => (
                              <motion.div
                                key={item.id}
                                onClick={() => router.push(`/business/${item.username || item.id}`)}
                                whileHover={{ backgroundColor: "#f8fafc" }}
                                whileTap={{ backgroundColor: "#f1f5f9" }}
                                className={`flex items-center justify-between p-3 md:p-4 cursor-pointer ${i !== liveSuggestions.length - 1 ? 'border-b border-slate-50' : ''}`}
                              >
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                    <img src={item.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1c2331&color=fff`} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm md:text-[15px] line-clamp-1">{item.name}</p>
                                    <span className="text-[10px] font-bold text-[#111844] bg-blue-50 px-2 py-0.5 rounded uppercase line-clamp-1">{item.primary_category || item.address_text || 'Business'}</span>
                                  </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-300 flex-shrink-0 ml-2" />
                              </motion.div>
                            ))}
                            <button
                              onClick={handleSearchSubmit}
                              className="w-full text-center py-4 text-sm font-bold text-[#104825] hover:bg-[#104825]/5 transition-colors border-t border-slate-100"
                            >
                              See all results for "{searchQuery}"
                            </button>
                          </>
                        ) : (
                          <div className="p-8 text-center text-slate-500 font-medium">No results found for "{searchQuery}"</div>
                        )
                      ) : (
                        defaultSuggestions.slice(0, 4).map((item, i) => (
                          <motion.div
                            key={i}
                            onClick={() => {
                              setSearchQuery(item.title);
                              setTimeout(() => handleSearchSubmit(), 100);
                            }}
                            whileHover={{ backgroundColor: "#f8fafc" }}
                            whileTap={{ backgroundColor: "#f1f5f9" }}
                            className={`flex items-center justify-between p-3 md:p-4 cursor-pointer ${i !== 3 ? 'border-b border-slate-50' : ''}`}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className={`p-2 rounded-lg ${item.type === 'trending' ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400'}`}>
                                {item.type === 'trending' ? <TrendingUp className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm md:text-[15px]">{item.title}</p>
                                <span className="text-[10px] font-bold text-[#111844] bg-blue-50 px-2 py-0.5 rounded uppercase">{item.category}</span>
                              </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-200" />
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative CTA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 md:mt-12 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-[#111844] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
                >
                  <div className="text-center md:text-left">
                    <h4 className="text-xl md:text-2xl font-black mb-1 md:mb-2">Can't find what you need?</h4>
                    <p className="text-blue-100 text-sm md:text-base opacity-90">Our community is always adding new local gems.</p>
                  </div>
                  <button className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-white text-[#111844] rounded-xl md:rounded-2xl font-black hover:scale-105 transition-all shadow-lg active:scale-95">
                    Suggest a Place
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="home-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <QuickCategories />
                
                {/* Popular Restaurants Section */}
                {homeRestaurants.length > 0 && (
                  <PopularSection title={location && location !== 'Set your location' ? `Popular Restaurants in ${location}` : "Popular Restaurants"} businesses={homeRestaurants} />
                )}
                
                {/* Popular Banks Section */}
                {homeBanks.length > 0 && (
                  <PopularSection title={location && location !== 'Set your location' ? `Top Healthcare near ${location}` : "Popular Healthcare near you"} businesses={homeBanks} />
                )}
                
                {/* Discover Cities Section */}
                <DiscoverCities />

                {/* About Application Section */}
                <AboutSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* FAQ Section */}
      <FAQSection />
      
      <Footer />

      {/* Location Modal */}
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </div>
  );
}
