// Reusable form for creating and editing snippets
import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
    'javascript', 'typescript', 'python', 'csharp',
    'html', 'css', 'sql', 'java', 'other',
];

/* ── tiny helpers ─────────────────────────────────────────────────────────── */

// Capitalise first letter for display
const displayLang = (lang) =>
    lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'JavaScript';

// Split comma-separated tag string → trimmed non-empty array
const parseTags = (str) =>
    str.split(',').map(t => t.trim()).filter(Boolean);

/* ── shared input / textarea base style ──────────────────────────────────── */
const fieldBase = {
    width: '100%',
    background: '#12162a',
    border: '1.5px solid rgba(90,100,180,0.35)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#c8d4ff',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    transition: 'border-color 0.18s',
    resize: 'vertical',
};

const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#c0caf5',
    marginBottom: '8px',
};

const errorStyle = {
    color: 'rgba(252,165,165,0.9)',
    fontSize: '12px',
    marginTop: '5px',
};

/* ─────────────────────────────────────────────────────────────────────────── */

const SnippetForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState(() => ({
        title: initialData?.title || '',
        description: initialData?.description || '',
        code: initialData?.code || '',
        language: initialData?.language || 'javascript',
        tags: initialData?.tags || '',
    }));
    const [formErrors, setFormErrors] = useState({});
    const [langOpen, setLangOpen] = useState(false);
    const [langSearch, setLangSearch] = useState('');
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setLangOpen(false);
                setLangSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    const selectLanguage = (lang) => {
        setFormData({ ...formData, language: lang });
        setFormErrors({ ...formErrors, language: '' });
        setLangOpen(false);
        setLangSearch('');
    };

    const removeTag = (tagToRemove) => {
        const current = parseTags(formData.tags).filter(t => t !== tagToRemove);
        setFormData({ ...formData, tags: current.join(', ') });
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
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
        onSubmit({
            title: formData.title.trim(),
            description: formData.description.trim(),
            code: formData.code,
            language: formData.language,
            tags: formData.tags.trim(),
        });
    };

    // Filtered languages for the search input in dropdown
    const filteredLangs = LANGUAGES.filter(l =>
        l.toLowerCase().includes(langSearch.toLowerCase())
    );

    // Tag chips derived from the tags string
    const tagChips = parseTags(formData.tags);

    // Focus ring helper
    const onFocus = (e) => { e.target.style.borderColor = 'rgba(110,130,255,0.80)'; };
    const onBlur = (e) => { e.target.style.borderColor = 'rgba(90,100,180,0.35)'; };

    return (
        /* Full-page wrapper matching the mockup's dark background */
        <div style={{
            minHeight: '100vh',
            background: '#0f1117',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            paddingBottom: '60px',
        }}>

            {/* ── Top bar with logo ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0 28px',
                gap: '10px',
            }}>
                {/* Code-bracket icon in purple */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
                    DevShelf
                </span>
            </div>

            {/* ── Main content area ── */}
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

                {/* ── Page heading ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                    {/* Purple bracket icon box */}
                    <div style={{
                        width: '44px', height: '44px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0,
                        letterSpacing: '-0.4px',
                    }}>
                        {initialData ? 'Edit Snippet' : 'Create New Snippet'}
                    </h1>
                </div>

                {/* ── Form card ── */}
                <div style={{
                    background: '#161926',
                    borderRadius: '16px',
                    border: '1px solid rgba(90,100,180,0.25)',
                    padding: '32px 28px',
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Title */}
                        <div>
                            <label style={labelStyle}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. React useEffect Cleanup"
                                style={fieldBase}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                            {formErrors.title && <p style={errorStyle}>{formErrors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="What does this snippet do?"
                                style={fieldBase}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </div>

                        {/* Language — custom dropdown matching the mockup */}
                        <div>
                            <label style={labelStyle}>Language</label>
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* Search / filter input */}
                                    <input
                                        type="text"
                                        value={langSearch}
                                        onChange={e => { setLangSearch(e.target.value); setLangOpen(true); }}
                                        onFocus={() => setLangOpen(true)}
                                        placeholder="Select Language..."
                                        style={{ ...fieldBase, flex: 1, resize: 'none' }}
                                    />
                                    {/* Current selection button */}
                                    <button
                                        type="button"
                                        onClick={() => setLangOpen(o => !o)}
                                        style={{
                                            background: '#1e2240',
                                            border: '1.5px solid rgba(110,120,200,0.45)',
                                            borderRadius: '10px',
                                            padding: '10px 16px',
                                            color: '#c8d4ff',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            whiteSpace: 'nowrap',
                                            fontFamily: "'Outfit', 'Inter', sans-serif",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {displayLang(formData.language)}
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Dropdown list */}
                                {langOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 'calc(100% + 6px)',
                                        minWidth: '160px',
                                        background: '#1e2240',
                                        border: '1px solid rgba(110,120,200,0.35)',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        zIndex: 50,
                                        boxShadow: '0 8px 32px rgba(0,0,20,0.45)',
                                    }}>
                                        {filteredLangs.length === 0 ? (
                                            <div style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                                                No match
                                            </div>
                                        ) : filteredLangs.map(lang => (
                                            <button
                                                key={lang}
                                                type="button"
                                                onClick={() => selectLanguage(lang)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    padding: '11px 16px',
                                                    fontSize: '14px',
                                                    color: formData.language === lang ? '#818cf8' : '#c8d4ff',
                                                    background: formData.language === lang
                                                        ? 'rgba(99,102,241,0.15)'
                                                        : 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontFamily: "'Outfit', 'Inter', sans-serif",
                                                    transition: 'background 0.12s',
                                                }}
                                                onMouseEnter={e => {
                                                    if (formData.language !== lang)
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                }}
                                                onMouseLeave={e => {
                                                    if (formData.language !== lang)
                                                        e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {formErrors.language && <p style={errorStyle}>{formErrors.language}</p>}
                        </div>

                        {/* Code — with line numbers */}
                        <div>
                            <label style={labelStyle}>Code</label>
                            <div style={{
                                background: '#12162a',
                                border: `1.5px solid ${formErrors.code ? 'rgba(248,113,113,0.6)' : 'rgba(90,100,180,0.35)'}`,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                display: 'flex',
                            }}>
                                {/* Line numbers column */}
                                <div
                                    aria-hidden="true"
                                    style={{
                                        background: '#0e1124',
                                        borderRight: '1px solid rgba(90,100,180,0.2)',
                                        padding: '13px 10px',
                                        minWidth: '40px',
                                        textAlign: 'right',
                                        userSelect: 'none',
                                        flexShrink: 0,
                                    }}
                                >
                                    {(formData.code || '\n').split('\n').map((_, i) => (
                                        <div key={i} style={{
                                            fontSize: '13px',
                                            lineHeight: '21px',
                                            color: 'rgba(120,140,200,0.4)',
                                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                        }}>
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                                {/* Code textarea */}
                                <textarea
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    rows={10}
                                    placeholder="Paste your code here..."
                                    spellCheck={false}
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        padding: '13px 16px',
                                        fontSize: '13px',
                                        lineHeight: '21px',
                                        color: '#a9b8ff',
                                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                                        resize: 'vertical',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            {formErrors.code && <p style={errorStyle}>{formErrors.code}</p>}
                        </div>

                        {/* Tags */}
                        <div>
                            <label style={labelStyle}>Tags</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="comma-separated: react, hooks, state"
                                style={fieldBase}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                            {/* Tag chips */}
                            {tagChips.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {tagChips.map(tag => (
                                        <span
                                            key={tag}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                background: 'rgba(99,102,241,0.12)',
                                                border: '1px solid rgba(99,102,241,0.30)',
                                                color: '#a5b4fc',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                cursor: 'default',
                                            }}
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                aria-label={`Remove tag ${tag}`}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'rgba(165,180,252,0.55)',
                                                    padding: '0 0 0 2px',
                                                    fontSize: '14px',
                                                    lineHeight: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(165,180,252,0.55)'}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Action buttons — right-aligned ── */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
                            <button
                                type="button"
                                onClick={onCancel}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#c0caf5',
                                    background: '#1e2240',
                                    border: '1px solid rgba(90,100,180,0.35)',
                                    cursor: 'pointer',
                                    fontFamily: "'Outfit', 'Inter', sans-serif",
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#252a4a'}
                                onMouseLeave={e => e.currentTarget.style.background = '#1e2240'}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#ffffff',
                                    background: isLoading ? 'rgba(79,70,229,0.45)' : '#4f46e5',
                                    border: 'none',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    fontFamily: "'Outfit', 'Inter', sans-serif",
                                    transition: 'background 0.15s, box-shadow 0.15s',
                                    boxShadow: isLoading ? 'none' : '0 4px 16px rgba(79,70,229,0.40)',
                                }}
                                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = '#5b52f0'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(79,70,229,0.55)'; } }}
                                onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.40)'; } }}
                            >
                                {isLoading ? 'Saving...' : initialData ? 'Update Snippet' : 'Save Snippet'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SnippetForm;