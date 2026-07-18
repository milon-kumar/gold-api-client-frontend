import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useAppQuery";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { data: settingResponse, isLoading: settingLoading } = useApiQuery({
    url: `/settings`,
  });

  const settings = settingResponse?.data?.data || {};

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      setEmailError("Please enter a valid email.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value || value.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }
  };

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
      });

      console.log("Login Response In Page -> ", {
        response,
        isLoading,
      });

      if (response?.success && response?.data?.token && response?.data?.user) {
        navigate("/admin/dashboard");
      }

      if (response?.success === false) {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong.");
      console.log("Error - ", e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="flex min-h-screen overflow-hidden font-body"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[52%] bg-[#1a2340] relative flex-col justify-between p-11 overflow-hidden shrink-0">
        {/* Geometric background decorations */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="absolute rounded-full opacity-60 pointer-events-none w-125 h-125 bg-[radial-gradient(circle,rgba(47,111,239,0.25)_0%,transparent_70%)] -top-30 -left-25" />
        <div className="absolute rounded-full opacity-60 pointer-events-none w-100 h-100 bg-[radial-gradient(circle,rgba(14,201,160,0.18)_0%,transparent_70%)] -bottom-20 -right-15" />

        {/* Floating shapes */}
        <div className="absolute rounded-full opacity-10 pointer-events-none w-60 h-60 bg-[#2f6fef] top-[30%] left-[55%] animate-float1" />
        <div className="absolute rounded-full opacity-10 pointer-events-none w-30 h-30 bg-[#0ec9a0] top-[60%] left-[10%] animate-float2" />
        <div className="absolute rounded-full opacity-10 pointer-events-none w-20 h-20 bg-white top-[20%] left-[30%] animate-float1-reverse" />

        {/* Brand */}
        <div
          className="relative z-10 flex items-start gap-3.5 opacity-0 animate-slideInLeft"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <div className="w-52">
            <Link to="/">
              <img src={settings?.logo_full_path} alt="Logo" />
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div
            className="opacity-0 animate-slideInLeft"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <div className="text-xs font-semibold tracking-[2px] uppercase text-[#0ec9a0] mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#0ec9a0] rounded-full"></span>
              Enterprise Dashboard
            </div>
            <h1 className="font-head text-[46px] leading-[1.12] font-bold text-white tracking-tight mb-5">
              Manage everything
              <br />
              <em className="italic text-[#0ec9a0]">smarter &amp;</em>
              <br />
              faster.
            </h1>
            <p className="text-[15px] leading-relaxed text-white/55 max-w-95 mb-10">
              Your all-in-one admin workspace. Monitor accounts, manage users,
              track orders, and gain real-time insights — all from one powerful
              platform.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                <i className="bi bi-shield-check text-[#0ec9a0]"></i> Admin
                Security
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                <i className="bi bi-lightning-charge text-[#0ec9a0]"></i>{" "}
                Real-time Analytics
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                <i className="bi bi-people text-[#0ec9a0]"></i> Advanced Builder
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-[13px] text-white/75 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors">
                <i className="bi bi-graph-up-arrow text-[#0ec9a0]"></i> Smart
                Content Manage
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 backdrop-blur-sm p-4">
          {settings?.facebook_link && (
            <a
              href={settings.facebook_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-105 relative"
            >
              <FaFacebook className="w-5 h-5" />
              <span className="absolute -bottom-6 text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Facebook
              </span>
            </a>
          )}

          {settings?.youtube_link && (
            <a
              href={settings.youtube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-105 relative"
            >
              <FaYoutube className="w-5 h-5" />
              <span className="absolute -bottom-6 text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                YouTube
              </span>
            </a>
          )}

          {settings?.instagram_link && (
            <a
              href={settings.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-105 relative"
            >
              <FaInstagram className="w-5 h-5" />
              <span className="absolute -bottom-6 text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Instagram
              </span>
            </a>
          )}

          {settings?.linkedin_link && (
            <a
              href={settings.linkedin_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-105 relative"
            >
              <FaLinkedin className="w-5 h-5" />
              <span className="absolute -bottom-6 text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                LinkedIn
              </span>
            </a>
          )}

          {settings?.play_store_link && (
            <a
              href={settings.play_store_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-105 relative"
            >
              <FaGooglePlay className="w-5 h-5" />
              <span className="absolute -bottom-6 text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Play Store
              </span>
            </a>
          )}

          {settings?.app_store_link && (
            <a
              href={settings.app_store_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20 hover:scale-105 relative"
            >
              <FaApple className="w-5 h-5" />
              <span className="absolute -bottom-6 text-[9px] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                App Store
              </span>
            </a>
          )}

          {/* Show message if no social links */}
          {!settings?.facebook_link &&
            !settings?.youtube_link &&
            !settings?.instagram_link &&
            !settings?.linkedin_link &&
            !settings?.play_store_link &&
            !settings?.app_store_link && (
              <p className="text-white/30 text-sm">
                No social links configured
              </p>
            )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative overflow-y-auto">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(47,111,239,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(47,111,239,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />

        <Card className="relative w-full max-w-md overflow-hidden border border-[#e5e9f2] shadow-sm">
          <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-[#2f6fef] to-[#0ec9a0]" />

          <CardHeader className="pt-9 px-9">
            {/* Alert / Success Messages */}
            {showAlert && (
              <Alert variant="destructive" className="mb-5 animate-fadeIn">
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
            {showSuccess && (
              <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-600 animate-fadeIn">
                <AlertDescription>
                  Login successful! Redirecting to dashboard…
                </AlertDescription>
              </Alert>
            )}

            <div
              className="animate-reveal"
              style={{ animationDelay: "0.18s", animationFillMode: "forwards" }}
            >
              <CardTitle className="font-head text-2xl md:text-[26px] font-bold text-gray-900 tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="text-[13.5px] text-gray-500 mt-1.5">
                Sign in to your NexAdmin account to continue
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-9 pb-0 space-y-4.5">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />

              <Input
                id="email"
                type="email"
                className={`h-11 pl-10 bg-gray-50 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  emailError
                    ? "border-red-500 bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/10"
                    : "border-gray-200 focus-visible:border-[#2f6fef] focus-visible:ring-2 focus-visible:ring-[#2f6fef]/10"
                }`}
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none ${
                  passwordError ? "text-red-500" : "text-gray-400"
                }`}
              />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`h-11 pl-10 pr-10 bg-gray-50 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  passwordError
                    ? "border-red-500 bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/10"
                    : "border-gray-200 focus-visible:border-[#2f6fef] focus-visible:ring-2 focus-visible:ring-[#2f6fef]/10"
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                onKeyDown={handleKeyDown}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2f6fef] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Remember & Forgot */}
            <div
              className="flex items-center justify-between py-1 animate-reveal"
              style={{ animationDelay: "0.42s", animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                  className="border-2 border-gray-200 data-[state=checked]:bg-[#2f6fef] data-[state=checked]:border-[#2f6fef] h-4 w-4"
                />
                <Label
                  htmlFor="remember"
                  className="text-[13px] text-gray-500 cursor-pointer font-normal"
                >
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-[13px] text-[#2f6fef] font-medium no-underline hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              className="w-full h-11 bg-linear-to-r from-[#2f6fef] to-[#5b93ff] text-white hover:from-[#2f6fef] hover:to-[#4a7fe6] rounded-xl font-medium text-[15px] shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all relative overflow-hidden group disabled:opacity-80 disabled:pointer-events-none"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <span className="absolute inset-0 bg-linear-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></span>
              {loading && (
                <div className="w-4.5 h-4.5 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>
              )}
              <span
                className={
                  loading
                    ? "opacity-50 flex items-center gap-2"
                    : "flex items-center gap-2"
                }
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </span>
            </Button>
          </CardContent>

          <CardFooter className="flex-col px-9 pt-6 pb-9 space-y-4">
            {/* Footer */}
            <div className="text-center text-[13px] text-gray-500">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-[#2f6fef] font-semibold no-underline hover:underline"
              >
                Request Access
              </a>
            </div>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-gray-500">
              <i className="bi bi-shield-fill-check text-emerald-500"></i>
              256-bit SSL encrypted · SOC 2 compliant
            </div>
          </CardFooter>
        </Card>
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
