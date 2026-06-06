import apiClient from "../../services/apiClient";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const normalizeCategory = (item, fallbackType = "general") => {
  const source = item?.type || item?.categoryType || item?.source || fallbackType;

  return {
    id: String(item?.id ?? item?._id ?? item?.categoryId ?? item?.name),
    title: item?.title ?? item?.name ?? item?.categoryName ?? "Untitled Category",
    image: item?.image ?? item?.imageUrl ?? item?.thumbnail ?? "/logo.png",
    source,
    sourceLabel:
      source === "event" ? "Events" : source === "service" ? "Services" : "Category",
  };
};

const uniqueByIdAndSource = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.id}-${item.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const fetchServiceCategories = async () => {
  const response = await apiClient.get("/api/categories/service");
  return normalizeList(response.data).map((item) => normalizeCategory(item, "service"));
};

const fetchEventCategories = async () => {
  const response = await apiClient.get("/api/categories/event");
  return normalizeList(response.data).map((item) => normalizeCategory(item, "event"));
};

const searchCategories = async (query) => {
  const response = await apiClient.get("/api/categories/search", {
    params: { q: query },
  });

  return normalizeList(response.data).map((item) => normalizeCategory(item));
};

export const fetchCategoriesAPI = async (query = "") => {
  const trimmedQuery = String(query || "").trim();

  if (trimmedQuery) {
    return uniqueByIdAndSource(await searchCategories(trimmedQuery));
  }

  const [serviceCategories, eventCategories] = await Promise.all([
    fetchServiceCategories(),
    fetchEventCategories(),
  ]);

  return uniqueByIdAndSource([...serviceCategories, ...eventCategories]);
};
