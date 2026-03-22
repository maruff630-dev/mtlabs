"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { LayoutDashboard, BrainCircuit, Rocket, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* Top Navbar */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 bg-white rounded-xl group-hover:scale-110 transition-transform">
              <Image src="/mt-labs-logo.png" width={32} height={32} alt="MT Labs" />
            </div>
            <span className="text-2xl font-black tracking-tight">MT Labs</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-400">System Online</span>
            </div>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.firstName || 'Developer'}</span>!
          </motion.h2>
          <p className="text-slate-400 text-lg">Your central hub for app publishing and automation.</p>
        </header>

        {/* Quick Stats / Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Published Apps', value: '0', icon: Rocket, color: 'text-blue-500' },
            { label: 'Cloud Credits', value: '1,000', icon: Zap, color: 'text-yellow-500' },
            { label: 'AI Generative Bits', value: '50', icon: BrainCircuit, color: 'text-purple-500' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm hover:border-blue-500/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-white/5 rounded-2xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black">{stat.value}</span>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Phase 1: App Publishing</h3>
              <p className="text-slate-400 mb-8 max-w-md">Upload and manage your digital tools. Get approved by admins and start scaling.</p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all">Submit New App</button>
            </div>
            <Rocket className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
          </div>

          <div className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Phase 2: Media Toolkit</h3>
              <p className="text-slate-400 mb-8 max-w-md">Process your videos, enhance to 2K/4K, and automate your media workflows.</p>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold border border-white/10 transition-all">Launch Toolkit</button>
            </div>
            <Sparkles className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:-rotate-12 transition-transform duration-700" />
          </div>
        </div>
      </main>
    </div>
  );
}
