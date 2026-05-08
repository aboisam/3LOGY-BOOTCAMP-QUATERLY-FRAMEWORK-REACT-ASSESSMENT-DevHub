import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

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

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-900 rounded-full opacity-40 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-24 right-16 w-40 h-40 bg-indigo-800 rounded-full opacity-25 blur-2xl" />

            {/* Decorative lines top-right */}
            <svg className="absolute top-4 right-4 w-28 h-28 opacity-20" viewBox="0 0 120 120" fill="none">
                {[0, 12, 24, 36, 48, 60].map((offset, i) => (
                    <line key={i} x1={offset} y1="0" x2="120" y2={120 - offset}
                        stroke="rgb(165,155,255)" strokeWidth="1.2" />
                ))}
            </svg>

            {/* Decorative lines bottom-left */}
            <svg className="absolute bottom-4 left-4 w-24 h-24 opacity-15 rotate-180" viewBox="0 0 100 100" fill="none">
                {[0, 14, 28, 42, 56].map((offset, i) => (
                    <line key={i} x1={offset} y1="0" x2="100" y2={100 - offset}
                        stroke="rgb(165,155,255)" strokeWidth="1.2" />
                ))}
            </svg>

            <div className="relative w-full max-w-md rounded-3xl bg-slate-950/90 border border-slate-700/80 px-10 py-16 shadow-xl shadow-slate-950/40 backdrop-blur-sm">
                <h2 className="text-3xl font-semibold text-white text-center mb-6">Sign in to DevShelf</h2>
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 inline-flex items-center justify-center rounded-full p-2 text-slate-300 transition hover:text-white"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting || isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;