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
        // Matches the deep navy background from the mockup
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#12151f',
                padding: '40px 24px',
            }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Page header — bold "My Resources" left, pill button right */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '32px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '28px',
                            fontWeight: 800,
                            color: '#ffffff',
                            margin: 0,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        My Resources
                    </h1>

                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#5457e5',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4446c9'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5457e5'}
                        >
                            <span style={{ fontSize: '18px', lineHeight: 1, marginTop: '-1px' }}>+</span>
                            New Resource
                        </button>
                    )}
                </div>

                {/* Inline form */}
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
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                border: '3px solid rgba(99,102,241,0.3)',
                                borderTopColor: '#6366f1',
                                borderRadius: '50%',
                                animation: 'spin 0.7s linear infinite',
                            }}
                        />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* Error state */}
                {error && !isLoading && (
                    <div
                        style={{
                            backgroundColor: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#fca5a5',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            fontSize: '14px',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && resources.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '96px 0' }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔖</p>
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: '18px', marginBottom: '6px' }}>
                            No resources yet
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Click "New Resource" to save your first link
                        </p>
                    </div>
                )}

                {/* Resource grid — 3 columns matching the snippet grid */}
                {!isLoading && !error && resources.length > 0 && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px',
                        }}
                    >
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