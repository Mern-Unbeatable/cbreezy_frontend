import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createAdminCountryAPI,
  deleteAdminCountryAPI,
  deleteAdminRegionAPI,
  deleteAdminListingAPI,
  deleteAdminEventCategoryAPI,
  deleteAdminServiceCategoryAPI,
  deleteAdminServiceSubCategoryAPI,
  fetchAdminListingByIdAPI,
  fetchAdminListingsAPI,
  createAdminPricingPlanAPI,
  createAdminRegionAPI,
  createAdminSubAdminAPI,
  createEventCategoryAPI,
  createServiceCategoryAPI,
  createServiceSubCategoryAPI,
  deleteAdminUserAPI,
  deleteAdminPricingPlanAPI,
  fetchAdminCategoriesAPI,
  fetchAdminCountriesWithRegionsAPI,
  fetchAdminDashboardOverviewAPI,
  fetchAdminPricingPlansAPI,
  fetchAdminUserByIdAPI,
  fetchAdminUsersAPI,
  updateAdminCountryAPI,
  updateAdminEventCategoryAPI,
  updateAdminListingStatusAPI,
  updateAdminPricingPlanAPI,
  updateAdminRegionAPI,
  updateAdminServiceCategoryAPI,
  updateAdminSubAdminAPI,
  updateAdminSubAdminStatusAPI,
  createAdminCityAPI,
  updateAdminCityAPI,
  deleteAdminCityAPI,
} from "./adminAPI";

const serializeListingsParams = (params = {}) =>
  JSON.stringify({
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 6,
    status: params.status ? String(params.status).toUpperCase() : "ALL",
  });

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Failed to load admin dashboard";

export const fetchAdminDashboardOverview = createAsyncThunk(
  "admin/fetchAdminDashboardOverview",
  async (period = "thisYear", { rejectWithValue }) => {
    try {
      return await fetchAdminDashboardOverviewAPI(period);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchAdminUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchAdminUsersAPI(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminListings = createAsyncThunk(
  "admin/fetchAdminListings",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchAdminListingsAPI(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminListingById = createAsyncThunk(
  "admin/fetchAdminListingById",
  async (listingId, { rejectWithValue }) => {
    try {
      return await fetchAdminListingByIdAPI(listingId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminListingStatus = createAsyncThunk(
  "admin/updateAdminListingStatus",
  async ({ listingId, status }, { rejectWithValue }) => {
    try {
      return await updateAdminListingStatusAPI({ listingId, status });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminListing = createAsyncThunk(
  "admin/deleteAdminListing",
  async (listingId, { rejectWithValue }) => {
    try {
      return await deleteAdminListingAPI(listingId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminUserById = createAsyncThunk(
  "admin/fetchAdminUserById",
  async (managedUserId, { rejectWithValue }) => {
    try {
      return await fetchAdminUserByIdAPI(managedUserId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminUser = createAsyncThunk(
  "admin/deleteAdminUser",
  async (managedUserId, { rejectWithValue }) => {
    try {
      await deleteAdminUserAPI(managedUserId);
      return managedUserId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createAdminSubAdmin = createAsyncThunk(
  "admin/createAdminSubAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      return await createAdminSubAdminAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminSubAdmin = createAsyncThunk(
  "admin/updateAdminSubAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateAdminSubAdminAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminSubAdminStatus = createAsyncThunk(
  "admin/updateAdminSubAdminStatus",
  async ({ managedUserId, isActive }, { rejectWithValue }) => {
    try {
      return await updateAdminSubAdminStatusAPI({ managedUserId, isActive });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminCategories = createAsyncThunk(
  "admin/fetchAdminCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAdminCategoriesAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createAdminCategory = createAsyncThunk(
  "admin/createAdminCategory",
  async ({ type, name, image }, { rejectWithValue }) => {
    try {
      if (type === "event") {
        const category = await createEventCategoryAPI({ name, image });
        return { type: "event", category };
      }

      const category = await createServiceCategoryAPI({ name, image });
      return { type: "service", category };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createAdminSubCategory = createAsyncThunk(
  "admin/createAdminSubCategory",
  async ({ serviceCategoryId, name, image }, { rejectWithValue }) => {
    try {
      return await createServiceSubCategoryAPI({ serviceCategoryId, name, image });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminServiceCategory = createAsyncThunk(
  "admin/updateAdminServiceCategory",
  async ({ categoryId, categoryName, subcategories }, { rejectWithValue }) => {
    try {
      return await updateAdminServiceCategoryAPI({ categoryId, categoryName, subcategories });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminEventCategory = createAsyncThunk(
  "admin/updateAdminEventCategory",
  async ({ categoryId, categoryName }, { rejectWithValue }) => {
    try {
      return await updateAdminEventCategoryAPI({ categoryId, categoryName });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminEventCategory = createAsyncThunk(
  "admin/deleteAdminEventCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await deleteAdminEventCategoryAPI(categoryId);
      return String(response?.categoryId || categoryId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminServiceCategory = createAsyncThunk(
  "admin/deleteAdminServiceCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await deleteAdminServiceCategoryAPI(categoryId);
      return String(response?.categoryId || categoryId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminServiceSubCategory = createAsyncThunk(
  "admin/deleteAdminServiceSubCategory",
  async ({ categoryId, subCategoryId }, { rejectWithValue }) => {
    try {
      const response = await deleteAdminServiceSubCategoryAPI({ categoryId, subCategoryId });
      return {
        categoryId: String(response?.categoryId || categoryId),
        subCategoryId: String(response?.subCategoryId || subCategoryId),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminPricingData = createAsyncThunk(
  "admin/fetchAdminPricingData",
  async (query = "", { rejectWithValue }) => {
    try {
      const [pricingPlans, locationPayload] = await Promise.all([
        fetchAdminPricingPlansAPI(),
        fetchAdminCountriesWithRegionsAPI(query),
      ]);

      return {
        pricingPlans,
        countries: locationPayload.countries,
        regions: locationPayload.regions,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createAdminPricingPlan = createAsyncThunk(
  "admin/createAdminPricingPlan",
  async ({ title, price, duration }, { rejectWithValue }) => {
    try {
      return await createAdminPricingPlanAPI({ title, price, duration });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminPricingPlan = createAsyncThunk(
  "admin/updateAdminPricingPlan",
  async ({ pricingPlanId, title, price, duration }, { rejectWithValue }) => {
    try {
      return await updateAdminPricingPlanAPI({ pricingPlanId, title, price, duration });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminPricingPlan = createAsyncThunk(
  "admin/deleteAdminPricingPlan",
  async (pricingPlanId, { rejectWithValue }) => {
    try {
      await deleteAdminPricingPlanAPI(pricingPlanId);
      return String(pricingPlanId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createAdminCountry = createAsyncThunk(
  "admin/createAdminCountry",
  async (name, { rejectWithValue }) => {
    try {
      return await createAdminCountryAPI(name);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminCountry = createAsyncThunk(
  "admin/deleteAdminCountry",
  async (countryId, { rejectWithValue }) => {
    try {
      const response = await deleteAdminCountryAPI(countryId);
      return String(response?.countryId || countryId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createAdminRegion = createAsyncThunk(
  "admin/createAdminRegion",
  async ({ countryId, name }, { rejectWithValue }) => {
    try {
      return await createAdminRegionAPI({ countryId, name });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminRegion = createAsyncThunk(
  "admin/deleteAdminRegion",
  async ({ countryId, regionId }, { rejectWithValue }) => {
    try {
      const response = await deleteAdminRegionAPI({ countryId, regionId });
      return {
        countryId: String(response?.countryId || countryId),
        regionId: String(response?.regionId || regionId),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminCountry = createAsyncThunk(
  "admin/updateAdminCountry",
  async ({ countryId, name }, { rejectWithValue }) => {
    try {
      return await updateAdminCountryAPI({ countryId, name });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminRegion = createAsyncThunk(
  "admin/updateAdminRegion",
  async ({ countryId, regionId, name }, { rejectWithValue }) => {
    try {
      return await updateAdminRegionAPI({ countryId, regionId, name });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// City Actions
export const createAdminCity = createAsyncThunk(
  "admin/createAdminCity",
  async ({ countryId, regionId, name }, { rejectWithValue }) => {
    try {
      const response = await createAdminCityAPI({ regionId, name });
      return {
        countryId: String(countryId),
        regionId: String(regionId),
        city: response.city,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAdminCity = createAsyncThunk(
  "admin/updateAdminCity",
  async ({ countryId, regionId, cityId, name }, { rejectWithValue }) => {
    try {
      const response = await updateAdminCityAPI({ regionId, cityId, name });
      return {
        countryId: String(countryId),
        regionId: String(regionId),
        cityId: String(cityId),
        city: response.city,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAdminCity = createAsyncThunk(
  "admin/deleteAdminCity",
  async ({ countryId, regionId, cityId }, { rejectWithValue }) => {
    try {
      const response = await deleteAdminCityAPI({ regionId, cityId });
      return {
        countryId: String(countryId),
        regionId: String(response?.regionId || regionId),
        cityId: String(response?.cityId || cityId),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  yearOptions: ["This year", "Last year", "This month", "Last month", "Last 3 months", "Last 6 months"],
  dashboard: {
    stats: [],
    sales: {
      months: [],
      salesData: [],
      gridTicks: [],
      yAxisLabels: [],
      tooltipIndex: 0,
      maxValue: 1,
    },
  },
  dashboardLoading: false,
  dashboardError: null,
  revenue: {
    stats: [],
    sales: {
      months: [],
      salesData: [],
      gridTicks: [],
      yAxisLabels: [],
      tooltipIndex: 0,
      maxValue: 1,
    },
  },
  listingTabs: [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "suspended", label: "Suspended" },
  ],
  listings: [],
  listingsLoading: false,
  listingsError: null,
  listingsRequestKey: "",
  updateListingStatusLoadingById: {},
  updateListingStatusError: null,
  deleteListingLoadingById: {},
  deleteListingError: null,
  listingsPagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  },
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  },
  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,
  deleteUserLoadingById: {},
  deleteUserError: null,
  createSubAdminLoading: false,
  createSubAdminError: null,
  updateSubAdminLoadingById: {},
  updateSubAdminError: null,
  updateSubAdminStatusLoadingById: {},
  updateSubAdminStatusError: null,
  serviceCategories: [],
  eventCategories: [],
  categoriesLoading: false,
  categoriesError: null,
  createCategoryLoading: false,
  createCategoryError: null,
  createSubCategoryLoading: false,
  createSubCategoryError: null,
  deleteEventCategoryLoadingById: {},
  deleteEventCategoryError: null,
  categories: [],
  subCategories: [],
  pricingPlans: [],
  countries: [],
  regions: [],
  pricingLoading: false,
  pricingError: null,
  createPricingLoading: false,
  createPricingError: null,
  deletePricingLoadingById: {},
  deletePricingError: null,
  locationsLoading: false,
  locationsError: null,
  createCountryLoading: false,
  createCountryError: null,
  createRegionLoading: false,
  createRegionError: null,
  createCityLoading: false,
  createCityError: null,
  listingDetail: null,
  listingDetailLoading: false,
  listingDetailError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    approveListing: (state, action) => {
      const listing = state.listings.find((item) => String(item.id) === String(action.payload));
      if (listing) {
        listing.status = "approved";
      }
    },
    rejectListing: (state, action) => {
      const listing = state.listings.find((item) => String(item.id) === String(action.payload));
      if (listing) {
        listing.status = "suspended";
      }
    },
    deleteListing: (state, action) => {
      state.listings = state.listings.filter((item) => item.id !== action.payload);
    },
    addCategory: (state, action) => {
      const value = action.payload?.trim();
      if (value) {
        state.categories.push(value);
      }
    },
    addSubCategory: (state, action) => {
      const value = action.payload?.trim();
      if (value) {
        state.subCategories.push(value);
      }
    },
    renameServiceCategory: (state, action) => {
      const categoryId = String(action.payload?.categoryId || "");
      const nextName = String(action.payload?.name || "").trim();
      if (!categoryId || !nextName) return;

      state.serviceCategories = state.serviceCategories.map((item) =>
        String(item.id) === categoryId ? { ...item, name: nextName } : item,
      );

      state.categories = [
        ...state.serviceCategories.map((item) => item.name),
        ...state.eventCategories.map((item) => item.name),
      ];
    },
    renameEventCategory: (state, action) => {
      const categoryId = String(action.payload?.categoryId || "");
      const nextName = String(action.payload?.name || "").trim();
      if (!categoryId || !nextName) return;

      state.eventCategories = state.eventCategories.map((item) =>
        String(item.id) === categoryId ? { ...item, name: nextName } : item,
      );

      state.categories = [
        ...state.serviceCategories.map((item) => item.name),
        ...state.eventCategories.map((item) => item.name),
      ];
    },
    renameServiceSubCategory: (state, action) => {
      const categoryId = String(action.payload?.categoryId || "");
      const subCategoryId = String(action.payload?.subCategoryId || "");
      const nextName = String(action.payload?.name || "").trim();
      if (!categoryId || !subCategoryId || !nextName) return;

      state.serviceCategories = state.serviceCategories.map((item) => {
        if (String(item.id) !== categoryId) return item;

        const nextSubcategories = (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) =>
          String(sub.id) === subCategoryId ? { ...sub, name: nextName } : sub,
        );

        return {
          ...item,
          subcategories: nextSubcategories,
        };
      });

      state.subCategories = state.serviceCategories.flatMap((item) =>
        (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
      );
    },
    updateServiceCategoryWithSubCategories: (state, action) => {
      const categoryId = String(action.payload?.categoryId || "");
      const nextCategoryName = String(action.payload?.categoryName || "").trim();
      const nextSubCategoryNames = Array.isArray(action.payload?.subCategoryNames)
        ? action.payload.subCategoryNames
            .map((name) => String(name || "").trim())
            .filter(Boolean)
        : [];

      if (!categoryId || !nextCategoryName) return;

      state.serviceCategories = state.serviceCategories.map((item) => {
        if (String(item.id) !== categoryId) return item;

        const existingSubcategories = Array.isArray(item.subcategories) ? item.subcategories : [];
        const nextSubcategories = nextSubCategoryNames.map((name, index) => {
          const matched = existingSubcategories.find((sub) => String(sub.name).trim() === name);
          return matched || { id: `${categoryId}-local-${index}-${name}`, name };
        });

        return {
          ...item,
          name: nextCategoryName,
          subcategories: nextSubcategories,
        };
      });

      state.categories = [
        ...state.serviceCategories.map((item) => item.name),
        ...state.eventCategories.map((item) => item.name),
      ];
      state.subCategories = state.serviceCategories.flatMap((item) =>
        (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
      );
    },
    deleteServiceCategoryWithSubCategories: (state, action) => {
      const categoryId = String(action.payload?.categoryId || "");
      if (!categoryId) return;

      state.serviceCategories = state.serviceCategories.filter((item) => String(item.id) !== categoryId);
      state.categories = [
        ...state.serviceCategories.map((item) => item.name),
        ...state.eventCategories.map((item) => item.name),
      ];
      state.subCategories = state.serviceCategories.flatMap((item) =>
        (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
      );
    },
    deleteServiceSubCategory: (state, action) => {
      const categoryId = String(action.payload?.categoryId || "");
      const subCategoryId = String(action.payload?.subCategoryId || "");
      if (!categoryId || !subCategoryId) return;

      state.serviceCategories = state.serviceCategories.map((item) => {
        if (String(item.id) !== categoryId) return item;

        return {
          ...item,
          subcategories: (Array.isArray(item.subcategories) ? item.subcategories : []).filter(
            (sub) => String(sub.id) !== subCategoryId,
          ),
        };
      });

      state.subCategories = state.serviceCategories.flatMap((item) =>
        (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
      );
    },
    addPricingPlan: (state, action) => {
      const title = action.payload?.title?.trim();
      const price = action.payload?.price?.trim();
      if (!title || !price) return;

      const nextId = state.pricingPlans.length
        ? Math.max(...state.pricingPlans.map((item) => item.id)) + 1
        : 1;

      state.pricingPlans.push({ id: nextId, title, price });
    },
    updatePricingPlan: (state, action) => {
      const { id, title, price, duration } = action.payload;
      const target = state.pricingPlans.find((item) => item.id === id);
      if (target) {
        target.title = title?.trim() || target.title;
        target.price = price?.trim() || target.price;
        target.duration = duration?.trim() || target.duration;
      }
    },
    deletePricingPlan: (state, action) => {
      state.pricingPlans = state.pricingPlans.filter((item) => item.id !== action.payload);
    },
    addCountry: (state, action) => {
      const value = action.payload?.trim();
      if (value) {
        state.countries.push(value);
      }
    },
    addRegion: (state, action) => {
      const value = action.payload?.trim();
      if (value) {
        state.regions.push(value);
      }
    },
    updateCountryLocal: (state, action) => {
      const countryId = String(action.payload?.countryId || "");
      const name = String(action.payload?.name || "").trim();
      if (!countryId || !name) return;

      state.countries = state.countries.map((country) =>
        String(country.id) === countryId ? { ...country, name } : country,
      );
    },
    deleteCountryLocal: (state, action) => {
      const countryId = String(action.payload?.countryId || "");
      if (!countryId) return;

      state.countries = state.countries.filter((country) => String(country.id) !== countryId);
      state.regions = state.countries.flatMap((country) =>
        (Array.isArray(country.regions) ? country.regions : []).map((regionItem) => regionItem.name),
      );
    },
    updateRegionLocal: (state, action) => {
      const countryId = String(action.payload?.countryId || "");
      const regionId = String(action.payload?.regionId || "");
      const name = String(action.payload?.name || "").trim();
      if (!countryId || !regionId || !name) return;

      state.countries = state.countries.map((country) => {
        if (String(country.id) !== countryId) return country;

        return {
          ...country,
          regions: (Array.isArray(country.regions) ? country.regions : []).map((regionItem) =>
            String(regionItem.id) === regionId ? { ...regionItem, name } : regionItem,
          ),
        };
      });

      state.regions = state.countries.flatMap((country) =>
        (Array.isArray(country.regions) ? country.regions : []).map((regionItem) => regionItem.name),
      );
    },
    deleteRegionLocal: (state, action) => {
      const countryId = String(action.payload?.countryId || "");
      const regionId = String(action.payload?.regionId || "");
      if (!countryId || !regionId) return;

      state.countries = state.countries.map((country) => {
        if (String(country.id) !== countryId) return country;

        return {
          ...country,
          regions: (Array.isArray(country.regions) ? country.regions : []).filter(
            (regionItem) => String(regionItem.id) !== regionId,
          ),
        };
      });

      state.regions = state.countries.flatMap((country) =>
        (Array.isArray(country.regions) ? country.regions : []).map((regionItem) => regionItem.name),
      );
    },
    clearDashboardError: (state) => {
      state.dashboardError = null;
    },
    clearAdminUsersError: (state) => {
      state.usersError = null;
      state.deleteUserError = null;
      state.selectedUserError = null;
    },
    clearAdminCategoriesError: (state) => {
      state.categoriesError = null;
      state.createCategoryError = null;
      state.createSubCategoryError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardOverview.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchAdminDashboardOverview.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = null;
        state.yearOptions = action.payload.yearOptions;
        state.dashboard = action.payload.dashboard;
      })
      .addCase(fetchAdminDashboardOverview.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload || "Failed to load admin dashboard";
      })
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAdminListings.pending, (state, action) => {
        state.listingsLoading = true;
        state.listingsError = null;
        state.listings = [];
        state.listingsRequestKey = serializeListingsParams(action.meta.arg);
      })
      .addCase(fetchAdminListings.fulfilled, (state, action) => {
        if (serializeListingsParams(action.meta.arg) !== state.listingsRequestKey) {
          return;
        }

        state.listingsLoading = false;
        state.listings = action.payload.items;
        state.listingsPagination = action.payload.pagination;
      })
      .addCase(fetchAdminListings.rejected, (state, action) => {
        if (serializeListingsParams(action.meta.arg) !== state.listingsRequestKey) {
          return;
        }

        state.listingsLoading = false;
        state.listingsError = action.payload || "Failed to load listings";
        state.listings = [];
        state.listingsPagination = {
          page: 1,
          limit: 6,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(fetchAdminListingById.pending, (state) => {
        state.listingDetailLoading = true;
        state.listingDetailError = null;
      })
      .addCase(fetchAdminListingById.fulfilled, (state, action) => {
        state.listingDetailLoading = false;
        state.listingDetail = action.payload;
      })
      .addCase(fetchAdminListingById.rejected, (state, action) => {
        state.listingDetailLoading = false;
        state.listingDetail = null;
        state.listingDetailError = action.payload || "Failed to load listing details";
      })
      .addCase(updateAdminListingStatus.pending, (state, action) => {
        const listingId = String(action.meta.arg?.listingId || "");
        if (listingId) {
          state.updateListingStatusLoadingById[listingId] = true;
        }
        state.updateListingStatusError = null;
      })
      .addCase(updateAdminListingStatus.fulfilled, (state, action) => {
        const listingId = String(action.payload?.listingId || "");
        if (listingId) {
          state.updateListingStatusLoadingById[listingId] = false;
        }

        state.listings = state.listings.map((item) => {
          if (String(item.id) !== listingId) return item;

          if (action.payload?.item) {
            return {
              ...item,
              ...action.payload.item,
            };
          }

          return {
            ...item,
            status: action.payload?.status || item.status,
          };
        });

        if (state.listingDetail && String(state.listingDetail.id) === listingId) {
          state.listingDetail = {
            ...state.listingDetail,
            ...(action.payload?.item || {}),
            status: action.payload?.status || state.listingDetail.status,
          };
        }
      })
      .addCase(updateAdminListingStatus.rejected, (state, action) => {
        const listingId = String(action.meta.arg?.listingId || "");
        if (listingId) {
          state.updateListingStatusLoadingById[listingId] = false;
        }
        state.updateListingStatusError = action.payload || "Failed to update listing status";
      })
      .addCase(deleteAdminListing.pending, (state, action) => {
        const listingId = String(action.meta.arg || "");
        if (listingId) {
          state.deleteListingLoadingById[listingId] = true;
        }
        state.deleteListingError = null;
      })
      .addCase(deleteAdminListing.fulfilled, (state, action) => {
        const listingId = String(action.payload?.listingId || "");
        if (listingId) {
          state.deleteListingLoadingById[listingId] = false;
        }

        state.listings = state.listings.filter((item) => String(item.id) !== listingId);
        const total = Math.max(0, Number(state.listingsPagination.total || 0) - 1);
        const limit = Number(state.listingsPagination.limit || 20) || 20;
        state.listingsPagination.total = total;
        state.listingsPagination.totalPages = Math.max(1, Math.ceil(total / limit));

        if (state.listingDetail && String(state.listingDetail.id) === listingId) {
          state.listingDetail = null;
        }
      })
      .addCase(deleteAdminListing.rejected, (state, action) => {
        const listingId = String(action.meta.arg || "");
        if (listingId) {
          state.deleteListingLoadingById[listingId] = false;
        }
        state.deleteListingError = action.payload || "Failed to delete listing";
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.items;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload || "Failed to load users";
        state.users = [];
      })
      .addCase(fetchAdminUserById.pending, (state) => {
        state.selectedUserLoading = true;
        state.selectedUserError = null;
      })
      .addCase(fetchAdminUserById.fulfilled, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchAdminUserById.rejected, (state, action) => {
        state.selectedUserLoading = false;
        state.selectedUser = null;
        state.selectedUserError = action.payload || "Failed to load user details";
      })
      .addCase(deleteAdminUser.pending, (state, action) => {
        const managedUserId = String(action.meta.arg);
        state.deleteUserLoadingById[managedUserId] = true;
        state.deleteUserError = null;
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        const managedUserId = String(action.payload);
        state.deleteUserLoadingById[managedUserId] = false;
        state.users = state.users.filter(
          (item) => String(item.id) !== managedUserId && String(item.managedUserId) !== managedUserId,
        );

        const total = Math.max(0, Number(state.usersPagination.total || 0) - 1);
        const limit = Number(state.usersPagination.limit || 6) || 6;
        state.usersPagination.total = total;
        state.usersPagination.totalPages = Math.max(1, Math.ceil(total / limit));
      })
      .addCase(deleteAdminUser.rejected, (state, action) => {
        const managedUserId = String(action.meta.arg);
        state.deleteUserLoadingById[managedUserId] = false;
        state.deleteUserError = action.payload || "Failed to delete user";
      })
      .addCase(createAdminSubAdmin.pending, (state) => {
        state.createSubAdminLoading = true;
        state.createSubAdminError = null;
      })
      .addCase(createAdminSubAdmin.fulfilled, (state, action) => {
        state.createSubAdminLoading = false;
        if (action.payload?.id) {
          state.users = [action.payload, ...state.users];
          state.usersPagination.total = Number(state.usersPagination.total || 0) + 1;
        }
      })
      .addCase(createAdminSubAdmin.rejected, (state, action) => {
        state.createSubAdminLoading = false;
        state.createSubAdminError = action.payload || "Failed to create sub-admin";
      })
      .addCase(updateAdminSubAdmin.pending, (state, action) => {
        const managedUserId = String(action.meta.arg?.managedUserId || "");
        if (managedUserId) {
          state.updateSubAdminLoadingById[managedUserId] = true;
        }
        state.updateSubAdminError = null;
      })
      .addCase(updateAdminSubAdmin.fulfilled, (state, action) => {
        const managedUserId = String(action.payload?.id || "");
        if (managedUserId) {
          state.updateSubAdminLoadingById[managedUserId] = false;
        }
        state.users = state.users.map((item) =>
          String(item.id) === managedUserId ? { ...item, ...action.payload } : item,
        );
      })
      .addCase(updateAdminSubAdmin.rejected, (state, action) => {
        const managedUserId = String(action.meta.arg?.managedUserId || "");
        if (managedUserId) {
          state.updateSubAdminLoadingById[managedUserId] = false;
        }
        state.updateSubAdminError = action.payload || "Failed to update sub-admin";
      })
      .addCase(updateAdminSubAdminStatus.pending, (state, action) => {
        const managedUserId = String(action.meta.arg?.managedUserId || "");
        if (managedUserId) {
          state.updateSubAdminStatusLoadingById[managedUserId] = true;
        }
        state.updateSubAdminStatusError = null;
      })
      .addCase(updateAdminSubAdminStatus.fulfilled, (state, action) => {
        const managedUserId = String(action.payload?.id || "");
        if (managedUserId) {
          state.updateSubAdminStatusLoadingById[managedUserId] = false;
        }
        state.users = state.users.map((item) =>
          String(item.id) === managedUserId ? { ...item, ...action.payload } : item,
        );
      })
      .addCase(updateAdminSubAdminStatus.rejected, (state, action) => {
        const managedUserId = String(action.meta.arg?.managedUserId || "");
        if (managedUserId) {
          state.updateSubAdminStatusLoadingById[managedUserId] = false;
        }
        state.updateSubAdminStatusError = action.payload || "Failed to update sub-admin status";
      })
      .addCase(fetchAdminCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = null;
        state.serviceCategories = action.payload.serviceCategories;
        state.eventCategories = action.payload.eventCategories;
        state.categories = [
          ...action.payload.serviceCategories.map((item) => item.name),
          ...action.payload.eventCategories.map((item) => item.name),
        ];
        state.subCategories = action.payload.serviceCategories.flatMap((item) =>
          (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
        );
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload || "Failed to load categories";
        state.serviceCategories = [];
        state.eventCategories = [];
      })
      .addCase(createAdminCategory.pending, (state) => {
        state.createCategoryLoading = true;
        state.createCategoryError = null;
      })
      .addCase(createAdminCategory.fulfilled, (state, action) => {
        state.createCategoryLoading = false;
        const { type, category } = action.payload;

        if (type === "event") {
          state.eventCategories = [category, ...state.eventCategories];
        } else {
          state.serviceCategories = [
            {
              ...category,
              subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
            },
            ...state.serviceCategories,
          ];
        }

        state.categories = [
          ...state.serviceCategories.map((item) => item.name),
          ...state.eventCategories.map((item) => item.name),
        ];
      })
      .addCase(createAdminCategory.rejected, (state, action) => {
        state.createCategoryLoading = false;
        state.createCategoryError = action.payload || "Failed to create category";
      })
      .addCase(createAdminSubCategory.pending, (state) => {
        state.createSubCategoryLoading = true;
        state.createSubCategoryError = null;
      })
      .addCase(createAdminSubCategory.fulfilled, (state, action) => {
        state.createSubCategoryLoading = false;
        const { serviceCategoryId, subcategory } = action.payload;

        state.serviceCategories = state.serviceCategories.map((item) => {
          if (String(item.id) !== String(serviceCategoryId)) return item;

          const existing = Array.isArray(item.subcategories) ? item.subcategories : [];
          return {
            ...item,
            subcategories: [subcategory, ...existing],
          };
        });

        state.subCategories = state.serviceCategories.flatMap((item) =>
          (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
        );
      })
      .addCase(createAdminSubCategory.rejected, (state, action) => {
        state.createSubCategoryLoading = false;
        state.createSubCategoryError = action.payload || "Failed to create sub category";
      })
      .addCase(updateAdminServiceCategory.pending, (state) => {
        state.categoriesError = null;
      })
      .addCase(updateAdminServiceCategory.fulfilled, (state, action) => {
        const categoryId = String(action.payload?.categoryId || "");
        const categoryName = String(action.payload?.categoryName || "").trim();
        if (!categoryId || !categoryName) return;

        state.serviceCategories = state.serviceCategories.map((item) =>
          String(item.id) === categoryId ? { ...item, name: categoryName } : item,
        );

        state.categories = [
          ...state.serviceCategories.map((item) => item.name),
          ...state.eventCategories.map((item) => item.name),
        ];
      })
      .addCase(updateAdminServiceCategory.rejected, (state, action) => {
        state.categoriesError = action.payload || "Failed to update service category";
      })
      .addCase(deleteAdminServiceCategory.pending, (state) => {
        state.categoriesError = null;
      })
      .addCase(deleteAdminServiceCategory.fulfilled, (state, action) => {
        const categoryId = String(action.payload || "");
        if (!categoryId) return;

        state.serviceCategories = state.serviceCategories.filter((item) => String(item.id) !== categoryId);
        state.categories = [
          ...state.serviceCategories.map((item) => item.name),
          ...state.eventCategories.map((item) => item.name),
        ];
        state.subCategories = state.serviceCategories.flatMap((item) =>
          (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
        );
      })
      .addCase(deleteAdminServiceCategory.rejected, (state, action) => {
        state.categoriesError = action.payload || "Failed to delete service category";
      })
      .addCase(deleteAdminServiceSubCategory.pending, (state) => {
        state.categoriesError = null;
      })
      .addCase(deleteAdminServiceSubCategory.fulfilled, (state, action) => {
        const categoryId = String(action.payload?.categoryId || "");
        const subCategoryId = String(action.payload?.subCategoryId || "");
        if (!categoryId || !subCategoryId) return;

        state.serviceCategories = state.serviceCategories.map((item) => {
          if (String(item.id) !== categoryId) return item;

          return {
            ...item,
            subcategories: (Array.isArray(item.subcategories) ? item.subcategories : []).filter(
              (sub) => String(sub.id) !== subCategoryId,
            ),
          };
        });

        state.subCategories = state.serviceCategories.flatMap((item) =>
          (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => sub.name),
        );
      })
      .addCase(deleteAdminServiceSubCategory.rejected, (state, action) => {
        state.categoriesError = action.payload || "Failed to delete service sub category";
      })
      .addCase(updateAdminEventCategory.pending, (state) => {
        state.categoriesError = null;
      })
      .addCase(updateAdminEventCategory.fulfilled, (state, action) => {
        const categoryId = String(action.payload?.categoryId || "");
        const categoryName = String(action.payload?.categoryName || "").trim();
        if (!categoryId || !categoryName) return;

        state.eventCategories = state.eventCategories.map((item) =>
          String(item.id) === categoryId ? { ...item, name: categoryName } : item,
        );

        state.categories = [
          ...state.serviceCategories.map((item) => item.name),
          ...state.eventCategories.map((item) => item.name),
        ];
      })
      .addCase(updateAdminEventCategory.rejected, (state, action) => {
        state.categoriesError = action.payload || "Failed to update event category";
      })
      .addCase(deleteAdminEventCategory.pending, (state, action) => {
        const categoryId = String(action.meta.arg || "");
        if (categoryId) {
          state.deleteEventCategoryLoadingById[categoryId] = true;
        }
        state.deleteEventCategoryError = null;
        state.categoriesError = null;
      })
      .addCase(deleteAdminEventCategory.fulfilled, (state, action) => {
        const categoryId = String(action.payload || "");
        if (categoryId) {
          state.deleteEventCategoryLoadingById[categoryId] = false;
        }

        state.eventCategories = state.eventCategories.filter((item) => String(item.id) !== categoryId);
        state.categories = [
          ...state.serviceCategories.map((item) => item.name),
          ...state.eventCategories.map((item) => item.name),
        ];
      })
      .addCase(deleteAdminEventCategory.rejected, (state, action) => {
        const categoryId = String(action.meta.arg || "");
        if (categoryId) {
          state.deleteEventCategoryLoadingById[categoryId] = false;
        }
        state.deleteEventCategoryError = action.payload || "Failed to delete event category";
        state.categoriesError = action.payload || "Failed to delete event category";
      })
      .addCase(fetchAdminPricingData.pending, (state) => {
        state.pricingLoading = true;
        state.locationsLoading = true;
        state.pricingError = null;
        state.locationsError = null;
      })
      .addCase(fetchAdminPricingData.fulfilled, (state, action) => {
        state.pricingLoading = false;
        state.locationsLoading = false;
        state.pricingError = null;
        state.locationsError = null;
        state.pricingPlans = action.payload.pricingPlans;
        state.countries = action.payload.countries;
        state.regions = action.payload.regions;
      })
      .addCase(fetchAdminPricingData.rejected, (state, action) => {
        state.pricingLoading = false;
        state.locationsLoading = false;
        state.pricingError = action.payload || "Failed to load pricing plans";
        state.locationsError = action.payload || "Failed to load locations";
        state.pricingPlans = [];
        state.countries = [];
        state.regions = [];
      })
      .addCase(createAdminPricingPlan.pending, (state) => {
        state.createPricingLoading = true;
        state.createPricingError = null;
      })
      .addCase(createAdminPricingPlan.fulfilled, (state, action) => {
        state.createPricingLoading = false;
        state.pricingPlans = [action.payload, ...state.pricingPlans];
      })
      .addCase(createAdminPricingPlan.rejected, (state, action) => {
        state.createPricingLoading = false;
        state.createPricingError = action.payload || "Failed to create pricing plan";
      })
      .addCase(updateAdminPricingPlan.pending, (state) => {
        state.createPricingError = null;
      })
      .addCase(updateAdminPricingPlan.fulfilled, (state, action) => {
        const updatedId = String(action.payload?.id || "");
        if (!updatedId) return;

        state.pricingPlans = state.pricingPlans.map((plan) =>
          String(plan.id) === updatedId ? { ...plan, ...action.payload } : plan,
        );
      })
      .addCase(updateAdminPricingPlan.rejected, (state, action) => {
        state.createPricingError = action.payload || "Failed to update pricing plan";
      })
      .addCase(deleteAdminPricingPlan.pending, (state, action) => {
        const id = String(action.meta.arg);
        state.deletePricingLoadingById[id] = true;
        state.deletePricingError = null;
      })
      .addCase(deleteAdminPricingPlan.fulfilled, (state, action) => {
        const id = String(action.payload);
        state.deletePricingLoadingById[id] = false;
        state.pricingPlans = state.pricingPlans.filter((plan) => String(plan.id) !== id);
      })
      .addCase(deleteAdminPricingPlan.rejected, (state, action) => {
        const id = String(action.meta.arg);
        state.deletePricingLoadingById[id] = false;
        state.deletePricingError = action.payload || "Failed to delete pricing plan";
      })
      .addCase(createAdminCountry.pending, (state) => {
        state.createCountryLoading = true;
        state.createCountryError = null;
      })
      .addCase(createAdminCountry.fulfilled, (state, action) => {
        state.createCountryLoading = false;
        state.countries = [
          {
            ...action.payload,
            regions: Array.isArray(action.payload.regions) ? action.payload.regions : [],
          },
          ...state.countries,
        ];
      })
      .addCase(createAdminCountry.rejected, (state, action) => {
        state.createCountryLoading = false;
        state.createCountryError = action.payload || "Failed to create country";
      })
      .addCase(deleteAdminCountry.pending, (state) => {
        state.createCountryError = null;
      })
      .addCase(deleteAdminCountry.fulfilled, (state, action) => {
        const countryId = String(action.payload || "");
        if (!countryId) return;

        state.countries = state.countries.filter((country) => String(country.id) !== countryId);
        state.regions = state.countries.flatMap((country) =>
          (Array.isArray(country.regions) ? country.regions : []).map((regionItem) => regionItem.name),
        );
      })
      .addCase(deleteAdminCountry.rejected, (state, action) => {
        state.createCountryError = action.payload || "Failed to delete country";
      })
      .addCase(updateAdminCountry.pending, (state) => {
        state.createCountryError = null;
      })
      .addCase(updateAdminCountry.fulfilled, (state, action) => {
        const countryId = String(action.payload?.id || "");
        const name = String(action.payload?.name || "").trim();
        if (!countryId || !name) return;

        state.countries = state.countries.map((country) =>
          String(country.id) === countryId ? { ...country, name } : country,
        );
      })
      .addCase(updateAdminCountry.rejected, (state, action) => {
        state.createCountryError = action.payload || "Failed to update country";
      })
      .addCase(updateAdminRegion.pending, (state) => {
        state.createRegionError = null;
      })
      .addCase(updateAdminRegion.fulfilled, (state, action) => {
        const countryId = String(action.payload?.countryId || "");
        const regionId = String(action.payload?.regionId || action.payload?.region?.id || "");
        const regionName = String(action.payload?.region?.name || "").trim();
        if (!countryId || !regionId || !regionName) return;

        state.countries = state.countries.map((country) => {
          if (String(country.id) !== countryId) return country;

          return {
            ...country,
            regions: (Array.isArray(country.regions) ? country.regions : []).map((regionItem) =>
              String(regionItem.id) === regionId ? { ...regionItem, name: regionName } : regionItem,
            ),
          };
        });

        state.regions = state.countries.flatMap((country) =>
          (Array.isArray(country.regions) ? country.regions : []).map((regionItem) => regionItem.name),
        );
      })
      .addCase(updateAdminRegion.rejected, (state, action) => {
        state.createRegionError = action.payload || "Failed to update region";
      })
      .addCase(deleteAdminRegion.pending, (state) => {
        state.createRegionError = null;
      })
      .addCase(deleteAdminRegion.fulfilled, (state, action) => {
        const countryId = String(action.payload?.countryId || "");
        const regionId = String(action.payload?.regionId || "");
        if (!countryId || !regionId) return;

        state.countries = state.countries.map((country) => {
          if (String(country.id) !== countryId) return country;

          return {
            ...country,
            regions: (Array.isArray(country.regions) ? country.regions : []).filter(
              (regionItem) => String(regionItem.id) !== regionId,
            ),
          };
        });

        state.regions = state.countries.flatMap((country) =>
          (Array.isArray(country.regions) ? country.regions : []).map((regionItem) => regionItem.name),
        );
      })
      .addCase(deleteAdminRegion.rejected, (state, action) => {
        state.createRegionError = action.payload || "Failed to delete region";
      })
      .addCase(createAdminRegion.pending, (state) => {
        state.createRegionLoading = true;
        state.createRegionError = null;
      })
      .addCase(createAdminRegion.fulfilled, (state, action) => {
        state.createRegionLoading = false;
        const { countryId, region } = action.payload;

        state.countries = state.countries.map((country) => {
          if (String(country.id) !== String(countryId)) return country;
          const existing = Array.isArray(country.regions) ? country.regions : [];
          return {
            ...country,
            regions: [region, ...existing],
          };
        });

        state.regions = state.countries.flatMap((country) =>
          (Array.isArray(country.regions) ? country.regions : []).map((regionItem) => regionItem.name),
        );
      })
      .addCase(createAdminRegion.rejected, (state, action) => {
        state.createRegionLoading = false;
        state.createRegionError = action.payload || "Failed to create region";
      })
      // City reducers
      .addCase(createAdminCity.pending, (state) => {
        state.createCityLoading = true;
        state.createCityError = null;
      })
      .addCase(createAdminCity.fulfilled, (state, action) => {
        state.createCityLoading = false;
        const { countryId, regionId, city } = action.payload;

        state.countries = state.countries.map((country) => {
          if (String(country.id) !== String(countryId)) return country;

          return {
            ...country,
            regions: (Array.isArray(country.regions) ? country.regions : []).map((region) => {
              if (String(region.id) !== String(regionId)) return region;

              const existingCities = Array.isArray(region.cities) ? region.cities : [];
              return {
                ...region,
                cities: [city, ...existingCities],
              };
            }),
          };
        });
      })
      .addCase(createAdminCity.rejected, (state, action) => {
        state.createCityLoading = false;
        state.createCityError = action.payload || "Failed to create city";
      })
      .addCase(updateAdminCity.pending, (state) => {
        state.createCityError = null;
      })
      .addCase(updateAdminCity.fulfilled, (state, action) => {
        const { countryId, regionId, cityId, city } = action.payload;
        const cityName = String(city?.name || "").trim();
        if (!countryId || !regionId || !cityId || !cityName) return;

        state.countries = state.countries.map((country) => {
          if (String(country.id) !== String(countryId)) return country;

          return {
            ...country,
            regions: (Array.isArray(country.regions) ? country.regions : []).map((region) => {
              if (String(region.id) !== String(regionId)) return region;

              return {
                ...region,
                cities: (Array.isArray(region.cities) ? region.cities : []).map((cityItem) =>
                  String(cityItem.id) === String(cityId) ? { ...cityItem, name: cityName } : cityItem,
                ),
              };
            }),
          };
        });
      })
      .addCase(updateAdminCity.rejected, (state, action) => {
        state.createCityError = action.payload || "Failed to update city";
      })
      .addCase(deleteAdminCity.pending, (state) => {
        state.createCityError = null;
      })
      .addCase(deleteAdminCity.fulfilled, (state, action) => {
        const { countryId, regionId, cityId } = action.payload;
        if (!countryId || !regionId || !cityId) return;

        state.countries = state.countries.map((country) => {
          if (String(country.id) !== String(countryId)) return country;

          return {
            ...country,
            regions: (Array.isArray(country.regions) ? country.regions : []).map((region) => {
              if (String(region.id) !== String(regionId)) return region;

              return {
                ...region,
                cities: (Array.isArray(region.cities) ? region.cities : []).filter(
                  (cityItem) => String(cityItem.id) !== String(cityId),
                ),
              };
            }),
          };
        });
      })
      .addCase(deleteAdminCity.rejected, (state, action) => {
        state.createCityError = action.payload || "Failed to delete city";
      });
  },
});

export const {
  approveListing,
  rejectListing,
  deleteListing,
  addCategory,
  addSubCategory,
  renameServiceCategory,
  renameEventCategory,
  renameServiceSubCategory,
  updateServiceCategoryWithSubCategories,
  deleteServiceCategoryWithSubCategories,
  deleteServiceSubCategory,
  addPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  addCountry,
  addRegion,
  updateCountryLocal,
  deleteCountryLocal,
  updateRegionLocal,
  deleteRegionLocal,
  clearDashboardError,
  clearAdminUsersError,
  clearAdminCategoriesError,
} = adminSlice.actions;

export default adminSlice.reducer;
