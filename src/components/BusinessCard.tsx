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
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col w-[300px] flex-shrink-0 snap-start hover:shadow-md transition-shadow relative">
      {/* Cover Photo */}
      <div className="h-[120px] w-full relative bg-slate-100">
        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
      </div>
      
      {/* Profile Row */}
      <div className="relative px-4 flex justify-between items-start h-12">
        {/* Avatar */}
        <div className="absolute -top-10 left-4 w-[76px] h-[76px] rounded-full border-4 border-white bg-black overflow-hidden flex items-center justify-center shadow-sm z-10">
          {logoImage ? (
            <img src={logoImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white font-bold text-3xl">{name.charAt(0)}</div>
          )}
        </div>
        
        {/* Follow Button */}
        <button className="mt-3 ml-auto bg-[#0f1419] text-white text-[15px] font-bold px-5 py-1.5 rounded-full hover:bg-black transition-colors">
          Follow
        </button>
      </div>

      {/* Details */}
      <div className="px-4 pb-6 pt-2">
        <div className="flex items-center gap-1 mt-1">
          <h3 className="font-extrabold text-[#0f1419] text-[20px] leading-tight truncate">{name}</h3>
          {verified && (
            <div className="relative flex items-center justify-center">
              <div className="absolute bg-white w-2.5 h-2.5 rounded-full z-0"></div>
              <BadgeCheck className="w-5 h-5 text-[#1d9bf0] fill-[#1d9bf0] text-white relative z-10" />
            </div>
          )}
        </div>
        <p className="text-slate-500 text-[15px] leading-tight mb-3">@{handle}</p>
        
        <p className="text-[#0f1419] text-[15px] leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
