"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Facebook, Apple, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignIn, useClerk, useUser } from "@clerk/nextjs";

export default function SignInPage() {
  const router = useRouter();
  const { client } = useClerk();
  const signInObj = useSignIn();
  const { signIn, setActive } = signInObj as any;
  const { isSignedIn, isLoaded } = useUser();

  // Already logged in → go to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuth = async (strategy: any) => {
    try {
      setLoadingProvider(strategy);
      await client.signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
    } catch (err: any) {
      setLoadingProvider(null);
      setError(err.message || "An error occurred with social login.");
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ── Admin shortcut ──────────────────────────────────────────
    if (emailAddress === "admin@gmail.com" && password === "admin@gmail.com") {
      localStorage.setItem("mtlabs_admin_session", "true");
      router.push("/admin/panel");
      return;
    }
    // ────────────────────────────────────────────────────────────

    if (!signIn) { setLoading(false); return; }

    try {
      const { error: createError } = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (createError) throw createError;

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) throw finalizeError;
        router.push("/dashboard");
      } else {
        setError("Further verification requirements needed.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[380px] space-y-4 my-auto"
    >
      <div className="text-center">
        <div className="flex justify-center mb-1">
           <Image 
             src="/mt-labs-logo.png" 
             width={72} 
             height={72} 
             alt="MT Labs Logo" 
             className="drop-shadow-sm hover:scale-105 transition-transform" 
             priority
           />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to MT Labs</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2 p-2.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-xl border border-red-100 text-center shadow-sm">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Logins */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => handleOAuth('oauth_google')} 
          disabled={loadingProvider !== null}
          type="button" 
          className="w-full flex justify-center items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loadingProvider === 'oauth_google' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" />
          ) : (
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {loadingProvider === 'oauth_google' ? "Connecting..." : "Continue with Google"}
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleOAuth('oauth_facebook')} 
            disabled={loadingProvider !== null}
            type="button" 
            className="flex justify-center items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            {loadingProvider === 'oauth_facebook' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Facebook className="w-4 h-4 mr-2 text-[#1877F2]" fill="#1877F2" stroke="none" />}
            Facebook
          </button>
          <button 
            onClick={() => handleOAuth('oauth_apple')} 
            disabled={loadingProvider !== null}
            type="button" 
            className="flex justify-center items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            {loadingProvider === 'oauth_apple' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Apple className="w-4 h-4 mr-2 text-slate-900" fill="currentColor"/>}
            Apple
          </button>
        </div>
      </div>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
          <span className="px-3 bg-slate-50 text-slate-400">Or continue with email</span>
        </div>
      </div>

      {/* Email Form Card */}
      <div className="bg-white p-4 sm:p-5 rounded-[20px] shadow-xl shadow-blue-500/5 border border-slate-100">
        <form className="space-y-3" onSubmit={submitForm}>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
              <input type="email" value={emailAddress} onChange={e=>setEmailAddress(e.target.value)} className="block w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all font-medium" required placeholder="you@example.com" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-bold text-slate-700">Password</label>
              <a href="#" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} className="block w-full pl-9 pr-10 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all font-medium" required placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 transition-all flex justify-center items-center mt-4 disabled:opacity-70 group">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Sign In <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
    </div>

  </motion.div>
  );
}
