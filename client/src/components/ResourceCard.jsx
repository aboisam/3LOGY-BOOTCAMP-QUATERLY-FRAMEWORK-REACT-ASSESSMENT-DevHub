const TYPE_BADGE = {
    csharp: 'badge-csharp',
    react: 'badge-react',
    video: 'badge-video',
    tool: 'badge-tool',
    docs: 'badge-docs',
    other: 'badge-other',
};

const ResourceCard = ({ resource, onEdit, onDelete }) => {
    if (!resource) return null;

    const tagList = resource.tags
        ? resource.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    const badgeClass = TYPE_BADGE[resource.type?.toLowerCase()] || TYPE_BADGE.other;

    return (
        <div className="rc-card">
            <div className="rc-body">

                {/* Header */}
                <div className="rc-header">
                    <h3 className="rc-title">{resource.title}</h3>
                    <span className={`rc-badge ${badgeClass}`}>{resource.type}</span>
                </div>

                {/* URL / filepath */}
                <p className="rc-filepath">{resource.url}</p>

                {/* Code block — shown if notes look like code, else plain notes */}
                {resource.notes && (
                    resource.notes.startsWith('import') || resource.notes.includes('{') ? (
                        <div className="rc-code">
                            <pre>{resource.notes}</pre>
                        </div>
                    ) : (
                        <p className="rc-notes">{resource.notes}</p>
                    )
                )}
            </div>

            {/* Footer */}
            <div className="rc-footer">
                <div className="rc-tags">
                    <span className="rc-tag">{tagList.join(', ')}</span>
                </div>
                <div className="rc-actions">
                    <button className="rc-btn rc-btn-edit" onClick={onEdit} aria-label="Edit">
                        <i className="ti ti-edit" />
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="rc-btn rc-btn-delete" onClick={onDelete} aria-label="Delete">
                        <i className="ti ti-trash" />
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ResourceCard;