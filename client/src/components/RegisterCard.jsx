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

const CheckIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const RegisterPage = () => {
    const { register, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
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
        { label: 'At least 8 characters', test: (p) => p.length >= 8 },
        { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
        { label: 'One number', test: (p) => /[0-9]/.test(p) },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!agreed) {
            newErrors.agreed = 'You must agree to the terms';
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
            await register(formData.fullName, formData.email, formData.password);
            toast.success('Account created! Welcome to DevShelf 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.error || err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-900 rounded-full opacity-40 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-8 w-40 h-40 bg-indigo-800 rounded-full opacity-20 blur-2xl" />

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

            {/* Card */}
            <div className="relative z-10 w-full max-w-md bg-slate-800 bg-opacity-80 border border-slate-700 rounded-2xl shadow-2xl px-10 py-16">

                {/* Brand */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <span className="text-3xl">📁</span>
                    <span className="text-white font-bold text-xl tracking-wide">DevShelf</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-extrabold text-white text-center mb-2 tracking-tight">
                    Create Account
                </h1>
                <p className="text-slate-400 text-sm text-center mb-10">
                    Join DevShelf and start building
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`w-full bg-slate-700 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-600'}`}
                        />
                        {errors.fullName && (
                            <p className="text-red-400 text-xs mt-0.5">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`w-full bg-slate-700 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.email ? 'border-red-500' : 'border-slate-600'}`}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-0.5">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                className={`w-full bg-slate-700 border rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.password ? 'border-red-500' : 'border-slate-600'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-0.5">{errors.password}</p>
                        )}

                        {/* Password strength indicators */}
                        {formData.password && (
                            <div className="flex flex-col gap-1.5 mt-1">
                                {passwordRules.map((rule, i) => {
                                    const passed = rule.test(formData.password);
                                    return (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className={`flex items-center justify-center w-4 h-4 rounded-full transition-all ${passed ? 'bg-indigo-500' : 'bg-slate-600'}`}>
                                                {passed && <CheckIcon />}
                                            </span>
                                            <span className={`text-xs transition-colors ${passed ? 'text-indigo-300' : 'text-slate-500'}`}>
                                                {rule.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-300">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                className={`w-full bg-slate-700 border rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.confirmPassword ? 'border-red-500' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-indigo-500' : 'border-slate-600'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-xs mt-0.5">{errors.confirmPassword}</p>
                        )}
                        {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="text-indigo-400 text-xs mt-0.5 flex items-center gap-1">
                                <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-indigo-500"><CheckIcon /></span>
                                Passwords match
                            </p>
                        )}
                    </div>

                    {/* Terms checkbox */}
                    <div className="flex flex-col gap-1">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div
                                onClick={() => {
                                    setAgreed(!agreed);
                                    setErrors({ ...errors, agreed: '' });
                                }}
                                className={`mt-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded border-2 flex items-center justify-center transition-all ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-500 bg-slate-700 group-hover:border-indigo-400'}`}
                            >
                                {agreed && <CheckIcon />}
                            </div>
                            <span className="text-xs text-slate-400 leading-relaxed">
                                I agree to the{' '}
                                <Link to="/terms" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                        {errors.agreed && (
                            <p className="text-red-400 text-xs mt-0.5 ml-7">{errors.agreed}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-8">
                    <div className="flex-1 h-px bg-slate-700" />
                    <span className="text-slate-600 text-xs">or</span>
                    <div className="flex-1 h-px bg-slate-700" />
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-white font-semibold underline underline-offset-2 hover:text-indigo-300 transition-colors"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;