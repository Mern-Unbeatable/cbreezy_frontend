export default function AboutUs() {
  return (
    <div className="relative w-full overflow-hidden min-h-10 md:min-h-160 flex items-center justify-center">
      {/* Background Image */}
      <img
        src="Property.webp"
        alt="About Us Background"
        className="absolute inset-0 w-full h-full object-cover object-center   "
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-80 md:min-h-155 w-full flex-col items-center justify-center px-6 py-10 md:py-12 text-center text-white">
        
        {/* Title with horizontal lines */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-16 bg-white opacity-70" />
          <h1 className="text-4xl font-bold tracking-wide text-white">About Us</h1>
          <div className="h-px w-16 bg-white opacity-70" />
        </div>

        {/* Description */}
        <p className="mx-auto max-w-5xl text-base sm:text-2xl text-gray-200 leading-relaxed">
          Sidegurus.com is where local talent shines...

        </p>
      </div>
    </div>
  );
}