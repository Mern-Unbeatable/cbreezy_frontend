import {  MapPin, ShieldOff, DollarSign, ChartNoAxesCombined, Handshake, ShieldCheck } from "lucide-react";

export default function WhyChoose() {
  const features = [
    {
      icon: <ChartNoAxesCombined size={16} className="text-[#E97C35]" />,
      title: "Empowerment –",
      desc: "We give individuals and small platforms to there skills on their own terms.",
    },
    {
    icon: <Handshake  size={16} className="text-[#E97C35]" />,
      title: "Local Connections:",
      desc: "Build lasting relationships with clients in your own community.",
    },
    {
      icon: <ShieldCheck  size={16} className="text-[#E97C35]" />,
      title: "No Middleman:",
      desc: "Connect to connect customers and keep out of your earn.",
    },
    {
      icon: <DollarSign size={16} className="text-[#E97C35]" />,
      title: "Simple & Affordable:",
      desc: "processed afterway to advertise your event.",
    },
  ];

  return (
    <div className="w-full bg-[#FDF2EB]  py-10 sm:py-0 sm:pt-16 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-10 lg:gap-14">

        {/* LEFT: Text Content */}
        <div className="flex-1 min-w-0 md:max-w-[48%]">
          {/* Heading */}
          <h2 className="text-4xl lg:text-[40px] font-bold text-gray-900 leading-tight mb-0.5">Why Choose</h2>
          <h2 className="text-3xl md:text-4xl font-bold text-[#E97C35] leading-tight mb-7">SideGurus.com?</h2>

          {/* Feature list */}
          <div className="space-y-3.5 mb-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Icon box */}
                <div className="w-8 h-8 rounded-md bg-[#F8D6C0] flex items-center justify-center shrink-0 mt-1 border border-orange-200">
                  {f.icon}
                </div>
                <p className="text-[15px] text-gray-700 leading-snug">
                  <span className="font-semibold text-[#0C0C0C]">{f.title}</span>{" "}
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Footer text */}
          <p className="text-base text-gray-700 leading-relaxed">
            At SideGurus.com,we believe that i valuabling your sellt
            <br />
            income-one gig at a time!
          </p>
        </div>

        {/* RIGHT: Two overlapping images */}
        <div className="relative shrink-0 w-full md:w-107.5 h-62.5 lg:h-67.5 hidden md:block">
          {/* Back image (top-right) */}
          <div className="absolute top-0 right-0 w-75 lg:w-80 h-51.25 lg:h-65 rounded-xl overflow-hidden shadow-md z-0 border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=340&fit=crop"
              alt="Event"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Front image (bottom-left) */}
          <div className="absolute -bottom-6 left-0 w-40 lg:w-44 h-28 lg:h-40 rounded-xl overflow-hidden shadow-lg z-10 border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
              alt="Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}