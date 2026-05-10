import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavbarCard = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper that applies active highlight matching the mockup's pill style
    const navLink = (to, label) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
            >
                {label}
            </Link>
        );
    };

    return (
        // Sticky navbar — dark background with subtle bottom border matching the mockup
        <nav className="bg-slate-900 border-b border-slate-700/60 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

                {/* Logo — left side */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 font-bold text-white text-lg shrink-0"
                >
                    <span>DevShelf</span>
                    <span className="text-xl">🗂️</span>
                </Link>

                {/* Nav links — center, hidden on mobile */}
                {isAuthenticated && (
                    <div className="hidden sm:flex items-center gap-1">
                        {navLink('/dashboard', 'Dashboard')}
                        {navLink('/snippets', 'Snippets')}
                        {navLink('/resources', 'Resources')}
                        {navLink('/tasks', 'Tasks')}
                    </div>
                )}

                {/* Right side — username and logout */}
                {isAuthenticated && (
                    <div className="flex items-center gap-3 shrink-0">

                        {/* Username with avatar circle */}
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm text-slate-300 font-medium">
                                {user?.userName}
                            </span>
                        </div>

                        {/* Logout button — outlined style matching the mockup */}
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium px-4 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Mobile nav — shown only on small screens */}
                {isAuthenticated && (
                    <div className="flex sm:hidden items-center gap-1">
                        {navLink('/dashboard', '🏠')}
                        {navLink('/snippets', '</>')}
                        {navLink('/resources', '🔖')}
                        {navLink('/tasks', '✅')}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavbarCard;