/**
 * Admin Layout Component
 *
 * Main layout wrapper for all admin pages.
 */

import { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import Sidebar from './adminSidebar/AdminSidebar'
import { AuthContext } from '../../context/AuthContext'

const AdminLayout = () => {
  const { user } = useContext(AuthContext)
  const adminName = user?.name || 'Atik Adnan'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="h-screen bg-[#f3f4f6] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-57.5 h-screen shrink-0">
        <Sidebar isMobile={false} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isMobile={true}
      />

      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
        <header className="h-16 shrink-0 sticky top-0 z-10 bg-white border-b border-[#e6e6e6] px-4 md:px-6 flex items-center justify-between md:justify-end gap-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-[#4b5563] hover:text-[#ec8d47] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop spacer */}
          <div className="hidden md:block flex-1" />

         

          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Admin Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="leading-tight hidden sm:block">
              <p className="text-[11px] font-semibold text-[#000000]">{adminName}</p>
              <p className="text-sm text-[#000000]">Admin</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
