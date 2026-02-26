import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import AdminDashboard from './pages/AdminDashboard';
import SearchUsers from './pages/SearchUsers';
import ConnectionRequests from './pages/ConnectionRequests';
import Connections from './pages/Connections';
import UserContent from './pages/UserContent';
import Profile from './pages/Profile';

const UserRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

  return children;
};

const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

const UserPublicRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return children;

  return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
};

const AdminPublicRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return children;

  return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
};

function AppContent() {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const showNavbar = isAuthenticated && !(user?.role === 'admin' && isAdminPath);

  if (loading) return null;

  return (
    <div className="flex min-h-screen flex-col ">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
        <Route path="/login" element={<UserPublicRoute><Login /></UserPublicRoute>} />
        <Route path="/register" element={<UserPublicRoute><Register /></UserPublicRoute>} />
        <Route path="/admin/login" element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>} />
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <UserRoute>
              <Gallery />
            </UserRoute>
          }
        />
        <Route
          path="/videos"
          element={
            <UserRoute>
              <Videos />
            </UserRoute>
          }
        />
        <Route
          path="/search-users"
          element={
            <UserRoute>
              <SearchUsers />
            </UserRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <UserRoute>
              <ConnectionRequests />
            </UserRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />
        <Route
          path="/connections"
          element={
            <UserRoute>
              <Connections />
            </UserRoute>
          }
        />
        <Route
          path="/users/:userId/content"
          element={
            <UserRoute>
              <UserContent />
            </UserRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'} replace />} />
        </Routes>
        <Toaster position="top-right" />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
