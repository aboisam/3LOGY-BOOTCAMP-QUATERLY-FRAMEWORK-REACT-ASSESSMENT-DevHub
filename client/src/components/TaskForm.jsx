// Reusable form for creating and editing tasks — styled to match SnippetForm
import { useState, useCallback } from 'react';

const STATUS_OPTIONS = ['todo', 'in-progress', 'done'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

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

/* ─── TaskForm ───────────────────────────────────────────────────────────── */
const TaskForm = ({ initialData = null, onSubmit, onCancel, isLoading }) => {
    const getInitialFormData = useCallback(() => {
        if (initialData) {
            return {
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'todo',
                priority: initialData.priority || 'medium',
                project: initialData.project || '',
                dueDate: initialData.dueDate
                    ? new Date(initialData.dueDate).toISOString().split('T')[0]
                    : '',
            };
        }
        return { title: '', description: '', status: 'todo', priority: 'medium', project: '', dueDate: '' };
    }, [initialData]);

    const [formData, setFormData] = useState(getInitialFormData);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' });
    };

    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
        onSubmit({ ...formData, dueDate: formData.dueDate || null });
    };

    return (
        /* Full-page wrapper — same dark bg as SnippetForm */
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
                    DevShelf
                </span>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>

                {/* ── Page heading ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                    {/* Purple icon box */}
                    <div style={{
                        width: '44px', height: '44px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0,
                        letterSpacing: '-0.4px',
                    }}>
                        {initialData ? 'Edit Task' : 'Create New Task'}
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
                                placeholder="e.g. Fix login bug"
                                style={{ ...fieldBase, resize: 'none' }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                            {formErrors.title && <p style={errorStyle}>{formErrors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label style={labelStyle}>
                                Description <span style={optionalStyle}>(optional)</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="What needs to be done?"
                                style={fieldBase}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </div>

                        {/* Status + Priority — 2 columns */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={{ ...fieldBase, paddingRight: '36px', cursor: 'pointer' }}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s}
                                                style={{ background: '#1e2240', color: '#c8d4ff' }}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Chevron */}
                                    <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}
                                        width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Priority</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        style={{ ...fieldBase, paddingRight: '36px', cursor: 'pointer' }}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    >
                                        {PRIORITY_OPTIONS.map(p => (
                                            <option key={p} value={p}
                                                style={{ background: '#1e2240', color: '#c8d4ff' }}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                    <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}
                                        width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Project + Due Date — 2 columns */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>
                                    Project <span style={optionalStyle}>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="project"
                                    value={formData.project}
                                    onChange={handleChange}
                                    placeholder="e.g. DevShelf"
                                    style={{ ...fieldBase, resize: 'none' }}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    Due Date <span style={optionalStyle}>(optional)</span>
                                </label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    style={{
                                        ...fieldBase,
                                        resize: 'none',
                                        colorScheme: 'dark',
                                    }}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                            </div>
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
                                {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Save Task'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskForm;