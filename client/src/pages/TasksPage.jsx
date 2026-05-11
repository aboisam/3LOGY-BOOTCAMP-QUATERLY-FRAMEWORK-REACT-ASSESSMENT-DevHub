// Tasks page — full CRUD plus status filter tabs and quick status toggle
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'Todo' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
];

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

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

    const filteredTasks = activeFilter === 'all'
        ? tasks
        : tasks.filter(t => t.status === activeFilter);

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
            setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
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
            setTasks(tasks.filter(t => t.id !== id));
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
        editingTask ? handleUpdate(formData) : handleCreate(formData);
    };

    const handleStatusChange = (updatedTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f1117',
            padding: '40px 32px 60px',
            fontFamily: "'Outfit','Inter',sans-serif",
            boxSizing: 'border-box',
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* ── Page header ── */}
                {!showForm && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '28px',
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 800,
                            color: '#ffffff',
                            margin: 0,
                            letterSpacing: '-0.5px',
                        }}>
                            My Tasks
                        </h1>
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '11px 22px',
                                borderRadius: '10px',
                                background: '#4f46e5',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                boxShadow: '0 4px 16px rgba(79,70,229,0.40)',
                                transition: 'background 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#5b52f0'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(79,70,229,0.55)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.40)'; }}
                        >
                            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
                            New Task
                        </button>
                    </div>
                )}

                {/* ── Inline form ── */}
                {showForm && (
                    <TaskForm
                        initialData={editingTask}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancel}
                        isLoading={isSubmitting}
                    />
                )}

                {/* ── Filter tabs — underline style ── */}
                {!showForm && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(90,100,180,0.18)',
                        marginBottom: '28px',
                    }}>
                        {FILTERS.map(({ key, label }) => {
                            const isActive = activeFilter === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveFilter(key)}
                                    style={{
                                        padding: '10px 18px',
                                        fontSize: '14px',
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? '#818cf8' : '#6b7280',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: isActive ? '2px solid #818cf8' : '2px solid transparent',
                                        marginBottom: '-1px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'color 0.15s',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#c0caf5'; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Loading ── */}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            border: '4px solid #4f46e5',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.75s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* ── Error ── */}
                {error && !isLoading && (
                    <div style={{
                        background: 'rgba(220,38,38,0.10)',
                        border: '1px solid rgba(220,38,38,0.35)',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        color: '#f87171',
                        fontSize: '14px',
                    }}>
                        {error}
                    </div>
                )}

                {/* ── Empty state ── */}
                {!isLoading && !error && filteredTasks.length === 0 && !showForm && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <p style={{ fontSize: '36px', margin: '0 0 12px' }}>✅</p>
                        <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '16px', margin: '0 0 6px' }}>
                            {activeFilter === 'all' ? 'No tasks yet' : `No ${FILTERS.find(f => f.key === activeFilter)?.label} tasks`}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            {activeFilter === 'all'
                                ? 'Click "+ New Task" to add your first task'
                                : 'Try a different filter or create a new task'}
                        </p>
                    </div>
                )}

                {/* ── 3-column card grid matching the snippets page layout ── */}
                {!isLoading && !error && filteredTasks.length > 0 && !showForm && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        alignItems: 'start',
                    }}>
                        {filteredTasks.map(task => (
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
        </div>
    );
};

export default TasksPage;