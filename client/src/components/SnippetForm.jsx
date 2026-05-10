// Reusable form for creating and editing snippets
import { useState } from 'react';

const LANGUAGES = [
    'javascript', 'typescript', 'python', 'csharp',
    'html', 'css', 'sql', 'java', 'other',
];

const SnippetForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return {
                title: initialData.title || '',
                description: initialData.description || '',
                code: initialData.code || '',
                language: initialData.language || 'javascript',
                // API stores tags as comma-separated string — keep as-is
                tags: initialData.tags || '',
            };
        } else {
            return {
                title: '',
                description: '',
                code: '',
                language: 'javascript',
                tags: '',
            };
        }
    });
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

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
        // Send tags as a plain string — API expects "react,hooks" not ["react","hooks"]
        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            code: formData.code,
            language: formData.language,
            tags: formData.tags.trim(),
        };
        onSubmit(payload);
    };

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-5">
                {initialData ? 'Edit Snippet' : 'New Snippet'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Debounce function"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    {formErrors.title && <p className="text-red-400 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                    {formErrors.language && <p className="text-red-400 text-xs mt-1">{formErrors.language}</p>}
                </div>

                {/* Code */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Code</label>
                    <textarea
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        rows={8}
                        placeholder="Paste your code here..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                    {formErrors.code && <p className="text-red-400 text-xs mt-1">{formErrors.code}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Description <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="What does this snippet do?"
                        className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                {/* Tags — sent as comma-separated string to match API format */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        Tags <span className="text-slate-500 font-normal">(comma-separated, optional)</span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. utility,async,react"
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
                        {isLoading ? 'Saving...' : initialData ? 'Update Snippet' : 'Save Snippet'}
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

export default SnippetForm;