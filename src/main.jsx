/**
 * Main Application Entry Point
 * 
 * This file is the entry point for the React application.
 * It renders the root App component into the DOM and sets up:
 * - React StrictMode for highlighting potential problems
 * - Redux Provider for global state management
 * - React Router for navigation
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import './index.css'
import { store } from './features/store.js'

// Create root element and render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux Provider makes the store available to all components */}
    <Provider store={store}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  </React.StrictMode>,
)
