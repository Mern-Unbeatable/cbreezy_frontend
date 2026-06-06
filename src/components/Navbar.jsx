import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Categories", path: "/categories" },
    { label: "Services", path: "/services" },
    { label: "Events", path: "/events" },
    { label: "About Us", path: "/about" }
  ];

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 ">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="shrink-0 flex items-center "
            aria-label="SIDEGURUS Logo"
          >
            <img 
              src="/logo.png" 
              alt="SIDEGURUS Logo" 
              className="h-14 md:h-18 w-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center flex-1 justify-center px-6 lg:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base  relative no-underline transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-[#e07b39]"
                    : "text-gray-700 hover:text-[#e07b39]"
                }`}
              >
                {link.label}
                {/* Animated underline */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#e07b39] transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3 shrink-0 hover:cursor-pointer">
            <Link 
              to="/profile"
              className="px-4 py-2.5 bg-[#004C48] text-white rounded-md font-semibold cursor-pointer text-sm no-underline inline-flex items-center transition-colors duration-200 hover:bg-[#003838]"
              aria-label="Post Advertisement"
            >
              Post Ad
            </Link>

            {isAuthenticated ? (
              <div 
                className="relative"
                onMouseEnter={() => setProfileDropdown(true)}
                onMouseLeave={() => setProfileDropdown(false)}
              >
                <button
                  className="p-2 text-gray-700 hover:text-[#e07b39] transition-colors duration-200 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
                  title="Profile Menu"
                  aria-label="User Profile Menu"
                  aria-expanded={profileDropdown}
                >
                  <User size={22} strokeWidth={1.5} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdown && (
                  <div 
                    className="absolute md:-left-35 2xl:-left-5 mt-0.5 pt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 z-50"
                    onMouseEnter={() => setProfileDropdown(true)}
                    onMouseLeave={() => setProfileDropdown(false)}
                  >
                    <Link 
                      to="/profile/account"
                      className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e07b39] transition-colors duration-200 text-sm no-underline rounded-t-lg flex items-center gap-2"
                    >
                      <User size={16} />
                      Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdown(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200 text-sm rounded-b-lg flex items-center gap-2 border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-2.5 bg-[#e07b39] text-white rounded-md font-semibold cursor-pointer text-sm no-underline inline-flex items-center transition-colors duration-200 hover:bg-[#c9692a]"
                title="Sign In"
                aria-label="Log In"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#e07b39] hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white animate-in fade-in slide-in-from-top">
            {/* Mobile Navigation Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium no-underline transition-colors duration-200 ${
                    isActive(link.path)
                      ? "bg-orange-50 text-[#e07b39] font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#e07b39]"
                  }`}
                  aria-current={isActive(link.path) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Divider */}
            <div className="border-t border-gray-200" />

            {/* Mobile Action Buttons */}
            <div className="px-2 py-3 space-y-2">
              {/* Post Add Button - Only on Mobile */}
              <Link 
                to="/post-add"
                onClick={closeMobileMenu}
                className="block w-full px-4 py-2.5 bg-[#004C48] text-white text-center rounded-md font-semibold cursor-pointer text-sm no-underline transition-colors duration-200 hover:bg-[#003838]"
                aria-label="Post Advertisement"
              >
                Post Add
              </Link>

              {/* Auth Button */}
              {isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="w-full px-4 py-2.5 bg-[#F4F5F7] text-gray-700 text-center rounded-md font-medium cursor-pointer text-sm no-underline transition-colors duration-200 hover:bg-[#E9EDF1] inline-flex items-center justify-center gap-2"
                    aria-label="User Profile"
                  >
                    <User size={16} className="text-gray-500" />
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                      navigate("/");
                    }}
                    className="w-full px-4 py-2.5 bg-white text-red-600 rounded-md font-medium cursor-pointer text-sm transition-colors duration-200 hover:bg-red-50 inline-flex items-center justify-center gap-2 border border-red-200"
                    aria-label="Log Out"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Log Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-2.5 bg-[#e07b39] text-white text-center rounded-md font-semibold cursor-pointer text-sm no-underline transition-colors duration-200 hover:bg-[#c9692a]"
                  aria-label="Log In"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}