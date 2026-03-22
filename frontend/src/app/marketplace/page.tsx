"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Code, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
             <Image src="/mt-labs-logo.png" width={32} height={32} alt="MT Labs" />
            <span className="text-xl font-black text-slate-800 tracking-tight">Marketplace</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-black mb-4 text-slate-800"
            >
              Digital Marketplace
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg max-w-2xl"
            >
              Buy and sell premium code snippets, templates, and digital assets.
            </motion.p>
          </div>
          <div className="flex gap-2 mt-6 md:mt-0">
            <button className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors">Categories</button>
            <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20">Sell Product</button>
          </div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Mock Products */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden cursor-pointer">
              <div className="w-full aspect-video bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
                <Image src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop&sig=${i}`} layout="fill" objectFit="cover" alt="Product thumbnail" className="group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-slate-800 rounded-lg">
                  Source Code
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Premium Dashboard UI Kit {i}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">Complete Next.js administration panel with light/dark modes and full analytics components.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-emerald-600">$49</span>
                <button className="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl font-bold text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
