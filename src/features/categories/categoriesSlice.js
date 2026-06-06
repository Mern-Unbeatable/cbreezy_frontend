/**
 * Categories Redux Slice
 * 
 * This slice manages the state for categories including:
 * - categories data array
 * - loading state
 * - error handling
 * - success status
 * 
 * Uses createAsyncThunk to handle async data fetching,
 * making it easy to switch from JSON to real API later.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoriesAPI } from './categoriesAPI';

/**
 * Async thunk for fetching categories
 * This is the single place where data fetching is defined
 * 
 * To switch to a real API:
 * 1. Update only categoriesAPI.js
 * 2. This thunk automatically adapts to the new data source
 */
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (query = '', { rejectWithValue }) => {
    try {
      const data = await fetchCategoriesAPI(query);
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          'Failed to fetch categories'
      );
    }
  }
);

/**
 * Initial state
 */
const initialState = {
  items: [],           // Array of category objects
  loading: false,      // Loading state
  error: null,         // Error message if any
  status: 'idle',      // 'idle' | 'pending' | 'succeeded' | 'failed'
};

/**
 * Categories Slice
 */
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    /**
     * Reset categories state manually if needed
     */
    resetCategories: () => {
      return initialState;
    },
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  /**
   * Handle async thunk states
   */
  extraReducers: (builder) => {
    builder
      // Pending state - when thunk is called
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
        state.error = null;
      })
      // Fulfilled state - when thunk succeeds
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      // Rejected state - when thunk fails
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
        state.items = [];
      });
  },
});

export const { resetCategories, clearError } = categoriesSlice.actions;

/**
 * Selectors
 * Use these in components with useSelector hook
 */
export const selectCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoriesStatus = (state) => state.categories.status;

/**
 * Get single category by ID
 */
export const selectCategoryById = (id) => (state) => 
  state.categories.items.find(cat => cat.id === id);

export default categoriesSlice.reducer;
