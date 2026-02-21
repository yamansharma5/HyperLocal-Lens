import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import { Loader2 } from 'lucide-react';

// Protected Route Component
function RequireAuth({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'business' ? '/business' : '/dashboard'} replace />;
  }

  return children;
}

// Redirect if already authenticated
function GuestOnly({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'business' ? '/business' : '/dashboard'} replace />;
  }

  return children;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Show Navbar only when authenticated */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Guest Routes */}
        <Route path="/login" element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        } />
        <Route path="/register" element={
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        } />

        {/* User Dashboard */}
        <Route path="/dashboard" element={
          <RequireAuth role="user">
            <UserDashboard />
          </RequireAuth>
        } />

        {/* Business Dashboard */}
        <Route path="/business" element={
          <RequireAuth role="business">
            <BusinessDashboard />
          </RequireAuth>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
