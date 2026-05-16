import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

/* ─── Icons ────────────────────────────────────────────────────────────── */
const SnippetsIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" className="stat-icon-svg">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

const ResourcesIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" className="stat-icon-svg">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

const TasksIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" className="stat-icon-svg">
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <polyline points="4 6 5 7 7 5" />
        <polyline points="4 12 5 13 7 11" />
        <polyline points="4 18 5 19 7 17" />
    </svg>
);

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
const Card = ({ count, label, iconEl, gradient, onClick }) => (
    <div onClick={onClick} className="stat-card" style={{ background: gradient }}>
        <div className="flex-between">
            <span className="stat-count">{count}</span>
            <span className="stat-icon-wrap">{iconEl}</span>
        </div>
        <span className="stat-label">{label}</span>
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

    if (isLoading) {
        return (
            <div className="spinner-page">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-card">

                {/* Welcome heading */}
                <h1 className="dashboard-title">
                    Welcome back, <span className="text-primary">{username}</span>!
                </h1>

                {/* ── Stat cards ── */}
                <div className="stats-grid">
                    <Card
                        count={stats.snippets}
                        label="Snippets"
                        iconEl={<SnippetsIcon />}
                        gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                        onClick={() => navigate('/snippets')}
                    />
                    <Card
                        count={stats.resources}
                        label="Resources"
                        iconEl={<ResourcesIcon />}
                        gradient="linear-gradient(135deg, #4338ca 0%, #3730a3 100%)"
                        onClick={() => navigate('/resources')}
                    />
                    <Card
                        count={stats.tasks}
                        label="Tasks"
                        iconEl={<TasksIcon />}
                        gradient="linear-gradient(135deg, #0f766e 0%, #0d9488 100%)"
                        onClick={() => navigate('/tasks')}
                    />
                </div>

                {/* ── Tasks Overview ── */}
                <div className="panel dashboard-panel">
                    <h2 className="section-title">Tasks Overview</h2>
                    <div className="panel-inner tasks-inner">
                        {stats.tasks === 0 ? (
                            <span className="text-muted text-sm">No tasks yet</span>
                        ) : (
                            <div className="flex flex-wrap gap-sm">
                                <button onClick={() => navigate('/tasks')} className="badge badge-todo">
                                    {taskCounts.todo} Todo
                                </button>
                                <button onClick={() => navigate('/tasks')} className="badge badge-inprogress">
                                    {taskCounts.inProgress}
                                    <span className="hide-mobile"> In Progress</span>
                                    <span className="hide-desktop"> In Prog.</span>
                                </button>
                                <button onClick={() => navigate('/tasks')} className="badge badge-done">
                                    {taskCounts.done} Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Recent Items ── */}
                <div>
                    <h2 className="section-title">Recent Items</h2>

                    {recentItems.length === 0 ? (
                        <div className="empty-state panel">
                            <p>No items yet — create a snippet or resource to see them here</p>
                        </div>
                    ) : (
                        <div className="recent-list">
                            {recentItems.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className="recent-item"
                                >
                                    <span className="recent-item-title truncate">{item.title}</span>
                                    <div className="recent-item-meta">
                                        <span className={`recent-badge recent-badge-${item.type.toLowerCase()}`}>
                                            {item.type}
                                        </span>
                                        <span className="recent-item-date">{item.date}</span>
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