import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Mock data — replace with real API calls
const stats = {
    snippets: 12,
    resources: 8,
    tasks: 15,
};

const taskCounts = {
    todo: 5,
    inProgress: 4,
    done: 6,
};

const recentItems = [
    { id: 1, title: 'React Component Library', type: 'Snippets', date: 'Oct 26' },
    { id: 2, title: 'Python Script for API', type: 'Snippets', date: 'Oct 25' },
    { id: 3, title: 'UI Design Patterns Article', type: 'Resources', date: 'Oct 24' },
];

const CodeIcon = () => (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

const BookmarkIcon = () => (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

const TaskIcon = () => (
    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <line x1="9" y1="6" x2="20" y2="6" />
        <line x1="9" y1="12" x2="20" y2="12" />
        <line x1="9" y1="18" x2="20" y2="18" />
        <polyline points="4 6 5 7 7 5" />
        <polyline points="4 12 5 13 7 11" />
        <polyline points="4 18 5 19 7 17" />
    </svg>
);

const tagColors = {
    Snippets: 'bg-indigo-900 text-indigo-300 border border-indigo-700',
    Resources: 'bg-slate-700 text-slate-300 border border-slate-600',
};

const DashboardCard = () => {
    const { user } = useContext(AuthContext);
    const username = user?.userName || user?.email?.split('@')[0] || 'there';

    return (
        <div className="min-h-screen bg-slate-900 px-4 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Welcome */}
                <h1 className="text-2xl font-bold text-white mb-7">
                    Welcome back, <span className="text-indigo-400">{username}</span>!
                </h1>

                {/* Stat Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">

                    {/* Snippets */}
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 flex flex-col justify-between min-h-28">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-4xl font-bold text-white">{stats.snippets}</p>
                                <p className="text-purple-200 text-sm mt-1">Snippets</p>
                            </div>
                            <div className="text-purple-200 opacity-70">
                                <CodeIcon />
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 flex flex-col justify-between min-h-28">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-4xl font-bold text-white">{stats.resources}</p>
                                <p className="text-blue-200 text-sm mt-1">Resources</p>
                            </div>
                            <div className="text-blue-200 opacity-70">
                                <BookmarkIcon />
                            </div>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-700 rounded-2xl p-5 flex flex-col justify-between min-h-28">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-4xl font-bold text-white">{stats.tasks}</p>
                                <p className="text-teal-100 text-sm mt-1">Tasks</p>
                            </div>
                            <div className="text-teal-100 opacity-70">
                                <TaskIcon />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Tasks Overview */}
                <div className="bg-slate-800 rounded-2xl p-6 mb-5">
                    <h2 className="text-white font-bold text-lg mb-4">Tasks Overview</h2>
                    <div className="bg-slate-900 rounded-xl px-5 py-4 flex items-center gap-3">
                        {/* Todo */}
                        <span className="flex items-center gap-1.5 bg-blue-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                            <span>{taskCounts.todo}</span>
                            <span>Todo</span>
                        </span>
                        {/* In Progress */}
                        <span className="flex items-center gap-1.5 bg-amber-400 text-slate-900 text-sm font-semibold px-3 py-1.5 rounded-full">
                            <span>{taskCounts.inProgress}</span>
                            <span>In Progress</span>
                        </span>
                        {/* Done */}
                        <span className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                            <span>{taskCounts.done}</span>
                            <span>Done</span>
                        </span>
                    </div>
                </div>

                {/* Recent Items */}
                <div>
                    <h2 className="text-white font-bold text-lg mb-4">Recent Items</h2>
                    <div className="flex flex-col gap-3">
                        {recentItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-slate-750 transition-colors cursor-pointer"
                            >
                                <span className="text-white text-sm font-medium">{item.title}</span>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${tagColors[item.type]}`}>
                                        {item.type}
                                    </span>
                                    <span className="text-slate-400 text-sm">{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardCard;