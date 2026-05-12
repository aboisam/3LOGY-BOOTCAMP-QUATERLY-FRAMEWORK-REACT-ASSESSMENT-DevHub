import { Pencil, Trash2 } from 'lucide-react';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

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

const TYPE_BADGE = {
    'todo': 'badge-docs',
    'in-progress': 'badge-react',
    'done': 'badge-csharp',
};

const PRIORITY_BADGE = {
    'low': 'badge-other',
    'medium': 'badge-video',
    'high': 'badge-tool',
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const formattedDue = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        })
        : null;

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

    const tagList = [
        task.project && `📁 ${task.project}`,
        formattedDue && `📅 ${formattedDue}`,
    ].filter(Boolean);

    const statusBadgeClass = TYPE_BADGE[task.status] || 'badge-other';
    const priorityBadgeClass = PRIORITY_BADGE[task.priority] || 'badge-other';

    return (
        <div className="rc-card">
            <div className="rc-body">

                {/* Header */}
                <div className="rc-header">
                    <h3 className="rc-title">{task.title}</h3>
                    <button
                        onClick={handleStatusToggle}
                        className={`rc-badge ${statusBadgeClass}`}
                        title="Click to advance status"
                    >
                        {STATUS_LABELS[task.status] || task.status}
                    </button>
                </div>

                {/* Priority shown where URL/filepath goes */}
                <p className="rc-filepath">
                    <span className={`rc-badge ${priorityBadgeClass}`}>
                        {task.priority} priority
                    </span>
                </p>

                {/* Description shown as notes */}
                {task.description && (
                    <p className="rc-notes">{task.description}</p>
                )}
            </div>

            {/* Footer */}
            <div className="rc-footer">
                <div className="rc-tags">
                    {tagList.length > 0 && (
                        <span className="rc-tag">{tagList.join('  ·  ')}</span>
                    )}
                </div>
                <div className="rc-actions">
                    <button className="rc-btn rc-btn-edit" onClick={onEdit} aria-label="Edit">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button className="rc-btn rc-btn-delete" onClick={onDelete} aria-label="Delete">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path>
                            <path d="M10 11v6M14 11v6"></path>
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;