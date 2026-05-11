import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

/* ─── Icons ────────────────────────────────────────────────────────────── */
const SnippetsIcon = () => (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

const ResourcesIcon = () => (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

const TasksIcon = () => (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <polyline points="4 6 5 7 7 5" />
        <polyline points="4 12 5 13 7 11" />
        <polyline points="4 18 5 19 7 17" />
    </svg>
);

/* ─── Stat card ─────────────────────────────────────────────────────────── */
const StatCard = ({ count, label, icon, gradient, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: gradient,
            borderRadius: '16px',
            padding: '24px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '120px',
            transition: 'filter 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
    >
        {/* Top row — count left, icon right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '42px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                {count}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.70)' }}>
                {icon}
            </span>
        </div>
        {/* Label bottom-left */}
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginTop: '12px' }}>
            {label}
        </span>
    </div>
);

/* ─── Main page ─────────────────────────────────────────────────────────── */
const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
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

    /* ── Badge colours per type — matches the mockup's muted purple / slate pills ── */
    const badgeStyle = {
        Snippets: { background: 'rgba(99,102,241,0.25)', color: '#a5b4fc' },
        Resources: { background: 'rgba(100,116,139,0.25)', color: '#94a3b8' },
        Tasks: { background: 'rgba(20,184,166,0.20)', color: '#5eead4' },
    };

    return (
        /* Outer page — muted purple-navy background matching the mockup */
        <div style={{
            minHeight: '100vh',
            background: '#252840',         /* the purple-navy outer bg */
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '32px 16px',
        }}>
            {/* Inner rounded dark card — the main content container */}
            <div style={{
                background: '#1e2035',     /* slightly darker card surface */
                borderRadius: '20px',
                padding: '32px 28px',
                width: '100%',
                maxWidth: '860px',
            }}>

                {/* Welcome heading */}
                <h1 style={{
                    fontSize: '26px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '28px',
                    lineHeight: 1.3,
                }}>
                    Welcome back,{' '}
                    <span style={{ color: '#818cf8' }}>{username}</span>!
                </h1>

                {/* ── Stat cards ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '20px',
                }}>
                    <StatCard
                        count={stats.snippets}
                        label="Snippets"
                        icon={<SnippetsIcon />}
                        gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                        onClick={() => navigate('/snippets')}
                    />
                    <StatCard
                        count={stats.resources}
                        label="Resources"
                        icon={<ResourcesIcon />}
                        gradient="linear-gradient(135deg, #4338ca 0%, #3730a3 100%)"
                        onClick={() => navigate('/resources')}
                    />
                    <StatCard
                        count={stats.tasks}
                        label="Tasks"
                        icon={<TasksIcon />}
                        gradient="linear-gradient(135deg, #0f766e 0%, #0d9488 100%)"
                        onClick={() => navigate('/tasks')}
                    />
                </div>

                {/* ── Tasks Overview panel ── */}
                <div style={{
                    background: '#262840',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '20px',
                }}>
                    <h2 style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '16px',
                    }}>
                        Tasks Overview
                    </h2>

                    {/* Dark inner strip with status pills */}
                    <div style={{
                        background: '#1a1c30',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '52px',
                    }}>
                        {stats.tasks === 0 ? (
                            <span style={{ fontSize: '13px', color: '#64748b' }}>
                                No tasks yet
                            </span>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                                {/* Todo — blue */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: '#3b82f6',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '6px 14px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span>{taskCounts.todo}</span>
                                    <span>Todo</span>
                                </button>

                                {/* In Progress — amber */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: '#f59e0b',
                                        color: '#1c1917',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '6px 14px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span>{taskCounts.inProgress}</span>
                                    <span>In Progress</span>
                                </button>

                                {/* Done — green */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: '#22c55e',
                                        color: '#052e16',
                                        border: 'none',
                                        borderRadius: '9999px',
                                        padding: '6px 14px',
                                        fontSize: '13px',
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
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '14px',
                    }}>
                        Recent Items
                    </h2>

                    {recentItems.length === 0 ? (
                        <div style={{
                            background: '#262840',
                            borderRadius: '14px',
                            padding: '40px 20px',
                            textAlign: 'center',
                        }}>
                            <p style={{ color: '#64748b', fontSize: '13px' }}>
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
                                        padding: '14px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#2e3052')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '#262840')}
                                >
                                    {/* Title */}
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#e2e8f0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginRight: '16px',
                                    }}>
                                        {item.title}
                                    </span>

                                    {/* Badge + date */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                                        <span style={{
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            padding: '4px 12px',
                                            borderRadius: '9999px',
                                            ...badgeStyle[item.type],
                                        }}>
                                            {item.type}
                                        </span>
                                        <span style={{
                                            fontSize: '13px',
                                            color: '#94a3b8',
                                            minWidth: '48px',
                                            textAlign: 'right',
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