import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/NavbarCard';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Feature pages
import DashboardPage from './pages/DashboardPage';
import SnippetsPage from './pages/SnippetsPage';
import SnippetDetailPage from './pages/SnippetDetailPage';
import ResourcesPage from './pages/ResourcesPage';
import TasksPage from './pages/TasksPage';

const AppLayout = () => {
  const location = useLocation();

  // Hide the navbar on auth screens so login/register have a clean full-page layout
  const hideNavbar = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      {/* Toast notifications available on every page */}
      <Toaster position="top-right" />

      <Routes>
        {/* Public routes — redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — ProtectedRoute redirects to /login if not authenticated */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/snippets" element={<ProtectedRoute><SnippetsPage /></ProtectedRoute>} />

        {/* Sprint 2 — snippet detail route, :id is read with useParams inside the page */}
        <Route path="/snippets/:id" element={<ProtectedRoute><SnippetDetailPage /></ProtectedRoute>} />

        <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;