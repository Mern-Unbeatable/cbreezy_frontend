import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  confirmServiceRenewAPI,
  confirmServicePurchaseAPI,
  createServiceAPI,
  deleteMyServiceAPI,
  fetchMyServicesAPI,
  fetchPricingPlansEligibilityAPI,
  fetchServiceCategoriesAPI,
  fetchServiceCategoryDetailAPI,
  fetchServiceByIdAPI,
  fetchServicesAPI,
  purchaseServiceAPI,
  reportServiceSpamAPI,
  renewServiceAPI,
  updateMyServiceAPI,
} from "./servicesAPI";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchServicesAPI(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchMyServices = createAsyncThunk(
  "services/fetchMyServices",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchMyServicesAPI(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateMyService = createAsyncThunk(
  "services/updateMyService",
  async ({ serviceId, payload }, { rejectWithValue }) => {
    try {
      return await updateMyServiceAPI(serviceId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteMyService = createAsyncThunk(
  "services/deleteMyService",
  async (serviceId, { rejectWithValue }) => {
    try {
      return await deleteMyServiceAPI(serviceId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchServiceCategories = createAsyncThunk(
  "services/fetchServiceCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchServiceCategoriesAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchServiceCategoryDetail = createAsyncThunk(
  "services/fetchServiceCategoryDetail",
  async (categoryId, { rejectWithValue }) => {
    try {
      const subcategories = await fetchServiceCategoryDetailAPI(categoryId);
      return { categoryId: String(categoryId), subcategories };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  "services/fetchServiceById",
  async (serviceId, { rejectWithValue }) => {
    try {
      return await fetchServiceByIdAPI(serviceId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const reportServiceSpam = createAsyncThunk(
  "services/reportServiceSpam",
  async (serviceId, { rejectWithValue }) => {
    try {
      return await reportServiceSpamAPI(serviceId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createService = createAsyncThunk(
  "services/createService",
  async (formData, { rejectWithValue }) => {
    try {
      return await createServiceAPI(formData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPricingPlansEligibility = createAsyncThunk(
  "services/fetchPricingPlansEligibility",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPricingPlansEligibilityAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const purchaseService = createAsyncThunk(
  "services/purchaseService",
  async ({ serviceId, payload }, { rejectWithValue }) => {
    try {
      return await purchaseServiceAPI(serviceId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const confirmServicePurchase = createAsyncThunk(
  "services/confirmServicePurchase",
  async ({ serviceId, payload }, { rejectWithValue }) => {
    try {
      return await confirmServicePurchaseAPI(serviceId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const renewService = createAsyncThunk(
  "services/renewService",
  async ({ serviceId, payload }, { rejectWithValue }) => {
    try {
      return await renewServiceAPI(serviceId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const confirmServiceRenew = createAsyncThunk(
  "services/confirmServiceRenew",
  async ({ serviceId, payload }, { rejectWithValue }) => {
    try {
      return await confirmServiceRenewAPI(serviceId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  items: [],
  myServices: [],
  myServicesLoading: false,
  myServicesError: null,
  myServicesPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  error: null,
  status: "idle",
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  subcategoriesByCategory: {},
  subcategoriesLoadingByCategory: {},
  subcategoriesErrorByCategory: {},
  serviceDetail: null,
  serviceDetailLoading: false,
  serviceDetailError: null,
  reportSpamLoading: false,
  reportSpamError: null,
  createServiceLoading: false,
  createServiceError: null,
  createdServiceId: "",
  pricingPlans: [],
  pricingEligibility: {
    isUnderFirstThreeMonths: false,
    introductoryPlanId: "",
    stripePublishableKey: "",
    stripeCurrency: "",
  },
  pricingPlansLoading: false,
  pricingPlansError: null,
  purchaseLoading: false,
  purchaseError: null,
  purchaseResult: null,
  purchaseConfirmLoading: false,
  purchaseConfirmError: null,
  purchaseConfirmResult: null,
  renewLoading: false,
  renewError: null,
  renewResult: null,
  renewConfirmLoading: false,
  renewConfirmError: null,
  renewConfirmResult: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearServiceCategoryErrors: (state) => {
      state.categoriesError = null;
      state.subcategoriesErrorByCategory = {};
    },
    clearServiceDetail: (state) => {
      state.serviceDetail = null;
      state.serviceDetailError = null;
      state.serviceDetailLoading = false;
    },
    clearReportSpamError: (state) => {
      state.reportSpamError = null;
    },
    clearCreateServiceState: (state) => {
      state.createServiceLoading = false;
      state.createServiceError = null;
      state.createdServiceId = "";
    },
    clearPricingState: (state) => {
      state.pricingPlansLoading = false;
      state.pricingPlansError = null;
      state.pricingEligibility = {
        isUnderFirstThreeMonths: false,
        introductoryPlanId: "",
        stripePublishableKey: "",
        stripeCurrency: "",
      };
      state.purchaseLoading = false;
      state.purchaseError = null;
      state.purchaseResult = null;
      state.purchaseConfirmLoading = false;
      state.purchaseConfirmError = null;
      state.purchaseConfirmResult = null;
      state.renewLoading = false;
      state.renewError = null;
      state.renewResult = null;
      state.renewConfirmLoading = false;
      state.renewConfirmError = null;
      state.renewConfirmResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload || "An error occurred while fetching services";
        state.items = [];
      })
      .addCase(fetchMyServices.pending, (state) => {
        state.myServicesLoading = true;
        state.myServicesError = null;
      })
      .addCase(fetchMyServices.fulfilled, (state, action) => {
        state.myServicesLoading = false;
        state.myServices = action.payload.items;
        state.myServicesPagination = action.payload.pagination;
      })
      .addCase(fetchMyServices.rejected, (state, action) => {
        state.myServicesLoading = false;
        state.myServicesError = action.payload || "Failed to fetch your services";
        state.myServices = [];
        state.myServicesPagination = {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(updateMyService.pending, (state) => {
        state.myServicesLoading = true;
        state.myServicesError = null;
      })
      .addCase(updateMyService.fulfilled, (state, action) => {
        state.myServicesLoading = false;
        const updatedItem = action.payload.item;

        state.myServices = state.myServices.map((item) =>
          String(item.id) === String(updatedItem.id) ? updatedItem : item
        );
      })
      .addCase(updateMyService.rejected, (state, action) => {
        state.myServicesLoading = false;
        state.myServicesError = action.payload || "Failed to update your service";
      })
      .addCase(deleteMyService.pending, (state) => {
        state.myServicesLoading = true;
        state.myServicesError = null;
      })
      .addCase(deleteMyService.fulfilled, (state, action) => {
        state.myServicesLoading = false;
        const deletedId = action.payload.serviceId;
        state.myServices = state.myServices.filter((item) => String(item.id) !== String(deletedId));
        state.myServicesPagination.total = Math.max(0, Number(state.myServicesPagination.total || 0) - 1);
        state.myServicesPagination.totalPages = Math.max(
          1,
          Math.ceil(state.myServicesPagination.total / Math.max(1, state.myServicesPagination.limit || 20))
        );
      })
      .addCase(deleteMyService.rejected, (state, action) => {
        state.myServicesLoading = false;
        state.myServicesError = action.payload || "Failed to delete your service";
      })
      .addCase(fetchServiceCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload || "Failed to fetch categories";
        state.categories = [];
      })
      .addCase(fetchServiceCategoryDetail.pending, (state, action) => {
        const categoryId = String(action.meta.arg);
        state.subcategoriesLoadingByCategory[categoryId] = true;
        state.subcategoriesErrorByCategory[categoryId] = null;
      })
      .addCase(fetchServiceCategoryDetail.fulfilled, (state, action) => {
        const { categoryId, subcategories } = action.payload;
        state.subcategoriesLoadingByCategory[categoryId] = false;
        state.subcategoriesByCategory[categoryId] = subcategories;
      })
      .addCase(fetchServiceCategoryDetail.rejected, (state, action) => {
        const categoryId = String(action.meta.arg);
        state.subcategoriesLoadingByCategory[categoryId] = false;
        state.subcategoriesErrorByCategory[categoryId] = action.payload || "Failed to fetch subcategories";
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.serviceDetailLoading = true;
        state.serviceDetailError = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.serviceDetailLoading = false;
        state.serviceDetail = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.serviceDetailLoading = false;
        state.serviceDetail = null;
        state.serviceDetailError = action.payload || "Failed to fetch service detail";
      })
      .addCase(reportServiceSpam.pending, (state) => {
        state.reportSpamLoading = true;
        state.reportSpamError = null;
      })
      .addCase(reportServiceSpam.fulfilled, (state) => {
        state.reportSpamLoading = false;
      })
      .addCase(reportServiceSpam.rejected, (state, action) => {
        state.reportSpamLoading = false;
        state.reportSpamError = action.payload || "Failed to report spam";
      })
      .addCase(createService.pending, (state) => {
        state.createServiceLoading = true;
        state.createServiceError = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.createServiceLoading = false;
        state.createdServiceId = action.payload.serviceId || "";
      })
      .addCase(createService.rejected, (state, action) => {
        state.createServiceLoading = false;
        state.createServiceError = action.payload || "Failed to create service";
      })
      .addCase(fetchPricingPlansEligibility.pending, (state) => {
        state.pricingPlansLoading = true;
        state.pricingPlansError = null;
      })
      .addCase(fetchPricingPlansEligibility.fulfilled, (state, action) => {
        state.pricingPlansLoading = false;
        state.pricingPlans = action.payload?.plans || [];
        state.pricingEligibility = {
          isUnderFirstThreeMonths: Boolean(action.payload?.isUnderFirstThreeMonths),
          introductoryPlanId: String(action.payload?.introductoryPlanId || ""),
          stripePublishableKey: String(action.payload?.stripePublishableKey || ""),
          stripeCurrency: String(action.payload?.stripeCurrency || ""),
        };
      })
      .addCase(fetchPricingPlansEligibility.rejected, (state, action) => {
        state.pricingPlansLoading = false;
        state.pricingPlansError = action.payload || "Failed to load pricing plans";
        state.pricingPlans = [];
        state.pricingEligibility = {
          isUnderFirstThreeMonths: false,
          introductoryPlanId: "",
          stripePublishableKey: "",
          stripeCurrency: "",
        };
      })
      .addCase(purchaseService.pending, (state) => {
        state.purchaseLoading = true;
        state.purchaseError = null;
      })
      .addCase(purchaseService.fulfilled, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseResult = action.payload;
      })
      .addCase(purchaseService.rejected, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseError = action.payload || "Failed to start purchase";
      })
      .addCase(confirmServicePurchase.pending, (state) => {
        state.purchaseConfirmLoading = true;
        state.purchaseConfirmError = null;
      })
      .addCase(confirmServicePurchase.fulfilled, (state, action) => {
        state.purchaseConfirmLoading = false;
        state.purchaseConfirmResult = action.payload;
      })
      .addCase(confirmServicePurchase.rejected, (state, action) => {
        state.purchaseConfirmLoading = false;
        state.purchaseConfirmError = action.payload || "Failed to confirm purchase";
      })
      .addCase(renewService.pending, (state) => {
        state.renewLoading = true;
        state.renewError = null;
      })
      .addCase(renewService.fulfilled, (state, action) => {
        state.renewLoading = false;
        state.renewResult = action.payload;
      })
      .addCase(renewService.rejected, (state, action) => {
        state.renewLoading = false;
        state.renewError = action.payload || "Failed to start renew";
      })
      .addCase(confirmServiceRenew.pending, (state) => {
        state.renewConfirmLoading = true;
        state.renewConfirmError = null;
      })
      .addCase(confirmServiceRenew.fulfilled, (state, action) => {
        state.renewConfirmLoading = false;
        state.renewConfirmResult = action.payload;
      })
      .addCase(confirmServiceRenew.rejected, (state, action) => {
        state.renewConfirmLoading = false;
        state.renewConfirmError = action.payload || "Failed to confirm renew";
      });
  },
});

export const selectServices = (state) => state.services.items;
export const selectMyServices = (state) => state.services.myServices;
export const selectMyServicesLoading = (state) => state.services.myServicesLoading;
export const selectMyServicesError = (state) => state.services.myServicesError;
export const selectMyServicesPagination = (state) => state.services.myServicesPagination;
export const selectServicesLoading = (state) => state.services.loading;
export const selectServicesError = (state) => state.services.error;
export const selectServicesStatus = (state) => state.services.status;
export const selectServicesPagination = (state) => state.services.pagination;
export const selectServiceCategories = (state) => state.services.categories;
export const selectServiceCategoriesLoading = (state) => state.services.categoriesLoading;
export const selectServiceCategoriesError = (state) => state.services.categoriesError;
export const selectServiceSubcategoriesByCategory = (state) => state.services.subcategoriesByCategory;
export const selectServiceSubcategoriesLoadingByCategory = (state) =>
  state.services.subcategoriesLoadingByCategory;
export const selectServiceSubcategoriesErrorByCategory = (state) =>
  state.services.subcategoriesErrorByCategory;
export const selectServiceDetail = (state) => state.services.serviceDetail;
export const selectServiceDetailLoading = (state) => state.services.serviceDetailLoading;
export const selectServiceDetailError = (state) => state.services.serviceDetailError;
export const selectServiceReportSpamLoading = (state) => state.services.reportSpamLoading;
export const selectServiceReportSpamError = (state) => state.services.reportSpamError;
export const selectCreateServiceLoading = (state) => state.services.createServiceLoading;
export const selectCreateServiceError = (state) => state.services.createServiceError;
export const selectCreatedServiceId = (state) => state.services.createdServiceId;
export const selectPricingPlans = (state) => state.services.pricingPlans;
export const selectPricingEligibility = (state) => state.services.pricingEligibility;
export const selectPricingPlansLoading = (state) => state.services.pricingPlansLoading;
export const selectPricingPlansError = (state) => state.services.pricingPlansError;
export const selectServicePurchaseLoading = (state) => state.services.purchaseLoading;
export const selectServicePurchaseError = (state) => state.services.purchaseError;
export const selectServicePurchaseConfirmLoading = (state) => state.services.purchaseConfirmLoading;
export const selectServicePurchaseConfirmError = (state) => state.services.purchaseConfirmError;
export const selectServiceRenewLoading = (state) => state.services.renewLoading;
export const selectServiceRenewError = (state) => state.services.renewError;
export const selectServiceRenewConfirmLoading = (state) => state.services.renewConfirmLoading;
export const selectServiceRenewConfirmError = (state) => state.services.renewConfirmError;

export const {
  clearError,
  clearServiceCategoryErrors,
  clearServiceDetail,
  clearReportSpamError,
  clearCreateServiceState,
  clearPricingState,
} = servicesSlice.actions;

export default servicesSlice.reducer;
