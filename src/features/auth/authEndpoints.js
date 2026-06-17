export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  FIREBASE_LOGIN: "/api/auth/firebase-login",
  FIREBASE_REGISTER: "/api/auth/firebase-register",
  REGISTER: "/api/auth/register",
  VERIFY_REGISTRATION_OTP: "/api/auth/verify-registration-otp",
  RESEND_REGISTRATION_OTP: "/api/auth/resend-registration-otp",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  VERIFY_FORGOT_PASSWORD_OTP: "/api/auth/verify-otp",
  RESET_PASSWORD: "/api/auth/reset-password",
  ACCOUNT_SETTINGS: "/api/auth/account-settings",
  CHANGE_PASSWORD: "/api/auth/account-settings/change-password",
};

export const LOCATION_ENDPOINTS = {
  COUNTRIES: "/api/locations/countries",
  REGIONS_BY_COUNTRY: (countryId) => `/api/locations/countries/${countryId}/regions`,
};
