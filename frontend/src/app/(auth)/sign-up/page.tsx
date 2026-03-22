"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Facebook, Apple, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignUp, useClerk } from "@clerk/nextjs";

export default function SignUpPage() {
  const router = useRouter();
  const { client } = useClerk();
  const { isLoaded, signUp, setActive } = useSignUp();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Password strength logic
  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };
  const strength = getPasswordStrength();

  const handleOAuth = async (strategy: any) => {
    try {
      setLoadingProvider(strategy);
      await client.signUp.authenticateWithRedirect({
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
    if (!isLoaded) return;
    
    setLoading(true);
    setError("");

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async (e?: React.FormEvent, codeToVerify?: string) => {
    if (e) e.preventDefault();
    if (!isLoaded) return;
    
    const verificationCode = codeToVerify || code;
    if (verificationCode.length !== 6) return;

    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      if (completeSignUp.status !== 'complete') {
        setError("Missing requirements. Please try again.");
      } else {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
      setCode("");
    }
  };

  // Auto-verify when 6 digits are hit
  useEffect(() => {
    if (code.length === 6 && pendingVerification) {
      onPressVerify(undefined, code);
    }
  }, [code, pendingVerification]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[420px] space-y-6"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
           <Image 
             src="/mt-labs-logo.png" 
             width={80} 
             height={80} 
             alt="MT Labs Logo" 
             className="drop-shadow-sm hover:scale-105 transition-transform" 
             priority
           />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {pendingVerification ? "Verify your email" : "Create your account"}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-2">
          {!pendingVerification ? (
            <>Already have an account? <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">Sign in</Link></>
          ) : "We sent a 6-digit code to your email"}
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 text-center shadow-sm">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {!pendingVerification ? (
        <>
          {/* Social Logins */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleOAuth('oauth_google')} 
              disabled={!isLoaded || loadingProvider !== null}
              type="button" 
              className="w-full flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loadingProvider === 'oauth_google' ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin text-slate-400" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {loadingProvider === 'oauth_google' ? "Connecting..." : "Continue with Google"}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleOAuth('oauth_facebook')} 
                disabled={!isLoaded || loadingProvider !== null}
                type="button" 
                className="flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                {loadingProvider === 'oauth_facebook' ? <Loader2 className="w-5 h-5 mr-2 animate-spin text-slate-400" /> : <Facebook className="w-5 h-5 mr-2 text-[#1877F2]" fill="#1877F2" stroke="none" />}
                Facebook
              </button>
              <button 
                onClick={() => handleOAuth('oauth_apple')} 
                disabled={!isLoaded || loadingProvider !== null}
                type="button" 
                className="flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                {loadingProvider === 'oauth_apple' ? <Loader2 className="w-5 h-5 mr-2 animate-spin text-slate-400" /> : <Apple className="w-5 h-5 mr-2 text-slate-900" fill="currentColor"/>}
                Apple
              </button>
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-[11px] uppercase font-black tracking-widest text-slate-400">
              <span className="px-3 bg-slate-50 text-slate-400">Or continue with email</span>
            </div>
          </div>

          {/* Email Form Card */}
          <div className="bg-white p-5 sm:p-6 rounded-[24px] shadow-xl shadow-blue-500/5 border border-slate-100">
            <form className="space-y-4" onSubmit={submitForm}>
              <div className="flex gap-3">
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all font-medium" required placeholder="John" />
                  </div>
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Last Name</label>
                  <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} className="block w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all font-medium" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type="email" value={emailAddress} onChange={e=>setEmailAddress(e.target.value)} className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all font-medium" required placeholder="you@example.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} className="block w-full pl-9 pr-10 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all font-medium" required placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                <div className="mt-2.5 flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`flex-1 rounded-full transition-colors duration-500 ${password ? (strength >= level ? (strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-amber-400' : strength === 3 ? 'bg-blue-400' : 'bg-emerald-500') : 'bg-slate-200') : 'bg-slate-100'}`} />
                  ))}
                </div>
                {password && (
                  <p className={`text-[10px] font-bold ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : strength === 3 ? 'text-blue-500' : 'text-emerald-500'}`}>
                    {strength === 1 && "Weak"}
                    {strength === 2 && "Fair"}
                    {strength === 3 && "Good"}
                    {strength === 4 && "Strong"}
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center mt-5 disabled:opacity-70">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </button>
            </form>
          </div>
        </>
      ) : (
         <div className="bg-white p-6 sm:p-8 rounded-[24px] shadow-xl shadow-blue-500/5 border border-slate-100">
             <form className="space-y-6" onSubmit={onPressVerify}>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 text-center block">Enter 6-digit code</label>
                  <div className="flex justify-center">
                    <input 
                      type="text" 
                      value={code} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setCode(val);
                      }} 
                      className="block w-full max-w-[280px] text-center tracking-[0.5em] text-3xl py-4 border border-slate-300 rounded-2xl bg-slate-50 text-slate-900 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-black outline-none transition-all shadow-inner" 
                      placeholder="------" 
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-center text-slate-400 font-medium">Automatic verification when completed</p>
                </div>
                <button type="submit" disabled={loading || code.length !== 6} className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center disabled:opacity-50 mt-4">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                </button>
             </form>
         </div>
      )}
    </motion.div>
  );
}
