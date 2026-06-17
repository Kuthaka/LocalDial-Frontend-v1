import { BadgeCheck, MapPin } from 'lucide-react';

interface BusinessCardProps {
  coverImage: string;
  logoImage?: string;
  name: string;
  handle: string;
  description: string;
  verified?: boolean;
  distance?: number;
}

export default function BusinessCard({ 
  coverImage, 
  logoImage, 
  name, 
  handle, 
  description,
  verified = true,
  distance
}: BusinessCardProps) {
  return (
    <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm overflow-hidden flex flex-col w-[240px] flex-shrink-0 snap-start hover:shadow-md transition-shadow relative">
      {/* Cover Photo */}
      <div className="h-[90px] w-full relative bg-slate-100">
        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
      </div>
      
      {/* Profile Row */}
      <div className="relative px-3 flex justify-between items-start h-8">
        {/* Avatar */}
        <div className="absolute -top-7 left-3 w-[56px] h-[56px] rounded-full border-[3px] border-white bg-black overflow-hidden flex items-center justify-center shadow-sm z-10">
          {logoImage ? (
            <img src={logoImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white font-bold text-xl">{name.charAt(0)}</div>
          )}
        </div>
        
        {/* View Profile Button */}
        <button className="mt-2 ml-auto bg-[#0f1419] text-white text-[11px] font-bold px-2.5 py-1 rounded-full hover:bg-black transition-colors shadow-sm">
          View Profile
        </button>
      </div>

      {/* Details */}
      <div className="px-3 pb-4 pt-1">
        <div className="flex items-center gap-1 mt-1">
          <h3 className="font-extrabold text-[#0f1419] text-[16px] leading-tight truncate">{name}</h3>
          {verified && (
            <div className="relative flex items-center justify-center">
              <div className="absolute bg-white w-1.5 h-1.5 rounded-full z-0"></div>
              <BadgeCheck className="w-3.5 h-3.5 text-[#1d9bf0] fill-[#1d9bf0] text-white relative z-10" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-slate-500 text-[12px] leading-tight truncate">@{handle}</p>
          {distance !== undefined && distance !== 999 && (
            <div className="flex items-center gap-0.5 text-[#104825] bg-green-50 px-1 rounded text-[10px] font-bold">
              <MapPin className="w-2.5 h-2.5" /> {distance.toFixed(1)} km
            </div>
          )}
        </div>
        
        <p className="text-[#0f1419] text-[12px] leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
