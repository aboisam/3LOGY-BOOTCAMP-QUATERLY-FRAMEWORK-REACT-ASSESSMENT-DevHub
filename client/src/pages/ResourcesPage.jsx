// Resources page — same CRUD pattern as SnippetsPage
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import resourceService from '../services/resourceService';
import ResourceCard from '../components/ResourceCard';
import ResourceForm from '../components/ResourceForm';

const ResourcesPage = () => {
    // Core list state — all mutations produce a new array immutably
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // showForm toggles the form panel; editingResource holds data in edit mode
    const [showForm, setShowForm] = useState(false);
    const [editingResource, setEditingResource] = useState(null);

    // Fetch resources once on mount
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await resourceService.getAll();
                setResources(data);
            } catch {
                setError('Failed to load resources. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchResources();
    }, []);

    // Prepend the new resource to the list so it appears at the top immediately
    const handleCreate = async (formData) => {
        try {
            setIsSubmitting(true);
            const newResource = await resourceService.create(formData);
            setResources([newResource, ...resources]);
            setShowForm(false);
            toast.success('Resource saved!');
        } catch (err) {
            toast.error(err.error || 'Failed to save resource');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open the form pre-filled with the selected resource's existing data
    const handleEdit = (resource) => {
        setEditingResource(resource);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Replace the edited resource in the array using .map()
    const handleUpdate = async (formData) => {
        try {
            setIsSubmitting(true);
            const updated = await resourceService.update(editingResource.id, formData);
            setResources(resources.map((r) => (r.id === editingResource.id ? updated : r)));
            setShowForm(false);
            setEditingResource(null);
            toast.success('Resource updated!');
        } catch (err) {
            toast.error(err.error || 'Failed to update resource');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Remove the resource from local state using .filter()
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            await resourceService.remove(id);
            setResources(resources.filter((r) => r.id !== id));
            toast.success('Resource deleted');
        } catch (err) {
            toast.error(err.error || 'Failed to delete resource');
        }
    };

    // Closing the form resets editing state so next open starts fresh
    const handleCancel = () => {
        setShowForm(false);
        setEditingResource(null);
    };

    // Route submit to create or update based on whether we are editing
    const handleFormSubmit = (formData) => {
        if (editingResource) {
            handleUpdate(formData);
        } else {
            handleCreate(formData);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Resources</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Bookmark useful links and references</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                        + New Resource
                    </button>
                )}
            </div>

            {/* Inline form panel */}
            {showForm && (
                <ResourceForm
                    initialData={editingResource}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    isLoading={isSubmitting}
                />
            )}

            {/* Loading spinner */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Empty state — shown when fetch succeeded but no resources exist yet */}
            {!isLoading && !error && resources.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-4xl mb-3">🔖</p>
                    <p className="text-slate-400 font-medium">No resources yet</p>
                    <p className="text-slate-500 text-sm mt-1">
                        Click "New Resource" to save your first link
                    </p>
                </div>
            )}

            {/* Resource grid — only rendered when there are actual items */}
            {!isLoading && resources.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {resources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onEdit={() => handleEdit(resource)}
                            onDelete={() => handleDelete(resource.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourcesPage;