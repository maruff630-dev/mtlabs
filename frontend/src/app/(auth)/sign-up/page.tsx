"use client";

import { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Facebook, Apple } from "lucide-react";
import { motion } from "framer-motion";
import { useSignUp, useClerk } from "@clerk/nextjs";

export default function SignUpPage() {
  const { client } = useClerk();
  const signUpResult = useSignUp();
  const { signUp, isLoaded, fetchStatus } = signUpResult as any;
  const isAuthReady = isLoaded || (fetchStatus !== 'loading' && fetchStatus !== 'fetching' && !!signUpResult);

  useEffect(() => {
    if (isAuthReady) {
      console.log("SignUpPage: Auth is ready");
    }
  }, [isAuthReady]);

  const handleOAuth = async (strategy: any) => {
    try {
      console.log("Starting OAuth redirect via Clerk Client for strategy:", strategy);
      await client.signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
    } catch (error) {
      console.error("OAuth Error detailed:", error);
      alert("Common Error: " + (error as any).message + "\n\nTip: Make sure you are using a consistent URL (e.g., http://localhost:3000) and that the Social Connection is fully configured in Clerk Dashboard.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[420px] space-y-8"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
           <Image 
             src="/mt-labs-logo.png" 
             width={64} 
             height={64} 
             alt="MT Labs Logo" 
             className="drop-shadow-sm" 
             priority
           />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h1>
        <p className="text-sm text-slate-500 mt-2">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Social Logins */}
      <div className="flex flex-col gap-3 mb-8">
        <button 
          onClick={() => handleOAuth('oauth_google')} 
          disabled={!isAuthReady}
          type="button" 
          className="w-full flex justify-center items-center px-4 py-3.5 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isAuthReady ? "Continue with Google" : "Loading auth..."}
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleOAuth('oauth_facebook')} 
            disabled={!isAuthReady}
            type="button" 
            className="w-full flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Facebook className="w-5 h-5 mr-2 text-[#1877F2]" fill="#1877F2" stroke="none" />
            Facebook
          </button>
          <button 
            onClick={() => handleOAuth('oauth_apple')} 
            disabled={!isAuthReady}
            type="button" 
            className="w-full flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Apple className="w-5 h-5 mr-2 text-slate-900" fill="currentColor"/>
            Apple
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-slate-50 text-slate-500 font-medium">Or continue with email</span>
        </div>
      </div>

      {/* Email / Password Form */}
      <form className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm font-medium"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm font-medium"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 transition-all group mt-2"
        >
          Sign Up
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

    </motion.div>
  );
}
