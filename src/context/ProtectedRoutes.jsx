/**
 * Protected Route Components
 *
 * These components handle role-based route protection.
 * They prevent unauthorized access based on user roles.
 */

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, ROLES } from "../context/AuthContext";
import NotFound from "../pages/NotFound";

/**
 * ProtectedRoute Component
 *
 * Protects routes that require authentication.
 * If user is not authenticated, redirects to login.
 *
 * Usage:
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * AdminRoute Component
 *
 * Protects routes that are only accessible to admins.
 * Redirects non-admin users to a 404 or home page.
 *
 * Usage:
 * <AdminRoute>
 *   <AdminDashboard />
 * </AdminRoute>
 */
export function AdminRoute({ children }) {
  const { isAuthenticated, role, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Not admin - show 404
  if (role !== ROLES.ADMIN) {
    return <NotFound />;
  }

  return children;
}

/**
 * UserRoute Component
 *
 * Protects routes that are only accessible to regular users.
 * Redirects admins to admin dashboard.
 *
 * Usage:
 * <UserRoute>
 *   <UserDashboard />
 * </UserRoute>
 */
export function UserRoute({ children }) {
  const { isAuthenticated, role, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role - redirect to appropriate dashboard
  if (role !== ROLES.USER) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

/**
 * RoleBasedRoute Component
 *
 * Flexible route protection for multiple roles.
 *
 * Usage:
 * <RoleBasedRoute requiredRoles={['admin', 'moderator']}>
 *   <SpecialComponent />
 * </RoleBasedRoute>
 */
export function RoleBasedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, role, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredRoles.includes(role)) {
    return <NotFound />;
  }

  return children;
}
