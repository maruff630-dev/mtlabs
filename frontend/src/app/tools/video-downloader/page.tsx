"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Download, Video, Youtube, Instagram, Facebook, Link as LinkIcon, 
  Loader2, Wand2, Sparkles, MonitorPlay, Zap, Settings2, Play
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton, SkeletonText, SkeletonBanner } from "@/components/ui/Skeleton";

interface VideoDetails {
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'Unknown';
  id?: string;
  thumbnail?: string;
}

export default function VideoDownloader() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [url, setUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Enhancements State
  const [enhancements, setEnhancements] = useState<{
    upscale4k: boolean;
    fpsBoost: boolean;
    hdrColor: boolean;
  }>({
    upscale4k: false,
    fpsBoost: false,
    hdrColor: false,
  });

  // Initial Skeleton Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoaded(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Real-time URL parsing for thumbnails
  useEffect(() => {
    if (!url) {
      setVideoDetails(null);
      setResult(null);
      return;
    }

    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    if (ytMatch && ytMatch[1]) {
      setVideoDetails({ 
        platform: 'YouTube', 
        id: ytMatch[1], 
        thumbnail: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` 
      });
    } else if (url.includes('tiktok.com')) {
      setVideoDetails({ platform: 'TikTok' });
    } else if (url.includes('instagram.com')) {
      setVideoDetails({ platform: 'Instagram' });
    } else if (url.includes('facebook.com')) {
      setVideoDetails({ platform: 'Facebook' });
    } else {
      setVideoDetails({ platform: 'Unknown' });
    }
  }, [url]);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !videoDetails) return;
    
    setLoading(true);
    // Simulate AI Enhancement & Download processing
    const processingTime = Object.values(enhancements).some(v => v) ? 4500 : 2500;
    
    setTimeout(() => {
      setLoading(false);
      
      let finalQuality = "1080p HD";
      if (enhancements.upscale4k) finalQuality = "4K UHD";
      
      let enhancedFeatures = [];
      if (enhancements.fpsBoost) enhancedFeatures.push("60 FPS");
      if (enhancements.hdrColor) enhancedFeatures.push("HDR Corrected");
      
      setResult({
        title: videoDetails.platform === 'YouTube' ? `YouTube Video ID: ${videoDetails.id}` : `${videoDetails.platform} Video`,
        thumbnail: videoDetails.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        duration: "00:00",
        format: "MP4",
        quality: finalQuality,
        enhancements: enhancedFeatures,
        platform: videoDetails.platform
      });
    }, processingTime);
  };

  const toggleEnhancement = (key: keyof typeof enhancements) => {
    setEnhancements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold group">
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold tracking-tight">AI Media Studio</span>
            </div>
            <div className="scale-110 p-1 bg-white rounded-full shadow-sm border border-slate-100">
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full flex flex-col items-center">
        
        {!isDataLoaded ? (
          <div className="w-full flex flex-col items-center max-w-2xl mt-8">
            <Skeleton className="w-24 h-24 rounded-3xl mb-8" />
            <Skeleton className="h-10 w-3/4 rounded-xl mb-4" />
            <SkeletonText lines={2} className="w-full text-center" />
            <SkeletonBanner className="h-32 mt-12 mb-6" />
            <SkeletonBanner className="h-[250px]" />
          </div>
        ) : (
          <>
            {/* Header Content */}
            <div className="text-center mb-12 max-w-3xl">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20"
              >
                <Wand2 className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-6xl font-black mb-6 text-slate-800 tracking-tight"
              >
                Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Video Extractor</span>
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 text-lg md:text-xl font-medium"
              >
                Download and remaster videos from YouTube, TikTok, and Instagram in stunning quality using AI processing.
              </motion.p>
            </div>

            {/* Main Interactive Tool */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100"
            >
              <form onSubmit={handleDownload} className="relative z-10">
                <div className="relative mb-6 group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <LinkIcon className={`h-6 w-6 transition-colors ${url ? 'text-blue-500' : 'text-slate-300'}`} />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste video URL here (YouTube, TikTok, Instagram)..."
                    className="block w-full pl-16 pr-6 py-5 md:py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                  {url && (
                    <button type="button" onClick={() => setUrl("")} className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-slate-600 font-bold text-sm">
                      Clear
                    </button>
                  )}
                </div>

                {/* AI Enhancement Panel - Only visible when URL is present */}
                <AnimatePresence>
                  {videoDetails && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Settings2 className="w-5 h-5 text-slate-600" />
                          <h4 className="font-bold text-slate-800">AI Upgrade Processing</h4>
                          <span className="ml-auto text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md uppercase tracking-wider">{videoDetails.platform} Detected</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* 4K Upscale Toggle */}
                          <div 
                            onClick={() => toggleEnhancement('upscale4k')}
                            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-start transition-all ${enhancements.upscale4k ? 'bg-blue-50 border-blue-300 shadow-sm shadow-blue-500/10' : 'bg-white border-slate-200 hover:border-blue-200'}`}
                          >
                            <div className="flex items-center justify-between w-full mb-2">
                              <MonitorPlay className={`w-5 h-5 ${enhancements.upscale4k ? 'text-blue-600' : 'text-slate-400'}`} />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${enhancements.upscale4k ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                {enhancements.upscale4k && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                            <span className={`font-bold text-sm ${enhancements.upscale4k ? 'text-blue-900' : 'text-slate-600'}`}>4K Upscaling</span>
                            <span className="text-xs text-slate-400 mt-1">Enhance sharpness</span>
                          </div>

                          {/* 60 FPS Toggle */}
                          <div 
                            onClick={() => toggleEnhancement('fpsBoost')}
                            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-start transition-all ${enhancements.fpsBoost ? 'bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-500/10' : 'bg-white border-slate-200 hover:border-emerald-200'}`}
                          >
                            <div className="flex items-center justify-between w-full mb-2">
                              <Zap className={`w-5 h-5 ${enhancements.fpsBoost ? 'text-emerald-600' : 'text-slate-400'}`} />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${enhancements.fpsBoost ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                                {enhancements.fpsBoost && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                            <span className={`font-bold text-sm ${enhancements.fpsBoost ? 'text-emerald-900' : 'text-slate-600'}`}>60 FPS Boost</span>
                            <span className="text-xs text-slate-400 mt-1">Frame interpolation</span>
                          </div>

                          {/* HDR Color Toggle */}
                          <div 
                            onClick={() => toggleEnhancement('hdrColor')}
                            className={`cursor-pointer p-4 rounded-xl border flex flex-col items-start transition-all ${enhancements.hdrColor ? 'bg-purple-50 border-purple-300 shadow-sm shadow-purple-500/10' : 'bg-white border-slate-200 hover:border-purple-200'}`}
                          >
                            <div className="flex items-center justify-between w-full mb-2">
                              <Sparkles className={`w-5 h-5 ${enhancements.hdrColor ? 'text-purple-600' : 'text-slate-400'}`} />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${enhancements.hdrColor ? 'border-purple-600 bg-purple-600' : 'border-slate-300'}`}>
                                {enhancements.hdrColor && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                            <span className={`font-bold text-sm ${enhancements.hdrColor ? 'text-purple-900' : 'text-slate-600'}`}>HDR Color</span>
                            <span className="text-xs text-slate-400 mt-1">Vibrant correction</span>
                          </div>
                        </div>
                      </div>

                      {/* Real Thumbnail Preview for YouTube */}
                      {videoDetails.thumbnail && (
                        <div className="mb-6 rounded-2xl overflow-hidden bg-black aspect-video relative shadow-inner border border-slate-200/50">
                          <img src={videoDetails.thumbnail} alt="Video Preview" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-red-500/40">
                              <Play className="w-6 h-6 text-white ml-1" fill="white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full py-5 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white rounded-2xl font-bold text-[17px] transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-3 text-blue-400" />
                      <span className="animate-pulse">Processing Enhancements...</span>
                    </>
                  ) : (
                    <>
                      Generate Download Link
                      <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Results Output */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-3xl bg-white mt-8 p-6 md:p-8 rounded-[32px] shadow-xl border border-emerald-100 flex flex-col md:flex-row gap-8 items-center md:items-start"
                >
                  <div className="relative w-full md:w-[280px] aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-inner">
                    <img src={result.thumbnail} className="object-cover w-full h-full" alt="Video thumbnail" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-bold">
                      {result.duration}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                      <Zap className="w-3 h-3" /> Ready
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight line-clamp-2">{result.title}</h3>
                    <div className="text-slate-500 mb-6 flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
                      <span>Format: <b>{result.format}</b></span>
                      <span>Quality: <b className="text-blue-600">{result.quality}</b></span>
                      {result.enhancements.length > 0 && (
                        <span className="text-amber-600 flex items-center gap-1">
                          <Wand2 className="w-3 h-3" /> {result.enhancements.join(', ')}
                        </span>
                      )}
                    </div>
                    
                    <button className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 hover:-translate-y-0.5">
                      <Download className="w-5 h-5" /> Download Media
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Supported Platforms (Footer) */}
            <div className="mt-16 text-center">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">Supported Platforms</p>
               <div className="flex flex-wrap justify-center gap-10 opacity-60">
                 <Youtube className="w-6 h-6 hover:text-red-500 hover:opacity-100 transition-all cursor-pointer" />
                 <Instagram className="w-6 h-6 hover:text-pink-500 hover:opacity-100 transition-all cursor-pointer" />
                 <Facebook className="w-6 h-6 hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer" />
               </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
