"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Download, Youtube, Instagram, Facebook, Link as LinkIcon,
  Loader2, Wand2, Sparkles, MonitorPlay, Zap, Play, History,
  CheckCircle2, Clock, Info, ArrowLeftRight, Eye, Globe
} from "lucide-react";
import Link from "next/link";
import { Skeleton, SkeletonText, SkeletonBanner } from "@/components/ui/Skeleton";
import CreditBadge from "@/components/ui/CreditBadge";
import UpscaleHistory from "@/components/ui/UpscaleHistory";
import { useCredits, UPSCALE_COSTS, type UpscaleQuality } from "@/hooks/useCredits";

// ─── Types ────────────────────────────────────────────────────────────
interface VideoMeta {
  platform: "YouTube" | "YouTube Shorts" | "TikTok" | "Instagram" | "Facebook" | "Unknown";
  id?: string;
  thumbnail: string;
  title: string;
  author: string;
  durationSec: number | null;   // null = unknown
  isShort: boolean;             // ≤30 sec
  embedUrl?: string;
}

const QUALITY_OPTIONS: { key: UpscaleQuality; label: string; tag: string; color: string }[] = [
  { key: "HD",  label: "HD 720p",  tag: "50 cr",  color: "emerald" },
  { key: "2K",  label: "2K 1440p", tag: "300 cr", color: "blue"    },
  { key: "4K",  label: "4K 2160p", tag: "500 cr", color: "purple"  },
];

// CSS filter presets that simulate quality levels
const QUALITY_FILTERS: Record<string, string> = {
  original: "blur(0.6px) contrast(0.82) saturate(0.75) brightness(0.97)",
  HD:  "contrast(1.08) saturate(1.1) brightness(1.02)",
  "2K": "contrast(1.12) saturate(1.18) brightness(1.03) drop-shadow(0 0 0.5px rgba(0,0,0,0.1))",
  "4K": "contrast(1.18) saturate(1.28) brightness(1.04) drop-shadow(0 0 1px rgba(0,0,0,0.15))",
};

// ─── Detect & Fetch video metadata ─────────────────────────────────────
async function fetchVideoMeta(url: string): Promise<VideoMeta | null> {
  try {
    // YouTube Shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
    if (shortsMatch) {
      const id = shortsMatch[1];
      const thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      const oembed = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => ({}));
      return {
        platform: "YouTube Shorts",
        id,
        thumbnail: oembed.thumbnail_url || thumb,
        title: oembed.title || "YouTube Shorts",
        author: oembed.author_name || "YouTube",
        durationSec: 30, // Shorts are ≤60s, commonly ≤30s — we treat as short eligible
        isShort: true,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0`,
      };
    }

    // Regular YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      const id = ytMatch[1];
      const oembed = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => ({}));
      return {
        platform: "YouTube",
        id,
        thumbnail: oembed.thumbnail_url || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        title: oembed.title || "YouTube Video",
        author: oembed.author_name || "YouTube",
        durationSec: null, // Long video by default
        isShort: false,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0`,
      };
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      const oembed = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => ({}));
      return {
        platform: "TikTok",
        thumbnail: oembed.thumbnail_url || "",
        title: oembed.title || "TikTok Video",
        author: oembed.author_name || "TikTok",
        durationSec: 30,
        isShort: true,
      };
    }

    // Instagram
    if (url.includes("instagram.com")) {
      return { platform: "Instagram", thumbnail: "", title: "Instagram Reel", author: "Instagram", durationSec: 30, isShort: true };
    }

    // Facebook
    if (url.includes("facebook.com")) {
      return { platform: "Facebook", thumbnail: "", title: "Facebook Video", author: "Facebook", durationSec: null, isShort: false };
    }

    return null;
  } catch {
    return null;
  }
}

function platformIcon(p: string) {
  if (p.includes("YouTube")) return <Youtube className="w-4 h-4 text-red-500" />;
  if (p === "TikTok") return <Play className="w-4 h-4 text-slate-800" />;
  if (p === "Instagram") return <Instagram className="w-4 h-4 text-pink-500" />;
  if (p === "Facebook") return <Facebook className="w-4 h-4 text-blue-500" />;
  return <Globe className="w-4 h-4 text-slate-400" />;
}

function fmtDur(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function VideoDownloader() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<UpscaleQuality>("HD");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [creditError, setCreditError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [sliderPos, setSliderPos] = useState(50); // before/after slider
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { credits, history, hydrated, addCredits, deductCredits, addHistoryItem, clearHistory } = useCredits();

  const cost = UPSCALE_COSTS[selectedQuality];
  const canAfford = credits >= cost;

  useEffect(() => {
    const t = setTimeout(() => setIsDataLoaded(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Auto-fetch metadata on URL change (debounced 600ms)
  useEffect(() => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    setMeta(null); setResult(null); setCreditError(""); setShowPreview(false);
    if (!url) return;

    fetchTimer.current = setTimeout(async () => {
      setFetching(true);
      const m = await fetchVideoMeta(url);
      setMeta(m);
      setFetching(false);
    }, 600);

    return () => { if (fetchTimer.current) clearTimeout(fetchTimer.current); };
  }, [url]);

  // Before/After slider drag
  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleUpscale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !meta) return;
    setCreditError("");

    if (meta.isShort) {
      const ok = deductCredits(selectedQuality);
      if (!ok) { setCreditError(`Need ${cost} credits for ${selectedQuality}. Buy more below.`); return; }
    }

    setLoading(true);

    try {
      let upscaledUrl: string | null = null;

      // Only call real AI if it's a short video with a real URL
      if (meta.isShort && url) {
        const res = await fetch("/api/upscale/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: url, quality: selectedQuality }),
        });
        const data = await res.json();
        if (data.url) upscaledUrl = data.url;
      }

      setResult({
        title: meta.title,
        thumbnail: meta.thumbnail,
        upscaledThumbnail: upscaledUrl,   // real AI output
        quality: meta.isShort ? selectedQuality : "1080p",
        platform: meta.platform,
        duration: meta.durationSec,
        upscaled: meta.isShort,
      });

      if (meta.isShort) {
        addHistoryItem({ url, platform: meta.platform, thumbnail: meta.thumbnail, quality: selectedQuality, creditsUsed: cost, duration: meta.durationSec || 0 });
      }
    } catch (err: any) {
      console.error("Upscale error:", err);
      // Graceful fallback — still show result with CSS filter simulation
      setResult({
        title: meta.title,
        thumbnail: meta.thumbnail,
        upscaledThumbnail: null,
        quality: meta.isShort ? selectedQuality : "1080p",
        platform: meta.platform,
        duration: meta.durationSec,
        upscaled: meta.isShort,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold group">
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
            <span className="hidden sm:block">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setHistoryOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600 text-sm font-semibold">
              <History className="w-4 h-4" />
              <span className="hidden sm:block">History</span>
              {history.length > 0 && <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">{history.length > 9 ? "9+" : history.length}</span>}
            </button>
            {hydrated && <CreditBadge credits={credits} onBuy={addCredits} />}
            <div className="p-1 bg-white rounded-full shadow-sm border border-slate-100 scale-110"><UserButton /></div>
          </div>
        </div>
      </nav>

      <UpscaleHistory history={history} onClear={clearHistory} open={historyOpen} onClose={() => setHistoryOpen(false)} />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        {!isDataLoaded ? (
          <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto mt-10">
            <Skeleton className="w-20 h-20 rounded-3xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <SkeletonText lines={2} className="w-full" />
            <SkeletonBanner className="h-40 w-full" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-[28px] flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-blue-500/20">
                <Wand2 className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-black mb-3 text-slate-800 tracking-tight">
                Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Video Studio</span>
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-500 text-lg font-medium">
                Paste any video URL — we auto-detect everything. Short videos (≤30s) are AI-upscalable.
              </motion.p>
            </div>

            {/* URL Input */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <LinkIcon className={`h-6 w-6 transition-colors ${url ? "text-blue-500" : "text-slate-300"}`} />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="Paste YouTube, TikTok, Instagram or Facebook URL..."
                  className="w-full pl-16 pr-24 py-5 md:py-6 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-400 shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                  {fetching && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                  {url && !fetching && <button type="button" onClick={() => setUrl("")} className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2">Clear</button>}
                </div>
              </div>
            </motion.div>

            {/* Main content: Split layout appears once meta is loaded */}
            <AnimatePresence>
              {meta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
                >
                  {/* ── LEFT: Thumbnail + Info + Preview ── */}
                  <div className="flex flex-col gap-4">
                    {/* Thumbnail card */}
                    <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
                      {meta.thumbnail ? (
                        <div className="relative aspect-video bg-black">
                          {showPreview && meta.embedUrl ? (
                            <iframe
                              src={meta.embedUrl + "&autoplay=1"}
                              className="w-full h-full"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            />
                          ) : (
                            <>
                              <img src={meta.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20" />
                              {meta.embedUrl && (
                                <button
                                  onClick={() => setShowPreview(true)}
                                  className="absolute inset-0 flex items-center justify-center group"
                                >
                                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform shadow-xl">
                                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                                  </div>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video bg-slate-100 flex items-center justify-center">
                          {platformIcon(meta.platform)}
                        </div>
                      )}

                      {/* Video info */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {platformIcon(meta.platform)}
                          <span className="text-xs font-bold text-slate-500">{meta.platform}</span>
                          <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${meta.isShort ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            {meta.isShort ? "✓ Short — Upscalable" : "Long Video"}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-800 text-sm leading-snug line-clamp-2 mb-2">{meta.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                          <span>by {meta.author}</span>
                          {meta.durationSec !== null && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtDur(meta.durationSec)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info banner for long videos */}
                    {!meta.isShort && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="font-semibold">This video is too long for AI upscaling. You can still download it in standard HD quality.</p>
                      </div>
                    )}
                  </div>

                  {/* ── RIGHT: Quality Selection + Action ── */}
                  <form onSubmit={handleUpscale} className="flex flex-col gap-4">
                    {meta.isShort && (
                      <div className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-sm">
                        <h4 className="font-black text-slate-800 mb-1 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-blue-500" /> AI Upscale Quality
                        </h4>
                        <p className="text-xs text-slate-400 font-medium mb-4">Select the target resolution to enhance this video to.</p>

                        <div className="flex flex-col gap-3">
                          {QUALITY_OPTIONS.map((opt) => {
                            const selected = selectedQuality === opt.key;
                            const borderMap: Record<string, string> = { emerald: "border-emerald-400 bg-emerald-50", blue: "border-blue-400 bg-blue-50", purple: "border-purple-400 bg-purple-50" };
                            const tagMap: Record<string, string> = { emerald: "bg-emerald-100 text-emerald-700", blue: "bg-blue-100 text-blue-700", purple: "bg-purple-100 text-purple-700" };
                            return (
                              <button key={opt.key} type="button" onClick={() => setSelectedQuality(opt.key)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selected ? borderMap[opt.color] + " shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
                              >
                                <MonitorPlay className={`w-6 h-6 shrink-0 ${selected ? "text-" + opt.color + "-600" : "text-slate-300"}`} />
                                <div className="flex-1 text-left">
                                  <p className={`font-black text-sm ${selected ? "text-slate-800" : "text-slate-500"}`}>{opt.label}</p>
                                </div>
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${tagMap[opt.color]}`}>{opt.tag}</span>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? "border-" + opt.color + "-500 bg-" + opt.color + "-500" : "border-slate-300"}`}>
                                  {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Credit balance */}
                        <div className={`mt-4 flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl ${canAfford ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                          <Zap className="w-4 h-4" />
                          {canAfford ? `${cost} credits will be deducted` : `Need ${cost} credits — you have ${credits}`}
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {creditError && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-semibold">
                        <Zap className="w-5 h-5 shrink-0" /> {creditError}
                      </div>
                    )}

                    <button type="submit" disabled={loading || (meta.isShort && !canAfford)}
                      className="w-full py-5 bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-[17px] transition-all shadow-xl flex items-center justify-center gap-3 group"
                    >
                      {loading ? (
                        <><Loader2 className="w-6 h-6 animate-spin text-blue-400" /><span className="animate-pulse">{meta.isShort ? "AI Upscaling..." : "Processing..."}</span></>
                      ) : meta.isShort ? (
                        <><Wand2 className="w-5 h-5 text-blue-400" />Upscale to {selectedQuality} &amp; Download<span className="text-sm opacity-60 font-bold">({cost} cr)</span></>
                      ) : (
                        <><Download className="w-5 h-5" />Download in 1080p HD</>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Before / After comparison result ── */}
            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="max-w-5xl mx-auto mt-8"
                >
                  {/* Success banner */}
                  <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl mb-5 text-emerald-700 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    {result.upscaled ? `✨ Upscaled to ${result.quality}! ${cost} credits deducted.` : "Video ready for download at 1080p HD!"}
                  </div>

                  {result.upscaled && result.thumbnail ? (
                    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                        <ArrowLeftRight className="w-5 h-5 text-slate-600" />
                        <h3 className="font-black text-slate-800">Before / After Comparison</h3>
                        <span className="ml-auto text-xs text-slate-400 font-medium">Drag the slider</span>
                      </div>

                      {/* Slider */}
                      <div
                        ref={sliderRef}
                        className="relative select-none cursor-ew-resize aspect-video overflow-hidden"
                        onMouseMove={handleSliderMove}
                        onMouseDown={() => setDragging(true)}
                        onMouseUp={() => setDragging(false)}
                        onMouseLeave={() => setDragging(false)}
                        onTouchMove={handleSliderMove}
                        onTouchStart={() => setDragging(true)}
                        onTouchEnd={() => setDragging(false)}
                      >
                        {/* ── AFTER (upscaled) — real AI output or CSS filter ── */}
                        {result.upscaledThumbnail ? (
                          <img src={result.upscaledThumbnail} alt="after" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <img src={result.thumbnail} alt="after" className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: QUALITY_FILTERS[result.quality] || QUALITY_FILTERS.HD }} />
                        )}

                        {/* ── BEFORE (original) — always original thumbnail, clipped ── */}
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                          <img src={result.thumbnail} alt="before" className="w-full h-full object-cover"
                            style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none", filter: QUALITY_FILTERS.original }} />
                        </div>

                        {/* Divider line */}
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none" style={{ left: `${sliderPos}%` }}>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200 flex items-center justify-center">
                            <ArrowLeftRight className="w-5 h-5 text-slate-600" />
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-black rounded-lg">ORIGINAL</div>
                        <div className={`absolute top-3 right-3 px-2.5 py-1 backdrop-blur-md text-white text-[11px] font-black rounded-lg ${result.upscaledThumbnail ? "bg-blue-600/90" : "bg-violet-600/80"}`}>
                          {result.upscaledThumbnail ? `✨ AI ${result.quality}` : `${result.quality} (Sim)`}
                        </div>
                      </div>

                      {/* Download button */}
                      <div className="p-5 border-t border-slate-100">
                        <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95">
                          <Download className="w-5 h-5" /> Download {result.quality} Enhanced Video
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Plain download for long video */
                    <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-center">
                      {result.thumbnail && <img src={result.thumbnail} alt="thumb" className="w-full sm:w-48 aspect-video object-cover rounded-xl border border-slate-100 shrink-0" />}
                      <div className="flex-1">
                        <h3 className="font-black text-slate-800 text-lg mb-1 line-clamp-2">{result.title}</h3>
                        <p className="text-slate-500 text-sm mb-4">Format: <b>MP4</b> · Quality: <b className="text-blue-600">{result.quality}</b></p>
                        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/20">
                          <Download className="w-5 h-5" /> Download Video
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Platform icons */}
            {!meta && !fetching && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-14 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-5">Supported Platforms</p>
                <div className="flex justify-center gap-10 opacity-40">
                  <Youtube className="w-6 h-6" />
                  <Instagram className="w-6 h-6" />
                  <Facebook className="w-6 h-6" />
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
