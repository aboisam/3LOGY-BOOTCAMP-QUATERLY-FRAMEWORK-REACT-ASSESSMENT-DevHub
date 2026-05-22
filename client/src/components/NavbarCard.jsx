import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import clsx from 'clsx';

/* ── Hamburger / Close icons ── */
const HamburgerIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const CloseIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const NavbarCard = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/snippets', label: 'Snippets' },
        { to: '/resources', label: 'Resources' },
        { to: '/tasks', label: 'Tasks' },
    ];

    return (
        <nav className="bg-[#161929] border-b border-white/[0.07] sticky top-0 z-50 w-full">

            {/* ── TOP BAR ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 no-underline shrink-0"
                    onClick={() => setMenuOpen(false)}
                >
                    <span className="text-lg font-bold text-white tracking-tight">DevShelf</span>
                    <span className="text-lg leading-none">📁</span>
                </Link>

                {/* Centre nav links — desktop only */}
                {isAuthenticated && (
                    <div className="hidden sm:flex items-center gap-1">
                        {navLinks.map(({ to, label }) => {
                            const isActive = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={clsx(
                                        'text-sm px-4 py-1.5 rounded-full whitespace-nowrap no-underline transition-all duration-150',
                                        isActive
                                            ? 'font-medium text-white bg-white/10'
                                            : 'font-normal text-slate-400 hover:bg-white/[0.06] hover:text-white',
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Right side */}
                <div className="flex items-center gap-3 shrink-0">

                    {/* Avatar + username — desktop only */}
                    {isAuthenticated && (
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/15 shrink-0 flex items-center justify-center bg-brand">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.userName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs font-semibold text-white">
                                        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-slate-200">{user?.userName}</span>
                        </div>
                    )}

                    {/* Logout — desktop only */}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="hidden sm:block text-sm text-slate-200 whitespace-nowrap px-4 py-1.5 rounded-full border border-violet-600 bg-transparent hover:bg-violet-600/15 hover:text-white transition-all duration-150 cursor-pointer"
                        >
                            Logout
                        </button>
                    )}

                    {/* Hamburger toggle — mobile only */}
                    {isAuthenticated && (
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] border-0 bg-transparent cursor-pointer transition-all duration-150"
                        >
                            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
                        </button>
                    )}
                </div>
            </div>

            {/* ── MOBILE DRAWER ──
          Slides open below the top bar on mobile (hidden sm+)
          Closes when a link or logout is tapped
      ── */}
            {isAuthenticated && (
                <div className={clsx(
                    'sm:hidden overflow-hidden transition-all duration-300 ease-in-out',
                    menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                )}>
                    <div className="px-4 pb-4 pt-2 flex flex-col gap-1 border-t border-white/[0.07]">

                        {/* Avatar + username row */}
                        <div className="flex items-center gap-3 px-3 py-3 mb-1">
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/15 shrink-0 flex items-center justify-center bg-brand">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.userName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-semibold text-white">
                                        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white leading-tight">{user?.userName}</p>
                                <p className="text-xs text-slate-500 leading-tight">Signed in</p>
                            </div>
                        </div>

                        {/* Nav links */}
                        {navLinks.map(({ to, label }) => {
                            const isActive = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMenuOpen(false)}
                                    className={clsx(
                                        'text-sm px-3 py-2.5 rounded-xl no-underline transition-all duration-150',
                                        isActive
                                            ? 'font-medium text-white bg-white/10'
                                            : 'font-normal text-slate-400 hover:bg-white/[0.06] hover:text-white',
                                    )}
                                >
                                    {label}
                                </Link>
                            );
                        })}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="mt-2 w-full text-sm text-slate-200 px-3 py-2.5 rounded-xl text-left border border-violet-600/60 bg-transparent hover:bg-violet-600/15 hover:text-white transition-all duration-150 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarCard;