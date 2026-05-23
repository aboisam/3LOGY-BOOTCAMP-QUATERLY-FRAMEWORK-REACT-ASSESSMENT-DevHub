import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

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

/* ─── Card ──────────────────────────────────────────────────────────────── */
const Card = ({ count, label, iconEl, gradient, onClick }) => (
    <div
        onClick={onClick}
        // gradient is a unique multi-stop value — kept as inline style
        style={{ background: gradient }}
        className="rounded-2xl px-3.5 py-4 sm:px-5 sm:py-6 cursor-pointer flex flex-col justify-between min-h-[90px] sm:min-h-[120px] transition-[filter,transform] duration-150 hover:brightness-108 hover:-translate-y-0.5"
    >
        <div className="flex justify-between items-start">
            <span className="text-3xl sm:text-[42px] font-bold text-white leading-none">
                {count}
            </span>
            <span className="text-white/70">
                {iconEl}
            </span>
        </div>
        <span className="text-xs sm:text-sm font-medium text-white/85 mt-2">
            {label}
        </span>
    </div>
);

/* ─── Badge style map ───────────────────────────────────────────────────── */
const badgeCls = {
    Snippets: 'bg-indigo-500/25 text-indigo-300',
    Resources: 'bg-slate-500/25 text-slate-400',
    Tasks: 'bg-teal-500/20 text-teal-300',
};

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

    /* ── Loading spinner ── */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#252840] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        // Page background — unique value, kept as inline style
        <div
            style={{ background: '#252840' }}
            className="min-h-screen flex items-start justify-center px-3 py-4 sm:px-4 sm:py-8 box-border"
        >
            <div className="bg-[#1e2035] rounded-2xl sm:rounded-[20px] px-4 py-5 sm:px-7 sm:py-8 w-full max-w-[860px]">

                {/* Welcome heading */}
                <h1 className="text-xl sm:text-[26px] font-bold text-white leading-snug mb-5 sm:mb-7">
                    Welcome back,{' '}
                    <span className="text-indigo-400">{username}</span>!
                </h1>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-3.5 sm:mb-5">
                    <Card
                        count={stats.snippets}
                        label="Snippets"
                        iconEl={<SnippetsIcon size={22} className="sm:hidden" />}
                        gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                        onClick={() => navigate('/snippets')}
                    />
                    <Card
                        count={stats.resources}
                        label="Resources"
                        iconEl={<ResourcesIcon size={22} />}
                        gradient="linear-gradient(135deg, #4338ca 0%, #3730a3 100%)"
                        onClick={() => navigate('/resources')}
                    />
                    <Card
                        count={stats.tasks}
                        label="Tasks"
                        iconEl={<TasksIcon size={22} />}
                        gradient="linear-gradient(135deg, #0f766e 0%, #0d9488 100%)"
                        onClick={() => navigate('/tasks')}
                    />
                </div>

                {/* ── Tasks Overview ── */}
                <div className="bg-[#262840] rounded-2xl px-4 py-4 sm:px-6 sm:py-5 mb-3.5 sm:mb-5">
                    <h2 className="text-[15px] sm:text-[17px] font-bold text-white mb-3.5">
                        Tasks Overview
                    </h2>

                    <div className="bg-[#1a1c30] rounded-xl px-3.5 py-3 sm:px-4.5 sm:py-3.5 flex items-center min-h-[52px]">
                        {stats.tasks === 0 ? (
                            <span className="text-[13px] text-slate-500">No tasks yet</span>
                        ) : (
                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {/* Todo */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="flex items-center gap-1.5 bg-blue-500 text-white border-0 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-semibold cursor-pointer hover:brightness-110 transition-[filter] duration-150"
                                >
                                    <span>{taskCounts.todo}</span>
                                    <span>Todo</span>
                                </button>

                                {/* In Progress */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="flex items-center gap-1.5 bg-amber-400 text-stone-900 border-0 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-semibold cursor-pointer hover:brightness-110 transition-[filter] duration-150"
                                >
                                    <span>{taskCounts.inProgress}</span>
                                    <span className="sm:hidden">In Prog.</span>
                                    <span className="hidden sm:inline">In Progress</span>
                                </button>

                                {/* Done */}
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="flex items-center gap-1.5 bg-green-500 text-green-950 border-0 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-semibold cursor-pointer hover:brightness-110 transition-[filter] duration-150"
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
                    <h2 className="text-[15px] sm:text-[17px] font-bold text-white mb-3 sm:mb-3.5">
                        Recent Items
                    </h2>

                    {recentItems.length === 0 ? (
                        <div className="bg-[#262840] rounded-[14px] px-4 py-7 sm:py-10 text-center">
                            <p className="text-slate-500 text-[13px] m-0">
                                No items yet — create a snippet or resource to see them here
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            {recentItems.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className="bg-[#262840] hover:bg-[#2e3052] rounded-[14px] px-3.5 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between cursor-pointer transition-colors duration-150 gap-2.5"
                                >
                                    {/* Title */}
                                    <span className="text-[13px] sm:text-sm font-medium text-slate-200 truncate flex-1 min-w-0">
                                        {item.title}
                                    </span>

                                    {/* Badge + date */}
                                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                        <span className={clsx(
                                            'font-medium rounded-full',
                                            'text-[11px] px-2 py-0.5 sm:text-xs sm:px-3 sm:py-1',
                                            badgeCls[item.type],
                                        )}>
                                            {item.type}
                                        </span>
                                        <span className="text-[11px] sm:text-[13px] text-slate-400 min-w-[36px] sm:min-w-[48px] text-right whitespace-nowrap">
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