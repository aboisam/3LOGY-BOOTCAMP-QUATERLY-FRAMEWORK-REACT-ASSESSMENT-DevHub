import clsx from 'clsx';
import toast from 'react-hot-toast';

/* ── Status cycle ── */
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

/* ── Status badge colors ── */
const STATUS_COLORS = {
    'todo': 'bg-slate-700      text-slate-300   hover:bg-slate-600',
    'in-progress': 'bg-cyan-900/60    text-cyan-300    hover:bg-cyan-800/60',
    'done': 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/60',
};

/* ── Priority badge colors ── */
const PRIORITY_COLORS = {
    low: 'bg-slate-700/60 text-slate-400',
    medium: 'bg-amber-900/60 text-amber-300',
    high: 'bg-rose-900/60  text-rose-300',
};

/* ── Icons ── */
const EditIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const DeleteIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);
const CalendarIcon = () => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const FolderIcon = () => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
);

/* ════════════════════════════════════════════
   Props (matching ResourceCard's pattern):
   - task        → the task object
   - onEdit      → () => void  — parent opens edit modal
   - onDelete    → () => void  — parent handles delete
   - onStatusChange → (taskId, nextStatus) => void — parent owns the service call
════════════════════════════════════════════ */
const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    if (!task) return null;

    const formattedDue = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        })
        : null;

    const formattedCreated = task.createdAt
        ? new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        })
        : 'No date';

    /*
      Like ResourceCard's onEdit / onDelete, we just signal the parent.
      The parent owns taskService — same pattern as ResourceCard → parent page.
    */
    const handleStatusToggle = () => {
        const nextStatus = NEXT_STATUS[task.status] || 'todo';
        onStatusChange(task.id, nextStatus);
    };

    const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS['todo'];
    const priorityColor = PRIORITY_COLORS[task.priority?.toLowerCase()] || PRIORITY_COLORS.medium;

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all duration-150 flex flex-col w-full">

            {/* ── BODY ── */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col gap-2.5 sm:gap-3">

                {/* Title + status badge */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-sm leading-snug">
                        {task.title}
                    </h3>
                    <button
                        onClick={handleStatusToggle}
                        title="Click to advance status"
                        className={clsx(
                            'text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 capitalize',
                            'border-0 cursor-pointer transition-all duration-150',
                            statusColor,
                        )}
                    >
                        <span className="sm:hidden">
                            {task.status === 'in-progress' ? 'Active' : STATUS_LABELS[task.status] || task.status}
                        </span>
                        <span className="hidden sm:inline">
                            {STATUS_LABELS[task.status] || task.status}
                        </span>
                    </button>
                </div>

                {/* Priority badge */}
                <div>
                    <span className={clsx(
                        'text-xs font-medium px-2 py-0.5 rounded-full capitalize',
                        priorityColor,
                    )}>
                        {task.priority} priority
                    </span>
                </div>

                {/* Description */}
                {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {task.description}
                    </p>
                )}

                {/* Meta pills — project + due date */}
                {(task.project || formattedDue) && (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-auto pt-1">
                        {task.project && (
                            <span className="flex items-center gap-1 text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full">
                                <FolderIcon />
                                <span className="max-w-[100px] sm:max-w-none truncate">
                                    {task.project}
                                </span>
                            </span>
                        )}
                        {formattedDue && (
                            <span className="flex items-center gap-1 text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                                <CalendarIcon />{formattedDue}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── FOOTER — identical structure to ResourceCard ── */}
            <div className="px-4 sm:px-5 py-3 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-xs text-slate-500">{formattedCreated}</span>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        aria-label="Edit task"
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-600/15 transition-colors cursor-pointer border-0 bg-transparent"
                    >
                        <EditIcon /> Edit
                    </button>
                    <button
                        onClick={onDelete}
                        aria-label="Delete task"
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-600/15 transition-colors cursor-pointer border-0 bg-transparent"
                    >
                        <DeleteIcon /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;