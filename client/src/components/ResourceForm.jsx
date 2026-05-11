// Reusable form for creating and editing resources — styled to match SnippetForm/TaskForm
import { useState } from 'react';

const RESOURCE_TYPES = ['article', 'video', 'tool', 'docs', 'other'];

/* ─── Shared style tokens ────────────────────────────────────────────────── */
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
    fontFamily: "'Outfit','Inter',sans-serif",
    transition: 'border-color 0.18s, box-shadow 0.18s',
    resize: 'vertical',
    appearance: 'none',
    WebkitAppearance: 'none',
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

const optionalStyle = {
    fontWeight: 400,
    color: 'rgba(148,163,184,0.6)',
    fontSize: '13px',
};

/* ─── Focus / blur handlers ──────────────────────────────────────────────── */
const onFocus = (e) => {
    e.target.style.borderColor = 'rgba(110,130,255,0.80)';
    e.target.style.boxShadow = '0 0 0 3px rgba(99,130,255,0.13)';
};
const onBlur = (e) => {
    e.target.style.borderColor = 'rgba(90,100,180,0.35)';
    e.target.style.boxShadow = 'none';
};

/* ─── Bookmark icon for header ───────────────────────────────────────────── */
const BookmarkIcon = ({ stroke = 'currentColor', size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
);

/* ─── ResourceForm ───────────────────────────────────────────────────────── */
const ResourceForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState(() => ({
        title: initialData?.title || '',
        url: initialData?.url || '',
        notes: initialData?.notes || '',
        type: initialData?.type || 'article',
        tags: initialData?.tags || '',
    }));
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }
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
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
        onSubmit({
            title: formData.title.trim(),
            url: formData.url.trim(),
            notes: formData.notes.trim(),
            type: formData.type,
            tags: formData.tags.trim(),
        });
    };

    // Tag chips from the comma-separated tags string
    const tagChips = formData.tags
        .split(',').map(t => t.trim()).filter(Boolean);

    const removeTag = (tagToRemove) => {
        const updated = tagChips.filter(t => t !== tagToRemove);
        setFormData({ ...formData, tags: updated.join(', ') });
    };

    return (
        /* Full-page wrapper */
        <div style={{
            minHeight: '100vh',
            background: '#0f1117',
            fontFamily: "'Outfit','Inter',sans-serif",
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
                <BookmarkIcon stroke="#818cf8" size={20} />
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
                    DevShelf
                </span>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

                {/* ── Page heading ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                    <div style={{
                        width: '44px', height: '44px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <BookmarkIcon stroke="#ffffff" size={22} />
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0,
                        letterSpacing: '-0.4px',
                    }}>
                        {initialData ? 'Edit Resource' : 'Create New Resource'}
                    </h1>
                </div>

                {/* ── Form card ── */}
                <div style={{
                    background: '#161926',
                    borderRadius: '16px',
                    border: '1px solid rgba(90,100,180,0.25)',
                    padding: '32px 28px',
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

                        {/* Title */}
                        <div>
                            <label style={labelStyle}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. React Documentation"
                                style={{ ...fieldBase, resize: 'none' }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                            {formErrors.title && <p style={errorStyle}>{formErrors.title}</p>}
                        </div>

                        {/* URL */}
                        <div>
                            <label style={labelStyle}>URL</label>
                            <input
                                type="text"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                style={{ ...fieldBase, resize: 'none' }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                            {formErrors.url && <p style={errorStyle}>{formErrors.url}</p>}
                        </div>

                        {/* Type — styled select with chevron */}
                        <div>
                            <label style={labelStyle}>Type</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    style={{ ...fieldBase, paddingRight: '36px', cursor: 'pointer', resize: 'none' }}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                >
                                    {RESOURCE_TYPES.map(type => (
                                        <option key={type} value={type}
                                            style={{ background: '#1e2240', color: '#c8d4ff' }}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {/* Chevron */}
                                <svg
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}
                                    width="14" height="14" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            {formErrors.type && <p style={errorStyle}>{formErrors.type}</p>}
                        </div>

                        {/* Notes */}
                        <div>
                            <label style={labelStyle}>
                                Notes <span style={optionalStyle}>(optional)</span>
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Why is this resource useful?"
                                style={fieldBase}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label style={labelStyle}>
                                Tags <span style={optionalStyle}>(comma-separated, optional)</span>
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g. react, frontend, docs"
                                style={{ ...fieldBase, resize: 'none' }}
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
                                    fontFamily: 'inherit',
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
                                    fontFamily: 'inherit',
                                    transition: 'background 0.15s, box-shadow 0.15s',
                                    boxShadow: isLoading ? 'none' : '0 4px 16px rgba(79,70,229,0.40)',
                                }}
                                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = '#5b52f0'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(79,70,229,0.55)'; } }}
                                onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.40)'; } }}
                            >
                                {isLoading ? 'Saving...' : initialData ? 'Update Resource' : 'Save Resource'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResourceForm;