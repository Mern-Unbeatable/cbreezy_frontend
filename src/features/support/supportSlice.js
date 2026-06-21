import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteTicketById,
  getAllTickets,
  getTicketById,
  submitContactUsAPI,
} from "./supportAPI";

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

export const fetchTickets = createAsyncThunk(
  "support/fetchTickets",
  async ({ page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await getAllTickets({
        page,
        limit,
        sortBy,
        sortOrder,
        ...(search ? { search } : {}),
      });

      const tickets = Array.isArray(response?.data) ? response.data : [];

      return {
        tickets,
        meta: response?.meta || {},
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  "support/fetchTicketById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTicketById(id);
      return response?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "support/deleteTicket",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteTicketById(id);
      return {
        id,
        message: response?.message || "Ticket deleted successfully",
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  tickets: [],
  meta: {},
  loading: false,
  error: null,
  selectedTicket: null,
  detailLoading: false,
  detailError: null,
  deleteLoading: false,
  deleteError: null,
  submitLoading: false,
  submitError: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    clearSupportError: (state) => {
      state.error = null;
      state.detailError = null;
      state.deleteError = null;
      state.submitError = null;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTicketById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.tickets = state.tickets.filter((ticket) => String(ticket?.id) !== String(action.payload.id));
        if (state.selectedTicket && String(state.selectedTicket?.id) === String(action.payload.id)) {
          state.selectedTicket = null;
        }
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
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

export const { clearSupportError, clearSelectedTicket } = supportSlice.actions;

export const selectSupportSubmitLoading = (state) => state.support.submitLoading;
export const selectSupportSubmitError = (state) => state.support.submitError;

export default supportSlice.reducer;
