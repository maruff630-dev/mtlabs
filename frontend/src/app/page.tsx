"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Beaker, BrainCircuit, Rocket, Zap, Sparkles, TestTubeDiagonal, Code2, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";

const ICONS = [
  { Icon: Beaker, color: "text-blue-500" },
  { Icon: BrainCircuit, color: "text-indigo-500" },
  { Icon: Rocket, color: "text-purple-500" },
  { Icon: Zap, color: "text-amber-500" },
  { Icon: Sparkles, color: "text-pink-500" },
  { Icon: TestTubeDiagonal, color: "text-emerald-500" },
  { Icon: Code2, color: "text-cyan-500" }
];

export default function Home() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !authLoaded) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-white">
      {/* Premium Light Shifting Background */}
      <motion.div 
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, #eff6ff 0%, #ffffff 100%)",
            "radial-gradient(circle at 80% 80%, #faf5ff 0%, #ffffff 100%)",
            "radial-gradient(circle at 50% 50%, #eff6ff 0%, #ffffff 100%)"
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-0 z-0 bg-white"
      />

      {/* Subtle modern dotted grid overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      {/* Floating Animated Icons in Background */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-60">
        {ICONS.map(({ Icon, color }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.8,
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute p-4 bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/50"
            style={{
              top: `${15 + (i * 25) % 70}%`,
              left: `${10 + (i * 35) % 80}%`,
            }}
          >
            <Icon className={`w-8 h-8 ${color}`} />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative z-20 text-center px-6 max-w-5xl py-16 mx-auto"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-10"
        >
          <div className="relative p-1 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-xl shadow-blue-500/10">
            <div className="bg-white rounded-[22px] p-5 border border-white/50">
              <Image src="/logo.png" width={80} height={80} alt="MT Labs" className="drop-shadow-sm" />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="text-6xl md:text-8xl font-black text-slate-800 tracking-tight mb-8 leading-[1.1]"
        >
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm">
            MT Labs
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
        >
          Advanced developer ecosystem for app publishing, media toolkit, 
          and AI-driven automation workflows.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {!isSignedIn ? (
            <>
              <Link 
                href="/sign-in" 
                className="group relative flex items-center justify-center px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-2xl transition-all w-full sm:w-auto shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-transform group-hover:scale-105" />
                <span className="relative z-10 flex items-center">
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="/sign-up" 
                className="group relative flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 shadow-sm rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/dashboard" 
                className="group relative flex items-center justify-center px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-2xl transition-all w-full sm:w-auto shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-transform group-hover:scale-105" />
                <span className="relative z-10 flex items-center">
                  Open Dashboard
                  <LayoutDashboard className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </Link>
              <div className="scale-110 ml-2 p-1 bg-white rounded-full shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                <UserButton />
              </div>
            </>
          )}
        </motion.div>

        {/* Bottom feature badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          className="mt-20 flex flex-wrap justify-center gap-6 md:gap-10"
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm text-slate-700 font-bold uppercase tracking-widest text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            AI Processing
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm text-slate-700 font-bold uppercase tracking-widest text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            Cloud Automation
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm text-slate-700 font-bold uppercase tracking-widest text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
            </span>
            Secure Auth
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
