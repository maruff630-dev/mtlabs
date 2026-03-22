"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Video, Youtube, Instagram, Facebook, Link as LinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    // Simulate API call for download processing
    setTimeout(() => {
      setLoading(false);
      setResult({
        title: "Sample High Quality Video",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        duration: "3:45",
        quality: "1080p HD"
      });
    }, 2500);
  };

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
            <span className="text-xl font-black text-slate-800 tracking-tight">Media Toolkit</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/10"
          >
            <Video className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-800"
          >
            Universal Video Downloader
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Paste a link from YouTube, TikTok, Instagram, or Facebook to download video in highest quality without watermarks.
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200 border border-slate-100 mb-12"
        >
          <form onSubmit={handleDownload} className="relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <LinkIcon className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your video link here..."
                  className="block w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center min-w-[160px]"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Supported Platforms */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-400 font-medium tracking-wide">
               <Youtube className="w-5 h-5 text-red-500" /> YouTube
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-medium tracking-wide">
               <Video className="w-5 h-5 text-black" /> TikTok
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-medium tracking-wide">
               <Instagram className="w-5 h-5 text-pink-500" /> Instagram
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-medium tracking-wide">
               <Facebook className="w-5 h-5 text-blue-600" /> Facebook
            </div>
          </div>
        </motion.div>

        {/* Results Section (Mocked) */}
        {result && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-6 rounded-[24px] shadow-lg border border-slate-100 flex flex-col md:flex-row gap-6 items-center"
          >
            <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-slate-200">
               {/* Note: I am not using next/image here for external unsplash placeholder just standard img tag to skip configuration if domains are not allowed */}
               <img src={result.thumbnail} className="object-cover w-full h-full" alt="Video thumbnail" />
               <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                 {result.duration}
               </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{result.title}</h3>
              <p className="text-slate-500 mb-6">Format: MP4 • Quality: <span className="text-blue-500 font-semibold">{result.quality}</span></p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all">
                  <Download className="w-5 h-5" /> Download HD
                </button>
                <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 transition-all">
                  <Download className="w-5 h-5" /> Download SD
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
