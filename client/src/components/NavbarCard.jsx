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

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/snippets', label: 'Snippets' },
        { to: '/resources', label: 'Resources' },
        { to: '/tasks', label: 'Tasks' },
    ];

    return (
        <nav
            style={{
                backgroundColor: '#161929',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                width: '100%',
            }}
        >
            <div
                style={{
                    maxWidth: '960px',
                    margin: '0 auto',
                    padding: '0 24px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                }}
            >
                {/* ── Logo ── */}
                <Link
                    to="/dashboard"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        flexShrink: 0,
                    }}
                >
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: '18px',
                            letterSpacing: '-0.3px',
                            color: '#ffffff',
                        }}
                    >
                        Dev<span style={{ color: '#ffffff' }}>Shelf</span>
                    </span>
                    {/* folder emoji matching the mockup */}
                    <span style={{ fontSize: '18px', lineHeight: 1 }}>📁</span>
                </Link>

                {/* ── Centre nav links ── */}
                {isAuthenticated && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        {navLinks.map(({ to, label }) => {
                            const isActive = location.pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: isActive ? 500 : 400,
                                        color: isActive ? '#ffffff' : '#94a3b8',
                                        padding: '6px 16px',
                                        borderRadius: '9999px',
                                        backgroundColor: isActive
                                            ? 'rgba(255,255,255,0.10)'
                                            : 'transparent',
                                        transition: 'background 0.15s, color 0.15s',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor =
                                                'rgba(255,255,255,0.06)';
                                            e.currentTarget.style.color = '#ffffff';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor =
                                                'transparent';
                                            e.currentTarget.style.color = '#94a3b8';
                                        }
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* ── Right side: avatar + username + logout ── */}
                {isAuthenticated && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexShrink: 0,
                        }}
                    >
                        {/* Username with avatar */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            {/* Avatar circle — shows user photo if available, else initials */}
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '2px solid rgba(255,255,255,0.15)',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#4f46e5',
                                }}
                            >
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.userName}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <span
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: '#ffffff',
                                        }}
                                    >
                                        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>

                            <span
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 400,
                                    color: '#e2e8f0',
                                }}
                            >
                                {user?.userName}
                            </span>
                        </div>

                        {/* Logout — outlined pill matching the mockup's purple border */}
                        <button
                            onClick={handleLogout}
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                color: '#e2e8f0',
                                padding: '6px 18px',
                                borderRadius: '9999px',
                                border: '1.5px solid #7c3aed',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                transition: 'background 0.15s, color 0.15s',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor =
                                    'rgba(124,58,237,0.15)';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#e2e8f0';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavbarCard;