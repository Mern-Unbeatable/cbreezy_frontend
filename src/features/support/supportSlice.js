import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { submitContactUsAPI } from "./supportAPI";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const submitContactUs = createAsyncThunk(
  "support/submitContactUs",
  async (payload, { rejectWithValue }) => {
    try {
      return await submitContactUsAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  submitLoading: false,
  submitError: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    clearSupportError: (state) => {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactUs.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(submitContactUs.fulfilled, (state) => {
        state.submitLoading = false;
      })
      .addCase(submitContactUs.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
      });
  },
});

export const { clearSupportError } = supportSlice.actions;

export const selectSupportSubmitLoading = (state) => state.support.submitLoading;
export const selectSupportSubmitError = (state) => state.support.submitError;

export default supportSlice.reducer;
