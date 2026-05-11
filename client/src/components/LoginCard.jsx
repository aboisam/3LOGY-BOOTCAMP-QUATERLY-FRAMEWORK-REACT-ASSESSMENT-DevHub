import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ─── Icons ─────────────────────────────────────────────────────────────── */
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

/* ─── Background decorative circles (matching the mockup) ───────────────── */
const BgDecor = () => (
    <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
    >
        {/* Top-right cluster — large circle with stripes */}
        <circle cx="870" cy="120" r="170" fill="rgba(30,35,90,0.55)" />
        <circle cx="870" cy="120" r="120" fill="none" stroke="rgba(60,70,150,0.4)" strokeWidth="1" />
        {/* Diagonal stripes inside top-right circle */}
        {[820, 840, 860, 880, 900, 920, 940, 960].map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x - 80} y2="240"
                stroke="rgba(80,100,180,0.25)" strokeWidth="6" />
        ))}

        {/* Bottom-left cluster */}
        <circle cx="100" cy="900" r="140" fill="rgba(28,33,85,0.5)" />
        <circle cx="100" cy="900" r="95" fill="none" stroke="rgba(55,65,140,0.35)" strokeWidth="1" />
        {[60, 80, 100, 120, 140, 160].map((x, i) => (
            <line key={i} x1={x} y1="760" x2={x - 60} y2="1000"
                stroke="rgba(70,90,170,0.22)" strokeWidth="6" />
        ))}

        {/* Bottom-right soft blob */}
        <circle cx="960" cy="920" r="200" fill="rgba(25,30,80,0.35)" />

        {/* Very subtle centre radial glow */}
        <radialGradient id="centreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3a50c0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3a50c0" stopOpacity="0" />
        </radialGradient>
        <rect x="0" y="0" width="1024" height="1024" fill="url(#centreGlow)" />
    </svg>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
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
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
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

    /* ── shared input style factory ── */
    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '14px 16px',
        borderRadius: '10px',
        fontSize: '15px',
        outline: 'none',
        background: 'rgba(15,18,60,0.6)',
        border: `1.5px solid ${hasError ? 'rgba(248,113,113,0.7)' : 'rgba(90,110,210,0.35)'}`,
        color: '#c8d4ff',
        boxSizing: 'border-box',
        fontFamily: "'Outfit', sans-serif",
        transition: 'border-color 0.18s, box-shadow 0.18s',
    });

    const focusBorder = (e) => {
        e.target.style.borderColor = 'rgba(120,150,255,0.85)';
        e.target.style.boxShadow = '0 0 0 3px rgba(99,130,255,0.15)';
    };
    const blurBorder = (e, hasError) => {
        e.target.style.borderColor = hasError ? 'rgba(248,113,113,0.7)' : 'rgba(90,110,210,0.35)';
        e.target.style.boxShadow = 'none';
    };

    return (
        /* Page background — muted blue-steel matching the mockup */
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '40px 16px',
            background: 'linear-gradient(160deg, #2c3470 0%, #1e2455 35%, #181e48 65%, #131840 100%)',
            fontFamily: "'Outfit', sans-serif",
        }}>
            <BgDecor />

            {/* ── Card ── */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '480px',
                background: 'linear-gradient(160deg, #1a1f55 0%, #12163d 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(90,110,210,0.28)',
                padding: '48px 44px 40px',
                boxShadow: '0 24px 72px rgba(0,0,20,0.55)',
                boxSizing: 'border-box',
            }}>

                {/* ── Logo ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '24px',
                }}>
                    <span style={{ fontSize: '22px', lineHeight: 1 }}>📁</span>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.3px',
                    }}>
                        DevShelf
                    </span>
                </div>

                {/* ── Heading ── */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 800,
                        color: '#ffffff',
                        margin: '0 0 8px',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.2,
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        fontSize: '15px',
                        color: 'rgba(160,175,230,0.75)',
                        margin: 0,
                    }}>
                        Sign in to your account
                    </p>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'rgba(200,215,255,0.90)',
                                marginBottom: '8px',
                            }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            style={inputStyle(!!errors.email)}
                            onFocus={focusBorder}
                            onBlur={e => blurBorder(e, !!errors.email)}
                        />
                        {errors.email && (
                            <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(252,165,165,0.9)' }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'rgba(200,215,255,0.90)',
                                marginBottom: '8px',
                            }}
                        >
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                style={{
                                    ...inputStyle(!!errors.password),
                                    paddingRight: '48px',
                                    letterSpacing: showPassword ? 'normal' : '2px',
                                }}
                                onFocus={focusBorder}
                                onBlur={e => blurBorder(e, !!errors.password)}
                            />
                            {/* Eye toggle */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'rgba(120,145,210,0.65)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = 'rgba(170,190,255,0.95)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(120,145,210,0.65)'}
                            >
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {errors.password && (
                            <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(252,165,165,0.9)' }}>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* ── Login button ── */}
                    <button
                        type="submit"
                        disabled={busy}
                        style={{
                            width: '100%',
                            padding: '15px',
                            marginTop: '4px',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#ffffff',
                            background: busy
                                ? 'rgba(60,80,200,0.4)'
                                : '#3d52d5',
                            border: 'none',
                            cursor: busy ? 'not-allowed' : 'pointer',
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: '0.2px',
                            transition: 'background 0.18s, box-shadow 0.18s',
                            boxShadow: busy ? 'none' : '0 4px 20px rgba(60,90,220,0.40)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                        }}
                        onMouseEnter={e => { if (!busy) { e.currentTarget.style.background = '#4a61e0'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(60,90,220,0.55)'; } }}
                        onMouseLeave={e => { if (!busy) { e.currentTarget.style.background = '#3d52d5'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(60,90,220,0.40)'; } }}
                    >
                        {busy ? (
                            <>
                                <svg style={{ width: 16, height: 16, animation: 'spin 0.75s linear infinite' }} fill="none" viewBox="0 0 24 24">
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <span style={{ color: 'rgba(255,255,255,0.65)' }}>Signing in…</span>
                            </>
                        ) : 'Login'}
                    </button>
                </form>

                {/* ── Sign up link ── */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    fontSize: '14px',
                    color: 'rgba(140,160,215,0.80)',
                }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{
                            fontWeight: 600,
                            color: '#ffffff',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            textDecorationColor: 'rgba(255,255,255,0.45)',
                            transition: 'text-decoration-color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecorationColor = 'rgba(255,255,255,0.9)'}
                        onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'rgba(255,255,255,0.45)'}
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Spin keyframe */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default LoginPage;