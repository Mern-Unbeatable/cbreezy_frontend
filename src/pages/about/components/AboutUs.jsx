export default function AboutUs() {
  return (
    <div className="relative w-full overflow-hidden min-h-155 flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/Categories/About_Us.png"
        alt="About Us Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-155 w-full flex-col items-center justify-center px-6 py-10 md:py-12 text-center text-white">
        
        {/* Title with horizontal lines */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-16 bg-white opacity-70" />
          <h1 className="text-4xl font-bold tracking-wide text-white">About Us</h1>
          <div className="h-px w-16 bg-white opacity-70" />
        </div>

        {/* Description */}
        <p className="mx-auto max-w-5xl text-base sm:text-lg text-gray-200 leading-relaxed">
          We believe that everyone has a skill, a passion, or a hustle that deserves to be seen. Whether you&apos;re a
          seasoned professional, a self-taught expert, or someone just getting started, SideGurus.com empowers
          individuals and small businesses to showcase their services and connect with clients in their local community.
          
          Our platform is designed to make it easier than ever to turn your side hustle into a thriving business.
         
          From hairstylists and tutors to personal trainers, handymen, and creatives_SideGurus.com is where local talent shines.
        </p>
      </div>
    </div>
  );
}