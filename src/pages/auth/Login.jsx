import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth.js";
import { useNavigate } from "react-router";
import { toast } from 'sonner';

const LoginPage = () => {
    // State for form fields

    const navigate = useNavigate();

    const [email, setEmail] = useState('superadmin@org.com');
    const [password, setPassword] = useState('123456');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // State for UI feedback
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Validation errors
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Validation functions
    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
            setEmailError('Please enter a valid email.');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (value) => {
        if (!value || value.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    // Handle email change with real-time validation
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('Please enter a valid email.');
        } else {
            setEmailError('');
        }
    };

    // Handle password change with real-time validation
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value && value.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
        } else {
            setPasswordError('');
        }
    };

    // Handle blur validation
    const handleEmailBlur = () => {
        if (email) validateEmail(email);
    };

    const handlePasswordBlur = () => {
        if (password) validatePassword(password);
    };

    const { login, isLoading } = useAuth();
    const handleLogin = async () => {
        try {
            const response = await login({
                email: email,
                password: password,
            })

            console.log("Login Response In Page -> ", {
                response,
                isLoading
            })

            if (response?.success && response?.data?.token && response?.data?.user) {
                navigate('/admin/dashboard')
            }

            console.log('login response -',response)

            if (response?.success === false) {
                toast.error(response?.message || "Something want wrong.")
            }

        } catch (e) {
            console.log('Error - ', e)
        }
    };

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="flex min-h-screen overflow-hidden font-body" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* LEFT PANEL */}
            <div className="hidden lg:flex lg:w-[52%] bg-[#1a2340] relative flex-col justify-between p-11 overflow-hidden flex-shrink-0">
                {/* Geometric background decorations */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,_transparent_1px)] bg-[length:32px_32px]" />
                <div className="absolute rounded-full opacity-60 pointer-events-none w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(47,111,239,0.25)_0%,_transparent_70%)] -top-[120px] -left-[100px]" />
                <div className="absolute rounded-full opacity-60 pointer-events-none w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(14,201,160,0.18)_0%,_transparent_70%)] -bottom-[80px] -right-[60px]" />

                {/* Floating shapes */}
                <div className="absolute rounded-full opacity-10 pointer-events-none w-60 h-60 bg-[#2f6fef] top-[30%] left-[55%] animate-float1" />
                <div className="absolute rounded-full opacity-10 pointer-events-none w-30 h-30 bg-[#0ec9a0] top-[60%] left-[10%] animate-float2" />
                <div className="absolute rounded-full opacity-10 pointer-events-none w-20 h-20 bg-white top-[20%] left-[30%] animate-float1-reverse" />

                {/* Brand */}
                <div className="relative z-10 flex items-start gap-3.5 opacity-0 animate-slideInLeft" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
                    <div className="w-10.5 h-10.5 rounded-xl bg-[#2f6fef] grid place-items-center font-head font-bold text-xl text-white shadow-md flex-shrink-0">
                        N
                    </div>
                    <div>
                        <div className="font-head text-[22px] font-bold text-white tracking-tight">NexAdmin</div>
                        <span className="text-[11px] font-medium text-[#0ec9a0] bg-white/10 px-2 py-0.5 rounded-full">Pro 2.O</span>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <div className="opacity-0 animate-slideInLeft" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                        <div className="text-xs font-semibold tracking-[2px] uppercase text-[#0ec9a0] mb-4 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-[#0ec9a0] rounded-full"></span>
                            Enterprise Dashboard
                        </div>
                        <h1 className="font-head text-[46px] leading-[1.12] font-bold text-white tracking-tight mb-5">
                            Manage everything<br /><em className="italic not-italic text-[#0ec9a0]">smarter &amp;</em><br />faster.
                        </h1>
                        <p className="text-[15px] leading-relaxed text-white/55 max-w-[380px] mb-10">
                            Your all-in-one admin workspace. Monitor accounts, manage users, track orders, and gain real-time
                            insights — all from one powerful platform.
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                                <i className="bi bi-shield-check text-[#0ec9a0]"></i> Bank-grade Security
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                                <i className="bi bi-lightning-charge text-[#0ec9a0]"></i> Real-time Analytics
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                                <i className="bi bi-people text-[#0ec9a0]"></i> Team Collaboration
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                                <i className="bi bi-graph-up-arrow text-[#0ec9a0]"></i> Smart Reports
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 flex border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm overflow-hidden">
                    <div className="flex-1 p-4 text-center border-r border-white/10">
                        <div className="font-head text-[22px] font-bold text-white">12K+</div>
                        <div className="text-[11px] text-white/40">Active Users</div>
                    </div>
                    <div className="flex-1 p-4 text-center border-r border-white/10">
                        <div className="font-head text-[22px] font-bold text-white">$84K</div>
                        <div className="text-[11px] text-white/40">Revenue</div>
                    </div>
                    <div className="flex-1 p-4 text-center border-r border-white/10">
                        <div className="font-head text-[22px] font-bold text-white">99.9%</div>
                        <div className="text-[11px] text-white/40">Uptime SLA</div>
                    </div>
                    <div className="flex-1 p-4 text-center">
                        <div className="font-head text-[22px] font-bold text-white">4.9★</div>
                        <div className="text-[11px] text-white/40">User Rating</div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative overflow-y-auto">
                {/* Subtle bg pattern */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(47,111,239,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(47,111,239,0.04)_1px,transparent_1px)] bg-[length:40px_40px]" />

                {/* Login Card */}
                <div className="bg-white border border-[#e5e9f2] rounded-2xl p-9 md:p-11 w-full max-w-md shadow-2xl relative z-10 animate-cardIn">
                    {/* Top accent bar */}
                    <div className="h-1 rounded-t-2xl bg-gradient-to-r from-[#2f6fef] to-[#0ec9a0] -mt-11 -mx-11 mb-9" />

                    {/* Alert / Success Messages */}
                    {showAlert && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 text-[13px] text-red-600 mb-5 animate-fadeIn">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            <span>{alertMessage}</span>
                        </div>
                    )}
                    {showSuccess && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2.5 text-[13px] text-emerald-600 mb-5 animate-fadeIn">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>Login successful! Redirecting to dashboard…</span>
                        </div>
                    )}

                    {/* Card Icon */}
                    <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#2f6fef] to-[#5b93ff] grid place-items-center text-2xl text-white shadow-md mb-5 animate-reveal" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                        <i className="bi bi-shield-lock"></i>
                    </div>

                    {/* Title */}
                    <div className="animate-reveal" style={{ animationDelay: '0.18s', animationFillMode: 'forwards' }}>
                        <div className="font-head text-2xl md:text-[26px] font-bold text-gray-900 tracking-tight">Welcome back</div>
                        <div className="text-[13.5px] text-gray-500 mt-1.5 mb-8">Sign in to your NexAdmin account to continue</div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-4.5 animate-reveal" style={{ animationDelay: '0.26s', animationFillMode: 'forwards' }}>
                        <label className="text-[13px] font-medium text-gray-900 mb-1.5 block">
                            Email Address <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                            <i className="bi bi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            <input
                                type="email"
                                className={`w-full bg-gray-50 border-2 rounded-xl py-2.5 px-3.5 pl-10 text-sm outline-none transition-all ${emailError ? 'border-red-500 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-gray-200 focus:border-[#2f6fef] focus:shadow-[0_0_0_4px_rgba(47,111,239,0.1)] focus:bg-white'}`}
                                placeholder="you@company.com"
                                autoComplete="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {emailError && (
                            <div className="text-[11.5px] text-red-500 mt-1.5 flex items-center gap-1">
                                <i className="bi bi-exclamation-circle"></i> {emailError}
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4.5 animate-reveal" style={{ animationDelay: '0.34s', animationFillMode: 'forwards' }}>
                        <label className="text-[13px] font-medium text-gray-900 mb-1.5 block">
                            Password <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                            <i className="bi bi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`w-full bg-gray-50 border-2 rounded-xl py-2.5 px-3.5 pl-10 text-sm outline-none transition-all ${passwordError ? 'border-red-500 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-gray-200 focus:border-[#2f6fef] focus:shadow-[0_0_0_4px_rgba(47,111,239,0.1)] focus:bg-white'}`}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2f6fef] transition-colors bg-transparent border-none p-0"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                        {passwordError && (
                            <div className="text-[11.5px] text-red-500 mt-1.5 flex items-center gap-1">
                                <i className="bi bi-exclamation-circle"></i> {passwordError}
                            </div>
                        )}
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between mb-5 animate-reveal" style={{ animationDelay: '0.42s', animationFillMode: 'forwards' }}>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-2 border-gray-200 checked:bg-[#2f6fef] checked:border-[#2f6fef] focus:ring-2 focus:ring-[#2f6fef]/30"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember" className="text-[13px] text-gray-500 cursor-pointer">Remember me</label>
                        </div>
                        <a href="#" className="text-[13px] text-[#2f6fef] font-medium no-underline hover:underline">Forgot password?</a>
                    </div>

                    {/* Sign In Button */}
                    <button
                        className="w-full py-3 bg-gradient-to-r from-[#2f6fef] to-[#5b93ff] text-white border-none rounded-xl font-medium text-[15px] cursor-pointer transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-80 disabled:pointer-events-none"
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></span>
                        {loading && <div className="w-4.5 h-4.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>}
                        <span className={loading ? 'opacity-50' : ''}>
                            <i className="bi bi-box-arrow-in-right mr-1"></i> Sign In
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5 text-gray-400 text-xs">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        or continue with
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* SSO Buttons */}
                    <div className="grid grid-cols-2 gap-2.5 animate-reveal" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                        <a href="#" className="flex items-center justify-center gap-2 py-2.5 px-3.5 border-2 border-gray-200 bg-gray-50 rounded-xl text-[13px] font-medium text-gray-900 hover:border-[#2f6fef] hover:bg-[rgba(47,111,239,0.1)] hover:text-[#2f6fef] transition-all">
                            <div className="w-5 h-5 rounded bg-[#fce8e6] grid place-items-center flex-shrink-0">
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                    <path fill="#ea4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#4285f4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#34a853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </div>
                            Google
                        </a>
                        <a href="#" className="flex items-center justify-center gap-2 py-2.5 px-3.5 border-2 border-gray-200 bg-gray-50 rounded-xl text-[13px] font-medium text-gray-900 hover:border-[#2f6fef] hover:bg-[rgba(47,111,239,0.1)] hover:text-[#2f6fef] transition-all">
                            <div className="w-5 h-5 rounded bg-[#e8f0fe] grid place-items-center flex-shrink-0">
                                <i className="bi bi-microsoft" style={{ color: '#0078d4' }}></i>
                            </div>
                            Microsoft
                        </a>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-5 text-[13px] text-gray-500">
                        Don't have an account? <a href="#" className="text-[#2f6fef] font-semibold no-underline hover:underline">Request Access</a>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-1.5 mt-4.5 text-[11.5px] text-gray-500">
                        <i className="bi bi-shield-fill-check text-emerald-500"></i>
                        256-bit SSL encrypted · SOC 2 compliant
                    </div>
                </div>
            </div>

            {/* Tailwind animations via style injection */}
            <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
        }
        @keyframes float1-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-8deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-5deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float1 { animation: float1 8s ease-in-out infinite; }
        .animate-float1-reverse { animation: float1-reverse 8s ease-in-out infinite; }
        .animate-float2 { animation: float2 10s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease forwards; }
        .animate-cardIn { animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-fadeIn { animation: fadeIn 0.25s ease both; }
        .animate-reveal { opacity: 0; animation: reveal 0.5s ease forwards; }
        .font-head { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
      `}</style>
        </div>
    );
};

export default LoginPage;
