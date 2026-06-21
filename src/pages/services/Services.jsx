import SEO from "../../components/SEO";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Filter, RotateCcw, X } from "lucide-react";
import {
  fetchServiceCategories,
  fetchServiceCategoryDetail,
  fetchServices,
  selectServiceCategories,
  selectServiceCategoriesError,
  selectServiceCategoriesLoading,
  selectServiceSubcategoriesByCategory,
  selectServices,
  selectServicesError,
  selectServicesPagination,
} from "../../features/services/servicesSlice";
import {
  fetchCountries,
  fetchRegionsByCountry,
  selectCountries,
  selectCountriesError,
  selectCountriesLoading,
  selectRegions,
  selectRegionsError,
  selectRegionsLoading,
  fetchCitiesByRegion,
  selectCities,
  selectCitiesLoading,
  selectCitiesError,
} from "../../features/auth/authSlice";
import Pagination from "../../components/Pagination";

const priceRanges = [
  { label: "All Price", value: "all", min: 0, max: 5000 },
  { label: "From 25 to 100", value: "from25to100", min: 25, max: 100 },
  { label: "From 100 to 300", value: "from100to300", min: 100, max: 300 },
  { label: "From 300 to 500", value: "from300to500", min: 300, max: 500 },
  { label: "500+", value: "500plus", min: 500, max: 5000 },
];

export default function Services() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCategoryId =
    searchParams.get("categoryId") || searchParams.get("category") || searchParams.get("serviceCategoryId") || "";
  const initialSubCategoryId = searchParams.get("subCategoryId") || searchParams.get("subcategoryId") || "";
  const initialCountryId = searchParams.get("countryId") || searchParams.get("country") || "";
  const initialRegionId = searchParams.get("regionId") || searchParams.get("region") || "";
  const initialCityId = searchParams.get("cityId") || searchParams.get("city") || "";
  const initialPage = Number(searchParams.get("page") || 1) || 1;

  const services = useSelector(selectServices);
  const servicesError = useSelector(selectServicesError);
  const pagination = useSelector(selectServicesPagination);

  const categories = useSelector(selectServiceCategories);
  const categoriesLoading = useSelector(selectServiceCategoriesLoading);
  const categoriesError = useSelector(selectServiceCategoriesError);
  const subcategoriesByCategory = useSelector(selectServiceSubcategoriesByCategory);

  const countries = useSelector(selectCountries);
  const countriesLoading = useSelector(selectCountriesLoading);
  const countriesError = useSelector(selectCountriesError);
  const regions = useSelector(selectRegions);
  const regionsLoading = useSelector(selectRegionsLoading);
  const regionsError = useSelector(selectRegionsError);
  const cities = useSelector(selectCities);
  const citiesLoading = useSelector(selectCitiesLoading);
  const citiesError = useSelector(selectCitiesError);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(5000);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [categoryOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(String(initialCategoryId));
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(String(initialSubCategoryId));
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);
  const [selectedCountry, setSelectedCountry] = useState(String(initialCountryId));
  const [selectedRegion, setSelectedRegion] = useState(String(initialRegionId));
  const [selectedCity, setSelectedCity] = useState(String(initialCityId));
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const latestMinPriceRef = useRef(minPrice);
  const latestMaxPriceRef = useRef(maxPrice);

  useEffect(() => {
    dispatch(fetchServiceCategories());
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    const nextCategoryId =
      searchParams.get("categoryId") || searchParams.get("category") || searchParams.get("serviceCategoryId") || "";
    const nextSubCategoryId = searchParams.get("subCategoryId") || searchParams.get("subcategoryId") || "";
    const nextCountryId = searchParams.get("countryId") || searchParams.get("country") || "";
    const nextRegionId = searchParams.get("regionId") || searchParams.get("region") || "";
    const nextCityId = searchParams.get("cityId") || searchParams.get("city") || "";
    const nextPage = Number(searchParams.get("page") || 1) || 1;

    setSelectedCategoryId(String(nextCategoryId));
    setSelectedSubCategoryId(String(nextSubCategoryId));
    setSelectedCountry(String(nextCountryId));
    setSelectedRegion(String(nextRegionId));
    setSelectedCity(String(nextCityId));
    setCurrentPage(nextPage > 0 ? nextPage : 1);
  }, [searchParams]);

  useEffect(() => {
    if (selectedCountry) {
      dispatch(fetchRegionsByCountry(selectedCountry));
    }
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    if (selectedRegion) {
      dispatch(fetchCitiesByRegion(selectedRegion));
    }
  }, [dispatch, selectedRegion]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    if (subcategoriesByCategory[String(selectedCategoryId)]) return;
    dispatch(fetchServiceCategoryDetail(selectedCategoryId));
  }, [dispatch, selectedCategoryId, subcategoriesByCategory]);

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
    if (citiesError) {
      console.error(citiesError);
    }
  }, [citiesError]);

  useEffect(() => {
    const params = {
      categoryId: selectedCategoryId || undefined,
      subCategoryId: selectedSubCategoryId || undefined,
      countryId: selectedCountry || undefined,
      cityId: selectedCity || undefined,
      regionId: selectedRegion || undefined,
      priceRange: selectedPriceRange !== "all" ? selectedPriceRange : undefined,
      minPrice: appliedMinPrice,
      maxPrice: appliedMaxPrice,
      page: currentPage,
      limit: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    dispatch(fetchServices(params));
  }, [
    dispatch,
    selectedCategoryId,
    selectedSubCategoryId,
    selectedCountry,
    selectedRegion,
    selectedCity,
    selectedPriceRange,
    appliedMinPrice,
    appliedMaxPrice,
    currentPage,
  ]);

  const toggleCategoryExpand = (categoryId) => {
    const key = String(categoryId);
    setExpandedCategories((prev) => {
      const willOpen = !prev[key];

      if (willOpen && !subcategoriesByCategory[key]) {
        dispatch(fetchServiceCategoryDetail(key));
      }

      // If opening this category, close all others (accordion behavior)
      if (willOpen) {
        return { [key]: true };
      }

      // If closing, just toggle this one
      return { ...prev, [key]: false };
    });
  };

  const handleCategoryFilter = (categoryId) => {
    const key = String(categoryId);
    setSelectedCategoryId(key);
    setSelectedSubCategoryId("");

    if (!subcategoriesByCategory[key]) {
      dispatch(fetchServiceCategoryDetail(key));
    }

    // Automatically expand the clicked category (accordion behavior)
    setExpandedCategories({ [key]: true });

    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subCategoryId) => {
    setSelectedSubCategoryId((prev) => (String(prev) === String(subCategoryId) ? "" : String(subCategoryId)));
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

  const handleMinPriceInputBlur = () => {
    applyCustomPriceRange();
  };

  const handleMaxPriceInputBlur = () => {
    applyCustomPriceRange();
  };

  const handlePriceInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      applyCustomPriceRange();
    }
  };

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(5000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(5000);
    latestMinPriceRef.current = 0;
    latestMaxPriceRef.current = 5000;
    setSelectedPriceRange("all");
    setExpandedCategories({});
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setSelectedCountry("");
    setSelectedRegion("");
    setSelectedCity("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(selectedCategoryId) ||
    Boolean(selectedSubCategoryId) ||
    Boolean(selectedCountry) ||
    Boolean(selectedRegion) ||
    Boolean(selectedCity) ||
    appliedMinPrice > 0 ||
    appliedMaxPrice < 5000 ||
    selectedPriceRange !== "all";

  const totalPages = pagination?.totalPages || 1;
  const totalResults = pagination?.total || services.length;

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedRegion("");
    setSelectedCity("");
    setCurrentPage(1);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <SEO title="Post Your Services Online | Find Local Side Jobs" description="Post your services online and connect with people looking for local side jobs. Discover flexible side hustles and weekend gigs near you." />
      {servicesError && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center px-4">
            <p className="text-lg font-semibold text-red-600 mb-2">Error Loading Services</p>
            <p className="text-gray-600 mb-4">{servicesError}</p>
            <button
              onClick={() => dispatch(fetchServices({ page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc" }))}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!servicesError && (
        <div className="relative min-h-screen bg-[#fbfbfb] py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 flex gap-6">
            <aside className="hidden lg:block w-80 shrink-0 sticky top-26 h-fit">
              <div className="mb-6 p-4 bg-[#fbfbfb] border-b border-[#E4E7E9] rounded-lg">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Price Range</h3>

                <div className="relative w-full h-6 flex items-center mb-6">
                  <div className="absolute w-full h-1 bg-gray-200 rounded-full" />

                  <div
                    className="absolute h-1 rounded-full"
                    style={{
                      backgroundColor: "#004C48",
                      left: `${(minPrice / 5000) * 100}%`,
                      right: `${100 - (maxPrice / 5000) * 100}%`,
                    }}
                  />

                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    onPointerUp={applyCustomPriceRange}
                    onKeyUp={applyCustomPriceRange}
                    className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
                    style={{ zIndex: minPrice > 2500 ? 5 : 3 }}
                  />

                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    onPointerUp={applyCustomPriceRange}
                    onKeyUp={applyCustomPriceRange}
                    className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
                    style={{ zIndex: maxPrice < 2500 ? 5 : 4 }}
                  />

                  <style>{`
                    .range-input::-webkit-slider-thumb {
                      appearance: none;
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background: white;
                      border: 3px solid #004C48;
                      cursor: pointer;
                      pointer-events: auto;
                      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }

                    .range-input::-moz-range-thumb {
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background: white;
                      border: 3px solid #004C48;
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
                    <div className="flex items-center border border-gray-300 rounded px-2 py-1.5 bg-white">
                      <span className="text-gray-600 text-xs">$</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceInputChange}
                        onBlur={handleMinPriceInputBlur}
                        onKeyDown={handlePriceInputKeyDown}
                        min="0"
                        max="5000"
                        className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#0F5C5C] text-white rounded px-3 py-2 text-sm font-semibold text-center mb-2">
                      Max Price
                    </div>
                    <div className="flex items-center border border-gray-300 rounded px-2 py-1.5 bg-white">
                      <span className="text-gray-600 text-xs">$</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceInputChange}
                        onBlur={handleMaxPriceInputBlur}
                        onKeyDown={handlePriceInputKeyDown}
                        min="0"
                        max="5000"
                        className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeSelect(range)}
                        className="accent-[#E97C35]"
                      />
                      <span className="text-sm text-gray-600">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-[#004C48]/10 text-[#004C48] rounded-lg hover:bg-[#004C48]/20 transition-colors font-medium text-sm"
                >
                  <RotateCcw size={14} />
                  Reset Filters
                </button>
              )}

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <h3 className="text-base font-bold text-gray-800 p-6">Category</h3>

                {categoryOpen && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {categoriesLoading && <p className="text-sm text-gray-500">Loading categories...</p>}
                      {!categoriesLoading &&
                        categories.map((category) => {
                          const categoryId = String(category.id);
                          const subcategories = subcategoriesByCategory[categoryId] || [];

                          return (
                            <div key={categoryId} className="w-full min-w-0">
                              <div className="flex items-center justify-between w-full mb-3 pb-2 gap-3 group">
                                <button
                                  type="button"
                                  onClick={() => handleCategoryFilter(categoryId)}
                                  className="text-sm font-bold text-[#004C48] uppercase tracking-wide truncate whitespace-nowrap overflow-hidden text-left flex-1 min-w-0"
                                >
                                  {category.name}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleCategoryExpand(categoryId)}
                                  className="shrink-0"
                                  aria-label={expandedCategories[categoryId] ? "Collapse subcategories" : "Expand subcategories"}
                                >
                                  {expandedCategories[categoryId] ? (
                                    <ChevronUp size={16} className="text-[#004C48]" />
                                  ) : (
                                    <ChevronDown size={16} className="text-[#004C48]" />
                                  )}
                                </button>
                              </div>

                              {expandedCategories[categoryId] && (
                                <div className="space-y-2.5 ml-3 border-l-2 border-gray-100 pl-3">
                                  {subcategories.map((subcat) => (
                                    <label
                                      key={subcat.id}
                                      className="flex items-center gap-3 cursor-pointer hover:text-[#004C48] transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={String(selectedSubCategoryId) === String(subcat.id)}
                                        onChange={() => handleSubcategoryChange(subcat.id)}
                                        className="w-4 h-4 accent-orange-400 shrink-0 cursor-pointer"
                                      />
                                      <span className="text-sm text-gray-700 leading-none truncate whitespace-nowrap overflow-hidden flex-1 min-w-0 text-left">
                                        {subcat.name}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-3 mb-5 items-center bg-[#FFFFFF] p-4 rounded-lg">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    disabled={countriesLoading}
                    className="w-full appearance-none text-base border border-gray-300 rounded px-3 py-2 pr-7 text-gray-700 bg-[#FDF2EB] focus:outline-none cursor-pointer disabled:opacity-70"
                  >
                    <option value="">Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setCurrentPage(1);
                    }}
                    disabled={!selectedCountry || regionsLoading}
                    className="w-full appearance-none text-base border border-gray-300 rounded px-3 py-2 pr-7 text-gray-700 bg-[#FDF2EB] focus:outline-none cursor-pointer disabled:opacity-70"
                  >
                    <option value="">{selectedCountry ? "Select Region" : "Region"}</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    disabled={!selectedRegion || citiesLoading}
                    className="w-full appearance-none text-base border border-gray-300 rounded px-3 py-2 pr-7 text-gray-700 bg-[#FDF2EB] focus:outline-none cursor-pointer disabled:opacity-70"
                  >
                    <option value="">{selectedRegion ? "Select City" : "City"}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="lg:hidden h-11 px-4 rounded-md border border-gray-200 bg-[#F4F5F7] text-[#1B2440] inline-flex items-center gap-2.5 shrink-0 hover:bg-[#ECEFF3] transition-colors"
                  aria-label="Open filters"
                >
                  <Filter size={18} strokeWidth={2.2} />
                  <span className="text-base leading-none font-semibold">Filter</span>
                </button>
              </div>

              {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer bg-white flex flex-col"
                    >
                      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                        <img
                          src={service.image || "/logo.png"}
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 flex flex-col flex-1" style={{ backgroundColor: "#FDF2ED" }}>
                        <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight uppercase">{service.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 leading-snug line-clamp-2 grow">{service.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-lg font-bold text-orange-500">{service.price || "$0"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-800 mb-4">No services found</p>
                    <p className="text-sm text-gray-600 mb-6">Try adjusting your filters or reset filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      <RotateCcw size={16} />
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}

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
          </div>

          {isFilterPanelOpen && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsFilterPanelOpen(false)} />
          )}

          <div
            className={`fixed top-0 left-0 h-full w-[85%] sm:w-96 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              isFilterPanelOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 pb-24 space-y-4">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#004C48]/10 text-[#004C48] rounded-lg hover:bg-[#004C48]/20 transition-colors font-medium text-sm"
                >
                  <RotateCcw size={14} />
                  Reset Filters
                </button>
              )}

              <div className="p-4 bg-[#fbfbfb] border border-[#E4E7E9] rounded-lg">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Price Range</h3>

                <div className="relative w-full h-6 flex items-center mb-6">
                  <div className="absolute w-full h-1 bg-gray-200 rounded-full" />

                  <div
                    className="absolute h-1 rounded-full"
                    style={{
                      backgroundColor: "#004C48",
                      left: `${(minPrice / 5000) * 100}%`,
                      right: `${100 - (maxPrice / 5000) * 100}%`,
                    }}
                  />

                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    onPointerUp={applyCustomPriceRange}
                    onKeyUp={applyCustomPriceRange}
                    className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
                    style={{ zIndex: minPrice > 2500 ? 5 : 3 }}
                  />

                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    onPointerUp={applyCustomPriceRange}
                    onKeyUp={applyCustomPriceRange}
                    className="absolute w-full bg-transparent cursor-pointer appearance-none pointer-events-none range-input"
                    style={{ zIndex: maxPrice < 2500 ? 5 : 4 }}
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <div className="bg-[#0F5C5C] text-white rounded px-3 py-2 text-sm font-semibold text-center mb-2">
                      Min Price
                    </div>
                    <div className="flex items-center border border-gray-300 rounded px-2 py-1.5 bg-white">
                      <span className="text-gray-600 text-xs">$</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceInputChange}
                        onBlur={handleMinPriceInputBlur}
                        onKeyDown={handlePriceInputKeyDown}
                        min="0"
                        max="5000"
                        className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#0F5C5C] text-white rounded px-3 py-2 text-sm font-semibold text-center mb-2">
                      Max Price
                    </div>
                    <div className="flex items-center border border-gray-300 rounded px-2 py-1.5 bg-white">
                      <span className="text-gray-600 text-xs">$</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceInputChange}
                        onBlur={handleMaxPriceInputBlur}
                        onKeyDown={handlePriceInputKeyDown}
                        min="0"
                        max="5000"
                        className="flex-1 text-xs border-none outline-none bg-transparent ml-1 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={selectedPriceRange === range.value}
                        onChange={() => handlePriceRangeSelect(range)}
                        className="accent-[#E97C35]"
                      />
                      <span className="text-sm text-gray-600">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <h3 className="text-base font-bold text-gray-800 p-4">Category</h3>

                {categoryOpen && (
                  <div className="w-full">
                    <div className="space-y-4 max-h-96 overflow-y-auto border-t border-gray-200 p-4 bg-gray-50">
                      {categoriesLoading && <p className="text-sm text-gray-500">Loading categories...</p>}
                      {!categoriesLoading &&
                        categories.map((category) => {
                          const categoryId = String(category.id);
                          const subcategories = subcategoriesByCategory[categoryId] || [];

                          return (
                            <div key={categoryId} className="w-full min-w-0">
                              <div className="flex items-center justify-between w-full mb-3 pb-2 gap-3 group">
                                <button
                                  type="button"
                                  onClick={() => handleCategoryFilter(categoryId)}
                                  className="text-sm font-bold text-[#004C48] uppercase tracking-wide truncate whitespace-nowrap overflow-hidden text-left flex-1 min-w-0"
                                >
                                  {category.name}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleCategoryExpand(categoryId)}
                                  className="shrink-0"
                                  aria-label={expandedCategories[categoryId] ? "Collapse subcategories" : "Expand subcategories"}
                                >
                                  {expandedCategories[categoryId] ? (
                                    <ChevronUp size={16} className="text-[#004C48]" />
                                  ) : (
                                    <ChevronDown size={16} className="text-[#004C48]" />
                                  )}
                                </button>
                              </div>

                              {expandedCategories[categoryId] && (
                                <div className="space-y-2.5 ml-3 border-l-2 border-gray-100 pl-3">
                                  {subcategories.map((subcat) => (
                                    <label
                                      key={subcat.id}
                                      className="flex items-center gap-3 cursor-pointer hover:text-[#004C48] transition-colors"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={String(selectedSubCategoryId) === String(subcat.id)}
                                        onChange={() => handleSubcategoryChange(subcat.id)}
                                        className="w-4 h-4 accent-orange-400 shrink-0 cursor-pointer"
                                      />
                                      <span className="text-sm text-gray-700 leading-none truncate whitespace-nowrap overflow-hidden flex-1 min-w-0 text-left">
                                        {subcat.name}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}