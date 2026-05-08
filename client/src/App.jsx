import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/NavbarCard';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SnippetsPage from './pages/SnippetsPage';
import ResourcesPage from './pages/ResourcesPage';
import TasksPage from './pages/TasksPage';
import RegisterPage from './pages/RegisterPage';

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
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