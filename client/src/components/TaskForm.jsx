// Reusable form for creating and editing tasks
import { useState, useCallback } from 'react';

const STATUS_OPTIONS = ['todo', 'in-progress', 'done'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

const TaskForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    const getInitialFormData = useCallback(() => {
        if (initialData) {
            return {
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'todo',
                priority: initialData.priority || 'medium',
                project: initialData.project || '',
                dueDate: initialData.dueDate
                    ? new Date(initialData.dueDate).toISOString().split('T')[0]
                    : '',
            };
        }
        return {
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            project: '',
            dueDate: '',
        };
    }, [initialData]);

    const [formData, setFormData] = useState(getInitialFormData());
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    // Only title is required — all other fields are optional
    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        // Send null for empty dueDate so the API doesn't receive an empty string
        const payload = {
            ...formData,
            dueDate: formData.dueDate || null,
        };
        onSubmit(payload);
    };

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-5">
                {initialData ? 'Edit Task' : 'New Task'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title — required */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Fix login bug"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    {formErrors.title && <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {/* Description — optional */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Description <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="What needs to be done?"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Status and Priority on the same row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                            {PRIORITY_OPTIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Project and Due Date on the same row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Project <span className="text-slate-500 font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            placeholder="e.g. DevShelf"
                            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Due Date <span className="text-slate-500 font-normal">(optional)</span>
                        </label>
                        {/* Date input — value formatted to yyyy-mm-dd in the useEffect above */}
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                    >
                        {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Save Task'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-600 hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;