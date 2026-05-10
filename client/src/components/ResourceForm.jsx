// Reusable form for creating and editing resources
import { useState, useEffect } from 'react';

const RESOURCE_TYPES = ['article', 'video', 'tool', 'docs', 'other'];

const ResourceForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        notes: '',
        type: 'article',
        tags: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // Pre-fill form when editing — tags come as a string from the API already
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                url: initialData.url || '',
                notes: initialData.notes || '',
                type: initialData.type || 'article',
                // API stores tags as comma-separated string — display as-is
                tags: initialData.tags || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.url.trim()) {
            errors.url = 'URL is required';
        } else if (!/^https?:\/\/.+/.test(formData.url.trim())) {
            errors.url = 'URL must start with http:// or https://';
        }
        if (!formData.type) errors.type = 'Type is required';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        // API expects tags as a comma-separated STRING not an array
        // Send exactly what the user typed — e.g. "react,docs,frontend"
        const payload = {
            title: formData.title.trim(),
            url: formData.url.trim(),
            notes: formData.notes.trim(),
            type: formData.type,
            tags: formData.tags.trim(),
        };
        onSubmit(payload);
    };

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-5">
                {initialData ? 'Edit Resource' : 'New Resource'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Title — required */}
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

                {/* URL — required, must be valid http/https */}
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

                {/* Type — required dropdown */}
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
                    {formErrors.type && <p className="text-red-400 text-xs mt-1">{formErrors.type}</p>}
                </div>

                {/* Notes — optional */}
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

                {/* Tags — optional, sent as comma-separated string matching the API format */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Tags <span className="text-slate-500 font-normal">(comma-separated, optional)</span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. react,frontend,docs"
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