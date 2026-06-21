import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectCategoriesStatus,
} from "../../../features/categories/categoriesSlice";
import SkeletonCategoryCard from "../../../components/SkeletonCategoryCard";

const getCategorySource = (category) =>
  String(category?.source || category?.sourceLabel || category?.type || "")
    .toLowerCase()
    .trim();

export default function CategoryGrid({ searchQuery = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const status = useSelector(selectCategoriesStatus);
  const error = useSelector(selectCategoriesError);
  const [imgErrors, setImgErrors] = useState({});
  const [selectedTab, setSelectedTab] = useState("service");

  const trimmedSearch = searchQuery.trim();
  const isSearching = Boolean(trimmedSearch);

  useEffect(() => {
    if (!isSearching && categories.length > 0 && status === "succeeded") {
      return;
    }

    const delay = isSearching ? 350 : 0;
    const timer = setTimeout(() => {
      dispatch(fetchCategories(trimmedSearch));
    }, delay);

    return () => clearTimeout(timer);
  }, [dispatch, trimmedSearch, isSearching, categories.length, status]);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const displayedCategories = useMemo(
    () =>
      categories.filter((category) => {
        const source = getCategorySource(category);

        if (selectedTab === "service") return source.includes("service");
        if (selectedTab === "event") return source.includes("event");
        return true;
      }),
    [categories, selectedTab]
  );

  const handleCategoryClick = (category) => {
    const source = getCategorySource(category);

    if (source.includes("service")) {
      navigate(`/services?categoryId=${category.id}`);
      return;
    }

    if (source.includes("event")) {
      navigate(`/events?categoryId=${category.id}`);
      return;
    }

    navigate(`/services?categoryId=${category.id}`);
  };

  const isInitialLoading = loading && categories.length === 0;
  const showGrid = displayedCategories.length > 0;
  const showEmptyTabState =
    !isInitialLoading && !loading && displayedCategories.length === 0 && !isSearching;

  if (error && categories.length === 0) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="relative z-10 bg-white py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 inline-flex items-center gap-2 rounded-lg bg-[#EFD4C2] px-2 py-1.5">
          <button
            onClick={() => setSelectedTab("service")}
            className={`rounded-lg px-5 py-2.5 text-base font-medium transition-all ${
              selectedTab === "service"
                ? "bg-[#E97933] text-white shadow-[0_2px_8px_rgba(233,121,51,0.35)]"
                : "text-[#5A3D2E]"
            }`}
          >
            Service
          </button>
          <button
            onClick={() => setSelectedTab("event")}
            className={`rounded-lg px-5 py-2.5 text-base font-medium transition-all ${
              selectedTab === "event"
                ? "bg-[#E97933] text-white shadow-[0_2px_8px_rgba(233,121,51,0.35)]"
                : "text-[#5A3D2E]"
            }`}
          >
            Events
          </button>
        </div>

        {isSearching && !loading && displayedCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No categories found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}

        {showEmptyTabState && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No {selectedTab === "service" ? "service" : "event"} categories found.
            </p>
          </div>
        )}

        {isInitialLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 items-start">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCategoryCard key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {showGrid && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 items-start">
            {displayedCategories.map((category) => (
              <div
                key={`${category.id}-${getCategorySource(category)}`}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col overflow-hidden bg-white cursor-pointer rounded-md shadow-sm"
              >
                <div className="overflow-hidden h-40 sm:h-48 md:h-52 shrink-0 bg-gray-100">
                  {!imgErrors[category.id] ? (
                    <img
                      src={category.image}
                      alt={category.title}
                      onError={() => handleImgError(category.id)}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-[10px] text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="bg-[#FDF2ED] p-3 flex flex-col items-center justify-center min-h-[70px]">
                  <h3 className="text-base font-medium text-gray-800 text-center uppercase tracking-tight leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 font-medium mt-1 uppercase">
                    {category.type || category.source || category.sourceLabel || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && categories.length > 0 && (
          <p className="mt-4 text-center text-sm text-gray-500">Updating categories...</p>
        )}

        {error && categories.length > 0 && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
