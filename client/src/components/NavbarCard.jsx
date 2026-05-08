import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Snippets', to: '/snippets' },
        { label: 'Resources', to: '/resources' },
        { label: 'Tasks', to: '/tasks' },
    ];

    return (
        <nav className="w-full bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-lg">

            {/* Brand */}
            <NavLink to="/dashboard" className="flex items-center gap-2 select-none">
                <span className="text-white font-extrabold text-lg tracking-tight">
                    Dev<span className="text-indigo-400">Shelf</span>
                </span>
                <span className="text-xl">📁</span>
            </NavLink>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
                {navItems.map(({ label, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-indigo-600 bg-opacity-30 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>

            {/* Right — User + Logout */}
            <div className="flex items-center gap-3">
                {/* Username + Avatar */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300 font-medium">
                        {user?.username || user?.name || 'user'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-300">
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-lg border border-indigo-500 text-indigo-300 text-sm font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
                >
                    Logout
                </button>
            </div>

        </nav>
    );
};

export default Navbar;