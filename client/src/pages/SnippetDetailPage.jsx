// Detail page for a single snippet — ID comes from the URL, fetched fresh on each visit
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import snippetService from '../services/snippetService';

const SnippetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Snippet data starts as null — the loading state prevents rendering before data arrives
    const [snippet, setSnippet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Re-fetch whenever the ID in the URL changes (e.g. navigating between detail pages)
    useEffect(() => {
        const fetchSnippet = async () => {
            try {
                setIsLoading(true);
                const data = await snippetService.getById(id);
                setSnippet(data);
            } catch {
                setError('Snippet not found or failed to load.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSnippet();
    }, [id]);

    // Uses the Clipboard API to copy code — toast confirms the action to the user
    const handleCopyCode = () => {
        navigator.clipboard.writeText(snippet.code);
        toast.success('Code copied to clipboard!');
    };

    // Loading spinner shown while the API call is in-flight
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Error state — shown when the snippet ID doesn't exist or the request failed
    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/snippets')}
                    className="text-sm text-indigo-600 hover:underline"
                >
                    ← Back to Snippets
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            {/* Back navigation and page-level action buttons */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/snippets')}
                    className="text-sm text-indigo-600 hover:underline"
                >
                    ← Back to Snippets
                </button>
                <button
                    onClick={handleCopyCode}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Copy Code
                </button>
            </div>

            {/* Main snippet card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                {/* Title and language badge */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h1 className="text-xl font-bold text-gray-900">{snippet.title}</h1>
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full shrink-0">
                        {snippet.language}
                    </span>
                </div>

                {/* Optional description — hidden when empty */}
                {snippet.description && (
                    <p className="text-sm text-gray-600 mb-5">{snippet.description}</p>
                )}

                {/* Full code block — monospace, horizontally scrollable for long lines */}
                <pre className="bg-gray-950 text-gray-100 rounded-xl p-5 text-sm font-mono overflow-x-auto whitespace-pre mb-5">
                    {snippet.code}
                </pre>

                {/* Tags row — only shown when at least one tag exists */}
                {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                        {snippet.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Metadata footer — created and last-updated timestamps */}
                <div className="border-t border-gray-100 pt-4 flex gap-6">
                    <div>
                        <p className="text-xs text-gray-400">Created</p>
                        <p className="text-sm text-gray-600">
                            {new Date(snippet.createdAt).toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric',
                            })}
                        </p>
                    </div>
                    {snippet.updatedAt && (
                        <div>
                            <p className="text-xs text-gray-400">Last updated</p>
                            <p className="text-sm text-gray-600">
                                {new Date(snippet.updatedAt).toLocaleDateString('en-US', {
                                    month: 'long', day: 'numeric', year: 'numeric',
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnippetDetailPage;