import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../../features/categories/categoriesSlice";
import SkeletonCategoryCard from "../../../components/SkeletonCategoryCard";

export default function CategoryGrid({ searchQuery = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);
  const [imgErrors, setImgErrors] = useState({});
  const [selectedTab, setSelectedTab] = useState("service");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchCategories(searchQuery));
    }, 350);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const isSearching = Boolean(searchQuery.trim());

  const displayedCategories = categories.filter((category) => {
    const source = String(category?.source || category?.sourceLabel || "")
      .toLowerCase()
      .trim();

    if (selectedTab === "service") return source.includes("service");
    if (selectedTab === "event") return source.includes("event");
    return true;
  });

  const handleCategoryClick = (category) => {
    const source = String(category?.source || category?.sourceLabel || "")
      .toLowerCase()
      .trim();

    if (source.includes("service")) {
      navigate(`/services?categoryId=${category.id}`);
      return;
    }

    if (source.includes("event")) {
      navigate(`/events?categoryId=${category.id}`);
      return;
    }

    // Fallback: send unknown category types to services listing.
    navigate(`/services?categoryId=${category.id}`);
  };

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white py-14 md:pb-20 md:pt-10">
      <div className="container mx-auto px-4">
        {/* Tabs */}
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

        {/* No results message */}
        {displayedCategories.length === 0 && isSearching && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No categories found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Skeleton Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 items-stretch">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCategoryCard key={index} />
            ))}
          </div>
        )}

        {/* Responsive Grid Layout */}
        {!loading && displayedCategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 items-stretch">
            {displayedCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col overflow-hidden bg-white cursor-pointer rounded-md h-full"
              >
                {/* Image Container - Aspect Ratio 4:3 matches the image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 shrink-0">
                  {!imgErrors[category.id] ? (
                    <img
                      src={category.image}
                      alt={category.title}
                      onError={() => handleImgError(category.id)}
                      className="absolute inset-0 w-full h-full object-cover "
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-[10px] text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Text Area - Matches the light peach/cream background in image */}
                <div className="bg-[#FDF2ED] p-3 flex flex-col items-center justify-center min-h-17.5 flex-1">
                  <h3 className="text-base font-medium text-gray-800 text-center uppercase tracking-tight leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 font-medium mt-1 uppercase ">
                    {category.type || category.source || category.sourceLabel || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}