import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

/* ─── Responsive hook ───────────────────────────────────────────────────── */
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return isMobile;
};

/* ─── Icons ────────────────────────────────────────────────────────────── */
const SnippetsIcon = ({ size = 36 }) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

const ResourcesIcon = ({ size = 36 }) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

const TasksIcon = ({ size = 36 }) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <polyline points="4 6 5 7 7 5" />
        <polyline points="4 12 5 13 7 11" />
        <polyline points="4 18 5 19 7 17" />
    </svg>
);

/* ─── Stat card ─────────────────────────────────────────────────────────── */
const StatCard = ({ count, label, gradient, onClick, isMobile }) => (
    <div
        onClick={onClick}
        style={{
            background: gradient,
            borderRadius: '16px',
            padding: isMobile ? '16px 14px' : '24px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: isMobile ? '90px' : '120px',
            transition: 'filter 0.15s, transform 0.15s',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.filter = 'brightness(1.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.filter = 'brightness(1)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                {count}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.70)' }}>
                <SnippetsIcon size={isMobile ? 24 : 36} />
                {/* icon passed as prop below overrides this — keeping size logic here */}
            </span>
        </div>
        <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginTop: '8px' }}>
            {label}
        </span>
    </div>
);

/* ─── Corrected Stat card that uses icon prop ───────────────────────────── */
const Card = ({ count, label, iconEl, gradient, onClick, isMobile }) => (
    <div
        onClick={onClick}
        style={{
            background: gradient,
            borderRadius: '16px',
            padding: isMobile ? '16px 14px' : '24px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: isMobile ? '90px' : '120px',
            transition: 'filter 0.15s, transform 0.15s',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.filter = 'brightness(1.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.filter = 'brightness(1)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                {count}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.70)' }}>
                {iconEl}
            </span>
        </div>
        <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginTop: '8px' }}>
            {label}
        </span>
    </div>
);

/* ─── Main page ─────────────────────────────────────────────────────────── */
const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const username = user?.userName || user?.email?.split('@')[0] || 'there';

    const [stats, setStats] = useState({ snippets: 0, resources: 0, tasks: 0 });
    const [taskCounts, setTaskCounts] = useState({ todo: 0, inProgress: 0, done: 0 });
    const [recentItems, setRecentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [snippetsRes, resourcesRes, tasksRes] = await Promise.all([
                    api.get('/api/snippets'),
                    api.get('/api/resources'),
                    api.get('/api/tasks'),
                ]);

                const snippets = snippetsRes.data;
                const resources = resourcesRes.data;
                const tasks = tasksRes.data;

                setStats({
                    snippets: snippets.length,
                    resources: resources.length,
                    tasks: tasks.length,
                });

                setTaskCounts({
                    todo: tasks.filter(t => t.status?.toLowerCase() === 'todo').length,
                    inProgress: tasks.filter(t => t.status?.toLowerCase() === 'in-progress').length,
                    done: tasks.filter(t => t.status?.toLowerCase() === 'done').length,
                });

                const recentSnippets = snippets.slice(0, 3).map(s => ({
                    id: `snippet-${s.id}`,
                    title: s.title,
                    type: 'Snippets',
                    date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    path: `/snippets/${s.id}`,
                }));

                const recentResources = resources.slice(0, 3).map(r => ({
                    id: `resource-${r.id}`,
                    title: r.title,
                    type: 'Resources',
                    date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    path: `/resources`,
                }));

                const merged = [...recentSnippets, ...recentResources]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5);

                setRecentItems(merged);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    /* Loading spinner */
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#252840',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: '32px', height: '32px',
                    border: '4px solid #6366f1',
                    borderTop: '4px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.75s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const badgeStyle = {
        Snippets: { background: 'rgba(99,102,241,0.25)', color: '#a5b4fc' },
        Resources: { background: 'rgba(100,116,139,0.25)', color: '#94a3b8' },
        Tasks: { background: 'rgba(20,184,166,0.20)', color: '#5eead4' },
    };

    const iconSize = isMobile ? 22 : 36;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#252840',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: isMobile ? '16px 12px 32px' : '32px 16px',
            boxSizing: 'border-box',
        }}>
            <div style={{
                background: '#1e2035',
                borderRadius: isMobile ? '16px' : '20px',
                padding: isMobile ? '20px 16px' : '32px 28px',
                width: '100%',
                maxWidth: '860px',
                boxSizing: 'border-box',
            }}>

                {/* Welcome heading */}
                <h1 style={{
                    fontSize: isMobile ? '20px' : '26px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: isMobile ? '20px' : '28px',
                    lineHeight: 1.3,
                    margin: `0 0 ${isMobile ? '20px' : '28px'} 0`,
                }}>
                    Welcome back,{' '}
                    <span style={{ color: '#818cf8' }}>{username}</span>!
                </h1>

                {/* ── Stat cards — 3 col on desktop, 3 col compact on mobile ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: isMobile ? '10px' : '16px',
                    marginBottom: isMobile ? '14px' : '20px',
                }}>
                    <Card
                        count={stats.snippets}
                        label="Snippets"
                        iconEl={<SnippetsIcon size={iconSize} />}
                        gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                        onClick={() => navigate('/snippets')}
                        isMobile={isMobile}
                    />
                    <Card
                        count={stats.resources}
                        label="Resources"
                        iconEl={<ResourcesIcon size={iconSize} />}
                        gradient="linear-gradient(135deg, #4338ca 0%, #3730a3 100%)"
                        onClick={() => navigate('/resources')}
                        isMobile={isMobile}
                    />
                    <Card
                        count={stats.tasks}
                        label="Tasks"
                        iconEl={<TasksIcon size={iconSize} />}
                        gradient="linear-gradient(135deg, #0f766e 0%, #0d9488 100%)"
                        onClick={() => navigate('/tasks')}
                        isMobile={isMobile}
                    />
                </div>

                {/* ── Tasks Overview panel ── */}
                <div style={{
                    background: '#262840',
                    borderRadius: '16px',
                    padding: isMobile ? '16px' : '20px 24px',
                    marginBottom: isMobile ? '14px' : '20px',
                }}>
                    <h2 style={{
                        fontSize: isMobile ? '15px' : '17px',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '14px',
                        margin: `0 0 14px 0`,
                    }}>
                        Tasks Overview
                    </h2>

                    <div style={{
                        background: '#1a1c30',
                        borderRadius: '12px',
                        padding: isMobile ? '12px 14px' : '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '52px',
                    }}>
                        {stats.tasks === 0 ? (
                            <span style={{ fontSize: '13px', color: '#64748b' }}>No tasks yet</span>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: isMobile ? '8px' : '10px',
                            }}>
                                {/* Todo */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        background: '#3b82f6',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: isMobile ? '5px 11px' : '6px 14px',
                                        fontSize: isMobile ? '12px' : '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span>{taskCounts.todo}</span>
                                    <span>Todo</span>
                                </button>

                                {/* In Progress */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        background: '#f59e0b',
                                        color: '#1c1917',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: isMobile ? '5px 11px' : '6px 14px',
                                        fontSize: isMobile ? '12px' : '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span>{taskCounts.inProgress}</span>
                                    <span>{isMobile ? 'In Prog.' : 'In Progress'}</span>
                                </button>

                                {/* Done */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        background: '#22c55e',
                                        color: '#052e16',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: isMobile ? '5px 11px' : '6px 14px',
                                        fontSize: isMobile ? '12px' : '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span>{taskCounts.done}</span>
                                    <span>Done</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Recent Items ── */}
                <div>
                    <h2 style={{
                        fontSize: isMobile ? '15px' : '17px',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: `0 0 ${isMobile ? '12px' : '14px'} 0`,
                    }}>
                        Recent Items
                    </h2>

                    {recentItems.length === 0 ? (
                        <div style={{
                            background: '#262840',
                            borderRadius: '14px',
                            padding: isMobile ? '28px 16px' : '40px 20px',
                            textAlign: 'center',
                        }}>
                            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                                No items yet — create a snippet or resource to see them here
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {recentItems.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    style={{
                                        background: '#262840',
                                        borderRadius: '14px',
                                        padding: isMobile ? '12px 14px' : '14px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s',
                                        gap: '10px',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#2e3052')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '#262840')}
                                >
                                    {/* Title */}
                                    <span style={{
                                        fontSize: isMobile ? '13px' : '14px',
                                        fontWeight: 500,
                                        color: '#e2e8f0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: 1,
                                        minWidth: 0,
                                    }}>
                                        {item.title}
                                    </span>

                                    {/* Badge + date */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: isMobile ? '8px' : '16px',
                                        flexShrink: 0,
                                    }}>
                                        {/* Hide badge on very small screens to save space */}
                                        {!isMobile && (
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                ...badgeStyle[item.type],
                                            }}>
                                                {item.type}
                                            </span>
                                        )}
                                        {isMobile && (
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                padding: '3px 8px',
                                                borderRadius: '9999px',
                                                ...badgeStyle[item.type],
                                            }}>
                                                {item.type}
                                            </span>
                                        )}
                                        <span style={{
                                            fontSize: isMobile ? '11px' : '13px',
                                            color: '#94a3b8',
                                            minWidth: isMobile ? '36px' : '48px',
                                            textAlign: 'right',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {item.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;