import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

/* ── Type → badge color (matches SnippetCard's LANGUAGE_COLORS pattern) ── */
const TYPE_COLORS = {
    csharp: 'bg-violet-900/60 text-violet-300',
    react: 'bg-cyan-900/60   text-cyan-300',
    video: 'bg-rose-900/60   text-rose-300',
    tool: 'bg-amber-900/60  text-amber-300',
    docs: 'bg-emerald-900/60 text-emerald-300',
    other: 'bg-slate-700     text-slate-300',
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
const LinkIcon = () => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

/* ════════════════════════════════════════════ */
const ResourceCard = ({ resource, onEdit, onDelete }) => {
    const navigate = useNavigate();

    if (!resource) return null;

    const tagList = resource.tags
        ? resource.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    const typeColor =
        TYPE_COLORS[resource.type?.toLowerCase()] || TYPE_COLORS.other;

    const formattedDate = resource.createdAt
        ? new Date(resource.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        })
        : 'No date';

    // Show notes — code block if it looks like code, plain text otherwise
    const isCode =
        resource.notes?.startsWith('import') || resource.notes?.includes('{');
    const notesPreview = resource.notes
        ? resource.notes.split('\n').slice(0, 5).join('\n')
        : '';

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all flex flex-col">

            {/* ── BODY ── */}
            <div className="p-5 flex-1 flex flex-col">

                {/* Header — title + type badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                        onClick={() => navigate(`/resources/${resource.id}`)}
                        className="font-semibold text-white text-sm leading-snug cursor-pointer hover:text-indigo-400 transition-colors"
                    >
                        {resource.title}
                    </h3>
                    <span className={clsx(
                        'text-xs font-medium px-2 py-0.5 rounded-full shrink-0 capitalize',
                        typeColor,
                    )}>
                        {resource.type}
                    </span>
                </div>

                {/* URL — clickable external link */}
                {resource.url && (
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono truncate mb-3 transition-colors no-underline"
                    >
                        <LinkIcon />
                        {resource.url}
                    </a>
                )}

                {/* Notes — code block or plain text, matches SnippetCard's code preview */}
                {notesPreview && (
                    isCode ? (
                        <pre className="bg-slate-900 border border-white/[0.07] rounded-lg p-3 text-xs font-mono text-slate-300 overflow-hidden whitespace-pre-wrap line-clamp-5 mb-3">
                            {notesPreview}
                        </pre>
                    ) : (
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                            {notesPreview}
                        </p>
                    )
                )}

                {/* Tag pills — same style as SnippetCard */}
                {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto pt-1">
                        {tagList.map((tag, i) => (
                            <span
                                key={i}
                                className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── FOOTER — same layout as SnippetCard ── */}
            <div className="px-5 py-3 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-xs text-slate-500">{formattedDate}</span>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-600/15 transition-colors cursor-pointer flex items-center gap-1"
                    >
                        <EditIcon /> Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-600/15 transition-colors cursor-pointer flex items-center gap-1"
                    >
                        <DeleteIcon /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;