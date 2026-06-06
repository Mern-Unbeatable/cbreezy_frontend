import { createContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../services/firebase";

export const AuthContext = createContext();

/**
 * User Roles
 */
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

/**
 * AuthProvider Component
 *
 * Manages authentication state and user roles across the application.
 * Features:
 * - User login/logout
 * - Role-based access control
 * - Persistent authentication (localStorage)
 * - Scalable for future backend integration
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if user is logged in on mount
   * Restores session from localStorage if available
   */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");
    
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  /**
   * Login user with role assignment
   * @param {Object} userData - User data object
   * @param {string} userRole - User role (user or admin)
   */
  const login = (userData, userRole) => {
    // Validate role
    const validRole = Object.values(ROLES).includes(userRole) ? userRole : ROLES.USER;
    
    setUser(userData);
    setRole(validRole);
    setIsAuthenticated(true);
    
    // Persist to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", validRole);
  };

  /**
   * Logout user and clear session
   */
  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("authToken");

    // Best-effort Firebase session cleanup for Google sign-in users.
    signOut(firebaseAuth).catch(() => {});
  };

  /**
   * Check if user has a specific role
   * @param {string} requiredRole - Role to check
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return role === ROLES.ADMIN;
  };

  /**
   * Check if user is regular user
   * @returns {boolean}
   */
  const isUser = () => {
    return role === ROLES.USER;
  };

  const value = {
    isAuthenticated,
    user,
    role,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
