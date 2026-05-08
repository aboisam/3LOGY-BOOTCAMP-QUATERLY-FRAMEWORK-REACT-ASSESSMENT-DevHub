import { useState } from "react";

const CATEGORIES = ["All", "Documentation", "Tools", "Libraries", "Tutorials", "Design", "APIs"];

const RESOURCES = [
    {
        id: 1,
        title: "React Official Docs",
        url: "https://react.dev",
        description: "The official React documentation covering hooks, components, and modern patterns.",
        category: "Documentation",
        tags: ["react", "frontend", "javascript"],
        favicon: "⚛️",
        pinned: true,
        addedAt: "2 days ago",
    },
    {
        id: 2,
        title: "Tailwind CSS",
        url: "https://tailwindcss.com",
        description: "A utility-first CSS framework packed with classes to build any design directly in your markup.",
        category: "Libraries",
        tags: ["css", "styling", "design"],
        favicon: "🎨",
        pinned: true,
        addedAt: "1 week ago",
    },
    {
        id: 3,
        title: "TypeScript Handbook",
        url: "https://typescriptlang.org",
        description: "Complete guide to TypeScript — types, interfaces, generics, and advanced patterns.",
        category: "Documentation",
        tags: ["typescript", "javascript", "types"],
        favicon: "📘",
        pinned: false,
        addedAt: "3 days ago",
    },
    {
        id: 4,
        title: "Vite Build Tool",
        url: "https://vitejs.dev",
        description: "Next generation frontend tooling. Extremely fast dev server and optimized production builds.",
        category: "Tools",
        tags: ["build", "bundler", "tooling"],
        favicon: "⚡",
        pinned: false,
        addedAt: "5 days ago",
    },
    {
        id: 5,
        title: "Prisma ORM",
        url: "https://prisma.io",
        description: "Next-generation Node.js and TypeScript ORM with a readable data model and auto migrations.",
        category: "Libraries",
        tags: ["database", "orm", "typescript"],
        favicon: "🔷",
        pinned: false,
        addedAt: "1 day ago",
    },
    {
        id: 6,
        title: "Josh W Comeau's Blog",
        url: "https://joshwcomeau.com",
        description: "Deep-dive articles on CSS, React animations, and frontend engineering craftsmanship.",
        category: "Tutorials",
        tags: ["css", "react", "animation"],
        favicon: "✍️",
        pinned: true,
        addedAt: "2 weeks ago",
    },
    {
        id: 7,
        title: "Radix UI Primitives",
        url: "https://radix-ui.com",
        description: "Unstyled, accessible UI components for building high-quality design systems and web apps.",
        category: "Libraries",
        tags: ["ui", "accessibility", "react"],
        favicon: "🧩",
        pinned: false,
        addedAt: "4 days ago",
    },
    {
        id: 8,
        title: "Figma",
        url: "https://figma.com",
        description: "Collaborative interface design tool for wireframing, prototyping, and design systems.",
        category: "Design",
        tags: ["design", "prototyping", "ui"],
        favicon: "🖌️",
        pinned: false,
        addedAt: "3 weeks ago",
    },
    {
        id: 9,
        title: "Stripe API Docs",
        url: "https://stripe.com/docs",
        description: "Comprehensive payment API documentation with guides for subscriptions, webhooks, and more.",
        category: "APIs",
        tags: ["payments", "api", "backend"],
        favicon: "💳",
        pinned: false,
        addedAt: "6 days ago",
    },
    {
        id: 10,
        title: "CSS Tricks",
        url: "https://css-tricks.com",
        description: "Tips, tricks, and techniques on using CSS, flexbox, grid, and modern layout methods.",
        category: "Tutorials",
        tags: ["css", "layout", "frontend"],
        favicon: "🔮",
        pinned: false,
        addedAt: "1 week ago",
    },
    {
        id: 11,
        title: "Zod Schema Validation",
        url: "https://zod.dev",
        description: "TypeScript-first schema validation with static type inference. Zero dependencies.",
        category: "Libraries",
        tags: ["validation", "typescript", "schema"],
        favicon: "🛡️",
        pinned: false,
        addedAt: "2 days ago",
    },
    {
        id: 12,
        title: "Excalidraw",
        url: "https://excalidraw.com",
        description: "Virtual whiteboard for sketching hand-drawn like diagrams and architecture flows.",
        category: "Design",
        tags: ["diagrams", "whiteboard", "design"],
        favicon: "✏️",
        pinned: false,
        addedAt: "10 days ago",
    },
];

const categoryColors = {
    Documentation: { dot: "#7c8cf8", bg: "rgba(124,140,248,0.12)", text: "#7c8cf8" },
    Tools: { dot: "#f5a623", bg: "rgba(245,166,35,0.12)", text: "#f5a623" },
    Libraries: { dot: "#61d5c4", bg: "rgba(97,213,196,0.12)", text: "#61d5c4" },
    Tutorials: { dot: "#f06292", bg: "rgba(240,98,146,0.12)", text: "#f06292" },
    Design: { dot: "#ba68c8", bg: "rgba(186,104,200,0.12)", text: "#ba68c8" },
    APIs: { dot: "#4db6ac", bg: "rgba(77,182,172,0.12)", text: "#4db6ac" },
};

function CategoryPill({ cat }) {
    const c = categoryColors[cat] || { dot: "#888", bg: "rgba(136,136,136,0.12)", text: "#888" };
    return (
        <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: c.bg, color: c.text }}
        >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.dot }} />
            {cat}
        </span>
    );
}

function ResourceCard({ resource, onEdit, onDelete, onPin }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 relative group"
            style={{
                background: "#141924",
                border: `1px solid ${hovered ? "#2e3a52" : "#1e2535"}`,
                transform: hovered ? "translateY(-2px)" : "none",
                boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.4)" : "none",
            }}
        >
            {resource.pinned && (
                <div
                    className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded"
                    style={{ background: "rgba(124,140,248,0.15)" }}
                    title="Pinned"
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#7c8cf8" stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
            )}

            <div className="flex items-start gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "#1a1f2e" }}
                >
                    {resource.favicon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-sm leading-tight truncate">{resource.title}</h3>
                    </div>
                    <p className="text-xs truncate" style={{ color: "#3a4a5a" }}>
                        {resource.url.replace("https://", "")}
                    </p>
                </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: "#7a8799" }}>
                {resource.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
                <CategoryPill cat={resource.category} />
                {resource.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "#1a1f2e", color: "#4a5a6a" }}>
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "#1a2030" }}>
                <span className="text-xs" style={{ color: "#3a4a5a" }}>Added {resource.addedAt}</span>
                <div className="flex items-center gap-1">
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-opacity-80"
                        style={{ background: "#1a2535" }}
                        title="Open"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#61d5c4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                    <button onClick={() => onPin(resource.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#1a2535" }} title="Pin">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={resource.pinned ? "#7c8cf8" : "none"} stroke="#7c8cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </button>
                    <button onClick={() => onEdit(resource)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#1e2a3e" }} title="Edit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c8cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button onClick={() => onDelete(resource.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#2a1e1e" }} title="Delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

function Modal({ resource, onClose, onSave }) {
    const [form, setForm] = useState(
        resource || { title: "", url: "", description: "", category: "Documentation", tags: "", favicon: "🔗", pinned: false }
    );
    const handleChange = (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };
    const handleSubmit = () => {
        if (!form.title.trim() || !form.url.trim()) return;
        onSave({
            ...form,
            id: form.id || Date.now(),
            addedAt: form.addedAt || "just now",
            tags: typeof form.tags === "string" ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : form.tags,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#141924", border: "1px solid #1e2535" }}>
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">{resource?.id ? "Edit Resource" : "New Resource"}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">&times;</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Title", name: "title", full: true },
                        { label: "URL", name: "url", full: true },
                        { label: "Favicon / Emoji", name: "favicon", full: false },
                        { label: "Tags (comma separated)", name: "tags", full: false, value: Array.isArray(form.tags) ? form.tags.join(", ") : form.tags },
                    ].map(({ label, name, full, value }) => (
                        <div key={name} className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
                            <label className="text-xs font-semibold" style={{ color: "#5a6a8a" }}>{label}</label>
                            <input
                                name={name}
                                value={value !== undefined ? value : form[name]}
                                onChange={handleChange}
                                className="rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
                                style={{ background: "#1a1f2e", border: "1px solid #1e2535" }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: "#5a6a8a" }}>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}
                        className="rounded-lg px-3 py-2 text-sm text-white outline-none"
                        style={{ background: "#1a1f2e", border: "1px solid #1e2535" }}
                    >
                        {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold" style={{ color: "#5a6a8a" }}>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                        className="rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        style={{ background: "#1a1f2e", border: "1px solid #1e2535" }}
                    />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} className="accent-indigo-500" />
                    <span className="text-sm" style={{ color: "#7a8799" }}>Pin this resource</span>
                </label>

                <div className="flex gap-3 justify-end pt-1">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "#1a1f2e", color: "#7a8799" }}>Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#6c6ef7" }}>Save Resource</button>
                </div>
            </div>
        </div>
    );
}

const NAV_LINKS = ["Dashboard", "Snippets", "Resources", "Tasks"];

export default function DevShelfResources() {
    const [resources, setResources] = useState(RESOURCES);
    const [activeNav, setActiveNav] = useState("Resources");
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [sortBy, setSortBy] = useState("pinned"); // pinned | recent | alpha

    const handleDelete = (id) => setResources(prev => prev.filter(r => r.id !== id));
    const handlePin = (id) => setResources(prev => prev.map(r => r.id === id ? { ...r, pinned: !r.pinned } : r));
    const handleSave = (resource) => {
        setResources(prev => {
            const exists = prev.find(r => r.id === resource.id);
            return exists ? prev.map(r => r.id === resource.id ? resource : r) : [resource, ...prev];
        });
    };

    const filtered = resources
        .filter(r => activeCategory === "All" || r.category === activeCategory)
        .filter(r =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.description.toLowerCase().includes(search.toLowerCase()) ||
            r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === "pinned") return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
            if (sortBy === "alpha") return a.title.localeCompare(b.title);
            return 0;
        });

    const pinnedCount = resources.filter(r => r.pinned).length;

    return (
        <div className="min-h-screen" style={{ background: "#0d1117", fontFamily: "'DM Mono', 'Fira Code', monospace" }}>
            {/* Navbar */}
            <nav className="flex items-center px-8 py-4 gap-8 sticky top-0 z-40" style={{ background: "#0d1117", borderBottom: "1px solid #1a2030" }}>
                <div className="flex items-center gap-2 mr-4">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#6c6ef7" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">Dev<span style={{ color: "#6c6ef7" }}>Shelf</span></span>
                </div>
                <div className="flex items-center gap-1 flex-1">
                    {NAV_LINKS.map(link => (
                        <button key={link} onClick={() => setActiveNav(link)}
                            className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors relative"
                            style={{ color: activeNav === link ? "#6c6ef7" : "#5a6a8a" }}
                        >
                            {link}
                            {activeNav === link && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full" style={{ background: "#6c6ef7" }} />}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#141924", border: "1px solid #1e2535" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a6a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..."
                            className="bg-transparent text-sm outline-none w-36" style={{ color: "#7a8799" }} />
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#2a3040" }}>DS</div>
                </div>
            </nav>

            <main className="px-8 py-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-white font-bold text-3xl tracking-tight">Resources</h1>
                        <p className="text-sm mt-1" style={{ color: "#4a5a6a" }}>
                            {resources.length} saved · {pinnedCount} pinned
                        </p>
                    </div>
                    <button onClick={() => setModal("new")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "#6c6ef7" }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Resource
                    </button>
                </div>

                {/* Filters + Controls */}
                <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                    {/* Category tabs */}
                    <div className="flex items-center gap-1 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={{
                                    background: activeCategory === cat ? "#6c6ef7" : "#141924",
                                    color: activeCategory === cat ? "white" : "#5a6a8a",
                                    border: `1px solid ${activeCategory === cat ? "#6c6ef7" : "#1e2535"}`,
                                }}
                            >
                                {cat}
                                {cat !== "All" && (
                                    <span className="ml-1.5 opacity-60">
                                        {resources.filter(r => r.category === cat).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* View + Sort */}
                    <div className="flex items-center gap-2">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="text-xs rounded-lg px-2.5 py-1.5 outline-none"
                            style={{ background: "#141924", border: "1px solid #1e2535", color: "#7a8799" }}
                        >
                            <option value="pinned">Pinned first</option>
                            <option value="recent">Recent</option>
                            <option value="alpha">A–Z</option>
                        </select>
                        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #1e2535" }}>
                            {[
                                { mode: "grid", icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> },
                                { mode: "list", icon: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></> },
                            ].map(({ mode, icon }) => (
                                <button key={mode} onClick={() => setViewMode(mode)}
                                    className="w-8 h-8 flex items-center justify-center transition-colors"
                                    style={{ background: viewMode === mode ? "#6c6ef7" : "#141924" }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={viewMode === mode ? "white" : "#5a6a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {icon}
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid / List */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3" style={{ color: "#3a4a5a" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p className="text-sm">No resources found</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(r => (
                            <ResourceCard key={r.id} resource={r} onEdit={setModal} onDelete={handleDelete} onPin={handlePin} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filtered.map(r => (
                            <div key={r.id}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 group hover:border-opacity-60"
                                style={{ background: "#141924", border: "1px solid #1e2535" }}
                            >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "#1a1f2e" }}>{r.favicon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-sm font-bold truncate">{r.title}</span>
                                        {r.pinned && <svg width="10" height="10" viewBox="0 0 24 24" fill="#7c8cf8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                                    </div>
                                    <p className="text-xs truncate" style={{ color: "#4a5a6a" }}>{r.url.replace("https://", "")}</p>
                                </div>
                                <p className="text-xs hidden md:block max-w-xs truncate" style={{ color: "#7a8799" }}>{r.description}</p>
                                <CategoryPill cat={r.category} />
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={r.url} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#1a2535" }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#61d5c4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                    <button onClick={() => handlePin(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#1a2535" }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill={r.pinned ? "#7c8cf8" : "none"} stroke="#7c8cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => setModal(r)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#1e2a3e" }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c8cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#2a1e1e" }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {modal && (
                <Modal resource={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
            )}
        </div>
    );
}