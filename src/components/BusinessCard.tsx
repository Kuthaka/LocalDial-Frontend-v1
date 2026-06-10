import { BadgeCheck } from 'lucide-react';

interface BusinessCardProps {
  coverImage: string;
  logoImage?: string;
  name: string;
  handle: string;
  description: string;
  verified?: boolean;
}

export default function BusinessCard({ 
  coverImage, 
  logoImage, 
  name, 
  handle, 
  description,
  verified = true 
}: BusinessCardProps) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden flex flex-col w-[270px] flex-shrink-0 snap-start hover:shadow-md transition-shadow relative">
      {/* Cover Photo */}
      <div className="h-[100px] w-full relative bg-slate-100">
        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
      </div>
      
      {/* Profile Row */}
      <div className="relative px-3 flex justify-between items-start h-10">
        {/* Avatar */}
        <div className="absolute -top-8 left-3 w-[64px] h-[64px] rounded-full border-[3px] border-white bg-black overflow-hidden flex items-center justify-center shadow-sm z-10">
          {logoImage ? (
            <img src={logoImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white font-bold text-2xl">{name.charAt(0)}</div>
          )}
        </div>
        
        {/* View Profile Button */}
        <button className="mt-2.5 ml-auto bg-[#0f1419] text-white text-[12px] font-bold px-3 py-1 rounded-full hover:bg-black transition-colors shadow-sm">
          View Profile
        </button>
      </div>

      {/* Details */}
      <div className="px-3 pb-5 pt-2">
        <div className="flex items-center gap-1 mt-1">
          <h3 className="font-extrabold text-[#0f1419] text-[18px] leading-tight truncate">{name}</h3>
          {verified && (
            <div className="relative flex items-center justify-center">
              <div className="absolute bg-white w-2 h-2 rounded-full z-0"></div>
              <BadgeCheck className="w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] text-white relative z-10" />
            </div>
          )}
        </div>
        <p className="text-slate-500 text-[13px] leading-tight mb-2">@{handle}</p>
        
        <p className="text-[#0f1419] text-[13px] leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
