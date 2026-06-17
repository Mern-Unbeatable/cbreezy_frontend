import { useState } from "react";
import { Search } from "lucide-react";
import CategoriesHeroImg from "/Categories/CategoriesHero.png";

const CategoriesHero = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchInput(query);
    onSearch(query);
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center overflow-hidden min-h-112.5">
      
      {/* Background image using Tailwind's arbitrary values */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${CategoriesHeroImg}')` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-12 pb-10">
        
        {/* Title with Fluid Font Size and Text Shadow */}
        <h1 className="text-white font-bold mb-8 text-center font-poppins drop-shadow-[0_2px_16px_rgba(0,0,0,0.3)] text-[1.5rem] sm:text-[3vw] lg:text-[2.5rem]">
          Categories
        </h1>

        {/* Search Bar Container with Glass Effect */}
        <div className="w-full max-w-xs sm:max-w-md md:max-w-3xl mx-auto">
          
          {/* Outer Wrapper for the Glass Border Look */}
          <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl">
            
            {/* Inner Search Input Area */}
            <div className="flex items-center bg-white rounded-lg px-4 py-2">
              <Search className="text-gray-500 w-5 h-5 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Search by category name"
                value={searchInput}
                onChange={handleSearchChange}
                className="flex-1 outline-none border-none text-gray-700 text-sm sm:text-lg bg-transparent placeholder-gray-500 font-poppins"
                aria-label="Search categories"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesHero;