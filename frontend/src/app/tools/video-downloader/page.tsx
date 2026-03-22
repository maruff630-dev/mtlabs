"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Download, Youtube, Instagram, Facebook, Link as LinkIcon, 
  Loader2, Wand2, Sparkles, MonitorPlay, Zap, Play, History,
  AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import Link from "next/link";
import { Skeleton, SkeletonText, SkeletonBanner } from "@/components/ui/Skeleton";
import CreditBadge from "@/components/ui/CreditBadge";
import UpscaleHistory from "@/components/ui/UpscaleHistory";
import { useCredits, UPSCALE_COSTS, type UpscaleQuality } from "@/hooks/useCredits";

interface VideoDetails {
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'Unknown';
  id?: string;
  thumbnail?: string;
}

const QUALITY_OPTIONS: { key: UpscaleQuality; label: string; description: string; color: string }[] = [
  { key: "HD",  label: "HD 720p",  description: "Standard High Definition", color: "emerald" },
  { key: "2K",  label: "2K 1440p", description: "Ultra Sharp Clarity",      color: "blue"    },
  { key: "4K",  label: "4K 2160p", description: "Cinema Grade Quality",     color: "purple"  },
];

const COLOR_MAPS: Record<string, string> = {
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-900",
  blue:    "border-blue-300 bg-blue-50 text-blue-900",
  purple:  "border-purple-300 bg-purple-50 text-purple-900",
};

const BADGE_COLOR: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue:    "bg-blue-100 text-blue-700",
  purple:  "bg-purple-100 text-purple-700",
};

export default function VideoDownloader() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [url, setUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Duration in seconds — user enters manually (simulated)
  const [videoDurationSec, setVideoDurationSec] = useState<number | "">("");
  const [selectedQuality, setSelectedQuality] = useState<UpscaleQuality>("HD");
  const [creditError, setCreditError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { credits, history, hydrated, addCredits, deductCredits, addHistoryItem, clearHistory } = useCredits();

  const isShortVideo = typeof videoDurationSec === "number" && videoDurationSec <= 30;
  const cost = UPSCALE_COSTS[selectedQuality];
  const canAfford = credits >= cost;

  // Initial Skeleton Loading
  useEffect(() => {
    const timer = setTimeout(() => { setIsDataLoaded(true); }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Real-time URL parsing for thumbnails
  useEffect(() => {
    if (!url) { setVideoDetails(null); setResult(null); return; }
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    if (ytMatch?.[1]) {
      setVideoDetails({ platform: 'YouTube', id: ytMatch[1], thumbnail: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` });
    } else if (url.includes('tiktok.com')) setVideoDetails({ platform: 'TikTok' });
    else if (url.includes('instagram.com')) setVideoDetails({ platform: 'Instagram' });
    else if (url.includes('facebook.com')) setVideoDetails({ platform: 'Facebook' });
    else setVideoDetails({ platform: 'Unknown' });
    
    setResult(null);
    setCreditError("");
    setSuccessMsg("");
  }, [url]);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !videoDetails) return;
    
    setLoading(true);
    setCreditError("");
    setSuccessMsg("");

    // If video is short and a quality is selected — deduct credits
    if (isShortVideo) {
      const ok = deductCredits(selectedQuality);
      if (!ok) {
        setCreditError(`Not enough credits! You need ${cost} credits for ${selectedQuality} upscaling. Buy more below.`);
        setLoading(false);
        return;
      }
    }

    const processingTime = isShortVideo ? 4000 : 2500;

    setTimeout(() => {
      setLoading(false);
      
      const effectiveQuality = isShortVideo ? selectedQuality : "1080p";
      
      const resultObj = {
        title: videoDetails.platform === 'YouTube' && videoDetails.id
          ? `YouTube Video · ID: ${videoDetails.id}`
          : `${videoDetails.platform} Video`,
        thumbnail: videoDetails.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000",
        duration: typeof videoDurationSec === "number" ? videoDurationSec : 0,
        format: "MP4",
        quality: effectiveQuality,
        platform: videoDetails.platform,
        url,
      };

      setResult(resultObj);
      setSuccessMsg(isShortVideo ? `Upscaled to ${selectedQuality} — ${cost} credits deducted!` : "Download ready!");

      // Save to history (only if upascale was applied)
      if (isShortVideo) {
        addHistoryItem({
          url,
          platform: videoDetails.platform,
          thumbnail: videoDetails.thumbnail,
          quality: selectedQuality,
          creditsUsed: cost,
          duration: typeof videoDurationSec === "number" ? videoDurationSec : 0,
        });
      }
    }, processingTime);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40 shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold group">
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="hidden sm:block">Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* History button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:block text-sm font-semibold">History</span>
              {history.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                  {history.length > 9 ? '9+' : history.length}
                </span>
              )}
            </button>

            {/* Credit Badge */}
            {hydrated && <CreditBadge credits={credits} onBuy={addCredits} />}
            
            <div className="scale-110 p-1 bg-white rounded-full shadow-sm border border-slate-100">
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Upscale History Drawer */}
      <UpscaleHistory history={history} onClear={clearHistory} open={historyOpen} onClose={() => setHistoryOpen(false)} />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full flex flex-col items-center">
        
        {!isDataLoaded ? (
          <div className="w-full flex flex-col items-center max-w-2xl mt-8 gap-6">
            <Skeleton className="w-24 h-24 rounded-3xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <SkeletonText lines={2} className="w-full" />
            <SkeletonBanner className="h-32 w-full" />
            <SkeletonBanner className="h-[200px] w-full" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-10 max-w-3xl">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20"
              >
                <Wand2 className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl md:text-6xl font-black mb-4 text-slate-800 tracking-tight"
              >
                Intelligent{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  Video Studio
                </span>
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 text-lg font-medium"
              >
                Download & AI-upscale videos from YouTube, TikTok & Instagram. Short videos (≤30s) can be enhanced to 4K.
              </motion.p>
            </div>

            {/* Main Card */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100"
            >
              <form onSubmit={handleDownload}>
                {/* URL Input */}
                <div className="relative mb-5">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <LinkIcon className={`h-6 w-6 transition-colors ${url ? 'text-blue-500' : 'text-slate-300'}`} />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube, TikTok, or Instagram URL..."
                    className="block w-full pl-16 pr-20 py-5 md:py-6 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                  {url && (
                    <button type="button" onClick={() => { setUrl(""); setVideoDurationSec(""); }} className="absolute inset-y-0 right-0 pr-6 text-slate-400 hover:text-slate-700 font-bold text-sm">
                      Clear
                    </button>
                  )}
                </div>

                {/* Video Duration + Thumbnail Preview */}
                <AnimatePresence>
                  {videoDetails && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {/* Thumbnail Preview for YouTube */}
                      {videoDetails.thumbnail && (
                        <div className="mb-5 rounded-2xl overflow-hidden bg-black aspect-video relative shadow-inner border border-slate-200">
                          <img src={videoDetails.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-75" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 backdrop-blur-sm">
                              <Play className="w-6 h-6 text-white ml-1" fill="white" />
                            </div>
                          </div>
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-black rounded-lg uppercase tracking-wider">
                            {videoDetails.platform}
                          </div>
                        </div>
                      )}

                      {/* Duration Input */}
                      <div className="mb-5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Video duration (seconds) — required for upscaling
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min={1}
                            max={7200}
                            value={videoDurationSec}
                            onChange={(e) => setVideoDurationSec(e.target.value ? parseInt(e.target.value) : "")}
                            placeholder="Enter duration in seconds (e.g. 25)"
                            className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                          />
                          {typeof videoDurationSec === "number" && (
                            <span className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${isShortVideo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                              {isShortVideo ? "✓ Short" : "Long (no upscale)"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quality Selection (Only for short videos) */}
                      {isShortVideo && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-5"
                        >
                          <p className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            Upscale Quality
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            {QUALITY_OPTIONS.map((opt) => {
                              const selected = selectedQuality === opt.key;
                              const colorMap = selected ? COLOR_MAPS[opt.color] : "border-slate-200 bg-white hover:border-slate-300";
                              return (
                                <button
                                  key={opt.key}
                                  type="button"
                                  onClick={() => setSelectedQuality(opt.key)}
                                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${colorMap}`}
                                >
                                  <div className="flex items-center justify-between w-full mb-2">
                                    <MonitorPlay className={`w-5 h-5 ${selected ? '' : 'text-slate-300'}`} />
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${BADGE_COLOR[opt.color]}`}>
                                      {UPSCALE_COSTS[opt.key]} cr
                                    </span>
                                  </div>
                                  <span className="font-black text-base w-full">{opt.label}</span>
                                  <span className="text-[11px] text-slate-400 w-full mt-0.5">{opt.description}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Credit balance indicator */}
                          <div className={`mt-3 flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl ${canAfford ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                            <Zap className="w-4 h-4" />
                            {canAfford 
                              ? `${cost} credits will be deducted for ${selectedQuality} upscaling`
                              : `Insufficient credits! Need ${cost}, you have ${credits}`
                            }
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error / Success Messages */}
                <AnimatePresence>
                  {creditError && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-semibold"
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      {creditError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !url || (isShortVideo && !canAfford)}
                  className="w-full py-5 bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-[17px] transition-all shadow-xl shadow-slate-900/15 flex items-center justify-center group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-3 text-blue-400" />
                      <span className="animate-pulse">{isShortVideo ? "AI Upscaling in Progress..." : "Processing Download..."}</span>
                    </>
                  ) : (
                    <>
                      {isShortVideo ? (
                        <>
                          <Wand2 className="w-5 h-5 mr-2 text-blue-400" />
                          Upscale to {selectedQuality} & Download
                          <span className="ml-2 text-sm font-bold opacity-60">({cost} cr)</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Generate Download Link
                        </>
                      )}
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ y: 20, opacity: 0, scale: 0.97 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="w-full max-w-3xl bg-white mt-8 p-6 md:p-8 rounded-[32px] shadow-xl border border-emerald-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start"
                >
                  <div className="relative w-full md:w-[260px] aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={result.thumbnail} className="object-cover w-full h-full" alt="thumbnail" />
                  </div>
                  <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        {successMsg || "Ready"}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2 leading-snug">{result.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-6">
                      <span>Format: <b>MP4</b></span>
                      <span>Quality: <b className="text-blue-600">{result.quality}</b></span>
                      {result.duration > 0 && <span>Duration: <b>{result.duration}s</b></span>}
                    </div>
                    <button className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 hover:-translate-y-0.5">
                      <Download className="w-5 h-5" /> Download Video
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Platform Icons */}
            <div className="mt-14 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-5">Works with</p>
              <div className="flex justify-center gap-10 opacity-50">
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
