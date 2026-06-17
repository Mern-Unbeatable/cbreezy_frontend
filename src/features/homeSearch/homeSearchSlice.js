import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
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

const initialState = {
  categories: [],
  countries: [],
  countriesWithRegions: [],
  categoryLoading: false,
  geoLoading: false,
  categoryError: null,
  geoError: null,
};

const homeSearchSlice = createSlice({
  name: "homeSearch",
  initialState,
  reducers: {
    clearHomeSearchErrors: (state) => {
      state.categoryError = null;
      state.geoError = null;
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
      });
  },
});

export const { clearHomeSearchErrors } = homeSearchSlice.actions;

export const selectHomeCategories = (state) => state.homeSearch.categories;
export const selectHomeCountries = (state) => state.homeSearch.countries;
export const selectHomeCountriesWithRegions = (state) => state.homeSearch.countriesWithRegions;
export const selectHomeCategoryLoading = (state) => state.homeSearch.categoryLoading;
export const selectHomeGeoLoading = (state) => state.homeSearch.geoLoading;
export const selectHomeCategoryError = (state) => state.homeSearch.categoryError;
export const selectHomeGeoError = (state) => state.homeSearch.geoError;

export default homeSearchSlice.reducer;
