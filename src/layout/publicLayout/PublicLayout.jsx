/**
 * Public Layout Component
 *
 * Shared layout wrapper for all public-facing pages.
 * Provides a consistent structure with:
 * - Fixed navbar at the top
 * - Dynamic content area via React Router's Outlet
 * - Footer at the bottom
 *
 * Layout Structure:
 * ┌──────────────────────────────┐
 * │        Navbar (Fixed)        │
 * ├──────────────────────────────┤
 * │                              │
 * │        Page Content          │
 * │         (Outlet)             │
 * │                              │
 * ├──────────────────────────────┤
 * │          Footer              │
 * └──────────────────────────────┘
 */

import { Outlet } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
