// Displays a single snippet — tags from API are a comma-separated string
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const LANGUAGE_COLORS = {
    javascript: 'bg-yellow-900/60 text-yellow-300',
    typescript: 'bg-blue-900/60 text-blue-300',
    python: 'bg-green-900/60 text-green-300',
    csharp: 'bg-purple-900/60 text-purple-300',
    html: 'bg-orange-900/60 text-orange-300',
    css: 'bg-pink-900/60 text-pink-300',
    sql: 'bg-cyan-900/60 text-cyan-300',
    java: 'bg-red-900/60 text-red-300',
    other: 'bg-slate-700 text-slate-300',
};

const SnippetCard = ({ snippet, onEdit, onDelete }) => {
    const navigate = useNavigate();

    if (!snippet) return null;

    // Show only the first 5 lines for a consistent card height
    const codePreview = snippet.code
        ? snippet.code.split('\n').slice(0, 5).join('\n')
        : '';

    const formattedDate = snippet.createdAt
        ? new Date(snippet.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        })
        : 'No date';

    // API returns tags as a comma-separated string — split for rendering pills
    const tagList = snippet.tags
        ? snippet.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    const langColor = LANGUAGE_COLORS[snippet.language] ?? LANGUAGE_COLORS.other;

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all flex flex-col">
            <div className="p-5 flex-1">

                {/* Header — title and language badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                        onClick={() => navigate(`/snippets/${snippet.id}`)}
                        className="font-semibold text-white text-sm leading-snug cursor-pointer hover:text-indigo-400 transition-colors"
                    >
                        {snippet.title}
                    </h3>
                    <span className={clsx(
                        'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
                        langColor
                    )}>
                        {snippet.language}
                    </span>
                </div>

                {/* Optional description */}
                {snippet.description && (
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                        {snippet.description}
                    </p>
                )}

                {/* Code preview block */}
                {codePreview && (
                    <pre className="bg-slate-900 border border-white/[0.07] rounded-lg p-3 text-xs font-mono text-slate-300 overflow-hidden whitespace-pre-wrap line-clamp-5 mb-3">
                        {codePreview}
                    </pre>
                )}

                {/* Tag pills — split from comma-separated string */}
                {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
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

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-xs text-slate-500">{formattedDate}</span>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-600/15 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-600/15 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SnippetCard;