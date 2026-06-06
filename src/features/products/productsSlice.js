/**
 * Products Redux Slice
 * 
 * This file defines the products slice of the Redux store using createSlice.
 * It manages all product-related state including loading states, data, and errors.
 * 
 * State Structure:
 * - items: Array of product objects
 * - selectedProduct: Single product object (for detail views)
 * - loading: Boolean indicating if any async operation is in progress
 * - error: String containing error message if operation failed
 * 
 * This slice uses extraReducers to handle async thunk actions from productsAPI.js
 */

import { createSlice } from '@reduxjs/toolkit'
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from './productsAPI'

/**
 * Initial state for products slice
 */
const initialState = {
  items: [],              // Array to store all products
  selectedProduct: null,  // Currently selected/viewed product
  loading: false,         // Loading state for async operations
  error: null,           // Error message if operation fails
}

/**
 * Products Slice
 * 
 * Creates a slice with reducers and automatically generates action creators.
 * The extraReducers handle all async thunk lifecycle actions (pending, fulfilled, rejected).
 */
const productsSlice = createSlice({
  name: 'products',
  initialState,
  
  /**
   * Synchronous Reducers
   * 
   * These are standard reducers for synchronous state updates.
   * Action creators are automatically generated for each reducer.
   */
  reducers: {
    /**
     * Clear all products from state
     */
    clearProducts: (state) => {
      state.items = []
    },
    
    /**
     * Clear the selected product
     */
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    
    /**
     * Clear any error messages
     */
    clearError: (state) => {
      state.error = null
    },
  },
  
  /**
   * Extra Reducers for Async Thunks
   * 
   * These handle the lifecycle of async operations:
   * - pending: Operation started (set loading, clear errors)
   * - fulfilled: Operation succeeded (update data, clear loading)
   * - rejected: Operation failed (set error, clear loading)
   */
  extraReducers: (builder) => {
    builder
      // ============================================
      // FETCH ALL PRODUCTS
      // ============================================
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch products'
      })
      
      // ============================================
      // FETCH PRODUCT BY ID
      // ============================================
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
        state.error = null
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch product'
      })
      
      // ============================================
      // CREATE PRODUCT
      // ============================================
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        // Add the new product to the items array
        state.items.push(action.payload)
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to create product'
      })
      
      // ============================================
      // UPDATE PRODUCT
      // ============================================
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        // Find and update the product in items array
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update product'
      })
      
      // ============================================
      // DELETE PRODUCT
      // ============================================
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        // Remove the deleted product from items array
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to delete product'
      })
  },
})

/**
 * Export action creators
 * These are automatically generated from the reducers object
 */
export const { clearProducts, clearSelectedProduct, clearError } = productsSlice.actions

/**
 * Selectors
 * 
 * These functions extract specific pieces of state.
 * They can be used with useSelector in components.
 * 
 * Example usage:
 * const products = useSelector(selectAllProducts)
 */
export const selectAllProducts = (state) => state.products.items
export const selectSelectedProduct = (state) => state.products.selectedProduct
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

/**
 * Export the reducer to be included in the store
 */
export default productsSlice.reducer
