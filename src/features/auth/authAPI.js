import apiClient from "../../services/apiClient";
import { AUTH_ENDPOINTS, LOCATION_ENDPOINTS } from "./authEndpoints";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const extractPayload = (data) => data?.data || data?.result || data;

export const fetchCountriesAPI = async () => {
  const response = await apiClient.get(LOCATION_ENDPOINTS.COUNTRIES);
  const list = normalizeList(response.data);

  return list
    .map((item) => ({
      id: item?.id ?? item?.countryId ?? item?._id,
      name: item?.countryName ?? item?.name ?? item?.title,
    }))
    .filter((item) => item.id !== undefined && item.id !== null && item.name);
};

export const fetchRegionsByCountryAPI = async (countryId) => {
  const response = await apiClient.get(LOCATION_ENDPOINTS.REGIONS_BY_COUNTRY(countryId));
  const list = normalizeList(response.data);

  return list
    .map((item) => ({
      id: item?.id ?? item?.regionId ?? item?._id ?? item?.name,
      name: item?.regionName ?? item?.name ?? item?.title,
    }))
    .filter((item) => item.name);
};

export const registerAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, payload);
  return response.data;
};

export const loginAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, payload);
  return response.data;
};

export const firebaseLoginAPI = async (idToken) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.FIREBASE_LOGIN, { idToken });
  return response.data;
};

export const firebaseRegisterAPI = async (idToken) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.FIREBASE_REGISTER, { idToken });
  return response.data;
};

export const verifyRegistrationOtpAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_REGISTRATION_OTP, payload);
  return response.data;
};

export const resendRegistrationOtpAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.RESEND_REGISTRATION_OTP, payload);
  return response.data;
};

export const forgotPasswordAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload);
  return response.data;
};

export const verifyForgotPasswordOtpAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_FORGOT_PASSWORD_OTP, payload);
  return response.data;
};

export const resetPasswordAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
  return response.data;
};

export const fetchAccountSettingsAPI = async () => {
  const response = await apiClient.get(AUTH_ENDPOINTS.ACCOUNT_SETTINGS);
  const raw = extractPayload(response.data);

  return {
    fullName: raw?.fullName || raw?.name || "",
    email: raw?.email || "",
    phoneNumber: raw?.phoneNumber || raw?.phone || "",
    countryId: raw?.countryId || raw?.country?.id || raw?.country?._id || "",
    regionId: raw?.regionId || raw?.region?.id || raw?.region?._id || "",
    profileImage: raw?.profileImage || raw?.avatar || raw?.image || "",
  };
};

export const updateAccountSettingsAPI = async (payload) => {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("countryId", String(payload.countryId));
  formData.append("regionId", String(payload.regionId));

  if (payload.profileImage) {
    formData.append("profileImage", payload.profileImage);
  }

  const response = await apiClient.put(AUTH_ENDPOINTS.ACCOUNT_SETTINGS, formData);
  return response.data;
};

export const changePasswordAPI = async (payload) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload);
  return response.data;
};
