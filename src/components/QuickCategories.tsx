"use client";

import { Utensils, Home as HomeIcon, Car, Stethoscope, Wrench, ShoppingBag, Scissors, GraduationCap, Coffee, Briefcase } from "lucide-react";

const quickCategories = [
  { name: "Restaurants", icon: <Utensils className="w-6 h-6" /> },
  { name: "Real Estate", icon: <HomeIcon className="w-6 h-6" /> },
  { name: "Automotive", icon: <Car className="w-6 h-6" /> },
  { name: "Health & Medical", icon: <Stethoscope className="w-6 h-6" /> },
  { name: "Home Services", icon: <Wrench className="w-6 h-6" /> },
  { name: "Shopping", icon: <ShoppingBag className="w-6 h-6" /> },
  { name: "Beauty & Spa", icon: <Scissors className="w-6 h-6" /> },
  { name: "Education", icon: <GraduationCap className="w-6 h-6" /> },
  { name: "Nightlife", icon: <Coffee className="w-6 h-6" /> },
  { name: "Financial", icon: <Briefcase className="w-6 h-6" /> },
];

export default function QuickCategories() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-6 md:mt-12 mb-4 md:mb-8 px-4 md:px-0 relative z-20">
      <h2 className="text-xl md:text-2xl font-black text-[#1c2331] mb-5 tracking-tight">What are you looking for?</h2>
      
      <div className="flex overflow-x-auto pb-4 gap-4 md:gap-5 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {quickCategories.map((category, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center justify-center min-w-[100px] md:min-w-[110px] bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer snap-start group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-50 flex items-center justify-center text-black mb-3 group-hover:bg-slate-100 transition-colors border border-slate-100">
              {category.icon}
            </div>
            <span className="text-xs md:text-sm font-bold text-slate-800 text-center leading-tight">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
