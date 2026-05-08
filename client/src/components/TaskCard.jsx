import { useState } from 'react';

const TABS = ['All', 'Todo', 'In Progress', 'Done'];

const statusColors = {
    Todo: 'bg-slate-600 text-slate-200',
    'In Progress': 'bg-amber-700 text-amber-200',
    Done: 'bg-green-700 text-green-200',
};

const priorityColors = {
    High: 'bg-red-600 text-white',
    Medium: 'bg-amber-500 text-white',
    Low: 'bg-slate-500 text-white',
};

const initialTasks = [
    { id: 1, title: 'Build login page', project: 'Apollo', status: 'Todo', priority: 'High', due: 'Oct 15' },
    { id: 2, title: 'Fix navbar bug', project: 'Apollo', status: 'In Progress', priority: 'High', due: 'Oct 12' },
    { id: 3, title: 'Implement SSO', project: 'Apollo', status: 'In Progress', priority: 'Medium', due: 'Oct 18' },
    { id: 4, title: 'API documentation', project: 'Apollo', status: 'Done', priority: 'Medium', due: 'Oct 10' },
    { id: 5, title: 'Write unit tests', project: 'Apollo', status: 'Todo', priority: 'Low', due: 'Oct 20' },
];

// Icons
const EditIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const MoveIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <polyline points="5 9 2 12 5 15" />
        <polyline points="19 9 22 12 19 15" />
        <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
);

const TasksPage = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTab, setActiveTab] = useState('Todo');
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', project: '', status: 'Todo', priority: 'Medium', due: '' });

    const filtered = activeTab === 'All' ? tasks : tasks.filter(t => t.status === activeTab);

    const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

    const toggleDone = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: t.status === 'Done' ? 'Todo' : 'Done' } : t
        ));
    };

    const handleCreate = () => {
        if (!newTask.title.trim()) return;
        setTasks([...tasks, { ...newTask, id: Date.now() }]);
        setNewTask({ title: '', project: '', status: 'Todo', priority: 'Medium', due: '' });
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 px-4 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <h1 className="text-3xl font-extrabold text-white">My Tasks</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-lg"
                    >
                        <span className="text-lg leading-none">+</span> New Task
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-6 border-b border-slate-700">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'text-indigo-400 border-b-2 border-indigo-500'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Task List */}
                <div className="flex flex-col gap-3">
                    {filtered.length === 0 && (
                        <p className="text-slate-500 text-sm text-center py-10">No tasks here.</p>
                    )}
                    {filtered.map(task => (
                        <div
                            key={task.id}
                            className="bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* Left */}
                                <div className="flex flex-col gap-2">
                                    <p className="text-white font-semibold text-base">{task.title}</p>
                                    <p className="text-slate-400 text-sm">Project: {task.project}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[task.status]}`}>
                                            {task.status}
                                        </span>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityColors[task.priority]}`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-slate-400 text-sm">Due: {task.due}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 text-slate-500 mt-1 shrink-0">
                                    <button className="hover:text-indigo-400 transition-colors"><EditIcon /></button>
                                    <button className="hover:text-blue-400 transition-colors"><MoveIcon /></button>
                                    <button onClick={() => deleteTask(task.id)} className="hover:text-red-400 transition-colors"><TrashIcon /></button>
                                    <button onClick={() => toggleDone(task.id)} className={`transition-colors ${task.status === 'Done' ? 'text-green-400' : 'hover:text-green-400'}`}><CheckIcon /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* New Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-white font-bold text-xl mb-6">New Task</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Task title"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                placeholder="Project name"
                                value={newTask.project}
                                onChange={e => setNewTask({ ...newTask, project: e.target.value })}
                                className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <select
                                value={newTask.status}
                                onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                                className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option>Todo</option>
                                <option>In Progress</option>
                                <option>Done</option>
                            </select>
                            <select
                                value={newTask.priority}
                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Due date (e.g. Oct 20)"
                                value={newTask.due}
                                onChange={e => setNewTask({ ...newTask, due: e.target.value })}
                                className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksPage;