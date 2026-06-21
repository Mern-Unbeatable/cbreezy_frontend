export default function WhyChoose() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Our Mission
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-left sm:text-center">
            We believe everyone has a skill, passion, or hustle that deserves to
            be seen. Whether you are a seasoned professional, a self-taught
            expert, or just getting started, SideGurus.com empowers individuals
            and small businesses to showcase their services and connect with
            clients in their local communities.
          </p>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-left sm:text-center">
            Our platform makes it easier than ever to turn side hustles into
            thriving businesses. From hairstylists and tutors to personal
            trainers, handymen, and creatives, SideGurus.com is where local
            talent shines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch auto-rows-fr">
          <div className="bg-[#FDF2EB] p-4 md:p-6 rounded-lg shadow-sm h-full min-h-65 flex flex-col">
            <h4 className="text-xl font-semibold text-gray-900">What We Do</h4>
            <p className="mt-3 text-gray-600 flex-1">
              SideGurus.com is a curated local services platform designed for
              modern convenience and elevated service experiences. We connect
              community professionals with clients who value quality,
              reliability, and convenience. We connect clients with
              professionals across all categories. Every provider on
              SideGurus.com is positioned to be discovered and booked with
              confidence.
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border h-full min-h-65 flex flex-col">
            <h4 className="text-xl font-semibold text-gray-900">Our Vision</h4>
            <p className="mt-3 text-gray-600 flex-1">
              We envision a world where independent professionals operate with
              the same visibility, credibility, and ease as large, established
              brands. A world where local talent is not only supported but
              elevated.
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border h-full min-h-65 flex flex-col">
            <h4 className="text-xl font-semibold text-gray-900">
              Why We Exist
            </h4>
            <p className="mt-3 text-gray-600 flex-1">
              The local services industry is fragmented, inconsistent, and often
              difficult to navigate. Quality talent remains hidden, while
              clients struggle to find reliable professionals. We are changing
              that. SideGurus.com was built to bring structure, visibility, and
              trust to local services — creating a marketplace where quality
              stands out and opportunity is accessible.
            </p>
          </div>

          <div className="bg-[#FDF2EB] p-4 md:p-6 rounded-lg shadow-sm h-full min-h-65 flex flex-col">
            <h4 className="text-xl font-semibold text-gray-900">
              Join the Marketplace
            </h4>
            <p className="mt-3 text-gray-600 flex-1">
              Whether you are a client seeking trusted professionals or a
              provider ready to grow your business, SideGurus.com is your
              gateway to a more connected, efficient, and elevated local
              economy.
            </p>

            <div className="mt-4 flex justify-between gap-3">
              <a
                href="/signup"
                className="flex px-5 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600"
              >
                Join as Provider
              </a>
              <a
                href="/services"
                className="flex px-5 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Find Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
