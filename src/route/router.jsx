
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminRoute, ListingStaffRoute, UserRoute } from "../context/ProtectedRoutes";

import PublicLayout from "../layout/publicLayout/PublicLayout";

const Login = lazy(() => import("../pages/login/Login"));
const Signup = lazy(() => import("../pages/login/Signup"));
const ForgotPassword = lazy(() => import("../pages/login/ForgotPassword"));
const OTPVerification = lazy(() => import("../pages/login/OTPVerification"));
const VerifyRegistrationOTP = lazy(() => import("../pages/login/VerifyRegistrationOTP"));
const ResetPassword = lazy(() => import("../pages/login/ResetPassword"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const ManageEvents = lazy(() => import("../pages/profile/my-events/ManageEvents"));
const EventPurchaseSuccess = lazy(() => import("../pages/profile/my-events/EventPurchaseSuccess"));
const ManageServices = lazy(() => import("../pages/profile/my-services/ManageServices"));
const ServicePurchaseSuccess = lazy(() => import("../pages/profile/my-services/ServicePurchaseSuccess"));
const AccountSettings = lazy(() => import("../pages/profile/my-account/AccountSettings"));
const AdminLayout = lazy(() => import("../layout/adminLayout/AdminLayout"));
const Dashboard = lazy(() => import("../pages/admin/dashboard/Dashboard"));
const AdminCategories = lazy(() => import("../pages/admin/categories/AdminCategories"));
const AdminUser = lazy(() => import("../pages/admin/user/AdminUser"));
const AdminListings = lazy(() => import("../pages/admin/listings/AdminListings"));
const AdminListingDetail = lazy(() => import("../pages/admin/listings/AdminListingDetail"));
const AdminIndexRedirect = lazy(() => import("../pages/admin/AdminIndexRedirect"));
const AdminRevenue = lazy(() => import("../pages/admin/revenue/AdminRevenue"));
const AdminPricing = lazy(() => import("../pages/admin/pricing/AdminPricing"));
const SupportTicketsPage = lazy(() => import("../pages/SupportTicketsPage"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Home = lazy(() => import("../pages/home/Home"));
const Categories = lazy(() => import("../pages/categories/Categories"));
const Services = lazy(() => import("../pages/services/Services"));
const ServiceDetail = lazy(() => import("../pages/services/ServiceDetail"));
const Events = lazy(() => import("../pages/events/Events"));
const EventDetail = lazy(() => import("../pages/events/EventDetail"));
const About = lazy(() => import("../pages/about/About"));
const ContactUs = lazy(() => import("../pages/contact/ContactUs"));
const Privacy = lazy(() => import("../pages/privacy/Privacy"));
const SafetyGuide = lazy(() => import("../pages/safety/SafetyGuide"));
const SideGuruSuggestions = lazy(() => import("../pages/sideguru-suggestions/SideGuruSuggestions"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center w-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E97C35]"></div></div>}>
      <Routes>

      {/* Public Layout Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/safety-guides" element={<SafetyGuide />} />
        <Route path="/safety-guide" element={<Navigate to="/safety-guides" replace />} />
        <Route path="/sideguru-suggestions" element={<SideGuruSuggestions />} />
        <Route path="/post-add" element={<ComingSoon />} />
      </Route>

      {/* Authentication */}
      <Route path="/signin" element={<Login />} />
      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-registration-otp" element={<VerifyRegistrationOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp-verification" element={<OTPVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<PublicLayout />}>
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />
        <Route
          path="/profile/my-events"
          element={
            <UserRoute>
              <ManageEvents />
            </UserRoute>
          }
        />
        <Route
          path="/profile/my-events/purchase-success"
          element={
            <UserRoute>
              <EventPurchaseSuccess />
            </UserRoute>
          }
        />
        <Route
          path="/profile/my-services"
          element={
            <UserRoute>
              <ManageServices />
            </UserRoute>
          }
        />
        <Route
          path="/profile/my-services/purchase-success"
          element={
            <UserRoute>
              <ServicePurchaseSuccess />
            </UserRoute>
          }
        />
        <Route
          path="/profile/account"
          element={
            <UserRoute>
              <AccountSettings />
            </UserRoute>
          }
        />
      </Route>
      <Route
        path="/admin"
        element={
          <ListingStaffRoute>
            <AdminLayout />
          </ListingStaffRoute>
        }
      >
        <Route index element={<AdminIndexRedirect />} />

        <Route
          path="dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="categories"
          element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          }
        />
        <Route
          path="user"
          element={
            <AdminRoute>
              <AdminUser />
            </AdminRoute>
          }
        />
        <Route path="listings" element={<AdminListings />} />
        <Route path="listings/:id" element={<AdminListingDetail />} />
        <Route
          path="revenue"
          element={
            <AdminRoute>
              <AdminRevenue />
            </AdminRoute>
          }
        />
        <Route
          path="support-tickets"
          element={
            <AdminRoute>
              <SupportTicketsPage />
            </AdminRoute>
          }
        />
        <Route
          path="pricing"
          element={
            <AdminRoute>
              <AdminPricing />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
