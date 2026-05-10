// Displays a single snippet in the grid — receives data and callback props from SnippetsPage
import { useNavigate } from 'react-router-dom';

// Maps language names to background/text colour pairs for the badge
const LANGUAGE_COLORS = {
    javascript: 'bg-yellow-100 text-yellow-800',
    typescript: 'bg-blue-100 text-blue-800',
    python: 'bg-green-100 text-green-800',
    csharp: 'bg-purple-100 text-purple-800',
    html: 'bg-orange-100 text-orange-800',
    css: 'bg-pink-100 text-pink-800',
    sql: 'bg-cyan-100 text-cyan-800',
    java: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800',
};

const SnippetCard = ({ snippet, onEdit, onDelete }) => {
    const navigate = useNavigate();

    // Show only the first 5 lines so cards stay a consistent height in the grid
    const codePreview = snippet.code
        ? snippet.code.split('\n').slice(0, 5).join('\n')
        : '';

    // Format the ISO date string into something readable like "Jan 5, 2025"
    const formattedDate = new Date(snippet.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        // Card container — clicking the title navigates to the detail page
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 flex-1">

                {/* Header row: title on the left, language badge on the right */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                        onClick={() => navigate(`/snippets/${snippet.id}`)}
                        className="font-semibold text-gray-900 text-sm leading-snug cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                        {snippet.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${LANGUAGE_COLORS[snippet.language] || LANGUAGE_COLORS.other}`}>
                        {snippet.language}
                    </span>
                </div>

                {/* Optional description — only rendered when present */}
                {snippet.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{snippet.description}</p>
                )}

                {/* Code preview block — monospace font, muted background, truncated to 5 lines */}
                {codePreview && (
                    <pre className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs font-mono text-gray-700 overflow-hidden whitespace-pre-wrap line-clamp-5 mb-3">
                        {codePreview}
                    </pre>
                )}

                {/* Tag pills — only shown when the snippet has at least one tag */}
                {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {snippet.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer row: creation date on the left, edit and delete buttons on the right */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">{formattedDate}</span>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SnippetCard;