// Reusable form for both creating and editing a snippet — mode is determined by whether initialData is passed
import { useState } from 'react';

// Supported languages shown in the dropdown
const LANGUAGES = [
    'javascript', 'typescript', 'python', 'csharp',
    'html', 'css', 'sql', 'java', 'other',
];

const SnippetForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    // Form state is pre-filled when editing, or blank when creating
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        code: initialData?.code || '',
        language: initialData?.language || 'javascript',
        tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : initialData?.tags || '',
    });
    const [formErrors, setFormErrors] = useState({});

    // One handler updates any field using the input's name attribute as the key
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    // Required fields are checked before the API call to give instant feedback
    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.code.trim()) errors.code = 'Code is required';
        if (!formData.language) errors.language = 'Language is required';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        // Convert the comma-separated tag string back into a clean array before sending to the API
        const payload = {
            ...formData,
            tags: formData.tags
                ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
                : [],
        };
        onSubmit(payload);
    };

    return (
        // White card form with a header that changes label depending on create vs edit mode
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
                {initialData ? 'Edit Snippet' : 'New Snippet'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Debounce function"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {/* Language dropdown — value must match what the API stores */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                    {formErrors.language && <p className="text-red-500 text-xs mt-1">{formErrors.language}</p>}
                </div>

                {/* Code textarea — monospace font makes it easier to read code */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <textarea
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        rows={8}
                        placeholder="Paste your code here..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                </div>

                {/* Description field — optional but helpful for explaining what the snippet does */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="What does this snippet do?"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Tags field — user types comma-separated values which are split into an array on submit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. utility, async, react"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Action buttons — Cancel discards changes, Save triggers the parent handler */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                        {isLoading ? 'Saving...' : initialData ? 'Update Snippet' : 'Save Snippet'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SnippetForm;