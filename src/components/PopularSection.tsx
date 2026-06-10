import BusinessCard from './BusinessCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PopularSectionProps {
  title: string;
  businesses: any[];
}

export default function PopularSection({ title, businesses }: PopularSectionProps) {
  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4 md:px-0 relative z-10">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl md:text-2xl font-black text-[#1c2331] tracking-tight">{title}</h2>
        <button className="text-[#104825] font-bold text-sm hover:underline flex items-center pb-0.5">
          See all <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>
      
      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 pt-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {businesses.map((biz, i) => (
          biz.href ? (
            <Link href={biz.href} key={i} className="block hover:scale-[1.02] transition-transform duration-300">
              <BusinessCard {...biz} />
            </Link>
          ) : (
            <BusinessCard key={i} {...biz} />
          )
        ))}
      </div>
    </div>
  );
}
