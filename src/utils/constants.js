/**
 * Application Constants
 * 
 * This file contains all constant values used throughout the application.
 * Centralizing constants makes them easy to maintain and update.
 */

/**
 * API Endpoints
 * Base paths for different API resources
 */
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  USERS: '/users',
  ORDERS: '/orders',
  AUTH: '/auth',
}

/**
 * Application Routes
 * All route paths used in React Router
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Admin routes
  ADMIN_BASE: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EMAILS: '/admin/emails',
  ADMIN_LEADS: '/admin/leads',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CASE_STUDIES: '/admin/case-studies',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_PRICING: '/admin/pricing',
}

/**
 * Local Storage Keys
 * Keys used for localStorage operations
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
}

/**
 * API Status Codes
 * Common HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
}

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  WITH_TIME: 'MM/DD/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
}

/**
 * Validation Rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  PHONE_REGEX: /^[\d\s\-+()]+$/,
}

/**
 * Theme Colors
 * Matches Tailwind configuration
 */
export const THEME_COLORS = {
  PRIMARY_BG: '#1e293b',
  PRIMARY_TEXT: '#f8fafc',
  PRIMARY_HOVER: '#334155',
}

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
}

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Changes saved successfully!',
  DELETE_SUCCESS: 'Item deleted successfully!',
  CREATE_SUCCESS: 'Item created successfully!',
  UPDATE_SUCCESS: 'Item updated successfully!',
}
