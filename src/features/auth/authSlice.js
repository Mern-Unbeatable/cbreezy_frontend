import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  changePasswordAPI,
  fetchAccountSettingsAPI,
  fetchCountriesAPI,
  fetchRegionsByCountryAPI,
  forgotPasswordAPI,
  firebaseLoginAPI,
  firebaseRegisterAPI,
  loginAPI,
  registerAPI,
  resetPasswordAPI,
  resendRegistrationOtpAPI,
  updateAccountSettingsAPI,
  verifyForgotPasswordOtpAPI,
  verifyRegistrationOtpAPI,
} from "./authAPI";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export const fetchCountries = createAsyncThunk(
  "auth/fetchCountries",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCountriesAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchRegionsByCountry = createAsyncThunk(
  "auth/fetchRegionsByCountry",
  async (countryId, { rejectWithValue }) => {
    try {
      return await fetchRegionsByCountryAPI(countryId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await registerAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginWithFirebase = createAsyncThunk(
  "auth/loginWithFirebase",
  async (idToken, { rejectWithValue }) => {
    try {
      return await firebaseLoginAPI(idToken);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const registerWithFirebase = createAsyncThunk(
  "auth/registerWithFirebase",
  async (idToken, { rejectWithValue }) => {
    try {
      return await firebaseRegisterAPI(idToken);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyRegistrationOtp = createAsyncThunk(
  "auth/verifyRegistrationOtp",
  async (payload, { rejectWithValue }) => {
    try {
      return await verifyRegistrationOtpAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const resendRegistrationOtp = createAsyncThunk(
  "auth/resendRegistrationOtp",
  async (payload, { rejectWithValue }) => {
    try {
      return await resendRegistrationOtpAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await forgotPasswordAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  "auth/verifyForgotPasswordOtp",
  async (payload, { rejectWithValue }) => {
    try {
      return await verifyForgotPasswordOtpAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await resetPasswordAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAccountSettings = createAsyncThunk(
  "auth/fetchAccountSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAccountSettingsAPI();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateAccountSettings = createAsyncThunk(
  "auth/updateAccountSettings",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateAccountSettingsAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const changeAccountPassword = createAsyncThunk(
  "auth/changeAccountPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await changePasswordAPI(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  countries: [],
  regions: [],
  countriesLoading: false,
  regionsLoading: false,
  loginLoading: false,
  firebaseLoginLoading: false,
  firebaseRegisterLoading: false,
  registerLoading: false,
  verifyOtpLoading: false,
  resendOtpLoading: false,
  forgotPasswordLoading: false,
  verifyForgotOtpLoading: false,
  resetPasswordLoading: false,
  accountSettingsLoading: false,
  accountSettingsFetchLoading: false,
  changePasswordLoading: false,
  countriesError: null,
  regionsError: null,
  loginError: null,
  firebaseLoginError: null,
  firebaseRegisterError: null,
  registerError: null,
  verifyOtpError: null,
  resendOtpError: null,
  forgotPasswordError: null,
  verifyForgotOtpError: null,
  resetPasswordError: null,
  accountSettingsError: null,
  accountSettingsFetchError: null,
  changePasswordError: null,
  accountSettingsData: null,
  changePasswordData: null,
  pendingRegistrationEmail: "",
  pendingResetEmail: "",
  pendingResetOtp: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthErrors: (state) => {
      state.countriesError = null;
      state.regionsError = null;
      state.loginError = null;
      state.firebaseLoginError = null;
      state.firebaseRegisterError = null;
      state.registerError = null;
      state.verifyOtpError = null;
      state.resendOtpError = null;
      state.forgotPasswordError = null;
      state.verifyForgotOtpError = null;
      state.resetPasswordError = null;
      state.accountSettingsError = null;
      state.accountSettingsFetchError = null;
      state.changePasswordError = null;
    },
    clearRegions: (state) => {
      state.regions = [];
      state.regionsError = null;
    },
    setPendingRegistrationEmail: (state, action) => {
      state.pendingRegistrationEmail = action.payload || "";
    },
    clearPendingRegistrationEmail: (state) => {
      state.pendingRegistrationEmail = "";
    },
    setPendingResetEmail: (state, action) => {
      state.pendingResetEmail = action.payload || "";
    },
    setPendingResetOtp: (state, action) => {
      state.pendingResetOtp = action.payload || "";
    },
    clearPendingResetFlow: (state) => {
      state.pendingResetEmail = "";
      state.pendingResetOtp = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.countriesLoading = true;
        state.countriesError = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countriesLoading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.countriesLoading = false;
        state.countriesError = action.payload;
        state.countries = [];
      })
      .addCase(fetchRegionsByCountry.pending, (state) => {
        state.regionsLoading = true;
        state.regionsError = null;
      })
      .addCase(fetchRegionsByCountry.fulfilled, (state, action) => {
        state.regionsLoading = false;
        state.regions = action.payload;
      })
      .addCase(fetchRegionsByCountry.rejected, (state, action) => {
        state.regionsLoading = false;
        state.regionsError = action.payload;
        state.regions = [];
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loginLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithFirebase.pending, (state) => {
        state.firebaseLoginLoading = true;
        state.firebaseLoginError = null;
      })
      .addCase(loginWithFirebase.fulfilled, (state) => {
        state.firebaseLoginLoading = false;
      })
      .addCase(loginWithFirebase.rejected, (state, action) => {
        state.firebaseLoginLoading = false;
        state.firebaseLoginError = action.payload;
      })
      .addCase(registerWithFirebase.pending, (state) => {
        state.firebaseRegisterLoading = true;
        state.firebaseRegisterError = null;
      })
      .addCase(registerWithFirebase.fulfilled, (state) => {
        state.firebaseRegisterLoading = false;
      })
      .addCase(registerWithFirebase.rejected, (state, action) => {
        state.firebaseRegisterLoading = false;
        state.firebaseRegisterError = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.pendingRegistrationEmail = action.meta.arg?.email || "";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      })
      .addCase(verifyRegistrationOtp.pending, (state) => {
        state.verifyOtpLoading = true;
        state.verifyOtpError = null;
      })
      .addCase(verifyRegistrationOtp.fulfilled, (state) => {
        state.verifyOtpLoading = false;
        state.pendingRegistrationEmail = "";
      })
      .addCase(verifyRegistrationOtp.rejected, (state, action) => {
        state.verifyOtpLoading = false;
        state.verifyOtpError = action.payload;
      })
      .addCase(resendRegistrationOtp.pending, (state) => {
        state.resendOtpLoading = true;
        state.resendOtpError = null;
      })
      .addCase(resendRegistrationOtp.fulfilled, (state) => {
        state.resendOtpLoading = false;
      })
      .addCase(resendRegistrationOtp.rejected, (state, action) => {
        state.resendOtpLoading = false;
        state.resendOtpError = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordLoading = false;
        state.pendingResetEmail = action.meta.arg?.email || "";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload;
      })
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.verifyForgotOtpLoading = true;
        state.verifyForgotOtpError = null;
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        state.verifyForgotOtpLoading = false;
        state.pendingResetOtp = action.meta.arg?.otp || "";
      })
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.verifyForgotOtpLoading = false;
        state.verifyForgotOtpError = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.pendingResetEmail = "";
        state.pendingResetOtp = "";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
      })
      .addCase(updateAccountSettings.pending, (state) => {
        state.accountSettingsLoading = true;
        state.accountSettingsError = null;
        state.accountSettingsData = null;
      })
      .addCase(updateAccountSettings.fulfilled, (state, action) => {
        state.accountSettingsLoading = false;
        state.accountSettingsData = action.payload;
      })
      .addCase(updateAccountSettings.rejected, (state, action) => {
        state.accountSettingsLoading = false;
        state.accountSettingsError = action.payload;
      })
      .addCase(fetchAccountSettings.pending, (state) => {
        state.accountSettingsFetchLoading = true;
        state.accountSettingsFetchError = null;
      })
      .addCase(fetchAccountSettings.fulfilled, (state, action) => {
        state.accountSettingsFetchLoading = false;
        state.accountSettingsData = action.payload;
      })
      .addCase(fetchAccountSettings.rejected, (state, action) => {
        state.accountSettingsFetchLoading = false;
        state.accountSettingsFetchError = action.payload;
      })
      .addCase(changeAccountPassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordData = null;
      })
      .addCase(changeAccountPassword.fulfilled, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordData = action.payload;
      })
      .addCase(changeAccountPassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload;
      });
  },
});

export const {
  clearAuthErrors,
  clearRegions,
  setPendingRegistrationEmail,
  clearPendingRegistrationEmail,
  setPendingResetEmail,
  setPendingResetOtp,
  clearPendingResetFlow,
} = authSlice.actions;

export const selectCountries = (state) => state.auth.countries;
export const selectRegions = (state) => state.auth.regions;
export const selectCountriesLoading = (state) => state.auth.countriesLoading;
export const selectRegionsLoading = (state) => state.auth.regionsLoading;
export const selectCountriesError = (state) => state.auth.countriesError;
export const selectRegionsError = (state) => state.auth.regionsError;
export const selectLoginLoading = (state) => state.auth.loginLoading;
export const selectFirebaseLoginLoading = (state) => state.auth.firebaseLoginLoading;
export const selectFirebaseRegisterLoading = (state) => state.auth.firebaseRegisterLoading;
export const selectRegisterLoading = (state) => state.auth.registerLoading;
export const selectVerifyOtpLoading = (state) => state.auth.verifyOtpLoading;
export const selectResendOtpLoading = (state) => state.auth.resendOtpLoading;
export const selectForgotPasswordLoading = (state) => state.auth.forgotPasswordLoading;
export const selectVerifyForgotOtpLoading = (state) => state.auth.verifyForgotOtpLoading;
export const selectResetPasswordLoading = (state) => state.auth.resetPasswordLoading;
export const selectAccountSettingsLoading = (state) => state.auth.accountSettingsLoading;
export const selectAccountSettingsFetchLoading = (state) => state.auth.accountSettingsFetchLoading;
export const selectChangePasswordLoading = (state) => state.auth.changePasswordLoading;
export const selectAccountSettingsError = (state) => state.auth.accountSettingsError;
export const selectAccountSettingsFetchError = (state) => state.auth.accountSettingsFetchError;
export const selectChangePasswordError = (state) => state.auth.changePasswordError;
export const selectAccountSettingsData = (state) => state.auth.accountSettingsData;
export const selectChangePasswordData = (state) => state.auth.changePasswordData;
export const selectPendingRegistrationEmail = (state) => state.auth.pendingRegistrationEmail;
export const selectPendingResetEmail = (state) => state.auth.pendingResetEmail;
export const selectPendingResetOtp = (state) => state.auth.pendingResetOtp;

export default authSlice.reducer;
