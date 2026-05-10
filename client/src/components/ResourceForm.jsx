// Reusable form for creating and editing resources — mode determined by initialData
import { useState } from 'react';

const RESOURCE_TYPES = ['article', 'video', 'tool', 'docs', 'other'];

const ResourceForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    // Form fields match exactly what the API expects
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        url: initialData?.url || '',
        notes: initialData?.notes || '',
        type: initialData?.type || 'article',
        tags: Array.isArray(initialData?.tags)
            ? initialData.tags.join(', ')
            : initialData?.tags || '',
    });
    const [formErrors, setFormErrors] = useState({});

    // One handler updates any field using the input name as the key
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    // Title and URL are required — everything else is optional
    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.url.trim()) errors.url = 'URL is required';
        else if (!/^https?:\/\/.+/.test(formData.url.trim()))
            errors.url = 'URL must start with http:// or https://';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        // Convert comma-separated tags string back to an array before sending
        const payload = {
            ...formData,
            tags: formData.tags
                ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
                : [],
        };
        onSubmit(payload);
    };

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-5">
                {initialData ? 'Edit Resource' : 'New Resource'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title field */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. React Documentation"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    {formErrors.title && <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {/* URL field — must be a valid http/https link */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">URL</label>
                    <input
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    {formErrors.url && <p className="text-red-400 text-xs mt-1">{formErrors.url}</p>}
                </div>

                {/* Type dropdown */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                        {RESOURCE_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Notes field — optional, for extra context */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Notes <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Why is this resource useful?"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Tags field — comma-separated, converted to array on submit */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Tags <span className="text-slate-500 font-normal">(comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. react, frontend, docs"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                    >
                        {isLoading ? 'Saving...' : initialData ? 'Update Resource' : 'Save Resource'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-600 hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResourceForm;