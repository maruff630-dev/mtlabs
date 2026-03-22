"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, MailOpen, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignUp, useClerk } from "@clerk/nextjs";

export default function VerifyPage() {
  const router = useRouter();
  const signUpObj = useSignUp();
  // Using as any to safely destructure newer hooks properties based on our v7 API integration
  const { signUp, setActive } = signUpObj as any;
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onPressVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!signUp) return;
    
    if (code.length !== 6) return;

    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptVerification({
        strategy: "email_code",
        code,
      });
      
      if (completeSignUp.status !== 'complete') {
        setError("Missing requirements. Please try again.");
        setLoading(false);
      } else {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || "Invalid verification code.");
      setCode(""); // Clear the code on error for quick re-entry
      setLoading(false);
    }
  };

  // Auto-verify when 6 digits are hit
  useEffect(() => {
    if (code.length === 6) {
      onPressVerify();
    }
  }, [code]);

  const codeArray = code.split('').concat(Array(6).fill('')).slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[420px] my-auto space-y-6"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full w-24 h-24 mx-auto" />
            <div className="w-20 h-20 bg-white shadow-xl shadow-blue-500/20 rounded-2xl flex items-center justify-center border border-slate-100 relative z-10">
                <MailOpen className="w-10 h-10 text-blue-600" />
            </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Verify your email
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-2 max-w-[280px] mx-auto leading-relaxed">
          We sent a 6-digit confirmation code to your email address.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 text-center shadow-sm">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[24px] shadow-2xl shadow-blue-900/5 border border-white">
        <form className="space-y-6" onSubmit={onPressVerify}>
          <div className="space-y-4">
            <label className="text-xs tracking-widest uppercase font-bold text-slate-400 text-center block">Enter Security Code</label>
            
            {/* Custom Premium OTP Input */}
            <div className="relative flex gap-2 sm:gap-3 justify-center">
                {codeArray.map((digit, i) => (
                <div 
                    key={i} 
                    className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center text-2xl font-black border-2 transition-all duration-300 ${
                        digit 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/20 scale-105' 
                        : code.length === i 
                            ? 'border-blue-300 bg-white ring-4 ring-blue-500/10' 
                            : 'border-slate-200 bg-slate-50 text-transparent'
                    }`}
                >
                    {digit}
                </div>
                ))}
                
                {/* Overlay exact bounding box input to capture real keystrokes effortlessly */}
                <input 
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
                    autoFocus
                />
            </div>

            <p className="text-[11px] text-center text-slate-400 font-medium flex items-center justify-center gap-1.5 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Automatic verification when completed
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading || code.length !== 6} 
            className="w-full py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xl shadow-blue-500/20 transition-all flex justify-center items-center disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
          </button>
        </form>
      </div>

      <div className="text-center pt-2">
          <p className="text-xs font-semibold text-slate-500">
             Didn&apos;t receive a code? <button type="button" onClick={() => signUp?.prepareVerification({ strategy: "email_code" })} className="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center">Resend now</button>
          </p>
      </div>

    </motion.div>
  );
}
