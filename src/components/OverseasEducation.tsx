"use client";

import { ChevronRight } from "lucide-react";

const destinations = [
  {
    country: "UK",
    title: "Study Abroad - UK",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=100&q=80",
    links: [
      "Why Study in UK?",
      "Top Universities in the UK for Indian Students",
      "Popular Courses to Study in the UK",
      "Top Scholarships for Indian Students"
    ],
    stats: {
      colleges: "420",
      cost: "₹ 20 L / Year"
    }
  },
  {
    country: "USA",
    title: "Study Abroad - USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=100&q=80",
    links: [
      "Why Study in USA?",
      "Top Universities in the USA for Indian Students",
      "Popular Courses to Study in the USA",
      "Top Scholarships for Indian Students"
    ],
    stats: {
      colleges: "3883",
      cost: "₹ 19.70 L / Year"
    }
  },
  {
    country: "Australia",
    title: "Study Abroad - Australia",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=100&q=80",
    links: [
      "Why Study in Australia?",
      "Top Universities in the Australia for Indian Stude...",
      "Popular Courses to Study in the Australia",
      "Top Scholarships for Indian Students"
    ],
    stats: {
      colleges: "175",
      cost: "₹ 23 L / Year"
    }
  }
];

export default function OverseasEducation() {
  return (
    <div className="w-full bg-[#0a1f18] py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 relative inline-block">
            Overseas Education
            <span className="absolute -bottom-1 left-0 w-16 h-1 bg-orange-400 rounded-full"></span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-2">Unlocking Global Opportunities, One Destination at a Time</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <div key={idx} className="bg-[#112d24] rounded-xl overflow-hidden border border-[#1b4335] flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/50">
              
              {/* Card Header */}
              <div className="flex items-center gap-4 p-5 border-b border-[#1b4335]">
                <img src={dest.image} alt={dest.country} className="w-12 h-12 rounded-lg object-cover border border-[#2FA084]" />
                <h3 className="text-lg font-bold text-white">{dest.title}</h3>
              </div>

              {/* Links List */}
              <div className="flex flex-col">
                {dest.links.map((link, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="flex items-center justify-between py-3 px-5 border-b border-[#1b4335] text-sm text-slate-300 hover:text-white hover:bg-[#15382d] transition-colors group"
                  >
                    <span className="truncate pr-4">{link}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#2FA084]" />
                  </a>
                ))}
              </div>

              {/* Stats & CTA */}
              <div className="mt-auto p-5">
                <div className="bg-[#0f281f] rounded-lg p-4 grid grid-cols-2 gap-4 mb-5 border border-[#1b4335]">
                  <div>
                    <div className="text-white font-bold text-sm">{dest.stats.colleges}</div>
                    <div className="text-slate-400 text-[11px] md:text-xs">No. Of Colleges</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{dest.stats.cost}</div>
                    <div className="text-slate-400 text-[11px] md:text-xs">Avg. Study Cost</div>
                  </div>
                </div>
                
                <button className="bg-transparent border border-orange-400 text-orange-400 font-bold text-sm px-6 py-2 rounded hover:bg-orange-400 hover:text-white transition-colors">
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
