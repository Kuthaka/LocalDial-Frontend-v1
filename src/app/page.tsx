"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Phone, ArrowLeft, Clock, TrendingUp, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/Navbar";
import ReviewDivider from "@/components/ReviewDivider";
import CategorySection from "@/components/CategorySection";
import HorizontalPlaceList from "@/components/HorizontalPlaceList";
import AboutSection from "@/components/AboutSection";

const nearbyBanks = [
  { id: 1, name: "Chase Bank", rating: 4.5, reviews: 128, address: "123 Market St, San Francisco", distance: "0.2 miles", imageUrl: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500&q=80" },
  { id: 2, name: "Bank of America", rating: 4.2, reviews: 85, address: "456 Montgomery St, San Francisco", distance: "0.4 miles", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80" },
  { id: 3, name: "Wells Fargo", rating: 3.9, reviews: 210, address: "789 Mission St, San Francisco", distance: "0.6 miles", imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=500&q=80" },
  { id: 4, name: "Citibank", rating: 4.1, reviews: 94, address: "101 California St, San Francisco", distance: "0.8 miles", imageUrl: "https://images.unsplash.com/photo-1541354329998-f4d9a9f929d4?w=500&q=80" },
  { id: 5, name: "Capital One Cafe", rating: 4.7, reviews: 320, address: "111 Post St, San Francisco", distance: "0.9 miles", imageUrl: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=500&q=80" }
];

const nearbyParlours = [
  { id: 1, name: "Glow Beauty Bar", rating: 4.9, reviews: 342, address: "202 Union St, San Francisco", distance: "0.3 miles", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80" },
  { id: 2, name: "The Glamour Lounge", rating: 4.6, reviews: 156, address: "303 Columbus Ave, San Francisco", distance: "0.5 miles", imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80" },
  { id: 3, name: "Lush Salon & Spa", rating: 4.8, reviews: 289, address: "404 Broadway, San Francisco", distance: "0.7 miles", imageUrl: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=500&q=80" },
  { id: 4, name: "Radiance Parlour", rating: 4.4, reviews: 112, address: "505 Kearny St, San Francisco", distance: "1.0 miles", imageUrl: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80" },
  { id: 5, name: "Urban Edge Hair", rating: 4.7, reviews: 201, address: "606 Washington St, San Francisco", distance: "1.2 miles", imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&q=80" }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    { title: "Best Pizza nearby", type: "trending", category: "Food" },
    { title: "Plumbers in San Francisco", type: "recent", category: "Services" },
    { title: "Top rated Clinics", type: "trending", category: "Medical" },
    { title: "Organic Grocery stores", type: "recent", category: "Shopping" },
    { title: "24/7 Electricians", type: "trending", category: "Emergency" },
  ];

  const categories = [
    { name: "Restaurants", icon: "🍕", color: "bg-orange-100" },
    { name: "Healthcare", icon: "🏥", color: "bg-blue-100" },
    { name: "Plumbing", icon: "🔧", color: "bg-emerald-100" },
    { name: "Beauty", icon: "💅", color: "bg-pink-100" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#EEEEEE] flex flex-col items-center relative overflow-x-hidden transition-colors duration-500">
      
      {/* Decorative background elements */}
      <motion.div 
        animate={{ 
          opacity: isSearching ? 0.05 : 0.4,
          scale: isSearching ? 1.4 : 1 
        }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 -z-10"
      >
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#6FCF97] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#2FA084] rounded-full blur-[120px]" />
      </motion.div>

      <div className="w-full max-w-5xl px-4 md:px-6 relative flex flex-col flex-1">
        <Navbar />
        {/* Search Header Area */}
        <motion.div 
          layout
          transition={{ 
            layout: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { duration: 0.2 }
          }}
          className={`w-full flex flex-col ${isSearching ? 'pt-16 md:pt-20' : 'pt-20 md:pt-32'}`}
        >
          {/* Back button only when searching */}
          <AnimatePresence>
            {isSearching && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setIsSearching(false)}
                className="mb-2 flex items-center gap-2 text-[#1F6F5F] font-bold text-sm md:text-base hover:gap-3 transition-all"
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
              className="text-center mb-8 md:mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-[#2C3947] mb-4 tracking-tighter leading-[0.9] md:leading-[0.85]">
                Find what you need, <br />
                <span className="text-[#2FA084]">right in your city.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-700 max-w-2xl mx-auto font-medium px-2">
                Discover over 50,000 verified local businesses, from hidden gems to essential services.
              </p>
            </motion.div>
          )}

          {/* Search Bar Container */}
          <motion.div 
            layout
            className="relative z-50 w-full"
          >
            <div className={`p-1.5 md:p-3 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col md:flex-row gap-0.5 md:gap-2 border border-slate-200 transition-all duration-500 ${isSearching ? 'rounded-xl' : 'rounded-2xl md:rounded-[2.5rem]'}`}>
              {/* Query Input */}
              <div className="flex-[1.5] flex items-center px-4 md:px-6 gap-3 md:gap-4 py-1">
                <Search className="text-[#2FA084] w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Looking for..." 
                  onFocus={() => setIsSearching(true)}
                  className="w-full py-3 md:py-5 bg-transparent outline-none text-slate-900 text-base md:text-lg placeholder:text-slate-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Divider for Mobile (visible only on small screens) */}
              <div className="md:hidden mx-4 h-[1px] bg-slate-100" />
              
              {/* Divider for Desktop */}
              <div className="hidden md:block w-[1px] h-10 bg-slate-200 self-center" />
              
              {/* Location Input */}
              <div className="flex-1 flex items-center px-4 md:px-6 gap-3 md:gap-4 py-1">
                <MapPin className="text-[#6FCF97] w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="San Francisco, CA" 
                  className="w-full py-3 md:py-5 bg-transparent outline-none text-slate-900 text-base md:text-lg placeholder:text-slate-400 font-medium"
                />
              </div>
              
              <button className="bg-[#2FA084] text-white px-6 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-[2rem] font-black text-base md:text-lg hover:bg-[#1F6F5F] transition-all shadow-lg active:scale-[0.98] mt-2 md:mt-0">
                Search
              </button>
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
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Popular Categories</h3>
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
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Suggestions</h3>
                    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                      {suggestions.map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ backgroundColor: "#f8fafc" }}
                          whileTap={{ backgroundColor: "#f1f5f9" }}
                          className={`flex items-center justify-between p-4 md:p-5 cursor-pointer ${i !== suggestions.length - 1 ? 'border-b border-slate-50' : ''}`}
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className={`p-2 rounded-lg ${item.type === 'trending' ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400'}`}>
                              {item.type === 'trending' ? <TrendingUp className="w-4 h-4 md:w-5 md:h-5" /> : <Clock className="w-4 h-4 md:w-5 md:h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm md:text-base">{item.title}</p>
                              <span className="text-[10px] md:text-xs font-bold text-[#2FA084] bg-emerald-50 px-2 py-0.5 rounded uppercase">{item.category}</span>
                            </div>
                          </div>
                          <Star className="w-4 h-4 text-slate-200 hover:text-amber-400 transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative CTA */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 md:mt-12 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-r from-[#2FA084] to-[#1F6F5F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
                >
                  <div className="text-center md:text-left">
                    <h4 className="text-xl md:text-2xl font-black mb-1 md:mb-2">Can't find what you need?</h4>
                    <p className="text-emerald-50 text-sm md:text-base opacity-90">Our community is always adding new local gems.</p>
                  </div>
                  <button className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-white text-[#2FA084] rounded-xl md:rounded-2xl font-black hover:scale-105 transition-all shadow-lg active:scale-95">
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
                <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3 px-4">
                  {['Restaurants', 'Plumbers', 'Clinics', 'Groceries', 'Electricians'].map((tag) => (
                    <motion.span 
                      key={tag} 
                      whileHover={{ scale: 1.05, backgroundColor: "#6FCF9744" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery(tag);
                        setIsSearching(true);
                      }}
                      className="px-3 md:px-5 py-2 md:py-2.5 bg-[#6FCF97]/20 text-[#1F6F5F] rounded-full text-xs md:text-sm font-bold border border-[#6FCF97]/30 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                
                {/* Horizontal rule with Review CTA */}
                <ReviewDivider />
                
                {/* Categories Grid */}
                <CategorySection />

                {/* Horizontal Place Lists */}
                <HorizontalPlaceList title="Nearby Banks" places={nearbyBanks} />
                <HorizontalPlaceList title="Nearby Beauty Parlours" places={nearbyParlours} />

                {/* About Application Section */}
                <AboutSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
