"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, BrainCircuit, Rocket, Zap, Sparkles, 
  Video, ShoppingBag, FileText, Bot, ShieldCheck, Download, ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/mt-labs-logo.png" width={48} height={48} alt="MT Labs" className="group-hover:scale-110 transition-transform drop-shadow-md" />
            <span className="text-2xl font-black text-slate-800 tracking-tight">MT Labs</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-600">System Online</span>
            </div>
            <div className="scale-110 ml-2 p-1 bg-white rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black mb-4 text-slate-800"
            >
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.firstName || 'User'}</span>!
            </motion.h2>
            <p className="text-slate-500 text-lg font-medium">Your universal workspace for tools, apps, and automation.</p>
          </div>
          <Link href="/developer/apply" className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            Become a Developer
          </Link>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Cloud Credits', value: '1,000', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100' },
            { label: 'Apps Owned', value: '3', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-100' },
            { label: 'Downloads', value: '12', icon: Download, color: 'text-emerald-500', bg: 'bg-emerald-100' },
            { label: 'AI Tokens', value: '500', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-100' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black text-slate-800">{stat.value}</span>
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Modular Grid Ecosystem */}
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Ecosystem Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Media Toolkit */}
          <div className="col-span-1 lg:col-span-2 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[32px] overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-800">Media Toolkit</h3>
              </div>
              <p className="text-slate-600 mb-8 max-w-sm">Download TikTok/YouTube videos without watermark, extract frames, and enhance to 4K effortlessly.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/tools/video-downloader" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">Video Downloader</Link>
                <Link href="/tools/video-enhancer" className="px-5 py-2.5 bg-white text-slate-700 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">AI Video Enhancer</Link>
              </div>
            </div>
            <Sparkles className="absolute -bottom-10 -right-10 w-48 h-48 text-blue-500/10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* App Publishing & Dev Hub */}
          <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700 rounded-[32px] overflow-hidden relative group shadow-xl shadow-slate-900/10">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">Developer Hub</h3>
              </div>
              <p className="text-slate-400 mb-8 text-sm">Publish your apps and digital products. Setup Telegram automation bots.</p>
              <Link href="/developer/apply" className="w-full flex justify-center px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/25">Apply for Developer Account</Link>
            </div>
            <Bot className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:-translate-y-4 transition-transform duration-700" />
          </div>

          {/* Document & PDF System */}
          <div className="p-8 bg-white border border-slate-200 rounded-[32px] hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">PDF & AI Docs</h3>
              <p className="text-slate-500 text-sm mb-6">Edit PDFs, generate AI content, and extract text seamlessly.</p>
            </div>
            <Link href="/tools/pdf-studio" className="text-rose-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all w-fit mt-auto cursor-pointer">
              Open PDF Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Digital Marketplace */}
          <div className="p-8 bg-white border border-slate-200 rounded-[32px] hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Marketplace</h3>
              <p className="text-slate-500 text-sm mb-6">Buy and sell premium source codes, assets, and digital tools.</p>
            </div>
            <Link href="/marketplace" className="text-emerald-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all w-fit mt-auto cursor-pointer">
              Browse Store <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Panel Link */}
          <Link href="/admin/panel" className="p-8 bg-slate-50 border border-slate-200 border-dashed rounded-[32px] flex flex-col justify-center items-center text-center group hover:bg-slate-100 transition-colors">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Admin Review Panel</h3>
            <p className="text-slate-500 text-xs mt-2 max-w-[200px]">Moderate users and approve developer applications.</p>
          </Link>

        </div>
      </main>
    </div>
  );
}
