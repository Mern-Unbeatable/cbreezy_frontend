import apiClient from "../../services/apiClient";
import { SUPPORT_ENDPOINTS } from "./supportEndpoints";

export const submitContactUsAPI = async (payload) => {
  const response = await apiClient.post(SUPPORT_ENDPOINTS.CONTACT_US, payload);
  return response.data;
};
