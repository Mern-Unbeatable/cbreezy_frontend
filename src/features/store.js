/**
 * Redux Store Configuration
 * 
 * This file configures the central Redux store for the application.
 * The store manages all global state using Redux Toolkit's configureStore.
 * 
 * Features:
 * - Automatic Redux DevTools integration (in development)
 * - Built-in thunk middleware for async actions
 * - Immutability and serializability checks (in development)
 * 
 * How to add new slices:
 * 1. Import the reducer from your slice file
 * 2. Add it to the reducer object below
 * 
 * Example:
 * import productsReducer from './features/products/productsSlice'
 * 
 * reducer: {
 *   products: productsReducer
 * }
 */

import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './products/productsSlice'
import categoriesReducer from './categories/categoriesSlice'
import servicesReducer from './services/servicesSlice'
import eventsReducer from './events/eventsSlice'
import adminReducer from './admin/adminSlice'
import authReducer from './auth/authSlice'
import homeSearchReducer from './homeSearch/homeSearchSlice'
import supportReducer from './support/supportSlice'


export const store = configureStore({
  reducer: {
    // Add all feature reducers here
    products: productsReducer,
    categories: categoriesReducer,
    services: servicesReducer,
    events: eventsReducer,
    admin: adminReducer,
    auth: authReducer,
    homeSearch: homeSearchReducer,
    support: supportReducer,

  },
})


