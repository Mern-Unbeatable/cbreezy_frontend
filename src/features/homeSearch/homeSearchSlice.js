import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCitiesByRegionAPI,
  fetchCategoriesByTabAPI,
  fetchCountriesAPI,
  fetchCountriesWithRegionsAPI,
} from "./homeSearchAPI";

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.response?.data?.error || error?.message || "Something went wrong";

export const fetchHomeCategoriesByTab = createAsyncThunk(
  "homeSearch/fetchHomeCategoriesByTab",
  async (tab, { rejectWithValue }) => {
    try {
      return await fetchCategoriesByTabAPI(tab);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchHomeCountries = createAsyncThunk(
  "homeSearch/fetchHomeCountries",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCountriesAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchHomeCountriesWithRegions = createAsyncThunk(
  "homeSearch/fetchHomeCountriesWithRegions",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCountriesWithRegionsAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchHomeCitiesByRegion = createAsyncThunk(
  "homeSearch/fetchHomeCitiesByRegion",
  async (regionId, { rejectWithValue }) => {
    try {
      return await fetchCitiesByRegionAPI(regionId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  categories: [],
  countries: [],
  countriesWithRegions: [],
  cities: [],
  categoryLoading: false,
  geoLoading: false,
  cityLoading: false,
  categoryError: null,
  geoError: null,
  cityError: null,
};

const homeSearchSlice = createSlice({
  name: "homeSearch",
  initialState,
  reducers: {
    clearHomeSearchErrors: (state) => {
      state.categoryError = null;
      state.geoError = null;
      state.cityError = null;
    },
    clearHomeCities: (state) => {
      state.cities = [];
      state.cityError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeCategoriesByTab.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchHomeCategoriesByTab.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchHomeCategoriesByTab.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
        state.categories = [];
      })
      .addCase(fetchHomeCountries.pending, (state) => {
        state.geoLoading = true;
        state.geoError = null;
      })
      .addCase(fetchHomeCountries.fulfilled, (state, action) => {
        state.geoLoading = false;
        state.countries = action.payload;
      })
      .addCase(fetchHomeCountries.rejected, (state, action) => {
        state.geoLoading = false;
        state.geoError = action.payload;
        state.countries = [];
      })
      .addCase(fetchHomeCountriesWithRegions.pending, (state) => {
        state.geoLoading = true;
        state.geoError = null;
      })
      .addCase(fetchHomeCountriesWithRegions.fulfilled, (state, action) => {
        state.geoLoading = false;
        state.countriesWithRegions = action.payload;
      })
      .addCase(fetchHomeCountriesWithRegions.rejected, (state, action) => {
        state.geoLoading = false;
        state.geoError = action.payload;
        state.countriesWithRegions = [];
      })
      .addCase(fetchHomeCitiesByRegion.pending, (state) => {
        state.cityLoading = true;
        state.cityError = null;
        state.cities = [];
      })
      .addCase(fetchHomeCitiesByRegion.fulfilled, (state, action) => {
        state.cityLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchHomeCitiesByRegion.rejected, (state, action) => {
        state.cityLoading = false;
        state.cityError = action.payload;
        state.cities = [];
      });
  },
});

export const { clearHomeSearchErrors, clearHomeCities } = homeSearchSlice.actions;

export const selectHomeCategories = (state) => state.homeSearch.categories;
export const selectHomeCountries = (state) => state.homeSearch.countries;
export const selectHomeCountriesWithRegions = (state) => state.homeSearch.countriesWithRegions;
export const selectHomeCities = (state) => state.homeSearch.cities;
export const selectHomeCategoryLoading = (state) => state.homeSearch.categoryLoading;
export const selectHomeGeoLoading = (state) => state.homeSearch.geoLoading;
export const selectHomeCityLoading = (state) => state.homeSearch.cityLoading;
export const selectHomeCategoryError = (state) => state.homeSearch.categoryError;
export const selectHomeGeoError = (state) => state.homeSearch.geoError;
export const selectHomeCityError = (state) => state.homeSearch.cityError;

export default homeSearchSlice.reducer;
