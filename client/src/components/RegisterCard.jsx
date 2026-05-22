import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import clsx from 'clsx';

/* ── Icons ── */
const EyeIcon = () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
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

/* ── Logo ── */
const LogoMark = () => (
    <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shrink-0">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <rect x="2" y="3" width="7" height="7" rx="1" />
            <rect x="15" y="3" width="7" height="7" rx="1" />
            <rect x="2" y="15" width="7" height="7" rx="1" />
            <rect x="15" y="15" width="7" height="7" rx="1" />
        </svg>
    </div>
);

/* ── Sidebar step icons ── */
const UserIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const LockIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);
const TickIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

/* ── Step component ── */
const Step = ({ icon, title, sub, active, done, showLine }) => (
    <div>
        <div className="flex items-center gap-3">
            <div className={clsx(
                'w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border transition-all duration-200',
                active && 'bg-brand border-brand text-white',
                done && 'bg-success-surface border-success-dim text-success',
                !active && !done && 'bg-transparent border-border-subtle text-border-subtle',
            )}>
                {icon}
            </div>
            <div>
                <p className={clsx(
                    'text-sm font-semibold font-mono leading-tight',
                    active && 'text-text-primary',
                    done && 'text-success',
                    !active && !done && 'text-text-dim',
                )}>
                    {title}
                </p>
                <p className={clsx(
                    'text-xs font-mono mt-0.5',
                    active ? 'text-text-hint' : 'text-border-subtle',
                )}>
                    {sub}
                </p>
            </div>
        </div>
        {showLine && <div className="w-px h-6 bg-border-dim ml-4 my-1.5" />}
    </div>
);

/* ── Field wrapper ── */
const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-widest uppercase text-text-label font-mono font-medium select-none">
            {label}
        </label>
        {children}
        {error && <p className="text-xs text-danger font-mono">{error}</p>}
    </div>
);

/* ── Input class builder (uses clsx) ── */
const inputCls = ({ error = false, valid = false, extra = '' } = {}) =>
    clsx(
        'w-full bg-surface-input border rounded-lg',
        'px-4 py-3 text-sm text-text-body font-mono',
        'outline-none placeholder:text-border-subtle',
        'transition-all duration-150',
        error && 'border-danger-border focus:border-danger focus:ring-2 focus:ring-danger/15',
        valid && 'border-success-border focus:border-success focus:ring-2 focus:ring-success/10',
        !error && !valid && 'border-border-subtle focus:border-brand focus:ring-2 focus:ring-brand/20 hover:border-border-mid',
        extra,
    );

/* ════════════════════════════════════════════ */
const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
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

    const steps = [
        { title: 'Account', sub: 'Name & email', icon: <UserIcon />, active: true },
        { title: 'Security', sub: 'Set a password', icon: <LockIcon /> },
        { title: 'Confirm', sub: 'Review & submit', icon: <TickIcon /> },
    ];

    return (
        /* ROOT — column on mobile, row on md+ */
        <div className="min-h-screen w-full bg-base font-mono flex flex-col md:flex-row overflow-hidden">

            {/* ── MOBILE HEADER (hidden md+) ── */}
            <header className="flex md:hidden items-center justify-between px-5 h-14 shrink-0 bg-surface border-b border-border-dark">
                <div className="flex items-center gap-2.5">
                    <LogoMark />
                    <span className="text-base font-semibold text-text-primary tracking-tight">DevShelf</span>
                </div>
                {/* Progress dots */}
                <div className="flex items-center gap-1.5">
                    {steps.map((_, i) => (
                        <div key={i} className={clsx(
                            'h-1.5 rounded-full transition-all duration-300',
                            i === 0 ? 'w-5 bg-brand' : 'w-1.5 bg-border-subtle',
                        )} />
                    ))}
                </div>
            </header>

            {/* ── SIDEBAR (hidden mobile, visible md+) ── */}
            <aside className="hidden md:flex flex-col w-[200px] lg:w-[220px] shrink-0 bg-surface border-r border-border-dark h-screen sticky top-0 px-5 py-8 lg:px-6">
                {/* Brand */}
                <div className="flex items-center gap-3 mb-10 lg:mb-12">
                    <LogoMark />
                    <span className="text-base font-semibold text-text-primary tracking-tight">DevShelf</span>
                </div>

                {/* Steps */}
                <nav className="flex flex-col">
                    {steps.map((s, i) => (
                        <Step key={s.title} {...s} showLine={i < steps.length - 1} />
                    ))}
                </nav>

                {/* Sign-in link pinned to bottom */}
                <div className="mt-auto pt-6 border-t border-border-dark">
                    <p className="text-xs text-text-faint font-mono mb-1.5">Already on DevShelf?</p>
                    <Link to="/login" className="text-xs text-brand-light no-underline hover:text-brand-lighter transition-colors duration-150">
                        Sign in →
                    </Link>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="
        flex-1 min-w-0 overflow-y-auto
        px-5 py-8
        sm:px-8 sm:py-10
        md:px-10 md:py-12
        lg:px-16 lg:py-14
        xl:px-20
      ">
                {/* Eyebrow */}
                <p className="text-xs tracking-widest font-medium uppercase text-brand-light font-mono mb-4 md:mb-5">
                    Step 1 of 3
                </p>

                {/* Heading */}
                <h1 className="
          font-mono font-bold text-text-primary leading-tight tracking-tight mb-2
          text-3xl
          sm:text-4xl
          lg:text-5xl
        ">
                    Create your<br />account{' '}
                    <span className="inline-block align-middle ml-2 text-xs font-medium tracking-wide bg-brand-muted text-brand-light border border-brand-border rounded-md px-2.5 py-1">
                        Free
                    </span>
                </h1>

                <p className="text-sm text-text-muted font-mono mb-8 md:mb-10 leading-relaxed">
                    Start organizing your dev resources in minutes.
                </p>

                {/* ── FORM ── */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5 w-full max-w-xl lg:max-w-2xl">

                    {/* Full Name + Username — stacked mobile, 2-col sm+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Full Name" error={errors.userName}>
                            <input
                                name="userName" type="text" autoComplete="name"
                                placeholder="John Doe"
                                value={formData.userName} onChange={handleChange}
                                className={inputCls({ error: !!errors.userName })}
                            />
                        </Field>
                        <Field label="Username">
                            <input
                                name="username" type="text" autoComplete="username"
                                placeholder="johndoe"
                                className={inputCls()}
                            />
                        </Field>
                    </div>

                    {/* Email */}
                    <Field label="Email Address" error={errors.email}>
                        <input
                            name="email" type="email" autoComplete="email"
                            placeholder="you@example.com"
                            value={formData.email} onChange={handleChange}
                            className={inputCls({ error: !!errors.email })}
                        />
                    </Field>

                    {/* Password */}
                    <Field label="Password" error={errors.password}>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="min. 8 characters"
                                value={formData.password} onChange={handleChange}
                                className={inputCls({ error: !!errors.password, extra: 'pr-12' })}
                            />
                            <button
                                type="button" tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted bg-transparent border-0 p-0 cursor-pointer flex items-center transition-colors duration-150"
                            >
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {/* Strength pills */}
                        {formData.password && (
                            <div className="flex gap-2 flex-wrap mt-2">
                                {passwordRules.map((rule, i) => {
                                    const ok = rule.test(formData.password);
                                    return (
                                        <span key={i} className={clsx(
                                            'text-2xs px-2.5 py-1 rounded-full font-mono border transition-all duration-200',
                                            ok
                                                ? 'border-success-border text-success bg-success-bg'
                                                : 'border-border-subtle text-text-dim bg-transparent',
                                        )}>
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
                                name="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="repeat password"
                                value={formData.confirmPassword} onChange={handleChange}
                                className={inputCls({ error: !!errors.confirmPassword, valid: !!passwordsMatch, extra: 'pr-12' })}
                            />
                            <button
                                type="button" tabIndex={-1}
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted bg-transparent border-0 p-0 cursor-pointer flex items-center transition-colors duration-150"
                            >
                                {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {!errors.confirmPassword && passwordsMatch && (
                            <span className="flex items-center gap-1.5 mt-1 text-xs text-success font-mono">
                                <span className="w-4 h-4 rounded-full bg-success-bg border border-success-border inline-flex items-center justify-center shrink-0">
                                    <CheckIcon />
                                </span>
                                Passwords match
                            </span>
                        )}
                    </Field>

                    {/* Terms checkbox */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                onClick={() => { setAgreed((v) => !v); setErrors((e) => ({ ...e, agreed: '' })); }}
                                aria-label="Agree to terms"
                                className={clsx(
                                    'w-5 h-5 rounded-sm shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all duration-150 cursor-pointer',
                                    agreed && 'bg-brand border-brand',
                                    !agreed && errors.agreed && 'bg-transparent border-danger-border',
                                    !agreed && !errors.agreed && 'bg-transparent border-border-mid hover:border-brand',
                                )}
                            >
                                {agreed && <CheckIcon />}
                            </button>
                            <span className="text-xs text-text-muted font-mono leading-relaxed">
                                I agree to the{' '}
                                <Link to="/terms" className="text-brand-light underline underline-offset-2 hover:text-brand-lighter transition-colors">
                                    Terms of Service
                                </Link>{' '}and{' '}
                                <Link to="/privacy" className="text-brand-light underline underline-offset-2 hover:text-brand-lighter transition-colors">
                                    Privacy Policy
                                </Link>.
                                {' '}DevShelf will never sell your data.
                            </span>
                        </div>
                        {errors.agreed && (
                            <p className="text-xs text-danger font-mono ml-8">{errors.agreed}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit" disabled={isSubmitting}
                        className={clsx(
                            'w-full rounded-lg py-3 md:py-3.5 mt-1',
                            'text-base font-semibold text-white font-mono tracking-wide',
                            'bg-brand border border-brand transition-all duration-150 active:scale-[0.99]',
                            isSubmitting
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:bg-brand-hover hover:border-brand-hover',
                        )}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating account...
                            </span>
                        ) : 'Continue →'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6 w-full max-w-xl lg:max-w-2xl">
                    <div className="flex-1 h-px bg-border-dark" />
                    <span className="text-2xs text-text-faint tracking-widest uppercase font-mono whitespace-nowrap">
                        or sign up with
                    </span>
                    <div className="flex-1 h-px bg-border-dark" />
                </div>

                {/* OAuth — stacked mobile, 2-col sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl lg:max-w-2xl">
                    {[
                        { icon: <GithubIcon />, label: 'GitHub' },
                        { icon: <GoogleIcon />, label: 'Google' },
                    ].map(({ icon, label }) => (
                        <button
                            key={label} type="button"
                            onClick={() => toast(`${label} sign-up coming soon!`, { icon: '🔒' })}
                            className="flex items-center justify-center gap-2 bg-surface-card border border-border-subtle rounded-lg py-3 text-xs text-text-muted font-mono hover:border-border-mid hover:text-text-label hover:bg-surface-hover transition-all duration-150 cursor-pointer"
                        >
                            {icon}{label}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-xs text-text-dim mt-6 w-full max-w-xl lg:max-w-2xl font-mono pb-8 md:pb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-light no-underline font-medium hover:text-brand-lighter transition-colors">
                        Sign in
                    </Link>
                </p>
            </main>
        </div>
    );
};

export default RegisterPage;