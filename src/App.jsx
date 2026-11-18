import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/layout/Layout';
import { ADMIN_EMAIL } from './config/constants';

// Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NewUserDashboard = lazy(() => import('./pages/NewUserDashboard'));
const SectorsPage = lazy(() => import('./pages/SectorsPage'));
const SectorDetailPage = lazy(() => import('./pages/SectorDetailPage'));
const DailyLogPage = lazy(() => import('./pages/DailyLogPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const CommunityChatPage = lazy(() => import('./pages/CommunityChatPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// High-end Page Loader
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-950 transition-colors">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-lime-500/20 border-t-lime-500 rounded-full animate-spin" />
        <div className="absolute inset-0 bg-lime-500/20 rounded-full blur-xl animate-pulse" />
      </div>
      <p className="text-xs font-mono text-lime-600 dark:text-lime-400 tracking-wider uppercase font-semibold">
        Loading Tophel...
      </p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

// Public route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Smart Dashboard selector: Admin gets full 12-sector dashboard; Other users get custom roadmap dashboard
const SmartDashboard = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <DashboardPage /> : <NewUserDashboard />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Authentication */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />

                {/* Protected App Layout */}
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<SmartDashboard />} />
                  <Route path="/sectors" element={<SectorsPage />} />
                  <Route path="/sectors/:id" element={<SectorDetailPage />} />
                  <Route path="/daily-log" element={<DailyLogPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/chat" element={<CommunityChatPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>
                    }
                  />
                </Route>

                {/* Fallback */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
