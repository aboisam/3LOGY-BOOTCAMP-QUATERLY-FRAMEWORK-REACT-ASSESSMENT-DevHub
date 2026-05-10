// Tasks page — full CRUD plus status filter tabs and quick status toggle
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

// Filter options shown as tabs above the grid
const FILTERS = ['all', 'todo', 'in-progress', 'done'];

const FILTER_LABELS = {
    'all': 'All',
    'todo': 'Todo',
    'in-progress': 'In Progress',
    'done': 'Done',
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Active filter — 'all' shows every task, others filter by status
    const [activeFilter, setActiveFilter] = useState('all');

    // Fetch all tasks on mount — filtering happens client-side
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await taskService.getAll();
                setTasks(data);
            } catch {
                setError('Failed to load tasks. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Filter the tasks array based on the active tab — no extra API call needed
    const filteredTasks = activeFilter === 'all'
        ? tasks
        : tasks.filter((t) => t.status === activeFilter);

    const handleCreate = async (formData) => {
        try {
            setIsSubmitting(true);
            const newTask = await taskService.create(formData);
            setTasks([newTask, ...tasks]);
            setShowForm(false);
            toast.success('Task created!');
        } catch (err) {
            toast.error(err.error || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdate = async (formData) => {
        try {
            setIsSubmitting(true);
            const updated = await taskService.update(editingTask.id, formData);
            setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
            setShowForm(false);
            setEditingTask(null);
            toast.success('Task updated!');
        } catch (err) {
            toast.error(err.error || 'Failed to update task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await taskService.remove(id);
            setTasks(tasks.filter((t) => t.id !== id));
            toast.success('Task deleted');
        } catch (err) {
            toast.error(err.error || 'Failed to delete task');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const handleFormSubmit = (formData) => {
        if (editingTask) {
            handleUpdate(formData);
        } else {
            handleCreate(formData);
        }
    };

    // Called by TaskCard when the status badge is clicked — updates the task in local state
    const handleStatusChange = (updatedTask) => {
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Track and manage your work</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                        + New Task
                    </button>
                )}
            </div>

            {/* Inline form */}
            {showForm && (
                <TaskForm
                    initialData={editingTask}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                />
            )}

            {/* Filter tabs — client-side filtering, no API call on tab change */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${activeFilter === filter
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                    >
                        {FILTER_LABELS[filter]}
                        {/* Show count badge next to each tab */}
                        <span className="ml-1.5 text-xs opacity-70">
                            {filter === 'all'
                                ? tasks.length
                                : tasks.filter((t) => t.status === filter).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Loading spinner */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Empty state — different message depending on whether a filter is active */}
            {!isLoading && !error && filteredTasks.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-slate-400 font-medium">
                        {activeFilter === 'all' ? 'No tasks yet' : `No ${FILTER_LABELS[activeFilter]} tasks`}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                        {activeFilter === 'all'
                            ? 'Click "New Task" to add your first task'
                            : 'Try a different filter or create a new task'}
                    </p>
                </div>
            )}

            {/* Task grid */}
            {!isLoading && filteredTasks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={() => handleEdit(task)}
                            onDelete={() => handleDelete(task.id)}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TasksPage;