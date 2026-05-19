"use client";

import { ArrowRight } from "lucide-react";

export default function ReviewDivider() {
  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10 md:mt-12 mb-8 flex items-center justify-center">
      <div className="absolute w-full h-[1px] bg-slate-300/70"></div>
      <div className="relative z-10 bg-[#EEEEEE] px-4">
        <button className="bg-white border border-slate-300 rounded-full px-5 py-2 md:px-6 md:py-2.5 text-xs md:text-sm text-slate-700 shadow-sm hover:shadow transition-all flex items-center gap-1.5 md:gap-2 cursor-pointer">
          <span>Bought something recently?</span>
          <span className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
            Write a review <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
