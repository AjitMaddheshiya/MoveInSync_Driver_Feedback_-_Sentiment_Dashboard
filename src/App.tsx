import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import FeedbackPage from './pages/FeedbackPage'
import DashboardPage from './pages/DashboardPage'
import DriversPage from './pages/DriversPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import UserDashboardPage from './pages/UserDashboardPage'
import './App.css'

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { isAuthenticated, isAdmin, isUser } = useApp();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // If it's a user (non-admin) and admin is required, redirect to feedback
  if (requireAdmin && isUser()) {
    return <Navigate to="/feedback" replace />;
  }
  
  return <>{children}</>;
}

// Main App Content with Role-based Routing
function AppContent() {
  const { isAuthenticated, isAdmin, isUser } = useApp();
  
  // Default route based on auth status and role
  // Login page is always the first page - both admin and user go to dashboard after login
  const getDefaultRoute = () => {
    if (!isAuthenticated()) return '/login';
    if (isAdmin()) return '/dashboard';
    if (isUser()) return '/dashboard';
    return '/login';
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated() ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />
      } />
      
      {/* Feedback form - accessible to all, but users must complete it first */}
      <Route path="/feedback" element={
        <FeedbackPage />
      } />
      
      {/* Protected routes - Admin only */}
      <Route path="/dashboard" element={
        <ProtectedRoute requireAdmin>
          <Layout><DashboardPage /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/drivers" element={
        <ProtectedRoute requireAdmin>
          <Layout><DriversPage /></Layout>
        </ProtectedRoute>
      } />
      
      {/* User Dashboard - for regular users */}
      <Route path="/my-rides" element={
        <ProtectedRoute>
          <UserDashboardPage />
        </ProtectedRoute>
      } />
      
      {/* Profile - accessible to both */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout><ProfilePage /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      
      {/* Catch all - redirect to default */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
