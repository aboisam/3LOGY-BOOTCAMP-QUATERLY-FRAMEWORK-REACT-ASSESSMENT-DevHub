// Displays a single resource — URL opens in a new tab, edit and delete via callback props
const TYPE_COLORS = {
    article: 'bg-blue-900 text-blue-300',
    video: 'bg-red-900 text-red-300',
    tool: 'bg-green-900 text-green-300',
    docs: 'bg-yellow-900 text-yellow-300',
    other: 'bg-slate-700 text-slate-300',
};

const ResourceCard = ({ resource, onEdit, onDelete }) => {
    // Format the ISO date into a readable string like "Jan 5, 2025"
    const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all flex flex-col">
            <div className="p-5 flex-1">

                {/* Header — title and type badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white text-sm leading-snug">{resource.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${TYPE_COLORS[resource.type] || TYPE_COLORS.other}`}>
                        {resource.type}
                    </span>
                </div>

                {/* Clickable URL — opens in new tab so user doesn't lose the app */}
                <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-all transition-colors block mb-3"
                >
                {resource.url}
                </a>

            {/* Optional notes — truncated to 2 lines */}
            {resource.notes && (
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{resource.notes}</p>
            )}

            {/* Tag pills */}
            {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>

      {/* Footer — date on left, action buttons on right */ }
    <div className="px-5 py-3 border-t border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-500">{formattedDate}</span>
        <div className="flex gap-2">
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
    </div >
  );
};

export default ResourceCard;