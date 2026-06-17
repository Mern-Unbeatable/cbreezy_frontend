/**
 * Sidebar Navigation Component
 *
 * Left sidebar matching the admin dashboard reference layout.
 */

import { Link, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import {
  BarChart3,
  Tag,
  LogOut,
  X,
  House,
  UsersRound, 
  NotebookTabs,
  Copy,
 
} from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'

const Sidebar = ({ isOpen = true, onClose = null, isMobile = false }) => {
  const { logout } = useContext(AuthContext)

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: House  },
    { name: 'Categories', path: '/admin/categories', icon: Copy  },
    { name: 'User', path: '/admin/user', icon: UsersRound },
    { name: 'Listings', path: '/admin/listings', icon: NotebookTabs  },
    { name: 'Revenue', path: '/admin/revenue', icon: BarChart3 },
    { name: 'Pricing & Country', path: '/admin/pricing', icon: Tag },
  ]

  const sidebarContent = (
    <aside className="h-screen sticky top-0 bg-white border-r border-[#e6e6e6] flex flex-col overflow-hidden">
      <div className="h-16 flex items-center px-4 border-b border-[#ededed]">

        <Link to={"/"}>
        
        <img src="/SideGurus-Logo-CUN.png" alt="Sidegurus" className="h-10 w-auto object-contain cursor-pointer" />
        </Link>
        
      </div>

      <div className="px-3 pt-3 pb-1">
        <p className="text-base text-[#9ca3af]">Main menu</p>
      </div>

      <nav className="px-2 pb-4 flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end
                  onClick={() => {
                    if (isMobile && onClose) onClose()
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-3 py-2 text-base transition-colors ${
                      isActive
                        ? 'bg-[#ec8d47] text-white'
                        : 'text-[#373737] hover:bg-[#f5f5f5]'
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-2 py-3 border-t border-[#ededed]">
        <button
          type="button"
          onClick={() => {
            logout()
            if (onClose) onClose()
          }}
          className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-base text-[#4b5563] hover:bg-[#f5f5f5] transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )

  // Desktop view
  if (!isMobile) {
    return (
      <div className="hidden md:block w-57.5 h-screen shrink-0">
        {sidebarContent}
      </div>
    )
  }

  // Mobile view - sliding drawer
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full">
          {sidebarContent}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#4b5563] hover:text-[#111827] md:hidden"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
