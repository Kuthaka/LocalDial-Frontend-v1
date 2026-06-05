"use client";

import { motion } from "framer-motion";

const majorCities = [
  // Kerala Cities (First)
  { name: "Malappuram", imageUrl: "https://picsum.photos/seed/malappuram/500/500" },
  { name: "Perinthalmanna", imageUrl: "https://picsum.photos/seed/perinthalmanna/500/500" },
  { name: "Kochi", imageUrl: "https://picsum.photos/seed/kochi/500/500" },
  { name: "Trivandrum", imageUrl: "https://picsum.photos/seed/trivandrum/500/500" },
  { name: "Kozhikode", imageUrl: "https://picsum.photos/seed/kozhikode/500/500" },
  { name: "Thrissur", imageUrl: "https://picsum.photos/seed/thrissur/500/500" },
  { name: "Alappuzha", imageUrl: "https://picsum.photos/seed/alappuzha/500/500" },
  { name: "Wayanad", imageUrl: "https://picsum.photos/seed/wayanad/500/500" },
  { name: "Palakkad", imageUrl: "https://picsum.photos/seed/palakkad/500/500" },
  { name: "Kannur", imageUrl: "https://picsum.photos/seed/kannur/500/500" },
  { name: "Kottayam", imageUrl: "https://picsum.photos/seed/kottayam/500/500" },
  
  // Major Metro Cities
  { name: "Bangalore", imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80" },
  { name: "Chennai", imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&q=80" },
  { name: "Delhi", imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80" },
];

export default function DiscoverCities() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-8 mb-16">
      <div className="mb-6 border-b border-slate-200 pb-2">
        <h2 className="text-2xl font-black text-slate-900 mb-1 inline-block relative">
          Discover Major Cities
          <span className="absolute -bottom-[9px] left-0 w-16 h-[3px] bg-orange-400 rounded-full"></span>
        </h2>
        <p className="text-sm text-slate-500 mt-2">Top Cities</p>
      </div>

      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {majorCities.map((city, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center gap-3 shrink-0 snap-start cursor-pointer group"
          >
            <div className="w-24 h-24 md:w-32 md:h-28 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <img 
                src={city.imageUrl} 
                alt={city.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <span className="text-sm md:text-base font-bold text-slate-700 group-hover:text-[#111844] transition-colors">{city.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
