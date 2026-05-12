import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ── inline SVG icons ── */
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

/* ── step sidebar item ── */
const Step = ({ icon, title, sub, active, done, showLine }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? '#3d2fff' : done ? '#132d1f' : '#13131e',
                border: `1.5px solid ${active ? '#3d2fff' : done ? '#2a5c45' : '#1e1e30'}`,
                color: active ? '#fff' : done ? '#4ecb8a' : '#35354a',
                fontSize: 13,
                transition: 'all .2s',
            }}>
                {icon}
            </div>
            <div>
                <div style={{
                    fontSize: 13, fontWeight: 500, fontFamily: 'DM Mono, monospace',
                    color: active ? '#c8c4ff' : done ? '#4ecb8a' : '#35354a',
                    lineHeight: 1.3,
                }}>
                    {title}
                </div>
                <div style={{ fontSize: 11, color: active ? '#6a6a88' : '#2a2a40', marginTop: 1, fontFamily: 'DM Mono, monospace' }}>
                    {sub}
                </div>
            </div>
        </div>
        {showLine && (
            <div style={{ width: 1, height: 20, background: '#1a1a2c', margin: '4px 0 4px 14px' }} />
        )}
    </div>
);

/* ── field wrapper ── */
const Field = ({ label, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#4a4a62', fontFamily: 'DM Mono, monospace', fontWeight: 500,
        }}>
            {label}
        </label>
        {children}
        {error && <p style={{ fontSize: 11, color: '#e05555', margin: 0, fontFamily: 'DM Mono, monospace' }}>{error}</p>}
    </div>
);

/* ── shared input style builder ── */
const inputStyle = (hasError, extra = {}) => ({
    width: '100%', boxSizing: 'border-box',
    background: '#0e0e1a',
    border: `1px solid ${hasError ? '#6a2222' : '#1e1e30'}`,
    borderRadius: 8,
    padding: '11px 14px',
    fontSize: 13,
    color: '#d4d0ff',
    fontFamily: 'DM Mono, monospace',
    outline: 'none',
    transition: 'border-color .15s',
    ...extra,
});

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

    /* ── render ── */
    return (
        <div style={{
            minHeight: '100vh',
            background: '#080810',
            display: 'flex',
            alignItems: 'stretch',
            fontFamily: 'DM Mono, monospace',
        }}>
            {/* ── Left sidebar ── */}
            <aside style={{
                width: 240, flexShrink: 0,
                background: '#0c0c16',
                borderRight: '1px solid #14142a',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
                    <div style={{
                        width: 32, height: 32, background: '#3d2fff', borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                            <rect x="2" y="3" width="7" height="7" rx="1" />
                            <rect x="15" y="3" width="7" height="7" rx="1" />
                            <rect x="2" y="15" width="7" height="7" rx="1" />
                            <rect x="15" y="15" width="7" height="7" rx="1" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: '#d8d4ff', letterSpacing: '0.06em' }}>
                        DevShelf
                    </span>
                </div>

                {/* Steps */}
                <Step icon={<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                    title="Account" sub="Name & email" active showLine />
                <Step icon={<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>}
                    title="Security" sub="Set a password" showLine />
                <Step icon={<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    title="Confirm" sub="Review & submit" />

                {/* Bottom sign-in nudge */}
                <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #14142a' }}>
                    <div style={{ fontSize: 11, color: '#2a2a40', lineHeight: 1.7 }}>
                        Already on DevShelf?
                    </div>
                    <Link to="/login" style={{ fontSize: 12, color: '#5548ff', textDecoration: 'none' }}>
                        Sign in →
                    </Link>
                </div>
            </aside>

            {/* ── Main form panel ── */}
            <main style={{
                flex: 1,
                padding: '44px 52px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Eyebrow */}
                <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#3d2fff', textTransform: 'uppercase', margin: '0 0 10px' }}>
                    Step 1 of 3
                </p>

                {/* Title */}
                <h1 style={{ fontSize: 32, fontWeight: 600, color: '#e0dcff', lineHeight: 1.15, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                    Create your<br />account{' '}
                    <span style={{
                        fontSize: 12, fontWeight: 400, verticalAlign: 'middle',
                        background: '#1a1730', color: '#7b78ff',
                        border: '1px solid #2d2860', borderRadius: 5,
                        padding: '3px 8px', letterSpacing: '0.06em', marginLeft: 6,
                    }}>
                        Free
                    </span>
                </h1>
                <p style={{ fontSize: 12, color: '#3a3a52', margin: '0 0 32px' }}>
                    Start organizing your dev resources in minutes.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>

                    {/* Name + Username row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <Field label="Full Name" error={errors.userName}>
                            <input
                                name="userName" type="text" autoComplete="name"
                                placeholder="John Doe"
                                value={formData.userName} onChange={handleChange}
                                style={inputStyle(!!errors.userName)}
                                onFocus={e => e.target.style.borderColor = '#3d2fff'}
                                onBlur={e => e.target.style.borderColor = errors.userName ? '#6a2222' : '#1e1e30'}
                            />
                        </Field>
                        <Field label="Username">
                            <input
                                name="username" type="text" autoComplete="username"
                                placeholder="johndoe"
                                style={inputStyle(false)}
                                onFocus={e => e.target.style.borderColor = '#3d2fff'}
                                onBlur={e => e.target.style.borderColor = '#1e1e30'}
                            />
                        </Field>
                    </div>

                    {/* Email */}
                    <Field label="Email Address" error={errors.email}>
                        <input
                            name="email" type="email" autoComplete="email"
                            placeholder="you@example.com"
                            value={formData.email} onChange={handleChange}
                            style={inputStyle(!!errors.email)}
                            onFocus={e => e.target.style.borderColor = '#3d2fff'}
                            onBlur={e => e.target.style.borderColor = errors.email ? '#6a2222' : '#1e1e30'}
                        />
                    </Field>

                    {/* Password */}
                    <Field label="Password" error={errors.password}>
                        <div style={{ position: 'relative' }}>
                            <input
                                name="password" type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="min. 8 characters"
                                value={formData.password} onChange={handleChange}
                                style={inputStyle(!!errors.password, { paddingRight: 40 })}
                                onFocus={e => e.target.style.borderColor = '#3d2fff'}
                                onBlur={e => e.target.style.borderColor = errors.password ? '#6a2222' : '#1e1e30'}
                            />
                            <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#45455a', padding: 0, display: 'flex' }}>
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {/* Strength pills */}
                        {formData.password && (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                                {passwordRules.map((rule, i) => {
                                    const ok = rule.test(formData.password);
                                    return (
                                        <span key={i} style={{
                                            fontSize: 10, padding: '3px 10px', borderRadius: 20,
                                            fontFamily: 'DM Mono, monospace',
                                            border: `1px solid ${ok ? '#2a5c45' : '#1e1e30'}`,
                                            color: ok ? '#4ecb8a' : '#3a3a55',
                                            background: ok ? '#0d2018' : '#0e0e1a',
                                            transition: 'all .2s',
                                        }}>
                                            {rule.label}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </Field>

                    {/* Confirm password */}
                    <Field label="Confirm Password" error={errors.confirmPassword}>
                        <div style={{ position: 'relative' }}>
                            <input
                                name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="repeat password"
                                value={formData.confirmPassword} onChange={handleChange}
                                style={inputStyle(!!errors.confirmPassword, {
                                    paddingRight: 40,
                                    borderColor: errors.confirmPassword ? '#6a2222' : passwordsMatch ? '#2a5c45' : '#1e1e30',
                                })}
                                onFocus={e => e.target.style.borderColor = '#3d2fff'}
                                onBlur={e => e.target.style.borderColor = errors.confirmPassword ? '#6a2222' : passwordsMatch ? '#2a5c45' : '#1e1e30'}
                            />
                            <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#45455a', padding: 0, display: 'flex' }}>
                                {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {!errors.confirmPassword && passwordsMatch && (
                            <span style={{ fontSize: 11, color: '#4ecb8a', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                                <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#0d2018', border: '1px solid #2a5c45', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckIcon />
                                </span>
                                Passwords match
                            </span>
                        )}
                    </Field>

                    {/* Terms */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                            <div
                                onClick={() => { setAgreed(v => !v); setErrors(e => ({ ...e, agreed: '' })); }}
                                style={{
                                    width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                                    background: agreed ? '#3d2fff' : '#0e0e1a',
                                    border: `1.5px solid ${agreed ? '#3d2fff' : errors.agreed ? '#6a2222' : '#2a2a40'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all .15s',
                                }}
                            >
                                {agreed && <CheckIcon />}
                            </div>
                            <span style={{ fontSize: 11, color: '#45455a', lineHeight: 1.6 }}>
                                I agree to the{' '}
                                <Link to="/terms" style={{ color: '#7b78ff', textDecoration: 'underline', textUnderlineOffset: 2 }}>Terms of Service</Link>
                                {' '}and{' '}
                                <Link to="/privacy" style={{ color: '#7b78ff', textDecoration: 'underline', textUnderlineOffset: 2 }}>Privacy Policy</Link>.
                                {' '}DevShelf will never sell your data.
                            </span>
                        </label>
                        {errors.agreed && <p style={{ fontSize: 11, color: '#e05555', margin: '0 0 0 26px' }}>{errors.agreed}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%', background: '#3d2fff',
                            border: '1px solid #3d2fff', borderRadius: 8,
                            padding: '13px 0', fontSize: 13, fontWeight: 500,
                            color: '#fff', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em',
                            opacity: isSubmitting ? 0.55 : 1,
                            transition: 'background .15s',
                        }}
                        onMouseEnter={e => { if (!isSubmitting) e.target.style.background = '#5548ff'; }}
                        onMouseLeave={e => { e.target.style.background = '#3d2fff'; }}
                    >
                        {isSubmitting
                            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <span style={{ width: 13, height: 13, border: '2px solid #ffffff66', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                                Creating account...
                            </span>
                            : 'Continue →'}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0', maxWidth: 600 }}>
                    <div style={{ flex: 1, height: 1, background: '#14142a' }} />
                    <span style={{ fontSize: 10, color: '#2a2a40', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or sign up with</span>
                    <div style={{ flex: 1, height: 1, background: '#14142a' }} />
                </div>

                {/* OAuth buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 600 }}>
                    {[
                        { icon: <GithubIcon />, label: 'GitHub' },
                        { icon: <GoogleIcon />, label: 'Google' },
                    ].map(({ icon, label }) => (
                        <button key={label} type="button" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: '#0e0e1a', border: '1px solid #1e1e30', borderRadius: 8,
                            padding: '11px 0', fontSize: 12, color: '#7a7a99',
                            cursor: 'pointer', fontFamily: 'DM Mono, monospace',
                            transition: 'border-color .15s, color .15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a3a55'; e.currentTarget.style.color = '#a0a0c0'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e30'; e.currentTarget.style.color = '#7a7a99'; }}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Sign in link */}
                <p style={{ fontSize: 11, color: '#35354a', marginTop: 24, maxWidth: 600 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#7b78ff', textDecoration: 'none', fontWeight: 500 }}>
                        Sign in
                    </Link>
                </p>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                input::placeholder { color: #2a2a42; }
                input:focus { border-color: #3d2fff !important; }
            `}</style>
        </div>
    );
};

export default RegisterPage;