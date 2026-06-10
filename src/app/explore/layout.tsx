import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8]">
      <Navbar />
      <div className="pt-24 md:pt-[104px] flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
