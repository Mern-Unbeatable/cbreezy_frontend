import axios from "axios";
import apiClient from "../../services/apiClient";
import { SUPPORT_ENDPOINTS } from "./supportEndpoints";

const supportAdminClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://backend.sidegurus.com/",
});

supportAdminClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token") || window.localStorage.getItem("authToken")
      : null;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const submitContactUsAPI = async (payload) => {
  const response = await apiClient.post(SUPPORT_ENDPOINTS.CONTACT_US, payload);
  return response.data;
};

export const getAllTickets = async (params = {}) => {
  const response = await supportAdminClient.get("/api/support/admin/tickets", {
    params,
  });

  return response.data;
};

export const getTicketById = async (id) => {
  const response = await supportAdminClient.get(`/api/support/admin/tickets/${id}`);
  return response.data;
};

export const deleteTicketById = async (id) => {
  const response = await supportAdminClient.delete(`/api/support/admin/tickets/${id}`);
  return response.data;
};
