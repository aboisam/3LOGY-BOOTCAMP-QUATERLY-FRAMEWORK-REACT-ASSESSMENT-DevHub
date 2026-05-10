// Main snippets page — fetches all snippets, manages CRUD state, and renders the grid
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import snippetService from '../services/snippetService';
import SnippetCard from '../components/SnippetCard';
import SnippetForm from '../components/SnippetForm';

const SnippetsPage = () => {
    // Core list state — all mutations (add, update, remove) produce a new array immutably
    const [snippets, setSnippets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // showForm toggles the form panel; editingSnippet holds data when in edit mode
    const [showForm, setShowForm] = useState(false);
    const [editingSnippet, setEditingSnippet] = useState(null);

    // Fetch snippets once when the component mounts — empty dependency array prevents re-fetching
    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                const data = await snippetService.getAll();
                setSnippets(data);
            } catch {
                setError('Failed to load snippets. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSnippets();
    }, []);

    // Add the newly created snippet to the front of the list without refetching the whole array
    const handleCreate = async (formData) => {
        try {
            setIsSubmitting(true);
            const newSnippet = await snippetService.create(formData);
            setSnippets([newSnippet, ...snippets]);
            setShowForm(false);
            toast.success('Snippet created!');
        } catch (err) {
            toast.error(err.error || 'Failed to create snippet');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open the form pre-filled with the selected snippet's data for editing
    const handleEdit = (snippet) => {
        setEditingSnippet(snippet);
        setShowForm(true);
        // Scroll to top so the form is visible immediately
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Replace the old snippet in the array using .map() — React re-renders only the changed card
    const handleUpdate = async (formData) => {
        try {
            setIsSubmitting(true);
            const updated = await snippetService.update(editingSnippet.id, formData);
            setSnippets(snippets.map((s) => (s.id === editingSnippet.id ? updated : s)));
            setShowForm(false);
            setEditingSnippet(null);
            toast.success('Snippet updated!');
        } catch (err) {
            toast.error(err.error || 'Failed to update snippet');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Remove the snippet from local state — .filter() returns every item except the deleted one
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this snippet?')) return;
        try {
            await snippetService.remove(id);
            setSnippets(snippets.filter((s) => s.id !== id));
            toast.success('Snippet deleted');
        } catch (err) {
            toast.error(err.error || 'Failed to delete snippet');
        }
    };

    // Closing the form also clears editingSnippet so re-opening starts in create mode
    const handleCancel = () => {
        setShowForm(false);
        setEditingSnippet(null);
    };

    // Route the form's onSubmit to either create or update depending on whether we're editing
    const handleFormSubmit = (formData) => {
        if (editingSnippet) {
            handleUpdate(formData);
        } else {
            handleCreate(formData);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Page header with title and the button that toggles the form */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Snippets</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Save and reuse your code snippets</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        + New Snippet
                    </button>
                )}
            </div>

            {/* Inline form panel — shown when creating or editing */}
            {showForm && (
                <SnippetForm
                    initialData={editingSnippet}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                />
            )}

            {/* Loading spinner while the initial fetch is in-flight */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Full-page error message if the fetch failed */}
            {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Empty state — shown when the fetch succeeded but the user has no snippets yet */}
            {!isLoading && !error && snippets.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="text-gray-500 font-medium">No snippets yet</p>
                    <p className="text-gray-400 text-sm mt-1">Click "New Snippet" to save your first one</p>
                </div>
            )}

            {/* Responsive grid — 1 column on mobile, 2 on tablet, 3 on desktop */}
            {!isLoading && snippets.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {snippets.map((snippet) => (
                        // key must be unique and stable — using the server-assigned id satisfies both
                        <SnippetCard
                            key={snippet.id}
                            snippet={snippet}
                            onEdit={() => handleEdit(snippet)}
                            onDelete={() => handleDelete(snippet.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SnippetsPage;