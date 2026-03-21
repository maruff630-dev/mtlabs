"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Beaker, BrainCircuit, Rocket, Zap, Sparkles, TestTubeDiagonal, Code2, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";

const ICONS = [
  { Icon: Beaker, color: "text-blue-400" },
  { Icon: BrainCircuit, color: "text-indigo-400" },
  { Icon: Rocket, color: "text-purple-400" },
  { Icon: Zap, color: "text-yellow-400" },
  { Icon: Sparkles, color: "text-pink-400" },
  { Icon: TestTubeDiagonal, color: "text-emerald-400" },
  { Icon: Code2, color: "text-cyan-400" }
];

export default function Home() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !authLoaded) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Premium Shifting Background */}
      <motion.div 
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, #1e1b4b 0%, #020617 100%)",
            "radial-gradient(circle at 80% 80%, #1e1b4b 0%, #020617 100%)",
            "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)"
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0"
      />

      {/* Floating Animated Icons in Background */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-30">
        {ICONS.map(({ Icon, color }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.4,
              y: [0, -40, 0],
              x: [0, i % 2 === 0 ? 30 : -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7
            }}
            className="absolute p-5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl"
            style={{
              top: `${10 + (i * 25) % 80}%`,
              left: `${10 + (i * 35) % 80}%`,
            }}
          >
            <Icon className={`w-10 h-10 ${color}`} />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 text-center px-6 max-w-4xl py-16"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="relative p-1 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/20">
            <div className="bg-slate-900 rounded-[22px] p-5">
              <Image src="/logo.png" width={80} height={80} alt="MT Labs" className="drop-shadow-2xl" />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[1.1]"
        >
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.3)]">
            MT Labs
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
        >
          Advanced developer ecosystem for app publishing, media toolkit, 
          and AI-driven automation workflows.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {!isSignedIn ? (
            <>
              <Link 
                href="/sign-in" 
                className="group relative flex items-center justify-center px-10 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl transition-all w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all group-hover:scale-105 group-active:scale-95" />
                <span className="relative z-10 flex items-center">
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="/sign-up" 
                className="group relative flex items-center justify-center px-10 py-5 text-lg font-bold text-slate-300 border border-slate-700 bg-slate-900/50 backdrop-blur-md rounded-2xl hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all w-full sm:w-auto"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/dashboard" 
                className="group relative flex items-center justify-center px-10 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl transition-all w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all group-hover:scale-105 group-active:scale-95" />
                <span className="relative z-10 flex items-center">
                  Open Dashboard
                  <LayoutDashboard className="ml-2 w-6 h-6 group-hover:scale-110 transition-transform" />
                </span>
              </Link>
              <div className="scale-125 ml-2 p-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                <UserButton />
              </div>
            </>
          )}
        </motion.div>

        {/* Bottom feature badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 flex flex-wrap justify-center gap-8 justify-items-center"
        >
          <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            AI Processing
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
            Cloud Automation
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            Secure Auth
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
