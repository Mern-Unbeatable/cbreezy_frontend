import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 py-8 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-12">
          <div className="max-w-md self-start px-4">
            <div className="">
              <Link
                to="/"
                className="inline-flex w-fit shrink-0 cursor-pointer"
              >
                <img
                  src="/logo.png"
                  alt="SIDEGURUS Logo"
                  className="h-14 w-auto md:h-18"
                />
              </Link>
            </div>

            <p className=" max-w-sm text-sm leading-relaxed text-[#2B2B2B] text-justify ">
              <p>At SideGurus, our belief is everyone has a skill, passion, or
              hustle that deserves to be seen. Whether you are a seasoned
              professional, a self-taught expert, or just getting started,
              SideGurus.com empowers individuals and small businesses to
              showcase their services and connect with clients in their local
              communities. </p>
              
             
            {/* <p> Our platform makes it easier than ever to turn side
              hustles into thriving businesses. From hairstylists and tutors to
              personal trainers, handymen, and creatives, SideGurus.com is where
              local talent shines.</p> */}
            </p>
          </div>

          <div className="self-start px-4 md:pt-6">
            <h3 className="mb-8 text-base font-bold text-gray-900 text-left ">
              Company
            </h3>

            <div className="grid gap-8 grid-cols-2">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 transition-colors hover:text-[#e07b39]"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-gray-600 transition-colors hover:text-[#e07b39]"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-gray-600 transition-colors hover:text-[#e07b39]"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>

              <ul className="space-y-3">
                <li>
                  <Link
                    to="/categories"
                    className="text-sm text-gray-600 transition-colors hover:text-[#e07b39]"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-sm text-gray-600 transition-colors hover:text-[#e07b39]"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="text-sm text-gray-600 transition-colors hover:text-[#e07b39]"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sideguru-suggestions"
                    className="text-sm text-gray-600 transition-colors hover:text-[#e07b39]"
                  >
                    Sideguru Suggestions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="text-center text-xs text-gray-600 md:text-left">
            © 2026 SideGurus. All rights reserved. Connecting people with
            trusted local services.
          </p>

          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-xs text-gray-600 transition-colors hover:text-[#e07b39]"
            >
              Privacy
            </Link>
            <Link
              to="/safety-guide"
              className="text-xs text-gray-600 transition-colors hover:text-[#e07b39]"
            >
              Safety Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
