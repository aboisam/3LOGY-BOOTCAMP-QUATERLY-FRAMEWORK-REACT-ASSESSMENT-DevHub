// Resources page — styled to match the Snippets page layout from the mockup
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import resourceService from '../services/resourceService';
import ResourceCard from '../components/ResourceCard';
import ResourceForm from '../components/ResourceForm';

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
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

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    const handleCancel = () => {
        setShowForm(false);
        setEditingResource(null);
    };

    const handleFormSubmit = (formData) => {
        if (editingResource) {
            handleUpdate(formData);
        } else {
            handleCreate(formData);
        }
    };

    return (
        // Full dark page background matching the mockup
        <div className="min-h-screen bg-slate-900 px-4 sm:px-6 py-8">
            <div className="max-w-6xl mx-auto">

                {/* Page header — "My Resources" title left, button right matching mockup */}




                
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">My Resources</h1>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-900/40"
                        >
                            <span className="text-lg leading-none">+</span>
                            New Resource
                        </button>
                    )}
                </div>

                {/* Inline form — shown when creating or editing */}
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

                {/* Empty state — matches the clean centered style */}
                {!isLoading && !error && resources.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-5xl mb-4">🔖</p>
                        <p className="text-white font-semibold text-lg mb-1">No resources yet</p>
                        <p className="text-slate-400 text-sm">
                            Click "New Resource" to save your first link
                        </p>
                    </div>
                )}

                {/* Resource grid — 3 columns matching the snippet grid in the mockup */}
                {!isLoading && !error && resources.length > 0 && (
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
        </div>
    );
};

export default ResourcesPage;