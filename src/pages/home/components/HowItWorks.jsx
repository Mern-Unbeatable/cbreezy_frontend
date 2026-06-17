export default function HowItWorks() {
  return (
    <section className="bg-white py-12 sm:py-16 md:py-20  px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-left md:text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black mb-3 sm:mb-4 md:mb-6">
            How it works
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl">
            Follow a few simple steps to find services or discover events near
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center mb-16 sm:mb-20 md:mb-24">
          <div className="flex justify-center md:justify-between items-center">
            <img src="/Categories/card.png" alt="Create Account" className="w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto" />
          </div>
          <div className="md:text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-black mb-3 sm:mb-4 md:mb-6">
              Create an Account
            </h3>
            <p className="text-[#373737]  text-base sm:text-lg max-w-full md:max-w-3/6 md:mx-auto leading-relaxed">
              Sign up for free and verify your email to start posting ads.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center mb-16 sm:mb-20 md:mb-24">
          <div className="text-left md:text-center order-2 md:order-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 md:mb-6">
              Post Your Ad
            </h3>
            <p className="text-[#373737] text-base sm:text-lg max-w-full md:max-w-3/6  md:mx-auto leading-relaxed">
              List your service or event with details and reach potential
              customers.
            </p>
          </div>
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <img src="/Categories/card_md.png" alt="Search" className="w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="flex justify-center md:justify-start">
            <img src="/Categories/card3_md.png" alt="Get Offers" className="w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto" />
          </div>
          <div className="text-left md:text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 md:mb-6">
              Get Offers
            </h3>
            <p className="text-[#373737] text-lg max-w-full md:max-w-3/6 md:mx-auto leading-relaxed">
              Receive responses from interested users and grow your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}