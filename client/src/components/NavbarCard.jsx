// Persistent navigation bar rendered on every page — shows different links based on auth state
import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // useLocation lets us highlight the active link by comparing pathname to the route
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper that applies active styles when the current URL matches the link destination
    const navLink = (to, label) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
            >
                {label}
            </Link>
        );
    };

    return (
        // sticky top-0 keeps the navbar visible while the user scrolls down any page
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link
                    to={isAuthenticated ? '/dashboard' : '/'}
                    className="font-bold text-indigo-600 text-lg tracking-tight"
                >
                    🗂️ DevShelf
                </Link>

                {/* Authenticated view — full nav links plus username and logout */}
                {isAuthenticated ? (
                    <div className="flex items-center gap-1">
                        {navLink('/dashboard', 'Dashboard')}
                        {navLink('/snippets', 'Snippets')}
                        {navLink('/resources', 'Resources')}
                        {navLink('/tasks', 'Tasks')}
                        <span className="text-gray-400 mx-2">|</span>
                        <span className="text-sm text-gray-600 mr-2">{user.userName}</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium px-3 py-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    // Guest view — only Login and Register links shown
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;