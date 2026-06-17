import apiClient from "../../services/apiClient";
import { HOME_SEARCH_ENDPOINTS } from "./homeSearchEndpoints";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const normalizeSubcategories = (rawSubs) => {
  const list = normalizeList(rawSubs);

  return list
    .map((sub) => ({
      id: sub?.id ?? sub?._id ?? sub?.subCategoryId ?? sub?.name,
      name: sub?.name ?? sub?.subCategoryName ?? sub?.title,
    }))
    .filter((item) => item.name);
};

const normalizeCategories = (payload) => {
  const list = normalizeList(payload);

  return list
    .map((item) => {
      const subcategorySource =
        item?.subcategories ?? item?.subCategories ?? item?.children ?? item?.subCategoryList ?? [];

      return {
        id: item?.id ?? item?._id ?? item?.categoryId ?? item?.name,
        name: item?.name ?? item?.categoryName ?? item?.title,
        image: item?.image ?? item?.imageUrl ?? item?.thumbnail ?? item?.icon,
        subcategories: normalizeSubcategories(subcategorySource),
      };
    })
    .filter((item) => item.name);
};

const normalizeCountries = (payload) => {
  const list = normalizeList(payload);

  return list
    .map((item) => ({
      id: item?.id ?? item?._id ?? item?.countryId ?? item?.name,
      name: item?.countryName ?? item?.name ?? item?.title,
    }))
    .filter((item) => item.name);
};

const normalizeCountriesWithRegions = (payload) => {
  const list = normalizeList(payload);

  return list
    .map((country) => {
      const rawRegions =
        country?.regions ?? country?.regionList ?? country?.locations ?? country?.states ?? [];

      return {
        id: country?.id ?? country?._id ?? country?.countryId ?? country?.name,
        name: country?.countryName ?? country?.name ?? country?.title,
        regions: normalizeList(rawRegions)
          .map((region) => ({
            id: region?.id ?? region?._id ?? region?.regionId ?? region?.name,
            name: region?.regionName ?? region?.name ?? region?.title,
          }))
          .filter((region) => region.name),
      };
    })
    .filter((item) => item.name);
};

export const fetchCategoriesByTabAPI = async (tab) => {
  const endpoint = tab === "Events" ? HOME_SEARCH_ENDPOINTS.EVENT_CATEGORIES : HOME_SEARCH_ENDPOINTS.SERVICE_CATEGORIES;
  const response = await apiClient.get(endpoint);
  return normalizeCategories(response.data);
};

export const fetchCountriesAPI = async () => {
  const response = await apiClient.get(HOME_SEARCH_ENDPOINTS.COUNTRIES);
  return normalizeCountries(response.data);
};

export const fetchCountriesWithRegionsAPI = async () => {
  const response = await apiClient.get(HOME_SEARCH_ENDPOINTS.COUNTRIES_WITH_REGIONS);
  return normalizeCountriesWithRegions(response.data);
};
