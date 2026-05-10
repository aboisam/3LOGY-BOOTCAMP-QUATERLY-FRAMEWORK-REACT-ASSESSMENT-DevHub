import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

// Stat card icons
const SnippetsIcon = () => (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

const ResourcesIcon = () => (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

const TasksIcon = () => (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <line x1="9" y1="6" x2="20" y2="6" />
        <line x1="9" y1="12" x2="20" y2="12" />
        <line x1="9" y1="18" x2="20" y2="18" />
        <polyline points="4 6 5 7 7 5" />
        <polyline points="4 12 5 13 7 11" />
        <polyline points="4 18 5 19 7 17" />
    </svg>
);

// Badge color map for recent items type tags
const TYPE_COLORS = {
    Snippets: 'bg-indigo-900 text-indigo-300 border border-indigo-700',
    Resources: 'bg-slate-700 text-slate-300 border border-slate-500',
    Tasks: 'bg-teal-900 text-teal-300 border border-teal-700',
};

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const username = user?.userName || user?.email?.split('@')[0] || 'there';

    // Real data fetched from the API — starts at zero while loading
    const [stats, setStats] = useState({ snippets: 0, resources: 0, tasks: 0 });
    const [taskCounts, setTaskCounts] = useState({ todo: 0, inProgress: 0, done: 0 });
    const [recentItems, setRecentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all three endpoints in parallel — Promise.all waits for all before updating state
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

                // Update stat card counts
                setStats({
                    snippets: snippets.length,
                    resources: resources.length,
                    tasks: tasks.length,
                });

                // Count tasks by status — normalise casing for safe comparison
                setTaskCounts({
                    todo: tasks.filter((t) => t.status?.toLowerCase() === 'todo').length,
                    inProgress: tasks.filter((t) => t.status?.toLowerCase() === 'in-progress').length,
                    done: tasks.filter((t) => t.status?.toLowerCase() === 'done').length,
                });

                // Build recent items from latest 3 snippets and 3 resources combined
                const recentSnippets = snippets.slice(0, 3).map((s) => ({
                    id: `snippet-${s.id}`,
                    title: s.title,
                    type: 'Snippets',
                    date: new Date(s.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                    }),
                    path: `/snippets/${s.id}`,
                }));

                const recentResources = resources.slice(0, 3).map((r) => ({
                    id: `resource-${r.id}`,
                    title: r.title,
                    type: 'Resources',
                    date: new Date(r.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                    }),
                    path: `/resources`,
                }));

                // Merge, sort newest first, and take the top 5
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

    // Full-page spinner while data is loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        // Page background matches the dark navy in the mockup
        <div className="min-h-screen bg-slate-900 px-4 sm:px-6 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Welcome heading — username highlighted in indigo to match mockup */}
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                    Welcome back,{' '}
                    <span className="text-indigo-400">{username}</span>!
                </h1>

                {/* Stat cards — 3 columns matching the mockup layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                    {/* Snippets card — purple gradient */}
                    <div
                        onClick={() => navigate('/snippets')}
                        className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-4xl font-bold text-white mb-1">{stats.snippets}</p>
                                <p className="text-purple-200 text-sm font-medium">Snippets</p>
                            </div>
                            <div className="text-purple-200 opacity-80 mt-1">
                                <SnippetsIcon />
                            </div>
                        </div>
                    </div>

                    {/* Resources card — blue gradient */}
                    <div
                        onClick={() => navigate('/resources')}
                        className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-4xl font-bold text-white mb-1">{stats.resources}</p>
                                <p className="text-blue-200 text-sm font-medium">Resources</p>
                            </div>
                            <div className="text-blue-200 opacity-80 mt-1">
                                <ResourcesIcon />
                            </div>
                        </div>
                    </div>

                    {/* Tasks card — teal gradient */}
                    <div
                        onClick={() => navigate('/tasks')}
                        className="bg-gradient-to-br from-teal-500 to-cyan-700 rounded-2xl p-5 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-4xl font-bold text-white mb-1">{stats.tasks}</p>
                                <p className="text-teal-100 text-sm font-medium">Tasks</p>
                            </div>
                            <div className="text-teal-100 opacity-80 mt-1">
                                <TasksIcon />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks Overview card — matches the mockup's inner dark panel */}
                <div className="bg-slate-800 rounded-2xl p-6 mb-4">
                    <h2 className="text-white font-bold text-lg mb-4">Tasks Overview</h2>
                    <div className="bg-slate-900 rounded-xl px-5 py-4">

                        {/* Status pills — exact colors from the mockup */}
                        {stats.tasks === 0 ? (
                            <p className="text-slate-500 text-sm">No tasks yet</p>
                        ) : (
                            <div className="flex flex-wrap items-center gap-3">

                                {/* Todo — blue pill */}
                                <span
                                    onClick={() => navigate('/tasks')}
                                    className="flex items-center gap-2 bg-blue-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full cursor-pointer hover:bg-blue-400 transition-colors"
                                >
                                    <span>{taskCounts.todo}</span>
                                    <span>Todo</span>
                                </span>

                                {/* In Progress — amber/orange pill */}
                                <span
                                    onClick={() => navigate('/tasks')}
                                    className="flex items-center gap-2 bg-amber-400 text-slate-900 text-sm font-semibold px-4 py-1.5 rounded-full cursor-pointer hover:bg-amber-300 transition-colors"
                                >
                                    <span>{taskCounts.inProgress}</span>
                                    <span>In Progress</span>
                                </span>

                                {/* Done — green pill */}
                                <span
                                    onClick={() => navigate('/tasks')}
                                    className="flex items-center gap-2 bg-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full cursor-pointer hover:bg-green-400 transition-colors"
                                >
                                    <span>{taskCounts.done}</span>
                                    <span>Done</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Items section */}
                <div>
                    <h2 className="text-white font-bold text-lg mb-4">Recent Items</h2>

                    {/* Empty state when no snippets or resources exist yet */}
                    {recentItems.length === 0 ? (
                        <div className="bg-slate-800 rounded-2xl px-5 py-10 text-center">
                            <p className="text-slate-400 text-sm">
                                No items yet — create a snippet or resource to see them here
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentItems.map((item) => (
                                // Each row is clickable and navigates to the relevant page
                                <div
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className="bg-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    {/* Item title */}
                                    <span className="text-white text-sm font-medium truncate mr-4">
                                        {item.title}
                                    </span>

                                    {/* Type badge and date — right aligned */}
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${TYPE_COLORS[item.type]}`}>
                                            {item.type}
                                        </span>
                                        <span className="text-slate-400 text-sm">{item.date}</span>
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