"use client";

import { Star } from "lucide-react";

export default function AboutSection() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 mb-16">
      <div className="w-full bg-[#c3f2d1] rounded-[2rem] p-8 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        
        {/* Left Content */}
        <div className="flex-1 text-[#001108]">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">We're Nearby Direct</h2>
          <p className="text-base md:text-lg font-medium mb-8 leading-relaxed opacity-90">
            We're a review platform that's open to everyone. Our vision is to become the universal symbol of trust — by empowering people to shop with confidence, and helping businesses improve.
          </p>
          <button className="px-6 py-3 bg-[#001108] text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg active:scale-95">
            What we do
          </button>
        </div>

        {/* Right Card */}
        <div className="flex-[1.2] w-full bg-[#004122] rounded-[1.5rem] p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-xl">
          <div className="flex-1 text-white z-10 relative">
            <h3 className="text-xl md:text-2xl font-black mb-2 leading-tight">Our new Trust Report has landed!</h3>
            <p className="text-sm md:text-base font-medium opacity-90 mb-6 leading-relaxed">
              Find out which actions we've taken to protect you and promote trust on our platform.
            </p>
            <button className="px-6 py-2.5 bg-transparent border-2 border-white/80 text-white rounded-full font-bold text-sm hover:bg-white/10 transition-colors active:scale-95">
              Take a look
            </button>
          </div>
          
          {/* Decorative Elements */}
          <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 relative z-10 hidden sm:block mr-2 md:mr-4">
            {/* Top Right Circle (Green border) */}
            <div className="absolute right-0 top-2 w-20 h-20 md:w-24 md:h-24 rounded-full border-[5px] md:border-[6px] border-[#00c97e] overflow-hidden bg-white z-10 shadow-lg">
              <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=200&q=80" alt="People" className="w-full h-full object-cover" />
            </div>
            {/* Bottom Left Circle (White border) */}
            <div className="absolute left-2 bottom-6 w-24 h-24 md:w-28 md:h-28 rounded-full border-[5px] md:border-[6px] border-[#f3f4f6] overflow-hidden bg-white z-20 shadow-xl">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&q=80" alt="Team" className="w-full h-full object-cover" />
            </div>
            {/* Star Icon overlapping the bottom circle */}
            <div className="absolute right-12 bottom-[4.5rem] md:right-16 md:bottom-20 w-4 h-4 z-30 flex items-center justify-center">
              <Star className="w-4 h-4 text-[#00c97e] fill-[#00c97e] drop-shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
