import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

/*
  Setup:
  1. Add to index.html <head>:
     <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  2. tailwind.config.js:
     theme: { extend: { fontFamily: { outfit: ['Outfit', 'sans-serif'] } } }

  3. Add to your global CSS (e.g. index.css):
     body { font-family: 'Outfit', sans-serif; }
     @keyframes fadeUp {
       from { opacity: 0; transform: translateY(28px); }
       to   { opacity: 1; transform: translateY(0); }
     }
     .animate-fade-up { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
*/

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

const GithubIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.05.138 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

const GoogleIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const BgSVG = () => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 760 700"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
    >
        <defs>
            <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4f6ef7" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4f6ef7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rg2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6a8dff" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#6a8dff" stopOpacity="0" />
            </radialGradient>
        </defs>
        <ellipse cx="90" cy="130" rx="220" ry="220" fill="url(#rg1)" />
        <ellipse cx="670" cy="570" rx="240" ry="240" fill="url(#rg2)" />
        {[160, 220, 490, 550].map(x =>
            <line key={x} x1={x} y1="0" x2={x} y2="700" stroke="#5c7aff" strokeWidth="0.5" opacity="0.09" />
        )}
        {[-30, 0, 30, 60, 510, 540, 570, 600].map((y, i) =>
            <line key={i} x1="-200" y1={y} x2="960" y2={y + 200}
                stroke="#7a9dff" strokeWidth={i % 2 === 0 ? 5 : 2.5}
                opacity="0.055" transform="rotate(-38 380 350)" />
        )}
        <circle cx="90" cy="130" r="160" fill="none" stroke="#4f6ef7" strokeWidth="0.8" opacity="0.15" />
        <circle cx="90" cy="130" r="95" fill="none" stroke="#4f6ef7" strokeWidth="0.5" opacity="0.09" />
        <circle cx="670" cy="560" r="200" fill="none" stroke="#6d8cff" strokeWidth="0.8" opacity="0.12" />
        <circle cx="670" cy="560" r="120" fill="none" stroke="#6d8cff" strokeWidth="0.5" opacity="0.07" />
        <circle cx="610" cy="80" r="55" fill="#5b72f7" opacity="0.05" />
        <circle cx="110" cy="610" r="75" fill="#3a55e0" opacity="0.06" />
        <circle cx="380" cy="350" r="280" fill="none" stroke="#4060d0" strokeWidth="0.4" opacity="0.07" />
        <ellipse cx="380" cy="710" rx="340" ry="90" fill="#3a5cf0" opacity="0.06" />
    </svg>
);

const LoginPage = () => {
    // ── All original logic — untouched ──────────────────────────────────────
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
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
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
    // ────────────────────────────────────────────────────────────────────────

    const busy = isSubmitting || isLoading;

    return (
        <div
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-10"
            style={{ background: 'linear-gradient(135deg,#07091f 0%,#0d1240 25%,#121a55 50%,#192264 72%,#1f2a78 100%)', fontFamily: "'Outfit', sans-serif" }}
        >
            <BgSVG />

            {/* ── Card ── */}
            <div className="animate-fade-up relative z-10 w-full max-w-[390px]">
                <div
                    className="relative rounded-3xl px-9 py-10 overflow-hidden"
                    style={{
                        background: 'linear-gradient(150deg,rgba(18,26,80,0.84) 0%,rgba(8,12,45,0.92) 100%)',
                        border: '1px solid rgba(110,145,255,0.22)',
                        boxShadow: '0 30px 80px rgba(0,0,10,0.6),0 0 0 0.5px rgba(120,155,255,0.1) inset,0 1px 0 rgba(170,190,255,0.09) inset',
                    }}
                >
                    {/* Shimmer overlay */}
                    <div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{ background: 'linear-gradient(135deg,rgba(100,140,255,0.1) 0%,rgba(60,80,200,0.02) 45%,rgba(80,120,255,0.07) 100%)' }}
                    />
                    {/* Top edge glow */}
                    <div
                        className="absolute top-0 left-[10%] right-[10%] h-px"
                        style={{ background: 'linear-gradient(90deg,transparent,rgba(160,190,255,0.3),transparent)' }}
                    />

                    {/* ── Branding ── */}
                    <div className="flex flex-col items-center mb-8 relative">
                        <div
                            className="flex items-center gap-2 px-4 mb-6 rounded-full"
                            style={{ paddingTop: 7, paddingBottom: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <span className="text-xl leading-none">📁</span>
                            <span className="text-[17px] font-bold text-white tracking-tight">DevShelf</span>
                        </div>
                        <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-tight mb-[7px]">
                            Welcome Back
                        </h1>
                        <p className="text-sm" style={{ color: 'rgba(148,168,230,0.85)' }}>
                            Sign in to your account
                        </p>
                    </div>


                    {/* ── Divider ── */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px" style={{ background: 'rgba(100,130,220,0.2)' }} />
                        <span className="text-[11.5px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(120,145,200,0.6)' }}>or</span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(100,130,220,0.2)' }} />
                    </div>

                    {/* ── Form — original handleSubmit, handleChange, validate wired in ── */}
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[12.5px] font-semibold mb-[7px]"
                                style={{ color: 'rgba(200,215,255,0.88)', letterSpacing: '0.3px' }}
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
                                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:opacity-40 focus:ring-0"
                                style={{
                                    background: 'rgba(6,10,42,0.72)',
                                    border: `1px solid ${errors.email ? 'rgba(248,113,113,0.6)' : 'rgba(90,110,210,0.28)'}`,
                                    color: '#c8d4ff',
                                    boxShadow: errors.email
                                        ? '0 0 0 3px rgba(248,113,113,0.1)'
                                        : 'inset 0 1px 3px rgba(0,0,0,0.25)',
                                    fontFamily: "'Outfit', sans-serif",
                                }}
                                onFocus={e => {
                                    if (!errors.email) {
                                        e.target.style.borderColor = 'rgba(99,130,255,0.65)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99,130,255,0.13),inset 0 1px 3px rgba(0,0,0,0.3)';
                                    }
                                }}
                                onBlur={e => {
                                    if (!errors.email) {
                                        e.target.style.borderColor = 'rgba(90,110,210,0.28)';
                                        e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.25)';
                                    }
                                }}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs font-medium" style={{ color: 'rgba(252,165,165,0.9)' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-[7px]">
                                <label
                                    htmlFor="password"
                                    className="text-[12.5px] font-semibold"
                                    style={{ color: 'rgba(200,215,255,0.88)', letterSpacing: '0.3px' }}
                                >
                                    Password
                                </label>
                                {/* Forgot password — wire to your route when ready */}
                                <button
                                    type="button"
                                    className="text-xs font-medium transition-opacity hover:opacity-100"
                                    style={{ color: 'rgba(110,155,255,0.9)', opacity: 0.9 }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:opacity-40"
                                    style={{
                                        paddingRight: 44,
                                        background: 'rgba(6,10,42,0.72)',
                                        border: `1px solid ${errors.password ? 'rgba(248,113,113,0.6)' : 'rgba(90,110,210,0.28)'}`,
                                        color: '#c8d4ff',
                                        letterSpacing: showPassword ? 'normal' : '2px',
                                        boxShadow: errors.password
                                            ? '0 0 0 3px rgba(248,113,113,0.1)'
                                            : 'inset 0 1px 3px rgba(0,0,0,0.25)',
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                    onFocus={e => {
                                        if (!errors.password) {
                                            e.target.style.borderColor = 'rgba(99,130,255,0.65)';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(99,130,255,0.13),inset 0 1px 3px rgba(0,0,0,0.3)';
                                        }
                                    }}
                                    onBlur={e => {
                                        if (!errors.password) {
                                            e.target.style.borderColor = 'rgba(90,110,210,0.28)';
                                            e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.25)';
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center justify-center p-1 rounded-md transition-colors duration-150"
                                    style={{ color: 'rgba(120,155,230,0.65)' }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(160,190,255,0.95)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(120,155,230,0.65)'}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs font-medium" style={{ color: 'rgba(252,165,165,0.9)' }}>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* ── Login button ── */}
                        <button
                            type="submit"
                            disabled={busy}
                            className="w-full mt-1.5 rounded-xl text-[15px] font-bold text-white flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.99]"
                            style={{
                                padding: '13.5px',
                                background: busy
                                    ? 'rgba(80,105,200,0.4)'
                                    : 'linear-gradient(95deg,#3d5cf5 0%,#5a78ff 55%,#4d6af0 100%)',
                                border: 'none',
                                letterSpacing: '0.2px',
                                cursor: busy ? 'not-allowed' : 'pointer',
                                boxShadow: busy
                                    ? 'none'
                                    : '0 4px 24px rgba(70,100,255,0.38),0 1px 0 rgba(255,255,255,0.1) inset',
                                fontFamily: "'Outfit', sans-serif",
                            }}
                            onMouseEnter={e => { if (!busy) e.currentTarget.style.boxShadow = '0 6px 34px rgba(70,100,255,0.54),0 1px 0 rgba(255,255,255,0.1) inset'; }}
                            onMouseLeave={e => { if (!busy) e.currentTarget.style.boxShadow = '0 4px 24px rgba(70,100,255,0.38),0 1px 0 rgba(255,255,255,0.1) inset'; }}
                        >
                            {busy ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Signing in…</span>
                                </>
                            ) : 'Login'}
                        </button>
                    </form>

                    {/* ── Sign up ── */}
                    <p className="text-center mt-6 text-[13.5px]" style={{ color: 'rgba(130,155,210,0.8)' }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-white underline underline-offset-[3px] transition-all duration-150"
                            style={{ textDecorationColor: 'rgba(255,255,255,0.4)' }}
                            onMouseEnter={e => e.currentTarget.style.textDecorationColor = 'rgba(255,255,255,0.85)'}
                            onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'rgba(255,255,255,0.4)'}
                        >
                            Sign up
                        </Link>
                    </p>

                    {/* Bottom edge glow */}
                    <div
                        className="absolute bottom-0 left-[15%] right-[15%] h-px"
                        style={{ background: 'linear-gradient(90deg,transparent,rgba(100,140,255,0.16),transparent)' }}
                    />
                </div>

                {/* Footer */}
                <p className="text-center mt-5 text-[11.5px]" style={{ color: 'rgba(100,120,180,0.5)', letterSpacing: '0.2px' }}>
                    Protected by DevShelf · Privacy Policy · Terms
                </p>
            </div>
        </div>
    );
};

export default LoginPage;