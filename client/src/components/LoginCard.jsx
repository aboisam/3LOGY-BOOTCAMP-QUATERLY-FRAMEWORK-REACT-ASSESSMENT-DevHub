import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import clsx from 'clsx';

/* ── Icons ── */
const EyeIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

/* ── Background decorative SVG ── */
const BgDecor = () => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
    >
        {/* Top-right cluster */}
        <circle cx="870" cy="120" r="170" fill="rgba(30,35,90,0.55)" />
        <circle cx="870" cy="120" r="120" fill="none" stroke="rgba(60,70,150,0.4)" strokeWidth="1" />
        {[820, 840, 860, 880, 900, 920, 940, 960].map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x - 80} y2="240" stroke="rgba(80,100,180,0.25)" strokeWidth="6" />
        ))}

        {/* Bottom-left cluster */}
        <circle cx="100" cy="900" r="140" fill="rgba(28,33,85,0.5)" />
        <circle cx="100" cy="900" r="95" fill="none" stroke="rgba(55,65,140,0.35)" strokeWidth="1" />
        {[60, 80, 100, 120, 140, 160].map((x, i) => (
            <line key={i} x1={x} y1="760" x2={x - 60} y2="1000" stroke="rgba(70,90,170,0.22)" strokeWidth="6" />
        ))}

        {/* Bottom-right soft blob */}
        <circle cx="960" cy="920" r="200" fill="rgba(25,30,80,0.35)" />

        {/* Centre radial glow */}
        <radialGradient id="centreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3a50c0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3a50c0" stopOpacity="0" />
        </radialGradient>
        <rect x="0" y="0" width="1024" height="1024" fill="url(#centreGlow)" />
    </svg>
);

/* ── Input class builder ── */
const inputCls = (hasError) => clsx(
    'w-full px-4 py-3.5 rounded-xl text-base outline-none',
    'bg-white/5 text-text-body font-sans',
    'border transition-all duration-150',
    'placeholder:text-white/20',
    'focus:ring-2 focus:ring-brand/20 focus:border-brand-light/80',
    hasError
        ? 'border-red-400/70'
        : 'border-brand/30 hover:border-brand/50',
);

/* ════════════════════════════════════════════ */
const LoginPage = () => {
    const { login, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const e = {};
        if (!formData.email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email address';
        if (!formData.password) e.password = 'Password is required';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ve = validate();
        if (Object.keys(ve).length) { setErrors(ve); return; }
        try {
            setIsSubmitting(true);
            await login(formData.email, formData.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.error || err.message || 'Login failed. Check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const busy = isSubmitting || isLoading;

    return (
        /*
          PAGE
          mobile  → centred column, tight padding
          sm+     → more breathing room
        */
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16"
            style={{ background: 'linear-gradient(160deg, #2c3470 0%, #1e2455 35%, #181e48 65%, #131840 100%)' }}
        >
            <BgDecor />

            {/* ── CARD ── */}
            <div className="
        relative z-10 w-full
        max-w-sm sm:max-w-md
        rounded-2xl border border-brand/25
        px-6 py-10
        sm:px-10 sm:py-12
      "
                style={{
                    background: 'linear-gradient(160deg, #1a1f55 0%, #12163d 100%)',
                    boxShadow: '0 24px 72px rgba(0,0,20,0.55)',
                }}
            >

                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-6">
                    <span className="text-2xl leading-none">📁</span>
                    <span className="text-xl font-bold text-white tracking-tight">DevShelf</span>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-sm sm:text-base text-brand-light/75">
                        Sign in to your account
                    </p>
                </div>

                {/* ── FORM ── */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-text-body/90">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputCls(!!errors.email)}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-300/90">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-text-body/90">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="••••••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className={clsx(inputCls(!!errors.password), 'pr-12', !showPassword && 'tracking-widest')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 border-0 bg-transparent text-brand-light/60 hover:text-brand-lighter cursor-pointer flex items-center transition-colors duration-150"
                            >
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-300/90">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={busy}
                        className={clsx(
                            'w-full mt-1 py-4 rounded-xl',
                            'text-base font-bold text-white tracking-wide',
                            'border-0 transition-all duration-150',
                            'flex items-center justify-center gap-2.5',
                            busy
                                ? 'opacity-50 cursor-not-allowed bg-brand/40'
                                : 'cursor-pointer bg-brand hover:bg-brand-hover active:scale-[0.99]',
                        )}
                        style={!busy ? { boxShadow: '0 4px 20px rgba(60,90,220,0.40)' } : {}}
                    >
                        {busy ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span className="text-white/65">Signing in…</span>
                            </>
                        ) : 'Login'}
                    </button>
                </form>

                {/* Sign-up link */}
                <p className="text-center mt-6 text-sm text-brand-light/80">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white/90 transition-all duration-150"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;