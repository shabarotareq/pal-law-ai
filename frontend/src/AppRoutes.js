import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoadingSpinner from "./components/common/LoadingSpinner";
import CourtPage from "./pages/court/caseId.js";

<Route path="/court/:caseId" element={<CourtPage />} />;

// ✅ Lazy Loading
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const VirtualCourt = lazy(() => import("./components/court/VirtualCourt1"));
const ApiSettingsPage = lazy(() => import("./pages/ApiSettingsPage"));
const SmartChat = lazy(() => import("./pages/SmartChat"));
const LegalSearch = lazy(() => import("./pages/LegalSearch"));
const Profile = lazy(() => import("./components/dashboard/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ✅ مكون لحماية المسارات
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="large" text="جاري تحميل الصفحة..." />
        </div>
      }
    >
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<LandingPage />} />

        {/* تسجيل الدخول والتسجيل */}
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!currentUser ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* المسارات المحمية */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/virtual-court"
          element={
            <ProtectedRoute>
              <VirtualCourt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/api-settings"
          element={
            <ProtectedRoute>
              <ApiSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* الصفحات الجديدة */}
        <Route
          path="/smart-chat"
          element={
            <ProtectedRoute>
              <SmartChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal-search"
          element={
            <ProtectedRoute>
              <LegalSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* صفحة 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
