// Displays a single task with status/priority badges and a quick status toggle
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

// Color maps for status and priority badges
const STATUS_COLORS = {
    'todo': 'bg-blue-900 text-blue-300',
    'in-progress': 'bg-amber-900 text-amber-300',
    'done': 'bg-green-900 text-green-300',
};

const PRIORITY_COLORS = {
    'low': 'bg-slate-700 text-slate-300',
    'medium': 'bg-yellow-900 text-yellow-300',
    'high': 'bg-red-900 text-red-300',
};

// The next status in the cycle — clicking the badge advances the task forward
const NEXT_STATUS = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': 'todo',
};

const STATUS_LABELS = {
    'todo': 'Todo',
    'in-progress': 'In Progress',
    'done': 'Done',
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    // Format due date — only shown when a due date exists
    const formattedDue = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        })
        : null;

    // Advance to the next status and notify the parent to update the list
    const handleStatusToggle = async () => {
        const nextStatus = NEXT_STATUS[task.status] || 'todo';
        try {
            const updated = await taskService.updateStatus(task.id, nextStatus);
            onStatusChange(updated);
            toast.success(`Status → ${STATUS_LABELS[nextStatus]}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all flex flex-col">
            <div className="p-5 flex-1">

                {/* Title row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-white text-sm leading-snug">{task.title}</h3>
                    {/* Priority badge */}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
                        {task.priority}
                    </span>
                </div>

                {/* Optional description */}
                {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                )}

                {/* Status badge — clicking it cycles to the next status */}
                <button
                    onClick={handleStatusToggle}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-opacity hover:opacity-80 mb-3 ${STATUS_COLORS[task.status] || STATUS_COLORS.todo}`}
                    title="Click to advance status"
                >
                    {STATUS_LABELS[task.status] || task.status}
                </button>

                {/* Project and due date metadata */}
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {task.project && (
                        <span>📁 {task.project}</span>
                    )}
                    {formattedDue && (
                        <span>📅 {formattedDue}</span>
                    )}
                </div>
            </div>

            {/* Footer — edit and delete buttons */}
            <div className="px-5 py-3 border-t border-slate-700 flex items-center justify-end gap-2">
                <button
                    onClick={onEdit}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-900/40 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-900/40 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCard;