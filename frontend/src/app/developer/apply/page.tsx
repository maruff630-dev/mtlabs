"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Rocket, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DeveloperApply() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
             <Image src="/mt-labs-logo.png" width={32} height={32} alt="MT Labs" />
            <span className="text-xl font-black text-slate-800 tracking-tight">Developer Hub</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl shadow-slate-200 border border-slate-100"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/10">
            <Rocket className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-4xl font-black text-slate-800 mb-4">Become an MT Labs Developer</h1>
          <p className="text-slate-500 text-lg mb-8">
            Join our ecosystem to publish powerful web apps, digital products, and automate workflows via our API and Telegram Bots.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "Publish apps to our global user base",
              "Sell premium source codes & tech products",
              "Access Webhooks & Telegram Bot integrations",
              "Dedicated analytics & API keys mapping"
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                {perk}
              </div>
            ))}
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Developer / Studio Name</label>
              <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="e.g. NextGen Studios" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Portfolio / Website (Optional)</label>
              <input type="url" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Why do you want to join?</label>
              <textarea className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[120px]" placeholder="Tell us briefly about the apps or tools you want to publish..." required></textarea>
            </div>
            
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Submit Application
            </button>
            <p className="text-center text-sm text-slate-400 mt-4">
              Your application will be manually reviewed by our Admin team.
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
