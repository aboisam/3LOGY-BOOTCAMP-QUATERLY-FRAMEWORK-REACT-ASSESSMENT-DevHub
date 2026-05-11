// Main snippets page — fetches all snippets, manages CRUD state, and renders the grid
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import snippetService from '../services/snippetService';
import SnippetForm from '../components/SnippetForm';

/* ─── Language badge colours ─────────────────────────────────────────────── */
const LANG_BADGE = {
    javascript: { bg: '#2563eb', color: '#ffffff' },
    typescript: { bg: '#3b82f6', color: '#ffffff' },
    python: { bg: '#16a34a', color: '#ffffff' },
    csharp: { bg: '#7c3aed', color: '#ffffff' },
    html: { bg: '#ea580c', color: '#ffffff' },
    css: { bg: '#0891b2', color: '#ffffff' },
    sql: { bg: '#ca8a04', color: '#ffffff' },
    java: { bg: '#dc2626', color: '#ffffff' },
    other: { bg: '#475569', color: '#ffffff' },
};

const langBadge = (lang = 'other') => LANG_BADGE[lang.toLowerCase()] || LANG_BADGE.other;

/* ─── Edit icon ──────────────────────────────────────────────────────────── */
const EditIcon = () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

/* ─── Trash icon ─────────────────────────────────────────────────────────── */
const TrashIcon = () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);

/* ─── Snippet Card ───────────────────────────────────────────────────────── */
const SnippetCard = ({ snippet, onEdit, onDelete }) => {
    const badge = langBadge(snippet.language);
    const tags = snippet.tags
        ? snippet.tags.split(',').map(t => t.trim()).filter(Boolean).join(', ')
        : '';

    return (
        <div style={{
            background: '#161926',
            borderRadius: '14px',
            border: '1px solid rgba(90,100,180,0.20)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxSizing: 'border-box',
        }}>
            {/* Title row + badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1.3,
                    flex: 1,
                }}>
                    {snippet.title}
                </h3>
                <span style={{
                    background: badge.bg,
                    color: badge.color,
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    letterSpacing: '0.1px',
                }}>
                    {snippet.language || 'other'}
                </span>
            </div>

            {/* Description */}
            {snippet.description && (
                <p style={{
                    fontSize: '13px',
                    color: '#94a3b8',
                    margin: 0,
                    lineHeight: 1.6,
                }}>
                    {snippet.description}
                </p>
            )}

            {/* Code block */}
            {snippet.code && (
                <div style={{
                    background: '#0f1117',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    overflow: 'hidden',
                    maxHeight: '140px',
                }}>
                    <pre style={{
                        margin: 0,
                        fontSize: '12px',
                        lineHeight: '18px',
                        color: '#a5b4fc',
                        fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                        overflow: 'hidden',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                    }}>
                        {snippet.code.length > 300
                            ? snippet.code.slice(0, 300) + '…'
                            : snippet.code}
                    </pre>
                </div>
            )}

            {/* Tags + action buttons row */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '8px',
                marginTop: 'auto',
            }}>
                {/* Tag string */}
                <span style={{
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: 1.5,
                    flex: 1,
                }}>
                    {tags}
                </span>

                {/* Edit / Delete buttons */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {/* Edit */}
                    <button
                        onClick={onEdit}
                        aria-label="Edit snippet"
                        style={{
                            width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '8px',
                            background: 'rgba(99,102,241,0.10)',
                            border: '1px solid rgba(99,102,241,0.35)',
                            color: '#818cf8',
                            cursor: 'pointer',
                            transition: 'background 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.22)'; e.currentTarget.style.borderColor = '#818cf8'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
                    >
                        <EditIcon />
                    </button>
                    {/* Delete */}
                    <button
                        onClick={onDelete}
                        aria-label="Delete snippet"
                        style={{
                            width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '8px',
                            background: 'rgba(220,38,38,0.10)',
                            border: '1px solid rgba(220,38,38,0.35)',
                            color: '#f87171',
                            cursor: 'pointer',
                            transition: 'background 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.22)'; e.currentTarget.style.borderColor = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.10)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'; }}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Snippets Page ──────────────────────────────────────────────────────── */
const SnippetsPage = () => {
    const navigate = useNavigate();

    const [snippets, setSnippets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingSnippet, setEditingSnippet] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                const data = await snippetService.getAll();
                setSnippets(data);
            } catch {
                setError('Failed to load snippets. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSnippets();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setIsSubmitting(true);
            const newSnippet = await snippetService.create(formData);
            setSnippets([newSnippet, ...snippets]);
            setShowForm(false);
            toast.success('Snippet created!');
        } catch (err) {
            toast.error(err.error || 'Failed to create snippet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (snippet) => {
        setEditingSnippet(snippet);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdate = async (formData) => {
        try {
            setIsSubmitting(true);
            const updated = await snippetService.update(editingSnippet.id, formData);
            setSnippets(snippets.map(s => s.id === editingSnippet.id ? updated : s));
            setShowForm(false);
            setEditingSnippet(null);
            toast.success('Snippet updated!');
        } catch (err) {
            toast.error(err.error || 'Failed to update snippet');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this snippet?')) return;
        try {
            await snippetService.remove(id);
            setSnippets(snippets.filter(s => s.id !== id));
            toast.success('Snippet deleted');
        } catch (err) {
            toast.error(err.error || 'Failed to delete snippet');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSnippet(null);
    };

    const handleFormSubmit = (formData) => {
        editingSnippet ? handleUpdate(formData) : handleCreate(formData);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f1117',
            padding: '40px 32px 60px',
            fontFamily: "'Outfit','Inter',sans-serif",
            boxSizing: 'border-box',
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* ── Page header ── */}
                {!showForm && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '32px',
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 800,
                            color: '#ffffff',
                            margin: 0,
                            letterSpacing: '-0.5px',
                        }}>
                            My Snippets
                        </h1>
                        <button
                            onClick={() => setShowForm(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '11px 20px',
                                borderRadius: '10px',
                                background: '#4f46e5',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: "'Outfit','Inter',sans-serif",
                                boxShadow: '0 4px 16px rgba(79,70,229,0.40)',
                                transition: 'background 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#5b52f0'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(79,70,229,0.55)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.40)'; }}
                        >
                            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
                            New Snippet
                        </button>
                    </div>
                )}

                {/* ── Inline form ── */}
                {showForm && (
                    <SnippetForm
                        initialData={editingSnippet}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancel}
                        isLoading={isSubmitting}
                    />
                )}

                {/* ── Loading spinner ── */}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            border: '4px solid #4f46e5',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.75s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {/* ── Error ── */}
                {error && !isLoading && (
                    <div style={{
                        background: 'rgba(220,38,38,0.10)',
                        border: '1px solid rgba(220,38,38,0.35)',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        color: '#f87171',
                        fontSize: '14px',
                    }}>
                        {error}
                    </div>
                )}

                {/* ── Empty state ── */}
                {!isLoading && !error && snippets.length === 0 && !showForm && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
                        <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '16px', margin: '0 0 6px' }}>
                            No snippets yet
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            Click "New Snippet" to save your first one
                        </p>
                    </div>
                )}

                {/* ── Card grid — 3 columns matching the mockup ── */}
                {!isLoading && snippets.length > 0 && !showForm && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        alignItems: 'start',    /* masonry-like: cards don't stretch */
                    }}>
                        {snippets.map(snippet => (
                            <SnippetCard
                                key={snippet.id}
                                snippet={snippet}
                                onEdit={() => handleEdit(snippet)}
                                onDelete={() => handleDelete(snippet.id)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default SnippetsPage;