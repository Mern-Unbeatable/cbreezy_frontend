import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearHomeCities,
  fetchHomeCitiesByRegion,
  fetchHomeCategoriesByTab,
  fetchHomeCountries,
  fetchHomeCountriesWithRegions,
  selectHomeCategories,
  selectHomeCategoryError,
  selectHomeCategoryLoading,
  selectHomeCities,
  selectHomeCityError,
  selectHomeCityLoading,
  selectHomeCountries,
  selectHomeCountriesWithRegions,
  selectHomeGeoError,
  selectHomeGeoLoading,
} from "../../../features/homeSearch/homeSearchSlice";


export default function ServicesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Service");
  const categories = useSelector(selectHomeCategories);
  const countries = useSelector(selectHomeCountries);
  const countriesWithRegions = useSelector(selectHomeCountriesWithRegions);
  const cities = useSelector(selectHomeCities);
  const categoryLoading = useSelector(selectHomeCategoryLoading);
  const geoLoading = useSelector(selectHomeGeoLoading);
  const cityLoading = useSelector(selectHomeCityLoading);
  const categoryError = useSelector(selectHomeCategoryError);
  const geoError = useSelector(selectHomeGeoError);
  const cityError = useSelector(selectHomeCityError);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const selectedCategoryObj = useMemo(
    () => categories.find((cat) => String(cat.id) === String(selectedCategory)),
    [categories, selectedCategory]
  );

  const subcategoryOptions = useMemo(() => {
    if (activeTab !== "Service") return [];
    return selectedCategoryObj?.subcategories || [];
  }, [activeTab, selectedCategoryObj]);

  const selectedCountryObj = useMemo(() => {
    return countries.find((country) => String(country.id) === String(selectedCountry));
  }, [countries, selectedCountry]);

  const locationOptions = useMemo(() => {
    if (!selectedCountry) return [];

    const matchedCountry = countriesWithRegions.find((country) => {
      const byId = String(country.id) === String(selectedCountry);
      const byName =
        selectedCountryObj?.name &&
        String(country.name).toLowerCase() === String(selectedCountryObj.name).toLowerCase();

      return byId || byName;
    });

    return matchedCountry?.regions || [];
  }, [countriesWithRegions, selectedCountry, selectedCountryObj?.name]);

  const selectedLocationObj = useMemo(() => {
    return locationOptions.find((item) => String(item.id) === String(selectedLocation));
  }, [locationOptions, selectedLocation]);

  const cityOptions = useMemo(() => cities, [cities]);

  const displayCategories = useMemo(() => categories.slice(0, 7), [categories]);
  const topRow = useMemo(() => displayCategories.slice(0, 3), [displayCategories]);
  const bottomRow = useMemo(() => displayCategories.slice(3, 7), [displayCategories]);

  useEffect(() => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    dispatch(fetchHomeCategoriesByTab(activeTab));
  }, [activeTab, dispatch]);

  useEffect(() => {
    dispatch(fetchHomeCountries());
    dispatch(fetchHomeCountriesWithRegions());
  }, [dispatch]);

  useEffect(() => {
    if (categoryError) {
      toast.error(categoryError);
    }
  }, [categoryError]);

  useEffect(() => {
    if (geoError) {
      toast.error(geoError);
    }
  }, [geoError]);

  useEffect(() => {
    if (cityError) {
      toast.error(cityError);
    }
  }, [cityError]);

  useEffect(() => {
    setSelectedLocation("");
    setSelectedCity("");
  }, [selectedCountry]);

  useEffect(() => {
    setSelectedSubcategory("");
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedLocation) {
      dispatch(clearHomeCities());
      setSelectedCity("");
      return;
    }

    dispatch(fetchHomeCitiesByRegion(selectedLocation));
    setSelectedCity("");
  }, [dispatch, selectedLocation]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    const selectedSubcategoryObj =
      subcategoryOptions.find((item) => String(item.id) === String(selectedSubcategory)) || null;
    const selectedCityObj = cityOptions.find((item) => String(item.id) === String(selectedCity)) || null;

    if (selectedCategory) params.set("categoryId", selectedCategory);
    if (activeTab === "Service" && selectedSubcategory) {
      params.set("subCategoryId", selectedSubcategory);
    }
    if (selectedCountry) params.set("countryId", selectedCountry);
    if (selectedLocation) params.set("regionId", selectedLocation);
    if (selectedCity) params.set("cityId", selectedCity);

    if (selectedCategoryObj?.name) params.set("category", selectedCategoryObj.name);
    if (activeTab === "Service" && selectedSubcategoryObj?.name) {
      params.set("subcategory", selectedSubcategoryObj.name);
    }
    if (selectedCountryObj?.name) params.set("country", selectedCountryObj.name);
    if (selectedLocationObj?.name) params.set("location", selectedLocationObj.name);
    if (selectedCityObj?.name) params.set("city", selectedCityObj.name);

    const targetPath = activeTab === "Service" ? "/services" : "/events";
    const query = params.toString();
    navigate(query ? `${targetPath}?${query}` : targetPath);
  };

  const handleCategoryCardClick = (category) => {
    const categoryId = category?.id;
    const targetPath = activeTab === "Service" ? "/services" : "/events";

    if (!categoryId) {
      navigate(targetPath);
      return;
    }

    navigate(`${targetPath}?categoryId=${encodeURIComponent(categoryId)}`);
  };

  return (
    <div className="container mx-auto min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="text-center pb-10  pt-14 md:pt-20 px-4 sm:px-6">
        <h1 className="text-2xl md:text-[40px] font-black text-[#0C0C0C] text-start sm:text-center  mb-3  font-[Poppins] md:max-w-4xl mx-auto leading-tight">
          Find Services & Events Near You Instantly
        </h1>
        <p className="text-gray-600 text-sm sm:text-base  md:text-lg  mb-6 md:mb-8 max-w-3xl  text-start sm:text-center mx-auto leading-relaxed">
          Discover local services and events in your area. Select a category,
          enter your location, and start exploring.
        </p>

        {/* Search Card */}
        <div className="flex justify-center   bg-white">
          <div className="relative w-full max-w-5xl">
            <div className="flex">
              <div className="bg-[#F8D7C4] rounded-t-xl flex p-1.5 pb-0">
                {["Service", "Events"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 text-sm font-medium transition-all duration-200 rounded-lg font-[Poppins] ${
                      activeTab === tab
                        ? "bg-[#EE8043] text-white shadow-sm"
                        : "text-gray-700 hover:text-[#EE8043]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar Container */}
            <div className="bg-[#F8D7C4] rounded-b-xl rounded-tr-xl p-4 sm:p-5">
              <div
                className={`grid grid-cols-1 gap-3 items-center  ${
                  activeTab === "Service" ? "md:grid-cols-6" : "md:grid-cols-5"
                }`}
              >
                {/* Dropdowns */}
                <div className="relative w-full">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={categoryLoading}
                    className="w-full appearance-none bg-white border-none rounded-md px-4 py-2.5 pr-10 text-sm text-gray-600 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="">
                      {categoryLoading ? "Loading category..." : "Select category"}
                    </option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-800 stroke-[3px]" />
                  </div>
                </div>

                {activeTab === "Service" && (
                  <div className="relative w-full">
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      disabled={!selectedCategory || subcategoryOptions.length === 0}
                      className="w-full appearance-none bg-white border-none rounded-md px-4 py-2.5 pr-10 text-sm text-gray-600 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <option value="">
                        {!selectedCategory ? "Select category first" : "Select Subcategory"}
                      </option>
                      {subcategoryOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-800 stroke-[3px]" />
                    </div>
                  </div>
                )}

                <div className="relative w-full">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    disabled={geoLoading}
                    className="w-full appearance-none bg-white border-none rounded-md px-4 py-2.5 pr-10 text-sm text-gray-600 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="">{geoLoading ? "Loading country..." : "Country"}</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-800 stroke-[3px]" />
                  </div>
                </div>

                <div className="relative w-full">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    disabled={!selectedCountry || locationOptions.length === 0}
                    className="w-full appearance-none bg-white border-none rounded-md px-4 py-2.5 pr-10 text-sm text-gray-600 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="">
                      {!selectedCountry ? "Select country first" : "Location"}
                    </option>
                    {locationOptions.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-800 stroke-[3px]" />
                  </div>
                </div>

                <div className="relative w-full">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedLocation || cityLoading || cityOptions.length === 0}
                    className="w-full appearance-none bg-white border-none rounded-md px-4 py-2.5 pr-10 text-sm text-gray-600 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="">
                      {!selectedLocation
                        ? "Select location first"
                        : cityLoading
                          ? "Loading city..."
                          : "City"}
                    </option>
                    {cityOptions.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-800 stroke-[3px]" />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-[#EE8043] hover:bg-[#d66f35] text-white font-semibold px-10 py-2.5 rounded-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="relative px-4 sm:px-8 md:px-12 py-4 md:py-24 bg-white overflow-hidden">
        {/* Decorative Half-Circle */}
        <div className="absolute top-10 right-10 md:right-20 hidden md:block z-10">
          <div style={{ position: "relative", width: "72px", height: "65px" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "72px",
                height: "40px",
                backgroundColor: "#E8804A",
                borderRadius: "36px 36px 0 0",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "48px",
                height: "25px",
                backgroundColor: "#0F5C5C",
                borderRadius: "24px 24px 0 0",
              }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col gap-5 md:gap-6 relative z-20">
          {/* Top Row — Title card + 3 image cards (4 columns total) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {/* Column 1: Title + CTA */}
            <div className="flex flex-col  pr-4 ">
              <p className="text-[#E8804A] text-13px font-bold mb-6 tracking-wide font-[Poppins]">
                {/* --- Find what interests you the most --- */}
              </p>

              <h2 className="text-2xl md:text-4xl font-semibold text-gray-950 leading-tight mb-8 font-[Poppins]">
                {/* Browse From
                Top Categories */}
              </h2>

              <Link to='/categories' className="hidden lg:inline-flex bg-[#E97C35]  active:bg-[#c06637] text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg w-full md:w-auto items-center justify-center">
                Browse All Categories
              </Link>
            </div>

            {/* Columns 2-4: Top 3 image cards */}
            {topRow.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryCardClick(cat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryCardClick(cat);
                  }
                }}
                role="button"
                tabIndex={0}
                className="overflow-hidden rounded-sm bg-white group cursor-pointer h-full flex flex-col shadow-sm  "
              >
                <div className="overflow-hidden h-50 sm:h-58 md:h-56 shrink-0">
                  <img
                    src={cat.image || "https://placehold.co/400x300/f0f0f0/999?text=Category"}
                    alt={cat.name}
                    className="w-full h-full object-cover "
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x300/f0f0f0/999?text=Image`;
                    }}
                  />
                </div>
                <div className="px-4 sm:px-5 py-5 sm:py-6 bg-[#FDF2ED] flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900 leading-snug font-['Poppins']">
                      {cat.name}
                    </p>
                    <p className="text-xs font-medium text-[#E97C35] mt-1 uppercase tracking-wide">
                      {cat.type || activeTab}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row — 4 image cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {bottomRow.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryCardClick(cat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryCardClick(cat);
                  }
                }}
                role="button"
                tabIndex={0}
                className="overflow-hidden rounded-sm bg-white group cursor-pointer h-full flex flex-col shadow-sm "
              >
                <div className="overflow-hidden h-40 sm:h-48 md:h-56 shrink-0">
                  <img
                    src={cat.image || "https://placehold.co/400x300/f0f0f0/999?text=Category"}
                    alt={cat.name}
                    className="w-full h-full object-cover "
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x300/f0f0f0/999?text=Image`;
                    }}
                  />
                </div>

                <div className="px-4 sm:px-5 py-4 sm:py-5 bg-[#FDF2ED] flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900 leading-snug">
                      {cat.name}
                    </p>
                    <p className="text-xs font-medium text-[#E97C35] mt-1 uppercase tracking-wide">
                      {cat.type || activeTab}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:hidden w-full">
            <Link
              to="/categories"
              className="inline-flex bg-[#E8804A] hover:bg-[#d4723e] active:bg-[#c06637] text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg w-full items-center justify-center"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
