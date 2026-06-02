"use client";

import { 
  Landmark, 
  Armchair, 
  Gem, 
  Shirt, 
  Laptop, 
  Dumbbell, 
  ShoppingBag, 
  Sparkles,
  ChevronRight
} from "lucide-react";

const categories = [
  { name: "Bank", icon: Landmark },
  { name: "Furniture", icon: Armchair },
  { name: "Jewelry", icon: Gem },
  { name: "Clothing", icon: Shirt },
  { name: "Electronics", icon: Laptop },
  { name: "Fitness", icon: Dumbbell },
  { name: "Shoe Store", icon: ShoppingBag },
  { name: "Cosmetics", icon: Sparkles },
];

export default function CategorySection() {
  return (
    <div className="w-full mt-4 md:mt-8 mb-20 flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-black text-[#2C3947] mb-8 md:mb-10 text-center tracking-tight">
        What are you looking for?
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl mx-auto px-4">
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-slate-50 text-[#111844] rounded-full flex items-center justify-center group-hover:bg-[#111844] group-hover:text-white transition-colors">
              <cat.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-bold text-slate-700 text-sm md:text-base text-center">{cat.name}</span>
          </div>
        ))}
      </div>
      
      <button className="mt-10 px-6 py-2.5 bg-transparent border-2 border-slate-300 text-slate-600 font-bold rounded-full hover:border-[#2C3947] hover:text-[#2C3947] transition-colors flex items-center gap-2">
        See more <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
