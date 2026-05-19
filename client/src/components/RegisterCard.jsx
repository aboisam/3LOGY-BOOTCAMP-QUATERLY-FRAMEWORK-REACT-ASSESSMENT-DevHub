import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ── Icons ── */
const EyeIcon = () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon = () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);
const CheckIcon = () => (
    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const GithubIcon = () => (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.88 10.96.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11.1 11.1 0 012.88-.39c.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.68 5.38-5.24 5.67.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.2 21.42 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
);
const GoogleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const LogoMark = () => (
    <div style={{ boxShadow: '0 0 16px rgba(61,47,255,0.4)' }}
        className="w-8 h-8 bg-[#3d2fff] rounded-lg flex items-center justify-center shrink-0">
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
            <rect x="2" y="3" width="7" height="7" rx="1" />
            <rect x="15" y="3" width="7" height="7" rx="1" />
            <rect x="2" y="15" width="7" height="7" rx="1" />
            <rect x="15" y="15" width="7" height="7" rx="1" />
        </svg>
    </div>
);

/* ── Sidebar Step ── */
const Step = ({ icon, title, sub, active, done, showLine }) => (
    <div>
        <div className="flex items-start gap-3">
            <div className={[
                'w-7 h-7 rounded-lg shrink-0 mt-0.5 flex items-center justify-center border text-xs transition-all duration-200',
                active ? 'bg-[#3d2fff] border-[#3d2fff] text-white' : '',
                done ? 'bg-[#0d2018] border-[#2a5c45] text-[#4ecb8a]' : '',
                !active && !done ? 'bg-transparent border-[#1c1c30] text-[#2a2a40]' : '',
            ].join(' ')}>
                {icon}
            </div>
            <div>
                <p className={[
                    'text-[12px] font-medium font-mono leading-tight',
                    active ? 'text-[#c8c4ff]' : done ? 'text-[#4ecb8a]' : 'text-[#2a2a40]',
                ].join(' ')}>{title}</p>
                <p className={[
                    'text-[11px] font-mono mt-0.5',
                    active ? 'text-[#50506a]' : 'text-[#1e1e30]',
                ].join(' ')}>{sub}</p>
            </div>
        </div>
        {showLine && <div className="w-px h-5 bg-[#14142a] ml-3.5 my-1" />}
    </div>
);

/* ── Field ── */
const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] tracking-[0.12em] uppercase text-[#38385a] font-mono font-medium select-none">
            {label}
        </label>
        {children}
        {error && <p className="text-[11px] text-[#d95555] font-mono mt-0.5">{error}</p>}
    </div>
);

/* ── Input base styles ── */
const inputCls = (hasError, isValid) => [
    'w-full bg-[#0a0a16] border rounded-xl px-4 py-[11px]',
    'text-[13px] text-[#d4d0ff] font-mono outline-none',
    'placeholder:text-[#252538]',
    'transition-all duration-150',
    'hover:border-[#252545]',
    'focus:shadow-[0_0_0_3px_rgba(61,47,255,0.15)]',
    hasError ? 'border-[#5c1e1e] focus:border-[#5c1e1e]' : '',
    isValid ? 'border-[#1f4d38] focus:border-[#1f4d38] focus:shadow-[0_0_0_3px_rgba(78,203,138,0.1)]' : '',
    !hasError && !isValid ? 'border-[#1c1c30] focus:border-[#3d2fff]' : '',
].join(' ');

const stepsData = [
    {
        title: 'Account', sub: 'Name & email', active: true,
        icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
        title: 'Security', sub: 'Set a password',
        icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
    },
    {
        title: 'Confirm', sub: 'Review & submit',
        icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    },
];

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
        { label: '8+ chars', test: p => p.length >= 8 },
        { label: 'uppercase', test: p => /[A-Z]/.test(p) },
        { label: 'number', test: p => /[0-9]/.test(p) },
    ];

    const handleChange = e => {
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

    const handleSubmit = async e => {
        e.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length) { setErrors(ve); return; }
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

    return (
        /*
         * ROOT: full-screen, row on md+
         * Key fix: overflow-hidden keeps the sidebar from growing the page width
         */
        <div className="min-h-screen w-full overflow-hidden bg-[#07070f] font-mono flex flex-col md:flex-row">

            {/* ══════════════════════════════════════
                MOBILE TOP BAR  (hidden on md+)
            ══════════════════════════════════════ */}
            <header className="flex md:hidden items-center justify-between
                px-5 h-14 shrink-0
                bg-[#09090f] border-b border-[#131326]
                sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                    <LogoMark />
                    <span className="text-[14px] font-medium text-[#d0ccff] tracking-wide">DevShelf</span>
                </div>
                {/* Step progress dots */}
                <div className="flex items-center gap-1.5">
                    {stepsData.map((_, i) => (
                        <div key={i} className={[
                            'h-1.5 rounded-full transition-all duration-300',
                            i === 0 ? 'w-5 bg-[#3d2fff]' : 'w-1.5 bg-[#1c1c30]',
                        ].join(' ')} />
                    ))}
                </div>
            </header>

            {/* ══════════════════════════════════════
                DESKTOP SIDEBAR  (hidden below md)
                - fixed width 224px
                - sticky so it doesn't scroll away
            ══════════════════════════════════════ */}
            <aside className="hidden md:flex flex-col
                w-56 shrink-0
                bg-[#09090f] border-r border-[#131326]
                sticky top-0 self-start h-screen
                px-6 py-8">

                {/* Brand */}
                <div className="flex items-center gap-2.5 mb-10">
                    <LogoMark />
                    <span className="text-[14px] font-medium text-[#d0ccff] tracking-[0.04em]">DevShelf</span>
                </div>

                {/* Steps */}
                <nav className="flex flex-col gap-0">
                    {stepsData.map((s, i) => (
                        <Step key={s.title} {...s} showLine={i < stepsData.length - 1} />
                    ))}
                </nav>

                {/* Bottom link */}
                <div className="mt-auto pt-5 border-t border-[#131326]">
                    <p className="text-[11px] text-[#1e1e30] font-mono mb-1">Already on DevShelf?</p>
                    <Link to="/login"
                        className="text-[12px] text-[#5548ff] no-underline hover:text-[#7b6fff] transition-colors">
                        Sign in →
                    </Link>
                </div>
            </aside>

            {/* ══════════════════════════════════════
                MAIN — takes remaining width
                Centered content, max-width on form
            ══════════════════════════════════════ */}
            <main className="flex-1 min-w-0 flex flex-col justify-start
                px-6 py-8
                sm:px-10 sm:py-10
                md:px-12 md:py-12
                lg:px-16 lg:py-14">

                {/* Eyebrow */}
                <p className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#3d2fff] font-mono mb-3">
                    Step 1 of 3
                </p>

                {/* Heading */}
                <h1 className="font-mono font-semibold text-[#e2deff] leading-[1.08] tracking-tight mb-2
                    text-[28px] sm:text-[32px] lg:text-[38px]">
                    Create your<br />account{' '}
                    <span className="inline-block align-middle ml-2
                        text-[10px] font-normal tracking-[0.08em]
                        bg-[#17133a] text-[#7b78ff] border border-[#27236a]
                        rounded-[5px] px-2 py-[3px]">
                        Free
                    </span>
                </h1>

                <p className="text-[12px] text-[#35354e] font-mono mb-8 leading-relaxed">
                    Start organizing your dev resources in minutes.
                </p>

                {/* ── FORM — max-w-md keeps it readable, not stretched ── */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">

                    {/* Row: Full Name + Username */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Full Name" error={errors.userName}>
                            <input
                                name="userName" type="text" autoComplete="name"
                                placeholder="John Doe"
                                value={formData.userName} onChange={handleChange}
                                className={inputCls(!!errors.userName, false)}
                            />
                        </Field>
                        <Field label="Username">
                            <input
                                name="username" type="text" autoComplete="username"
                                placeholder="johndoe"
                                className={inputCls(false, false)}
                            />
                        </Field>
                    </div>

                    {/* Email */}
                    <Field label="Email Address" error={errors.email}>
                        <input
                            name="email" type="email" autoComplete="email"
                            placeholder="you@example.com"
                            value={formData.email} onChange={handleChange}
                            className={inputCls(!!errors.email, false)}
                        />
                    </Field>

                    {/* Password */}
                    <Field label="Password" error={errors.password}>
                        <div className="relative">
                            <input
                                name="password" type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password" placeholder="min. 8 characters"
                                value={formData.password} onChange={handleChange}
                                className={inputCls(!!errors.password, false) + ' pr-11'}
                            />
                            <button type="button" tabIndex={-1}
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2
                                    text-[#35354e] hover:text-[#7070a0]
                                    bg-transparent border-none p-0 cursor-pointer
                                    flex items-center transition-colors duration-150">
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {/* Strength pills */}
                        {formData.password && (
                            <div className="flex gap-1.5 flex-wrap mt-2">
                                {passwordRules.map((rule, i) => {
                                    const ok = rule.test(formData.password);
                                    return (
                                        <span key={i} className={[
                                            'text-[10px] px-2.5 py-[3px] rounded-full font-mono border transition-all duration-200',
                                            ok ? 'border-[#1f4d38] text-[#4ecb8a] bg-[#091a10]'
                                                : 'border-[#1c1c30] text-[#2e2e48] bg-transparent',
                                        ].join(' ')}>
                                            {ok && '✓ '}{rule.label}
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
                                className={inputCls(!!errors.confirmPassword, passwordsMatch) + ' pr-11'}
                            />
                            <button type="button" tabIndex={-1}
                                onClick={() => setShowConfirm(v => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2
                                    text-[#35354e] hover:text-[#7070a0]
                                    bg-transparent border-none p-0 cursor-pointer
                                    flex items-center transition-colors duration-150">
                                {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {!errors.confirmPassword && passwordsMatch && (
                            <span className="flex items-center gap-1.5 mt-1 text-[11px] text-[#4ecb8a] font-mono">
                                <span className="w-3.5 h-3.5 rounded-full bg-[#091a10] border border-[#1f4d38]
                                    inline-flex items-center justify-center shrink-0">
                                    <CheckIcon />
                                </span>
                                Passwords match
                            </span>
                        )}
                    </Field>

                    {/* Terms */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                onClick={() => { setAgreed(v => !v); setErrors(e => ({ ...e, agreed: '' })); }}
                                aria-label="Agree to terms"
                                className={[
                                    'w-[18px] h-[18px] rounded-[4px] shrink-0 mt-0.5',
                                    'flex items-center justify-center',
                                    'border transition-all duration-150 cursor-pointer',
                                    agreed
                                        ? 'bg-[#3d2fff] border-[#3d2fff]'
                                        : errors.agreed
                                            ? 'bg-transparent border-[#5c1e1e]'
                                            : 'bg-transparent border-[#222240] hover:border-[#3d2fff]',
                                ].join(' ')}>
                                {agreed && <CheckIcon />}
                            </button>
                            <span className="text-[11px] text-[#3d3d58] font-mono leading-[1.75]">
                                I agree to the{' '}
                                <Link to="/terms" className="text-[#7b78ff] underline underline-offset-2 hover:text-[#9d9bff] transition-colors">
                                    Terms of Service
                                </Link>{' '}and{' '}
                                <Link to="/privacy" className="text-[#7b78ff] underline underline-offset-2 hover:text-[#9d9bff] transition-colors">
                                    Privacy Policy
                                </Link>.
                                {' '}DevShelf will never sell your data.
                            </span>
                        </div>
                        {errors.agreed && (
                            <p className="text-[11px] text-[#d95555] font-mono ml-[30px]">{errors.agreed}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit" disabled={isSubmitting}
                        style={{ boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(61,47,255,0.4)' }}
                        className={[
                            'w-full rounded-xl py-[13px] mt-1',
                            'text-[13px] font-medium text-white font-mono tracking-[0.05em]',
                            'border border-[#3d2fff] bg-[#3d2fff]',
                            'transition-all duration-150 active:scale-[0.99]',
                            isSubmitting
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-[#5548ff] hover:border-[#5548ff]',
                        ].join(' ')}>
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating account...
                            </span>
                        ) : 'Continue →'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5 w-full max-w-md">
                    <div className="flex-1 h-px bg-[#131326]" />
                    <span className="text-[10px] text-[#1e1e32] tracking-[0.12em] uppercase font-mono whitespace-nowrap">
                        or sign up with
                    </span>
                    <div className="flex-1 h-px bg-[#131326]" />
                </div>

                {/* OAuth */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                    {[
                        { icon: <GithubIcon />, label: 'GitHub' },
                        { icon: <GoogleIcon />, label: 'Google' },
                    ].map(({ icon, label }) => (
                        <button key={label} type="button"
                            onClick={() => toast(`${label} sign-up coming soon!`, { icon: '🔒' })}
                            className="flex items-center justify-center gap-2
                                bg-[#0a0a16] border border-[#1c1c30] rounded-xl
                                py-[10px] text-[12px] text-[#50506a] font-mono
                                hover:border-[#2e2e50] hover:text-[#9090b8] hover:bg-[#0e0e1c]
                                transition-all duration-150 cursor-pointer">
                            {icon}{label}
                        </button>
                    ))}
                </div>

                {/* Sign-in */}
                <p className="text-[11px] text-[#28283e] mt-5 w-full max-w-md font-mono">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#7b78ff] no-underline font-medium hover:text-[#9d9bff] transition-colors">
                        Sign in
                    </Link>
                </p>
            </main>
        </div>
    );
};

export default RegisterPage;