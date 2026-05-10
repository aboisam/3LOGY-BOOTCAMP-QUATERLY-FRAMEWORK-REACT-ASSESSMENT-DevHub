// Wraps any route that requires the user to be authenticated before accessing it
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoading, isAuthenticated } = useContext(AuthContext);

    // Show spinner while session is being restored from localStorage on page load
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Redirect unauthenticated users to login instead of rendering the protected page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated — render the child page normally
    return children;
};

export default ProtectedRoute;