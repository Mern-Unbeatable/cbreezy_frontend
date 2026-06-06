import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  confirmEventRenewAPI,
  deleteMyEventAPI,
  confirmEventPurchaseAPI,
  createEventAPI,
  fetchEventByIdAPI,
  fetchEventCategoriesAPI,
  fetchEventPricingPlansEligibilityAPI,
  fetchEventsAPI,
  fetchMyEventsAPI,
  purchaseEventAPI,
  reportEventSpamAPI,
  renewEventAPI,
  updateMyEventAPI,
} from "./eventsAPI";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchEventsAPI(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchMyEvents = createAsyncThunk(
  "events/fetchMyEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchMyEventsAPI(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateMyEvent = createAsyncThunk(
  "events/updateMyEvent",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {
      return await updateMyEventAPI(eventId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteMyEvent = createAsyncThunk(
  "events/deleteMyEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await deleteMyEventAPI(eventId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchEventCategories = createAsyncThunk(
  "events/fetchEventCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEventCategoriesAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      return await fetchEventByIdAPI(eventId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const reportEventSpam = createAsyncThunk(
  "events/reportEventSpam",
  async (eventId, { rejectWithValue }) => {
    try {
      return await reportEventSpamAPI(eventId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (formData, { rejectWithValue }) => {
    try {
      return await createEventAPI(formData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchEventPricingPlansEligibility = createAsyncThunk(
  "events/fetchEventPricingPlansEligibility",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEventPricingPlansEligibilityAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const purchaseEvent = createAsyncThunk(
  "events/purchaseEvent",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {
      return await purchaseEventAPI(eventId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const confirmEventPurchase = createAsyncThunk(
  "events/confirmEventPurchase",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {
      return await confirmEventPurchaseAPI(eventId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const renewEvent = createAsyncThunk(
  "events/renewEvent",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {
      return await renewEventAPI(eventId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const confirmEventRenew = createAsyncThunk(
  "events/confirmEventRenew",
  async ({ eventId, payload }, { rejectWithValue }) => {
    try {
      return await confirmEventRenewAPI(eventId, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  items: [],
  myItems: [],
  myItemsLoading: false,
  myItemsError: null,
  myItemsPagination: {
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
  eventDetail: null,
  eventDetailLoading: false,
  eventDetailError: null,
  reportSpamLoading: false,
  reportSpamError: null,
  createEventLoading: false,
  createEventError: null,
  createdEventId: "",
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

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEventsError: (state) => {
      state.error = null;
    },
    clearEventDetail: (state) => {
      state.eventDetail = null;
      state.eventDetailError = null;
      state.eventDetailLoading = false;
    },
    clearReportSpamError: (state) => {
      state.reportSpamError = null;
    },
    clearCreateEventState: (state) => {
      state.createEventLoading = false;
      state.createEventError = null;
      state.createdEventId = "";
    },
    clearEventPricingState: (state) => {
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
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.items = [];
        state.error = action.payload || "An error occurred while fetching events";
      })
      .addCase(fetchMyEvents.pending, (state) => {
        state.myItemsLoading = true;
        state.myItemsError = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.myItemsLoading = false;
        state.myItems = action.payload.items;
        state.myItemsPagination = action.payload.pagination;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.myItemsLoading = false;
        state.myItemsError = action.payload || "Failed to fetch your events";
        state.myItems = [];
        state.myItemsPagination = {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 1,
        };
      })
      .addCase(updateMyEvent.pending, (state) => {
        state.myItemsLoading = true;
        state.myItemsError = null;
      })
      .addCase(updateMyEvent.fulfilled, (state, action) => {
        state.myItemsLoading = false;
        const updatedItem = action.payload.item;

        state.myItems = state.myItems.map((item) =>
          String(item.id) === String(updatedItem.id) ? updatedItem : item
        );
      })
      .addCase(updateMyEvent.rejected, (state, action) => {
        state.myItemsLoading = false;
        state.myItemsError = action.payload || "Failed to update your event";
      })
      .addCase(deleteMyEvent.pending, (state) => {
        state.myItemsLoading = true;
        state.myItemsError = null;
      })
      .addCase(deleteMyEvent.fulfilled, (state, action) => {
        state.myItemsLoading = false;
        const deletedId = action.payload.eventId;
        state.myItems = state.myItems.filter((item) => String(item.id) !== String(deletedId));
        state.myItemsPagination.total = Math.max(0, Number(state.myItemsPagination.total || 0) - 1);
        state.myItemsPagination.totalPages = Math.max(
          1,
          Math.ceil(state.myItemsPagination.total / Math.max(1, state.myItemsPagination.limit || 20))
        );
      })
      .addCase(deleteMyEvent.rejected, (state, action) => {
        state.myItemsLoading = false;
        state.myItemsError = action.payload || "Failed to delete your event";
      })
      .addCase(fetchEventCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categories = [];
        state.categoriesError = action.payload || "Failed to fetch event categories";
      })
      .addCase(fetchEventById.pending, (state) => {
        state.eventDetailLoading = true;
        state.eventDetailError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.eventDetailLoading = false;
        state.eventDetail = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.eventDetailLoading = false;
        state.eventDetail = null;
        state.eventDetailError = action.payload || "Failed to fetch event detail";
      })
      .addCase(reportEventSpam.pending, (state) => {
        state.reportSpamLoading = true;
        state.reportSpamError = null;
      })
      .addCase(reportEventSpam.fulfilled, (state) => {
        state.reportSpamLoading = false;
      })
      .addCase(reportEventSpam.rejected, (state, action) => {
        state.reportSpamLoading = false;
        state.reportSpamError = action.payload || "Failed to report spam";
      })
      .addCase(createEvent.pending, (state) => {
        state.createEventLoading = true;
        state.createEventError = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.createEventLoading = false;
        state.createdEventId = action.payload.eventId || "";
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.createEventLoading = false;
        state.createEventError = action.payload || "Failed to create event";
      })
      .addCase(fetchEventPricingPlansEligibility.pending, (state) => {
        state.pricingPlansLoading = true;
        state.pricingPlansError = null;
      })
      .addCase(fetchEventPricingPlansEligibility.fulfilled, (state, action) => {
        state.pricingPlansLoading = false;
        state.pricingPlans = action.payload?.plans || [];
        state.pricingEligibility = {
          isUnderFirstThreeMonths: Boolean(action.payload?.isUnderFirstThreeMonths),
          introductoryPlanId: String(action.payload?.introductoryPlanId || ""),
          stripePublishableKey: String(action.payload?.stripePublishableKey || ""),
          stripeCurrency: String(action.payload?.stripeCurrency || ""),
        };
      })
      .addCase(fetchEventPricingPlansEligibility.rejected, (state, action) => {
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
      .addCase(purchaseEvent.pending, (state) => {
        state.purchaseLoading = true;
        state.purchaseError = null;
      })
      .addCase(purchaseEvent.fulfilled, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseResult = action.payload;
      })
      .addCase(purchaseEvent.rejected, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseError = action.payload || "Failed to start purchase";
      })
      .addCase(confirmEventPurchase.pending, (state) => {
        state.purchaseConfirmLoading = true;
        state.purchaseConfirmError = null;
      })
      .addCase(confirmEventPurchase.fulfilled, (state, action) => {
        state.purchaseConfirmLoading = false;
        state.purchaseConfirmResult = action.payload;
      })
      .addCase(confirmEventPurchase.rejected, (state, action) => {
        state.purchaseConfirmLoading = false;
        state.purchaseConfirmError = action.payload || "Failed to confirm purchase";
      })
      .addCase(renewEvent.pending, (state) => {
        state.renewLoading = true;
        state.renewError = null;
      })
      .addCase(renewEvent.fulfilled, (state, action) => {
        state.renewLoading = false;
        state.renewResult = action.payload;
      })
      .addCase(renewEvent.rejected, (state, action) => {
        state.renewLoading = false;
        state.renewError = action.payload || "Failed to start renew";
      })
      .addCase(confirmEventRenew.pending, (state) => {
        state.renewConfirmLoading = true;
        state.renewConfirmError = null;
      })
      .addCase(confirmEventRenew.fulfilled, (state, action) => {
        state.renewConfirmLoading = false;
        state.renewConfirmResult = action.payload;
      })
      .addCase(confirmEventRenew.rejected, (state, action) => {
        state.renewConfirmLoading = false;
        state.renewConfirmError = action.payload || "Failed to confirm renew";
      });
  },
});

export const selectEvents = (state) => state.events.items;
export const selectMyEvents = (state) => state.events.myItems;
export const selectMyEventsLoading = (state) => state.events.myItemsLoading;
export const selectMyEventsError = (state) => state.events.myItemsError;
export const selectMyEventsPagination = (state) => state.events.myItemsPagination;
export const selectEventsLoading = (state) => state.events.loading;
export const selectEventsError = (state) => state.events.error;
export const selectEventsPagination = (state) => state.events.pagination;
export const selectEventCategories = (state) => state.events.categories;
export const selectEventCategoriesLoading = (state) => state.events.categoriesLoading;
export const selectEventCategoriesError = (state) => state.events.categoriesError;
export const selectEventDetail = (state) => state.events.eventDetail;
export const selectEventDetailLoading = (state) => state.events.eventDetailLoading;
export const selectEventDetailError = (state) => state.events.eventDetailError;
export const selectReportSpamLoading = (state) => state.events.reportSpamLoading;
export const selectReportSpamError = (state) => state.events.reportSpamError;
export const selectCreateEventLoading = (state) => state.events.createEventLoading;
export const selectCreateEventError = (state) => state.events.createEventError;
export const selectCreatedEventId = (state) => state.events.createdEventId;
export const selectEventPricingPlans = (state) => state.events.pricingPlans;
export const selectEventPricingEligibility = (state) => state.events.pricingEligibility;
export const selectEventPricingPlansLoading = (state) => state.events.pricingPlansLoading;
export const selectEventPricingPlansError = (state) => state.events.pricingPlansError;
export const selectEventPurchaseLoading = (state) => state.events.purchaseLoading;
export const selectEventPurchaseError = (state) => state.events.purchaseError;
export const selectEventPurchaseConfirmLoading = (state) => state.events.purchaseConfirmLoading;
export const selectEventPurchaseConfirmError = (state) => state.events.purchaseConfirmError;
export const selectEventRenewLoading = (state) => state.events.renewLoading;
export const selectEventRenewError = (state) => state.events.renewError;
export const selectEventRenewConfirmLoading = (state) => state.events.renewConfirmLoading;
export const selectEventRenewConfirmError = (state) => state.events.renewConfirmError;

export const {
  clearEventsError,
  clearEventDetail,
  clearReportSpamError,
  clearCreateEventState,
  clearEventPricingState,
} = eventsSlice.actions;

export default eventsSlice.reducer;
