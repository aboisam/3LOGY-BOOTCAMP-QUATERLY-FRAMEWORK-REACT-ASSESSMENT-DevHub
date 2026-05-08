import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LANGUAGES = ['JavaScript', 'Python', 'CSharp', 'HTML', 'CSS', 'TypeScript', 'Java', 'Go', 'Rust'];

const CodeIcon = () => (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="3" strokeOpacity="0.6" />
        <polyline points="8 10 5 13 8 16" stroke="#a78bfa" strokeWidth="2" />
        <polyline points="16 10 19 13 16 16" stroke="#f59e0b" strokeWidth="2" />
        <line x1="13" y1="8" x2="11" y2="18" stroke="#60a5fa" strokeWidth="2" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const CreateSnippetPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        language: 'JavaScript',
        code: '',
        tags: '',
    });
    const [tagList, setTagList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTagsKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const raw = formData.tags.trim().replace(/,$/, '');
            if (raw && !tagList.includes(raw)) {
                setTagList([...tagList, raw]);
            }
            setFormData({ ...formData, tags: '' });
        }
    };

    const handleTagsBlur = () => {
        const raw = formData.tags.trim().replace(/,$/, '');
        if (raw && !tagList.includes(raw)) {
            setTagList([...tagList, raw]);
            setFormData({ ...formData, tags: '' });
        }
    };

    const removeTag = (tag) => {
        setTagList(tagList.filter((t) => t !== tag));
    };

    const selectLanguage = (lang) => {
        setFormData({ ...formData, language: lang });
        setShowDropdown(false);
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!formData.code.trim()) {
            toast.error('Code is required');
            return;
        }
        try {
            setIsSubmitting(true);
            // Replace with real API call e.g. await snippetService.create({...formData, tags: tagList})
            toast.success('Snippet saved!');
            navigate('/snippets');
        } catch (err) {
            toast.error(err.message || 'Failed to save snippet');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 px-4 py-10">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-indigo-950 border border-indigo-700 rounded-xl p-2">
                        <CodeIcon />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create New Snippet</h1>
                </div>

                {/* Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col gap-6">

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. React useEffect Cleanup"
                            className="w-full bg-slate-900 border border-indigo-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What does this snippet do?"
                            rows={4}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                        />
                    </div>

                    {/* Language */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">Language</label>
                        <div className="flex gap-3 relative">
                            <input
                                type="text"
                                placeholder="Select Language..."
                                readOnly
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-400 placeholder-slate-500 outline-none cursor-pointer"
                                onClick={() => setShowDropdown(!showDropdown)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors whitespace-nowrap"
                            >
                                {formData.language}
                                <ChevronIcon />
                            </button>

                            {/* Dropdown */}
                            {showDropdown && (
                                <div className="absolute right-0 top-14 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-20 min-w-36 overflow-hidden">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => selectLanguage(lang)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-700 ${formData.language === lang
                                                ? 'text-indigo-400 bg-slate-700'
                                                : 'text-slate-300'
                                                }`}
                                        >
                                            {lang.toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Code */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">Code</label>
                        <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                            {/* Line numbers + textarea */}
                            <div className="flex">
                                {/* Line numbers */}
                                <div className="select-none py-4 px-3 text-right bg-slate-950 border-r border-slate-800 min-w-10">
                                    {(formData.code || '\n').split('\n').map((_, i) => (
                                        <div key={i} className="text-slate-600 text-xs leading-6">{i + 1}</div>
                                    ))}
                                </div>
                                {/* Code area */}
                                <textarea
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder={`import { useEffect } from 'react';\n\nconst MyComponent = () => {\n  useEffect(() => {\n    // Setup...\n\n    return () => {\n      // Cleanup...\n    };\n  }, []);\n\n  return <div>Component</div>;\n};`}
                                    rows={12}
                                    spellCheck={false}
                                    className="flex-1 bg-transparent px-4 py-4 text-sm text-slate-300 placeholder-slate-700 outline-none resize-none font-mono leading-6 w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            onKeyDown={handleTagsKeyDown}
                            onBlur={handleTagsBlur}
                            placeholder="comma-separated: react, hooks, state"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        {tagList.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {tagList.map((tag) => (
                                    <span
                                        key={tag}
                                        onClick={() => removeTag(tag)}
                                        className="bg-slate-700 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer hover:bg-red-900 hover:text-red-300 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/snippets')}
                            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Snippet'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateSnippetPage;