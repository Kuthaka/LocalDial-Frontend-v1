"use client";

import { ChevronRight } from "lucide-react";

export interface FeaturedPlace {
  id: string | number;
  name: string;
  imageUrl: string;
  features: string[];
  stat1: { value: string | number; label: string };
  stat2: { value: string | number; label: string };
}

interface FeaturedPlacesProps {
  title: string;
  subtitle: string;
  places: FeaturedPlace[];
  theme?: 'dark' | 'light';
}

export default function FeaturedPlaces({ title, subtitle, places, theme = 'dark' }: FeaturedPlacesProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full py-12 md:py-16 px-4 md:px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 relative inline-block ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {title}
            <span className="absolute -bottom-1 left-0 w-16 h-1 bg-orange-400 rounded-full"></span>
          </h2>
          <p className={`text-sm md:text-base mt-2 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{subtitle}</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {places.slice(0, 3).map((place, idx) => (
            <div key={idx} className={`rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl ${
              isDark 
                ? 'bg-[#112d24] border border-[#1b4335] hover:shadow-black/50' 
                : 'bg-white border border-slate-200 hover:shadow-slate-200'
            }`}>
              
              {/* Card Header */}
              <div className={`flex items-center gap-4 p-5 border-b ${isDark ? 'border-[#1b4335]' : 'border-slate-100'}`}>
                <img src={place.imageUrl} alt={place.name} className={`w-12 h-12 rounded-lg object-cover border ${isDark ? 'border-[#2FA084]' : 'border-slate-200'}`} />
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{place.name}</h3>
              </div>

              {/* Links List */}
              <div className="flex flex-col">
                {place.features.map((feature, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className={`flex items-center justify-between py-3 px-5 border-b text-sm transition-colors group ${
                      isDark 
                        ? 'border-[#1b4335] text-slate-300 hover:text-white hover:bg-[#15382d]' 
                        : 'border-slate-100 text-slate-600 hover:text-[#2FA084] hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-4">{feature}</span>
                    <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500 group-hover:text-[#2FA084]' : 'text-slate-400 group-hover:text-[#2FA084]'}`} />
                  </a>
                ))}
              </div>

              {/* Stats & CTA */}
              <div className="mt-auto p-5">
                <div className={`rounded-lg p-4 grid grid-cols-2 gap-4 mb-5 border ${
                  isDark 
                    ? 'bg-[#0f281f] border-[#1b4335]' 
                    : 'bg-slate-50 border-slate-100'
                }`}>
                  <div>
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{place.stat1.value}</div>
                    <div className={`text-[11px] md:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{place.stat1.label}</div>
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{place.stat2.value}</div>
                    <div className={`text-[11px] md:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{place.stat2.label}</div>
                  </div>
                </div>
                
                <button className={`bg-transparent border font-bold text-sm px-6 py-2 rounded transition-colors w-full md:w-auto ${
                  isDark 
                    ? 'border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white' 
                    : 'border-[#2FA084] text-[#2FA084] hover:bg-[#2FA084] hover:text-white'
                }`}>
                  Enquire Now
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
