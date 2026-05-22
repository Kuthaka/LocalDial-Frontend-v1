"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Globe, 
  Share2, 
  Heart, 
  CheckCircle2, 
  MessageSquare,
  ChevronRight,
  Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data fetching function based on ID
const getBusinessDetails = (id: string) => {
  return {
    id,
    name: "Chase Bank & Financial Services",
    category: "Banking & Finance",
    rating: 4.8,
    reviews: 1248,
    status: "Open Now",
    closingTime: "6:00 PM",
    address: "123 Market St, San Francisco, CA 94105",
    phone: "+1 (555) 123-4567",
    website: "www.chase.com",
    about: "We provide comprehensive financial services tailored to your needs. From personal banking and wealth management to business loans and investment strategies, our experienced team is here to guide you toward financial success. We pride ourselves on exceptional customer service and innovative digital banking solutions.",
    images: [
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=1200&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      "https://images.unsplash.com/photo-1541354329998-f4d9a9f929d4?w=800&q=80",
      "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800&q=80",
    ],
    features: ["Wheelchair Accessible", "ATM Inside", "Drive-Thru", "Free Wi-Fi", "Parking Available"],
    workingHours: [
      { day: "Monday", hours: "9:00 AM - 6:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
      { day: "Friday", hours: "9:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    reviewsList: [
      { id: 1, user: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=1", rating: 5, date: "2 days ago", text: "Excellent customer service! The staff was incredibly helpful when I was setting up my new business account. Highly recommend." },
      { id: 2, user: "Michael Chen", avatar: "https://i.pravatar.cc/150?u=2", rating: 4, date: "1 week ago", text: "Very clean and modern branch. The ATM lines can get a bit long during lunch hour, but otherwise great experience." },
      { id: 3, user: "Emily Rodriguez", avatar: "https://i.pravatar.cc/150?u=3", rating: 5, date: "3 weeks ago", text: "I've been banking here for years. The personal attention they give to their clients is unmatched in the area." }
    ]
  };
};

export default function BusinessDetails() {
  const params = useParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Use id from params, fallback to "1" for preview
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "1";
  const business = getBusinessDetails(id);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      {/* Spacer for Navbar */}
      <div className="pt-20 md:pt-24" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pb-20">
        
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center gap-4 py-4 md:py-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#2FA084] transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="hover:text-[#2FA084] cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-[#2FA084] cursor-pointer">{business.category}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-800 truncate max-w-[150px] sm:max-w-none">{business.name}</span>
          </div>
        </div>

        {/* Hero Image Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 h-[300px] md:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden mb-8 md:mb-10 shadow-lg">
          <div className="md:col-span-2 h-full relative group">
            <img src={business.images[0]} alt="Main view" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2 md:gap-3 h-full">
            <div className="h-full relative group overflow-hidden">
              <img src={business.images[1]} alt="Interior view 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="h-full relative group overflow-hidden">
              <img src={business.images[2]} alt="Interior view 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div className="hidden md:block h-full relative group overflow-hidden cursor-pointer">
            <img src={business.images[3]} alt="Exterior view" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
              <span className="text-white font-bold text-lg border-2 border-white/80 rounded-xl px-4 py-2 backdrop-blur-sm">View all photos</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Left Column: Main Content */}
          <div className="flex-1">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-emerald-100 text-[#1F6F5F] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {business.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {business.status}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-[#2C3947] tracking-tight mb-3">
                  {business.name}
                </h1>
                <div className="flex items-center gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-800">{business.rating}</span>
                    <span className="text-slate-500">({business.reviews} reviews)</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-slate-500 font-medium">{business.address.split(',')[1].trim()}</span>
                </div>
              </div>
              
              <div className="flex gap-2 self-start">
                <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#2FA084] transition-all shadow-sm">
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all shadow-sm ${isFavorite ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            </div>

            <hr className="border-slate-200 mb-8" />

            {/* About Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-[#2FA084]" />
                About Business
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                {business.about}
              </p>
            </section>

            {/* Features */}
            <section className="mb-10">
              <h2 className="text-2xl font-black text-slate-800 mb-5">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {business.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#2FA084]" />
                    <span className="font-bold text-slate-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200 mb-10" />

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[#2FA084]" />
                  Customer Reviews
                </h2>
                <button className="text-[#2FA084] font-bold text-sm hover:underline">Write a Review</button>
              </div>
              
              <div className="space-y-6">
                {business.reviewsList.map((review) => (
                  <div key={review.id} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <h4 className="font-bold text-slate-800">{review.user}</h4>
                          <span className="text-xs text-slate-500 font-medium">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">"{review.text}"</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-700 hover:border-slate-200 hover:bg-slate-50 transition-all">
                Load More Reviews
              </button>
            </section>
          </div>

          {/* Right Column: Sticky Sidebar Info */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              
              {/* Action Card */}
              <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                <button className="w-full bg-[#2FA084] hover:bg-[#1F6F5F] text-white py-4 rounded-xl font-black text-lg mb-3 shadow-lg shadow-[#2FA084]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </button>
                <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#1F6F5F] py-4 rounded-xl font-bold text-lg mb-6 transition-all flex items-center justify-center gap-2 border border-emerald-100">
                  <MapPin className="w-5 h-5" />
                  Get Directions
                </button>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-[#2FA084]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                      <p className="font-bold text-slate-800 leading-snug">{business.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-[#2FA084]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                      <p className="font-bold text-slate-800">{business.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-[#2FA084]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Website</p>
                      <a href={`https://${business.website}`} target="_blank" rel="noreferrer" className="font-bold text-[#2FA084] hover:underline">
                        {business.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white rounded-[2rem] p-6 shadow-md border border-slate-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">Working Hours</h3>
                </div>
                
                <div className="space-y-3">
                  {business.workingHours.map((schedule, idx) => {
                    const isToday = schedule.day === "Wednesday"; // Mock current day
                    return (
                      <div key={idx} className={`flex justify-between items-center p-2 rounded-lg ${isToday ? 'bg-emerald-50 border border-emerald-100' : ''}`}>
                        <span className={`font-medium ${isToday ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                          {schedule.day} {isToday && <span className="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Today</span>}
                        </span>
                        <span className={`font-bold ${schedule.hours === 'Closed' ? 'text-red-500' : (isToday ? 'text-emerald-700' : 'text-slate-800')}`}>
                          {schedule.hours}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
