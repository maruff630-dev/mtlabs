"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText, Upload, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PDFStudio() {
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
            <span className="text-xl font-black text-slate-800 tracking-tight">PDF Studio</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/10"
        >
          <FileText className="w-12 h-12 text-rose-500" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-black mb-6 text-slate-800"
        >
          Advanced PDF & Docs Workspace
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-xl max-w-2xl mx-auto mb-12"
        >
          Edit, split, merge PDFs, or use our AI Generator to construct entire documents from scratch seamlessly.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          <div className="p-8 bg-white border border-slate-200 border-dashed rounded-[32px] hover:border-rose-400 hover:bg-rose-50 transition-colors cursor-pointer group flex flex-col items-center justify-center min-h-[250px]">
            <Upload className="w-10 h-10 text-slate-400 group-hover:text-rose-500 mb-4 transition-colors" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Upload PDF to Edit</h3>
            <p className="text-slate-500 text-sm">Drag and drop your file here</p>
          </div>
          <div className="p-8 bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-[32px] hover:shadow-xl hover:shadow-rose-500/20 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[250px]">
            <Sparkles className="w-10 h-10 text-white mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">AI Document Generator</h3>
            <p className="text-white/80 text-sm">Create documents automatically</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
