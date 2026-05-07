"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function CustomerLogin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Side - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a1628] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/login-bg.png?v=2')",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-xl tracking-tight">M</span>
              </div>
              <div>
                <span className="text-white font-bold text-2xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Mercury</span>
                <span className="text-[#c0c8d4] text-xs block leading-none tracking-widest uppercase font-light">Dry Cleaners</span>
              </div>
            </Link>
          </div>
          
          <div className="mb-12">
            <h1 className="text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Premium Care,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8963e] to-[#d4af5a]">
                Spotless Results.
              </span>
            </h1>
            <p className="text-lg text-[#c0c8d4] max-w-md leading-relaxed">
              Log in to schedule a pickup, track your active orders, and view your entire cleaning history in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center bg-[#f8fafc] px-6 sm:px-12 py-12 relative">
        {/* Mobile Logo (visible only on small screens) */}
        <div className="lg:hidden absolute top-8 left-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8963e] to-[#d4af5a] flex items-center justify-center shadow-md">
              <span className="text-white font-black tracking-tight">M</span>
            </div>
            <div>
              <span className="text-[#0a1628] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Mercury</span>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto fade-in-up">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome Back
            </h2>
            <p className="text-[15px] text-[#4a5568]">
              Sign in with your Google account to access your personal dashboard.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 shadow-xl rounded-3xl border border-[#e8edf3] shimmer-card">
            
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 border border-[#e8edf3] rounded-2xl shadow-sm text-[15px] font-bold text-[#0a1628] bg-white hover:bg-[#f8fafc] hover:border-[#b8963e]/50 hover:shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin text-[#b8963e]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              ) : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {loading ? "Authenticating..." : "Continue with Google"}
            </button>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e8edf3]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-[#9aa5b4] font-medium">Why Google?</span>
                </div>
              </div>
              <p className="mt-5 text-[13px] text-center text-[#9aa5b4] leading-relaxed">
                We use your verified Google email address to seamlessly connect all your past and active orders. No passwords to remember.
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-[#9aa5b4]">
            By continuing, you agree to Mercury Dry Cleaners'<br/>
            <a href="#" className="underline hover:text-[#b8963e] transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-[#b8963e] transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
