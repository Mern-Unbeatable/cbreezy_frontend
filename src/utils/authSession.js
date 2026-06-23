import { STORAGE_KEYS } from "./constants";

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

export const hasAuthSession = () => Boolean(getAuthToken());

export const clearAuthSession = ({ redirectToLogin = false } = {}) => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));

  if (
    redirectToLogin &&
    typeof window !== "undefined" &&
    !window.location.pathname.startsWith("/login")
  ) {
    window.location.href = "/login?session=expired";
  }
};
