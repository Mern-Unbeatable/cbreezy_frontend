/**
 * Products API Service
 * 
 * This file contains all API calls related to products using Axios.
 * It serves as a centralized location for product-related HTTP requests.
 * 
 * This module uses createAsyncThunk from Redux Toolkit to handle
 * asynchronous API calls with automatic action dispatching for
 * pending, fulfilled, and rejected states.
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

/**
 * Base API URL
 * In production, this should come from environment variables
 * Example: process.env.VITE_API_URL
 */
const API_BASE_URL = 'https://fakestoreapi.com'

/**
 * Fetch All Products Async Thunk
 * 
 * This async thunk fetches all products from the API.
 * It automatically dispatches:
 * - pending action when the request starts
 * - fulfilled action when the request succeeds (with data)
 * - rejected action when the request fails (with error)
 * 
 * Usage in components:
 * dispatch(fetchProducts())
 * 
 * @returns {Promise} Product array from the API
 * @throws {Error} If the API request fails
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts', // Action type prefix
  async (_, { rejectWithValue }) => {
    try {
      // Make GET request to fetch products
      const response = await axios.get(`${API_BASE_URL}/products`)
      
      // Return the data which will be available in action.payload
      return response.data
    } catch (error) {
      // Handle errors and pass them to the rejected action
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      )
    }
  }
)

/**
 * Fetch Single Product by ID Async Thunk
 * 
 * Fetches a specific product by its ID.
 * 
 * @param {number} productId - The ID of the product to fetch
 * @returns {Promise} Product object from the API
 * @throws {Error} If the API request fails
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to fetch product ${productId}`
      )
    }
  }
)

/**
 * Create New Product Async Thunk
 * 
 * Creates a new product via POST request.
 * 
 * @param {Object} productData - The product data to create
 * @returns {Promise} Created product object from the API
 * @throws {Error} If the API request fails
 */
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      )
    }
  }
)

/**
 * Update Product Async Thunk
 * 
 * Updates an existing product via PUT request.
 * 
 * @param {Object} params - Object containing id and updated product data
 * @param {number} params.id - Product ID to update
 * @param {Object} params.data - Updated product data
 * @returns {Promise} Updated product object from the API
 * @throws {Error} If the API request fails
 */
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      )
    }
  }
)

/**
 * Delete Product Async Thunk
 * 
 * Deletes a product via DELETE request.
 * 
 * @param {number} productId - The ID of the product to delete
 * @returns {Promise} Deleted product ID
 * @throws {Error} If the API request fails
 */
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`)
      // Return the ID so we can remove it from state
      return productId
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      )
    }
  }
)
