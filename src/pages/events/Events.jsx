import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, X, Filter } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination";
import {
  fetchEventCategories,
  fetchEvents,
  selectEventCategories,
  selectEventCategoriesError,
  selectEventCategoriesLoading,
  selectEvents,
  selectEventsError,
  selectEventsPagination,
} from "../../features/events/eventsSlice";
import {
  fetchCountries,
  fetchRegionsByCountry,
  selectCountries,
  selectCountriesError,
  selectCountriesLoading,
  selectRegions,
  selectRegionsError,
  selectRegionsLoading,
} from "../../features/auth/authSlice";

const priceRanges = [
  { label: "All Price", value: "all", min: 0, max: 1500 },
  { label: "Under $20", value: "under20", min: 0, max: 20 },
  { label: "$25 to $100", value: "from25to100", min: 25, max: 100 },
  { label: "$100 to $300", value: "from100to300", min: 100, max: 300 },
  { label: "$300 to $500", value: "from300to500", min: 300, max: 500 },
  { label: "$500+", value: "500plus", min: 500, max: 1500 },
];

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCategoryId =
    searchParams.get("categoryId") || searchParams.get("category") || searchParams.get("eventCategoryId") || "";
  const initialCountryId = searchParams.get("countryId") || searchParams.get("country") || "";
  const initialRegionId = searchParams.get("regionId") || searchParams.get("region") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialPriceRange = searchParams.get("priceRange") || "all";
  const initialMinPrice = Number(searchParams.get("minPrice") || 0);
  const initialMaxPrice = Number(searchParams.get("maxPrice") || 1500);
  const initialPage = Number(searchParams.get("page") || 1) || 1;

  const events = useSelector(selectEvents);
  const eventsError = useSelector(selectEventsError);
  const pagination = useSelector(selectEventsPagination);

  const categories = useSelector(selectEventCategories);
  const categoriesLoading = useSelector(selectEventCategoriesLoading);
  const categoriesError = useSelector(selectEventCategoriesError);

  const countries = useSelector(selectCountries);
  const countriesLoading = useSelector(selectCountriesLoading);
  const countriesError = useSelector(selectCountriesError);

  const regions = useSelector(selectRegions);
  const regionsLoading = useSelector(selectRegionsLoading);
  const regionsError = useSelector(selectRegionsError);

  const [minPrice, setMinPrice] = useState(Number.isNaN(initialMinPrice) ? 0 : initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(Number.isNaN(initialMaxPrice) ? 1500 : initialMaxPrice);
  const [appliedMinPrice, setAppliedMinPrice] = useState(Number.isNaN(initialMinPrice) ? 0 : initialMinPrice);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(Number.isNaN(initialMaxPrice) ? 1500 : initialMaxPrice);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPriceRange || "all");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(String(initialCategoryId));
  const [selectedCountry, setSelectedCountry] = useState(String(initialCountryId));
  const [selectedRegion, setSelectedRegion] = useState(String(initialRegionId));
  const [selectedSearch, setSelectedSearch] = useState(initialSearch);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const latestMinPriceRef = useRef(minPrice);
  const latestMaxPriceRef = useRef(maxPrice);

  useEffect(() => {
    dispatch(fetchEventCategories());
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    const nextCategoryId =
      searchParams.get("categoryId") || searchParams.get("category") || searchParams.get("eventCategoryId") || "";
    const nextCountryId = searchParams.get("countryId") || searchParams.get("country") || "";
    const nextRegionId = searchParams.get("regionId") || searchParams.get("region") || "";
    const nextSearch = searchParams.get("search") || "";
    const nextPriceRange = searchParams.get("priceRange") || "all";
    const nextMinPrice = Number(searchParams.get("minPrice") || 0);
    const nextMaxPrice = Number(searchParams.get("maxPrice") || 1500);
    const nextPage = Number(searchParams.get("page") || 1) || 1;

    const safeMinPrice = Number.isNaN(nextMinPrice) ? 0 : Math.max(0, Math.min(nextMinPrice, 1500));
    const safeMaxPrice = Number.isNaN(nextMaxPrice) ? 1500 : Math.max(safeMinPrice, Math.min(nextMaxPrice, 1500));

    setSelectedCategoryId(String(nextCategoryId));
    setSelectedCountry(String(nextCountryId));
    setSelectedRegion(String(nextRegionId));
    setSelectedSearch(nextSearch);
    setSelectedPriceRange(nextPriceRange);
    setMinPrice(safeMinPrice);
    setMaxPrice(safeMaxPrice);
    setAppliedMinPrice(safeMinPrice);
    setAppliedMaxPrice(safeMaxPrice);
    latestMinPriceRef.current = safeMinPrice;
    latestMaxPriceRef.current = safeMaxPrice;
    setCurrentPage(nextPage > 0 ? nextPage : 1);
  }, [searchParams]);

  useEffect(() => {
    if (selectedCountry) {
      dispatch(fetchRegionsByCountry(selectedCountry));
    }
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    if (categoriesError) {
      console.error(categoriesError);
    }
  }, [categoriesError]);

  useEffect(() => {
    if (countriesError) {
      console.error(countriesError);
    }
  }, [countriesError]);

  useEffect(() => {
    if (regionsError) {
      console.error(regionsError);
    }
  }, [regionsError]);

  useEffect(() => {
    const params = {
      categoryId: selectedCategoryId || undefined,
      countryId: selectedCountry || undefined,
      regionId: selectedRegion || undefined,
      search: selectedSearch || undefined,
      priceRange: selectedPriceRange !== "all" ? selectedPriceRange : undefined,
      minPrice: appliedMinPrice,
      maxPrice: appliedMaxPrice,
      page: currentPage,
      limit: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    dispatch(fetchEvents(params));
  }, [
    dispatch,
    selectedCategoryId,
    selectedCountry,
    selectedRegion,
    selectedSearch,
    selectedPriceRange,
    appliedMinPrice,
    appliedMaxPrice,
    currentPage,
  ]);

  const toggleCategory = (categoryId) => {
    setSelectedCategoryId((prev) => (String(prev) === String(categoryId) ? "" : String(categoryId)));
    setCurrentPage(1);
  };

  const handlePriceRangeSelect = (range) => {
    setSelectedPriceRange(range.value);
    setMinPrice(range.min);
    setMaxPrice(range.max);
    setAppliedMinPrice(range.min);
    setAppliedMaxPrice(range.max);
    latestMinPriceRef.current = range.min;
    latestMaxPriceRef.current = range.max;
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value) || 0, maxPrice);
    setMinPrice(value);
    latestMinPriceRef.current = value;
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value) || 0, minPrice);
    setMaxPrice(value);
    latestMaxPriceRef.current = value;
  };

  const applyCustomPriceRange = () => {
    setSelectedPriceRange("all");
    setAppliedMinPrice(latestMinPriceRef.current);
    setAppliedMaxPrice(latestMaxPriceRef.current);
    setCurrentPage(1);
  };

  const handleMinPriceInputChange = (e) => {
    const value = Math.min(Number(e.target.value) || 0, maxPrice);
    setMinPrice(value);
    latestMinPriceRef.current = value;
  };

  const handleMaxPriceInputChange = (e) => {
    const value = Math.max(Number(e.target.value) || 0, minPrice);
    setMaxPrice(value);
    latestMaxPriceRef.current = value;
  };

  const handlePriceInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      applyCustomPriceRange();
    }
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedRegion("");
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(1500);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(1500);
    latestMinPriceRef.current = 0;
    latestMaxPriceRef.current = 1500;
    setSelectedPriceRange("all");
    setSelectedCategoryId("");
    setSelectedCountry("");
    setSelectedRegion("");
    setCurrentPage(1);
  };

  const totalPages = pagination?.totalPages || 1;
  const totalResults = pagination?.total || events.length;

  const hasActiveFilters =
    appliedMinPrice > 0 ||
    appliedMaxPrice < 1500 ||
    Boolean(selectedCategoryId) ||
    Boolean(selectedCountry) ||
    Boolean(selectedRegion) ||
    selectedPriceRange !== "all";

  return (
    <div className="min-h-screen bg-white font-sans">
      {eventsError && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600 mb-2">Error Loading Events</p>
            <p className="text-gray-600 mb-4">{eventsError}</p>
            <button
              onClick={() => dispatch(fetchEvents({ page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc" }))}
              className="px-6 py-2.5 bg-[#E97C35] text-white rounded-lg hover:bg-[#E0691F] transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!eventsError && <div className="relative min-h-screen bg-[#fbfbfb] py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 flex gap-6">
          <aside className="hidden lg:flex lg:flex-col w-80 shrink-0 sticky top-24 max-h-[calc(100vh-2rem)] gap-4">
            
            <div className="p-4  border-b border-[#E4E7E9] shrink-0">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Price Range
              </h3>

              {/* Slider track */}
           <div className="w-full h-12 flex items-center justify-center p-4">
  <div className="relative w-full h-6 flex items-center">
    {/* Background Track */}
    <div className="absolute w-full h-1 bg-gray-200 rounded-full" />

    <div
      className="absolute h-1 rounded-full"
      style={{
        backgroundColor: "#026F67", 
        left: `${(minPrice / 1500) * 100}%`,
        right: `${100 - (maxPrice / 1500) * 100}%`,
      }}
    />

    {/* Minimum Range Input */}
    <input
      type="range"
      min="0"
      max="1500"
      value={minPrice}
      onChange={handleMinPriceChange}
      onPointerUp={applyCustomPriceRange}
      onKeyUp={applyCustomPriceRange}
      className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
      style={{ zIndex: minPrice > 750 ? 5 : 3 }}
    />

    {/* Maximum Range Input */}
    <input
      type="range"
      min="0"
      max="1500"
      value={maxPrice}
      onChange={handleMaxPriceChange}
      onPointerUp={applyCustomPriceRange}
      onKeyUp={applyCustomPriceRange}
      className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
      style={{ zIndex: maxPrice < 750 ? 5 : 4 }}
    />

    <style>{`
      /* Custom Slider Thumb Design */
      .range-input::-webkit-slider-thumb {
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white; /* Thumb inner color is now white */
        border: 3px solid #004C48; /* Thumb border is now dark teal */
        cursor: pointer;
        pointer-events: auto;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1); /* Lighter shadow for a cleaner look */
      }

      /* FireFox Support for Slider Thumb */
      .range-input::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white; /* Thumb inner color is now white */
        border: 3px solid #004C48; /* Thumb border is now dark teal */
        cursor: pointer;
        pointer-events: auto;
      }

      /* Hide Default Track and Focus State */
      .range-input::-webkit-slider-runnable-track {
        background: transparent;
        border: none;
      }
      
      /* Ensure no default focus ring on thumbs */
      .range-input:focus {
          outline: none;
      }
      .range-input:focus::-webkit-slider-thumb {
          outline: none;
          box-shadow: 0 0 0 4px rgba(0, 76, 72, 0.1); /* Subtle focus ring */
      }
    `}</style>
  </div>
</div>

              {/* Min/Max inputs */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <div className="bg-[#0F5C5C] text-white rounded px-3 py-2 text-sm font-semibold text-center mb-2">
                    Min Price
                  </div>
                  <div className="flex items-center border border-gray-300 rounded px-2 py-1.5">
                    <span className="text-gray-600 text-xs">$</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={handleMinPriceInputChange}
                      onBlur={applyCustomPriceRange}
                      onKeyDown={handlePriceInputKeyDown}
                      min="0"
                      max="1500"
                      className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-[#0F5C5C] text-white rounded px-3 py-2 text-sm font-semibold text-center mb-2">
                    Max Price
                  </div>
                  <div className="flex items-center border border-gray-300 rounded px-2 py-1.5">
                    <span className="text-gray-600 text-xs">$</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={handleMaxPriceInputChange}
                      onBlur={applyCustomPriceRange}
                      onKeyDown={handlePriceInputKeyDown}
                      min="0"
                      max="1500"
                      className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Price radio options */}
              <div className="space-y-1.5">
                {priceRanges.map((range) => (
                  <label
                    key={range.label}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={() => handlePriceRangeSelect(range)}
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        selectedPriceRange === range.value
                          ? "border-[#E97C35] bg-white"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      {selectedPriceRange === range.value && (
                        <div className="w-2 h-2 rounded-full bg-[#E97C35]" />
                      )}
                    </button>
                    <span className="text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E97C35]/10 text-[#E97C35] rounded-lg hover:bg-[#E97C35]/20 transition-colors font-medium text-sm shrink-0"
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>
            )}

            {/* Category */}
            <div className="overflow-hidden  flex flex-col flex-1">
              <button className="flex items-center justify-between w-full p-4  shrink-0">
                <h3 className="text-base font-bold text-gray-800">Events</h3>
                  {categoryOpen ? (
                    <ChevronUp size={14} className="text-gray-500" onClick={() => setCategoryOpen(false)} />
                  ) : (
                    <ChevronDown size={14} className="text-gray-500" onClick={() => setCategoryOpen(true)} />
                  )}
              </button>

              {categoryOpen && (
                <div className="space-y-2.5 overflow-y-auto p-4 bg-gray-50 flex-1">
                  {categoriesLoading && <p className="text-sm text-gray-500">Loading categories...</p>}
                  {!categoriesLoading && categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer hover:text-[#E97C35] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={String(selectedCategoryId) === String(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 accent-orange-400 shrink-0"
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Top Filters */}
            <div className="flex gap-3 mb-5 items-center bg-[#FFFFFF] p-4 rounded-lg">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={countriesLoading}
                  className="w-full sm:w-auto appearance-none text-base border border-gray-300 rounded px-3 py-2 pr-7 text-gray-700 bg-[#FDF2EB] focus:outline-none cursor-pointer disabled:opacity-70"
                >
                  <option value="">Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={!selectedCountry || regionsLoading}
                  className="w-full sm:w-auto appearance-none text-base border border-gray-300 rounded px-3 py-2 pr-7 text-gray-700 bg-[#FDF2EB] focus:outline-none cursor-pointer disabled:opacity-70"
                >
                  <option value="">{selectedCountry ? "Select Region" : "Region"}</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(true)}
                className="lg:hidden h-11 px-4 rounded-md border border-gray-200 bg-[#F4F5F7] text-[#1B2440] inline-flex items-center gap-2.5 shrink-0 hover:bg-[#ECEFF3] transition-colors"
                aria-label="Open filters"
              >
                <Filter size={18} strokeWidth={2.2} />
                <span className="text-base leading-none font-semibold">
                  Filter
                </span>
              </button>
            </div>

            {/* Event Cards Grid */}
            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer bg-white transition-shadow flex flex-col"
                  >
                    {/* Image Container */}
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "75%" }}
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentNode.style.background = "#e5e7eb";
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div
                      className="p-4 flex flex-col flex-1"
                      style={{ backgroundColor: "#FDF2ED" }}
                    >
                      <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight uppercase">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 leading-snug line-clamp-2 grow">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E8F0EF]">
                        <p className="text-lg font-bold text-[#E97C35]">
                          {event.price || "$0"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    No events found
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Try adjusting your filters or use the button below to reset
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E97C35] text-white rounded-lg hover:bg-[#E0691F] transition-colors font-medium"
                  >
                    <RotateCcw size={16} />
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                current={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
                totalResults={totalResults}
                resultsPerPage={pagination?.limit || 12}
              />
            )}
          </div>

          {/* MOBILE FILTER DRAWER */}
          {isFilterPanelOpen && (
            <div
              className="fixed inset-0 bg-black/60 bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsFilterPanelOpen(false)}
            />
          )}

          <div
            className={`fixed top-0 left-0 h-full w-[85%] sm:w-96 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              isFilterPanelOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 pb-24 space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Price Range
                </h3>
                <div className="relative w-full h-6 flex items-center mb-6">
                  <div className="absolute w-full h-1 bg-gray-200 rounded-full" />

                  <div
                    className="absolute h-1 rounded-full"
                    style={{
                      backgroundColor: "#E97C35",
                      left: `${(minPrice / 1500) * 100}%`,
                      right: `${100 - (maxPrice / 1500) * 100}%`,
                    }}
                  />

                  <input
                    type="range"
                    min="0"
                    max="1500"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    onPointerUp={applyCustomPriceRange}
                    onKeyUp={applyCustomPriceRange}
                    className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
                    style={{ zIndex: minPrice > 750 ? 5 : 3 }}
                  />

                  <input
                    type="range"
                    min="0"
                    max="1500"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    onPointerUp={applyCustomPriceRange}
                    onKeyUp={applyCustomPriceRange}
                    className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
                    style={{ zIndex: maxPrice < 750 ? 5 : 4 }}
                  />

                  <style>{`
                    .range-input::-webkit-slider-thumb {
                      appearance: none;
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background: white;
                      border: 3px solid #E97C35;
                      cursor: pointer;
                      pointer-events: auto;
                      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }

                    .range-input::-moz-range-thumb {
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background: white;
                      border: 3px solid #E97C35;
                      cursor: pointer;
                      pointer-events: auto;
                    }

                    .range-input::-webkit-slider-runnable-track {
                      background: transparent;
                      border: none;
                    }
                  `}</style>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <div className="bg-[#0F5C5C] text-white rounded px-3 py-2 text-sm font-semibold text-center mb-2">
                      Min Price
                    </div>
                    <div className="flex items-center border border-gray-300 rounded px-2 py-1.5">
                      <span className="text-gray-600 text-xs">$</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceInputChange}
                        onBlur={applyCustomPriceRange}
                        onKeyDown={handlePriceInputKeyDown}
                        min="0"
                        max="1500"
                        className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#0F5C5C] text-white rounded px-3 py-2 text-sm font-semibold text-center mb-2">
                      Max Price
                    </div>
                    <div className="flex items-center border border-gray-300 rounded px-2 py-1.5">
                      <span className="text-gray-600 text-xs">$</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceInputChange}
                        onBlur={applyCustomPriceRange}
                        onKeyDown={handlePriceInputKeyDown}
                        min="0"
                        max="1500"
                        className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${selectedPriceRange === range.value ? "border-[#E97C35] bg-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                        onClick={() => handlePriceRangeSelect(range)}
                      >
                        {selectedPriceRange === range.value && (
                          <div className="w-2 h-2 rounded-full bg-[#E97C35]" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E97C35]/10 text-[#E97C35] rounded-lg hover:bg-[#E97C35]/20 transition-colors font-medium text-sm"
                >
                  <RotateCcw size={14} />
                  Reset Filters
                </button>
              )}

              <div className=" overflow-hidden ">
                <button className="flex items-center justify-between w-full p-4 transition-colors ">
                  <h3 className="text-base font-bold text-gray-800">Events</h3>
                </button>
                {categoryOpen && (
                  <div className="space-y-2.5 max-h-[45vh] overflow-y-auto p-4 bg-gray-50">
                    {categoriesLoading && <p className="text-sm text-gray-500">Loading categories...</p>}
                    {!categoriesLoading && categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 cursor-pointer hover:text-[#E97C35] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={String(selectedCategoryId) === String(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-4 h-4 accent-orange-400 shrink-0"
                        />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="w-full px-4 py-3 bg-[#E97C35] text-white rounded-lg hover:bg-[#E0691F] transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
