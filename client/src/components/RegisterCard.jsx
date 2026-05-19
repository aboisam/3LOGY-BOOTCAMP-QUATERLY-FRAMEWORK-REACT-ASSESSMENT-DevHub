import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ── SVG Icons ── */
const EyeIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);
const CheckIcon = () => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const GithubIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.88 10.96.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11.1 11.1 0 012.88-.39c.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.68 5.38-5.24 5.67.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.2 21.42 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
);
const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const LogoMark = () => (
    <div className="w-8 h-8 bg-[#3d2fff] rounded-lg flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <rect x="2" y="3" width="7" height="7" rx="1" />
            <rect x="15" y="3" width="7" height="7" rx="1" />
            <rect x="2" y="15" width="7" height="7" rx="1" />
            <rect x="15" y="15" width="7" height="7" rx="1" />
        </svg>
    </div>
);

/* ── Step sidebar item ── */
const Step = ({ icon, title, sub, active, done, showLine }) => (
    <div>
        <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center border transition-all duration-200 text-[13px]
                ${active ? 'bg-[#3d2fff] border-[#3d2fff] text-white'
                    : done ? 'bg-[#132d1f] border-[#2a5c45] text-[#4ecb8a]'
                        : 'bg-[#13131e] border-[#1e1e30] text-[#35354a]'}`}>
                {icon}
            </div>
            <div>
                <div className={`text-[13px] font-medium font-mono leading-tight
                    ${active ? 'text-[#c8c4ff]' : done ? 'text-[#4ecb8a]' : 'text-[#35354a]'}`}>
                    {title}
                </div>
                <div className={`text-[11px] mt-0.5 font-mono ${active ? 'text-[#6a6a88]' : 'text-[#2a2a40]'}`}>
                    {sub}
                </div>
            </div>
        </div>
        {showLine && <div className="w-px h-5 bg-[#1a1a2c] ml-3.5 my-1" />}
    </div>
);

/* ── Field wrapper ── */
const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-[6px]">
        <label className="text-[10px] tracking-[0.14em] uppercase text-[#4a4a62] font-mono font-medium">
            {label}
        </label>
        {children}
        {error && <p className="text-[11px] text-[#e05555] m-0 font-mono">{error}</p>}
    </div>
);

/* ── Shared input classes ── */
const inputBase = 'w-full bg-[#0e0e1a] border border-[#1e1e30] rounded-xl px-4 py-3 text-[13px] text-[#d4d0ff] font-mono outline-none transition-colors duration-150 focus:border-[#3d2fff]';

/* ════════════════════════════════════════════ */
const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ userName: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const passwordRules = [
        { label: '8+ chars', test: (p) => p.length >= 8 },
        { label: 'uppercase', test: (p) => /[A-Z]/.test(p) },
        { label: 'number', test: (p) => /[0-9]/.test(p) },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const e = {};
        if (!formData.userName.trim()) e.userName = 'Full name is required';
        if (!formData.email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
        if (!formData.password) e.password = 'Password is required';
        else if (formData.password.length < 8) e.password = 'Min 8 characters required';
        if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
        if (!agreed) e.agreed = 'You must agree to the terms';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        try {
            setIsSubmitting(true);
            await register(formData.userName, formData.email, formData.password);
            toast.success('Account created! Please sign in 🎉');
            navigate('/login');
        } catch (err) {
            toast.error(err.error || err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

    const stepsData = [
        {
            title: 'Account', sub: 'Name & email', active: true,
            icon: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        },
        {
            title: 'Security', sub: 'Set a password',
            icon: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
        },
        {
            title: 'Confirm', sub: 'Review & submit',
            icon: <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                input::placeholder { color: #2e2e48; }
                * { box-sizing: border-box; }
            `}</style>

            <div className="min-h-screen bg-[#080810] font-mono flex flex-col md:flex-row">

                {/* ════ DESKTOP SIDEBAR — hidden on mobile ════ */}
                <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#0c0c16] border-r border-[#14142a] px-6 py-8 min-h-screen">
                    <div className="flex items-center gap-2.5 mb-12">
                        <LogoMark />
                        <span className="text-[15px] font-medium text-[#d8d4ff] tracking-[0.06em]">DevShelf</span>
                    </div>
                    <div className="flex flex-col">
                        {stepsData.map((s, i) => (
                            <Step key={s.title} {...s} showLine={i < stepsData.length - 1} />
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-[#14142a]">
                        <div className="text-[11px] text-[#2a2a40] leading-relaxed">Already on DevShelf?</div>
                        <Link to="/login" className="text-[12px] text-[#5548ff] no-underline">Sign in →</Link>
                    </div>
                </aside>

                {/* ════ MAIN CONTENT ════ */}
                <main className="flex-1 flex flex-col min-h-screen
                    px-5 pt-8 pb-10
                    md:px-10 md:pt-11 md:pb-12
                    lg:px-14
                ">
                    {/* ── Eyebrow ── */}
                    <p className="text-[10px] tracking-[0.18em] text-[#3d2fff] uppercase mb-4 font-mono">
                        Step 1 of 3
                    </p>

                    {/* ── Title ── */}
                    <h1 className="font-mono font-semibold text-[#e0dcff] leading-[1.1] tracking-tight mb-2
                        text-[36px]
                        sm:text-[40px]
                        md:text-[32px]
                    ">
                        Create your<br />account{' '}
                        <span className="inline-block text-[11px] font-normal align-middle
                            bg-[#1a1730] text-[#7b78ff] border border-[#2d2860]
                            rounded-[5px] px-2 py-[3px] tracking-[0.06em] ml-1.5">
                            Free
                        </span>
                    </h1>

                    <p className="text-[12px] text-[#3a3a52] mb-8 font-mono">
                        Start organizing your dev resources in minutes.
                    </p>

                    {/* ── FORM ── */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-lg">

                        {/* Full Name + Username — 2-col on all sizes to match screenshot */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Full Name" error={errors.userName}>
                                <input
                                    name="userName" type="text" autoComplete="name"
                                    placeholder="John Doe"
                                    value={formData.userName} onChange={handleChange}
                                    className={`${inputBase} ${errors.userName ? '!border-[#6a2222]' : ''}`}
                                />
                            </Field>
                            <Field label="Username">
                                <input
                                    name="username" type="text" autoComplete="username"
                                    placeholder="johndoe"
                                    className={inputBase}
                                />
                            </Field>
                        </div>

                        {/* Email */}
                        <Field label="Email Address" error={errors.email}>
                            <input
                                name="email" type="email" autoComplete="email"
                                placeholder="you@example.com"
                                value={formData.email} onChange={handleChange}
                                className={`${inputBase} ${errors.email ? '!border-[#6a2222]' : ''}`}
                            />
                        </Field>

                        {/* Password */}
                        <Field label="Password" error={errors.password}>
                            <div className="relative">
                                <input
                                    name="password" type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password" placeholder="min. 8 characters"
                                    value={formData.password} onChange={handleChange}
                                    className={`${inputBase} pr-11 ${errors.password ? '!border-[#6a2222]' : ''}`}
                                />
                                <button type="button" tabIndex={-1}
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#45455a] hover:text-[#7a7a99] bg-transparent border-none cursor-pointer flex items-center p-0 transition-colors">
                                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {passwordRules.map((rule, i) => {
                                        const ok = rule.test(formData.password);
                                        return (
                                            <span key={i} className={`text-[10px] px-2.5 py-[3px] rounded-full font-mono border transition-all duration-200
                                                ${ok ? 'border-[#2a5c45] text-[#4ecb8a] bg-[#0d2018]'
                                                    : 'border-[#1e1e30] text-[#3a3a55] bg-[#0e0e1a]'}`}>
                                                {rule.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </Field>

                        {/* Confirm Password */}
                        <Field label="Confirm Password" error={errors.confirmPassword}>
                            <div className="relative">
                                <input
                                    name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                                    autoComplete="new-password" placeholder="repeat password"
                                    value={formData.confirmPassword} onChange={handleChange}
                                    className={`${inputBase} pr-11
                                        ${errors.confirmPassword ? '!border-[#6a2222]'
                                            : passwordsMatch ? '!border-[#2a5c45]'
                                                : ''}`}
                                />
                                <button type="button" tabIndex={-1}
                                    onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#45455a] hover:text-[#7a7a99] bg-transparent border-none cursor-pointer flex items-center p-0 transition-colors">
                                    {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                                </button>
                            </div>
                            {!errors.confirmPassword && passwordsMatch && (
                                <span className="text-[11px] text-[#4ecb8a] flex items-center gap-1.5 mt-1">
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#0d2018] border border-[#2a5c45] inline-flex items-center justify-center">
                                        <CheckIcon />
                                    </span>
                                    Passwords match
                                </span>
                            )}
                        </Field>

                        {/* Terms */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-start gap-3">
                                <div
                                    onClick={() => { setAgreed(v => !v); setErrors(e => ({ ...e, agreed: '' })); }}
                                    className={`w-[18px] h-[18px] rounded-[4px] shrink-0 mt-0.5 flex items-center justify-center cursor-pointer border transition-all duration-150
                                        ${agreed ? 'bg-[#3d2fff] border-[#3d2fff]'
                                            : errors.agreed ? 'bg-[#0e0e1a] border-[#6a2222]'
                                                : 'bg-[#0e0e1a] border-[#2a2a40]'}`}
                                >
                                    {agreed && <CheckIcon />}
                                </div>
                                <span className="text-[11px] text-[#45455a] leading-[1.7] font-mono">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-[#7b78ff] underline underline-offset-2">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-[#7b78ff] underline underline-offset-2">Privacy Policy</Link>.
                                    {' '}DevShelf will never sell your data.
                                </span>
                            </div>
                            {errors.agreed && (
                                <p className="text-[11px] text-[#e05555] m-0 ml-[30px] font-mono">{errors.agreed}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit" disabled={isSubmitting}
                            className={`w-full bg-[#3d2fff] hover:bg-[#5548ff] border border-[#3d2fff] rounded-xl
                                py-[14px] text-[13px] font-medium text-white font-mono tracking-[0.04em]
                                transition-all duration-150 active:scale-[0.99] mt-1
                                ${isSubmitting ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isSubmitting
                                ? <span className="flex items-center justify-center gap-2">
                                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                                    Creating account...
                                </span>
                                : 'Continue →'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6 w-full max-w-lg">
                        <div className="flex-1 h-px bg-[#14142a]" />
                        <span className="text-[10px] text-[#2a2a40] tracking-[0.1em] uppercase whitespace-nowrap font-mono">
                            or sign up with
                        </span>
                        <div className="flex-1 h-px bg-[#14142a]" />
                    </div>

                    {/* OAuth buttons */}
                    <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                        {[
                            { icon: <GithubIcon />, label: 'GitHub' },
                            { icon: <GoogleIcon />, label: 'Google' },
                        ].map(({ icon, label }) => (
                            <button
                                key={label} type="button"
                                onClick={() => toast(`${label} sign-up coming soon!`, { icon: '🔒' })}
                                className="flex items-center justify-center gap-2 bg-[#0e0e1a] border border-[#1e1e30]
                                    rounded-xl py-3 text-[12px] text-[#7a7a99] font-mono
                                    hover:border-[#3a3a55] hover:text-[#a0a0c0] hover:bg-[#13131e]
                                    transition-all duration-150 cursor-pointer"
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Sign-in link */}
                    <p className="text-[11px] text-[#35354a] mt-6 w-full max-w-lg font-mono">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#7b78ff] no-underline font-medium hover:text-[#9d9bff] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </main>
            </div>
        </>
    );
};

export default RegisterPage;