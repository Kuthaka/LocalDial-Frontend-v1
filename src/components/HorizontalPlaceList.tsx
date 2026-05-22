"use client";

import Link from "next/link";
import { ChevronRight, Star, MapPin } from "lucide-react";

export interface Place {
  id: string | number;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  distance: string;
  imageUrl: string;
}

interface HorizontalPlaceListProps {
  title: string;
  places: Place[];
}

export default function HorizontalPlaceList({ title, places }: HorizontalPlaceListProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-16">
      <div className="flex justify-between items-end mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-black text-[#2C3947] tracking-tight">{title}</h2>
        <a href="#" className="text-[#2FA084] text-xs md:text-sm font-bold flex items-center gap-0.5 hover:underline whitespace-nowrap">
          See more <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </a>
      </div>
      
      <div className="flex overflow-x-auto gap-4 md:gap-5 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {places.map((place) => (
          <Link 
            href={`/business/${place.id}`}
            key={place.id} 
            className="snap-start shrink-0 w-[240px] md:w-[280px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-full h-32 md:h-40 bg-slate-200 overflow-hidden relative">
              <img 
                src={place.imageUrl} 
                alt={place.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-800">{place.rating}</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-black text-slate-800 text-base md:text-lg mb-1 truncate">{place.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{place.reviews} reviews</p>
              
              <div className="flex items-start gap-1.5 mt-auto text-slate-500">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                <span className="text-xs md:text-sm line-clamp-2 leading-tight">{place.address}</span>
              </div>
              <div className="text-xs font-bold text-[#2FA084] mt-3 bg-emerald-50 border border-emerald-100 w-fit px-2.5 py-1 rounded-md">
                {place.distance}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
