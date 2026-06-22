import { useState } from "react";
import { Link } from "react-router-dom";

const ReachMoreCustomers = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="w-full bg-[#fdf0eb]">
      <div className="container mx-auto flex flex-col md:flex-row items-center py-14  px-4 sm:px-8 md:px-12  gap-14">
        {/* ===== Left Content ===== */}
        <div className="w-full text-center md:text-left">
          <h2 className="text-xl sm:text-4xl  text-start  font-bold text-gray-900 leading-tight mb-4 font-[Poppins]">
            Reach More Customers
          
            by Listing Your Services
            
            or Events
          </h2>
          <p className="text-base md:text-lg text-[#373737] text-start  leading-relaxed mb-7 max-w-2xl mx-auto md:mx-0">
            Showcase your services or events to a wider audience and attract the
            right customers quickly. By listing on our platform, you can
            increase your visibility, grow your reach, and connect with users
            actively looking for what you offer.
          </p>
          <Link to="/profile">
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`px-8 py-3 rounded text-white text-base font-semibold  ${
                hovered ? "bg-[#d46a2a]" : "bg-[#d46a2a]"
              } shadow-lg`}
            >
              Post Ad
            </button>
          </Link>
        </div>

  <div className="w-full flex justify-center py-6 sm:py-10 overflow-hidden">
  <div className="relative w-full max-w-[320px] h-75 sm:max-w-112.5 sm:h-100 md:max-w-[600px] md:h-[500px] lg:max-w-[750px]">
    
    {/* Image 1 (Event Hall - Back Left) */}
    <div className="absolute top-0 left-0 w-[70%] h-[60%] rounded-sm overflow-hidden shadow-md z-10">
      <img
        src="/Categories/Event-hall.jpg"
        alt="Event hall"
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>

  
    <div className="absolute top-[15%] right-0 w-[55%] h-[50%] rounded-sm overflow-hidden shadow-lg border-[3px] sm:border-4 border-white z-30">
      <img
        src="/Categories/Craftsman.png"
        alt="Craftsman"
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>

    {/* Image 3 (Tech Workspace - Bottom Center/Left) */}
    <div className="absolute bottom-0 left-[10%] w-[65%] h-[55%] rounded-sm overflow-hidden shadow-2xl border-[3px] sm:border-4 border-white z-20">
      <img
        src="/Categories/Tech-workspace.png"
        alt="Tech workspace with wires"
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
</div>
      </div>
    </section>
  );
};

export default ReachMoreCustomers;
