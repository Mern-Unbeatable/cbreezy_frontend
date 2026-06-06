/**
 * Utility Functions
 * 
 * This file contains helper/utility functions used throughout the application.
 * These functions provide reusable logic for common operations.
 */

/**
 * Format currency values
 * 
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 * 
 * Example:
 * formatCurrency(1234.56) => "$1,234.56"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format date to readable string
 * 
 * @param {Date|string} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 * 
 * Example:
 * formatDate(new Date()) => "Jan 15, 2024"
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  
  return new Intl.DateTimeFormat('en-US', {
    ...defaultOptions,
    ...options,
  }).format(new Date(date))
}

/**
 * Truncate text to specified length
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} suffix - String to append (default: '...')
 * @returns {string} Truncated text
 * 
 * Example:
 * truncateText('Hello World', 5) => "Hello..."
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength).trim() + suffix
}

/**
 * Debounce function to limit function call frequency
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 * 
 * Example:
 * const debouncedSearch = debounce(searchFunction, 300)
 */
export const debounce = (func, delay) => {
  let timeoutId
  
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Deep clone an object
 * 
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 * 
 * Example:
 * const cloned = deepClone(originalObject)
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * 
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 * 
 * Example:
 * isEmpty([]) => true
 * isEmpty('hello') => false
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  
  return false
}

/**
 * Generate random ID
 * 
 * @param {number} length - Length of ID to generate
 * @returns {string} Random ID string
 * 
 * Example:
 * generateId() => "x7k9m2p5"
 */
export const generateId = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Capitalize first letter of string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 * 
 * Example:
 * capitalize('hello') => "Hello"
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Sleep/delay function
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 * 
 * Example:
 * await sleep(1000) // Wait 1 second
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
