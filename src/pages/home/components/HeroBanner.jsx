import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


const CTAButton = ({ children, variant = "outline" }) => {
  const base =
    "inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm md:text-base transition-all duration-200 cursor-pointer whitespace-nowrap";

  if (variant === "primary") {
    return (
      <Link to={"/profile"} className={`${base} bg-[#E97C35]  text-white`}>
        {children}
        <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shrink-0 text-black">
          <ArrowRight size={14} strokeWidth={2.5} />
        </span>
      </Link>
    );
  }

  return (
    <Link to={"/services"} className={`${base} bg-transparent border border-white/40 hover:border-white/70 text-white`}>
      {children}
      <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/40 flex items-center justify-center shrink-0">
        <ArrowRight size={14} strokeWidth={2.5} />
      </span>
    </Link>
  );
};

export default function HeroBanner() {
  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8  py-14 md:pb-20">
      <div
        className="relative w-full max-w-5xl rounded-xl sm:rounded-2xl overflow-hidden bg-[url('/Categories/Discovered.png')] bg-center bg-cover"
        style={{ minHeight: "200px" }}
      >
        {/* Semi-transparent overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-5" />

        <div className="relative z-10 px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-12 max-w-full sm:max-w-2xl">
          <h1 className="text-white font-bold text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight mb-3 md:mb-4">
            Get Discovered by Local Customers Today
          </h1>
          <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed mb-6 md:mb-7">
            Join our growing marketplace and showcase your services to people who are already looking for them.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-fit">
            <CTAButton variant="primary" className="bg-white">Create Your Listing</CTAButton>
            <CTAButton variant="outline">Browse Services</CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}