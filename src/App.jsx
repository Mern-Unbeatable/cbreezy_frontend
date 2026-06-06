/**
 * Root Application Component
 * 
 * This is the main App component that sets up routing for the entire application.
 * It uses React Router v6 with Router wrapper and routes imported from router.jsx.
 * 
 * Route Structure:
 * - / : Demo login page (entry point)
 * - /admin/* : Protected admin area with layout and nested routes
 *   - dashboard, emails, leads, orders, case-studies, blog, jobs, pricing
 */

import { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './route/router'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
