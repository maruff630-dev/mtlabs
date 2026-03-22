"use client";

import { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Download, Youtube, Instagram, Facebook, Link as LinkIcon,
  Loader2, Wand2, Sparkles, MonitorPlay, Zap, Play, History,
  CheckCircle2, Clock, Info, ArrowLeftRight, Globe, ChevronUp
} from "lucide-react";
import Link from "next/link";
import { Skeleton, SkeletonText, SkeletonBanner } from "@/components/ui/Skeleton";
import CreditBadge from "@/components/ui/CreditBadge";
import UpscaleHistory from "@/components/ui/UpscaleHistory";
import { useCredits, UPSCALE_COSTS, type UpscaleQuality } from "@/hooks/useCredits";

// ─── Types ─────────────────────────────────────────────────────────────
interface VideoMeta {
  platform: "YouTube" | "YouTube Shorts" | "TikTok" | "Instagram" | "Facebook" | "Unknown";
  id?: string;
  thumbnail: string;
  title: string;
  author: string;
  durationSec: number | null;
  isShort: boolean;
  embedUrl?: string;
  directUrl?: string; // best-effort direct download URL
}

const QUALITY_OPTIONS: { key: UpscaleQuality; label: string; color: string; ring: string }[] = [
  { key: "HD",  label: "HD",  color: "bg-emerald-500", ring: "ring-emerald-400" },
  { key: "2K",  label: "2K",  color: "bg-blue-600",    ring: "ring-blue-400"   },
  { key: "4K",  label: "4K",  color: "bg-violet-600",  ring: "ring-violet-400" },
];

const QUALITY_FILTERS: Record<string, string> = {
  original: "blur(0.6px) contrast(0.82) saturate(0.75) brightness(0.97)",
  HD:  "contrast(1.08) saturate(1.1) brightness(1.02)",
  "2K": "contrast(1.12) saturate(1.18) brightness(1.03)",
  "4K": "contrast(1.18) saturate(1.28) brightness(1.04)",
};

const COST_LABELS: Record<UpscaleQuality, string> = { HD: "100 cr", "2K": "300 cr", "4K": "500 cr" };

// ─── Fetch metadata ─────────────────────────────────────────────────
async function fetchVideoMeta(url: string): Promise<VideoMeta | null> {
  try {
    // YouTube Shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
    if (shortsMatch) {
      const id = shortsMatch[1];
      const oembed = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => ({}));
      return {
        platform: "YouTube Shorts", id,
        thumbnail: oembed.thumbnail_url || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        title: oembed.title || "YouTube Shorts",
        author: oembed.author_name || "YouTube",
        durationSec: 30, isShort: true,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0`,
        directUrl: url,
      };
    }
    // Regular YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      const id = ytMatch[1];
      const oembed = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => ({}));
      return {
        platform: "YouTube", id,
        thumbnail: oembed.thumbnail_url || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        title: oembed.title || "YouTube Video",
        author: oembed.author_name || "YouTube",
        durationSec: null, isShort: false,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=0`,
        directUrl: url,
      };
    }
    // TikTok
    if (url.includes("tiktok.com")) {
      const oembed = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`).then(r => r.json()).catch(() => ({}));
      // Try multiple thumbnail sources for TikTok
      const thumb = oembed.thumbnail_url || "";
      return {
        platform: "TikTok",
        thumbnail: thumb,
        title: oembed.title || "TikTok Video",
        author: oembed.author_name || "TikTok",
        durationSec: 30, isShort: true,
        directUrl: url,
      };
    }
    // Instagram
    if (url.includes("instagram.com")) {
      return { platform: "Instagram", thumbnail: "", title: "Instagram Reel", author: "Instagram", durationSec: 30, isShort: true, directUrl: url };
    }
    // Facebook
    if (url.includes("facebook.com")) {
      return { platform: "Facebook", thumbnail: "", title: "Facebook Video", author: "Facebook", durationSec: null, isShort: false, directUrl: url };
    }
    return null;
  } catch { return null; }
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

// ─── Download handler ────────────────────────────────────────────────
async function triggerDownload(videoUrl: string) {
  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "video.mp4";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } else {
      // Fallback: open in new tab
      window.open(videoUrl, "_blank");
    }
  } catch {
    window.open(videoUrl, "_blank");
  }
}

// ─── Main Component ─────────────────────────────────────────────────
export default function VideoDownloader() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<UpscaleQuality>("HD");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [creditError, setCreditError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showUpscaleOptions, setShowUpscaleOptions] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { credits, history, hydrated, addCredits, deductCredits, addHistoryItem, clearHistory } = useCredits();
  const cost = UPSCALE_COSTS[selectedQuality];
  const canAfford = credits >= cost;

  useEffect(() => {
    const t = setTimeout(() => setIsDataLoaded(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    setMeta(null); setResult(null); setCreditError(""); setShowPreview(false); setShowUpscaleOptions(false);
    if (!url) return;
    fetchTimer.current = setTimeout(async () => {
      setFetching(true);
      const m = await fetchVideoMeta(url);
      setMeta(m);
      setFetching(false);
    }, 600);
    return () => { if (fetchTimer.current) clearTimeout(fetchTimer.current); };
  }, [url]);

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setSliderPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const handleDownload = async () => {
    if (!url) return;
    setDownloading(true);
    await triggerDownload(url);
    setDownloading(false);
  };

  const handleUpscale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !meta) return;
    setCreditError("");
    const ok = deductCredits(selectedQuality);
    if (!ok) { setCreditError(`Need ${cost} credits. Buy more credits.`); return; }
    setLoading(true);
    setShowUpscaleOptions(false);
    try {
      let upscaledUrl: string | null = null;
      const res = await fetch("/api/upscale/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url, quality: selectedQuality }),
      });
      const data = await res.json();
      if (data.url) upscaledUrl = data.url;
      setResult({ title: meta.title, thumbnail: meta.thumbnail, upscaledThumbnail: upscaledUrl, quality: selectedQuality, platform: meta.platform, duration: meta.durationSec });
      addHistoryItem({ url, platform: meta.platform, thumbnail: meta.thumbnail, quality: selectedQuality, creditsUsed: cost, duration: meta.durationSec || 0 });
    } catch {
      setResult({ title: meta.title, thumbnail: meta.thumbnail, upscaledThumbnail: null, quality: selectedQuality, platform: meta.platform, duration: meta.durationSec });
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
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black mb-3 text-slate-800 tracking-tight">
                Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Video Studio</span>
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-500 text-base font-medium">
                Paste any video URL — auto-detected. Short videos (≤30s) are AI-upscalable.
              </motion.p>
            </div>

            {/* URL Input */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <LinkIcon className={`h-5 w-5 transition-colors ${url ? "text-blue-500" : "text-slate-300"}`} />
                </div>
                <input
                  type="url" value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="Paste YouTube, TikTok, Instagram or Facebook URL..."
                  className="w-full pl-14 pr-20 py-5 bg-white border-2 border-slate-200 rounded-2xl text-base text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-400 shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                  {fetching && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                  {url && !fetching && <button type="button" onClick={() => setUrl("")} className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2">Clear</button>}
                </div>
              </div>
            </motion.div>

            {/* Split layout */}
            <AnimatePresence>
              {meta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
                >
                  {/* ── LEFT: Thumbnail + Info ── */}
                  <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
                      {meta.thumbnail ? (
                        <div className="relative aspect-video bg-black">
                          {showPreview && meta.embedUrl ? (
                            <iframe src={meta.embedUrl + "&autoplay=1"} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
                          ) : (
                            <>
                              <img src={meta.thumbnail} alt="thumbnail" className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              <div className="absolute inset-0 bg-black/20" />
                              {meta.embedUrl && (
                                <button onClick={() => setShowPreview(true)} className="absolute inset-0 flex items-center justify-center group">
                                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform shadow-xl">
                                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                                  </div>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-3">
                          {platformIcon(meta.platform)}
                          <p className="text-slate-400 text-xs font-semibold">No preview available</p>
                        </div>
                      )}
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
                          {meta.durationSec !== null && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtDur(meta.durationSec)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT: Action Panel ── */}
                  <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-sm">
                      <h4 className="font-black text-slate-800 mb-1 flex items-center gap-2">
                        <MonitorPlay className="w-5 h-5 text-slate-600" /> What would you like to do?
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mb-5">Download or AI-enhance this video.</p>

                      <div className="flex flex-col gap-3">
                        {/* DOWNLOAD */}
                        <button type="button" onClick={handleDownload} disabled={downloading}
                          className="w-full py-4 flex items-center justify-center gap-3 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white rounded-2xl font-black text-[15px] transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
                        >
                          {downloading
                            ? <><Loader2 className="w-5 h-5 animate-spin" />Downloading...</>
                            : <><Download className="w-5 h-5" />Download</>
                          }
                        </button>

                        {/* UPSCALE toggle button + inline quality chips */}
                        {meta.isShort && (
                          <div className="flex flex-col gap-2">
                            <button type="button" onClick={() => setShowUpscaleOptions(prev => !prev)}
                              className={`w-full py-4 flex items-center justify-center gap-3 text-white rounded-2xl font-black text-[15px] transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 ${showUpscaleOptions ? "bg-violet-700 shadow-violet-500/20" : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-blue-500/20"}`}
                            >
                              {showUpscaleOptions
                                ? <><ChevronUp className="w-5 h-5" />Hide Upscale Options</>
                                : <><Wand2 className="w-5 h-5" />✨ Upscale</>}
                            </button>

                            {/* Inline quality chips — expand below the button */}
                            <AnimatePresence>
                              {showUpscaleOptions && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <form onSubmit={handleUpscale} className="flex flex-col gap-3 pt-1">
                                    {/* 3 quality chips in a row */}
                                    <div className="grid grid-cols-3 gap-2">
                                      {QUALITY_OPTIONS.map(opt => {
                                        const selected = selectedQuality === opt.key;
                                        return (
                                          <button key={opt.key} type="button" onClick={() => setSelectedQuality(opt.key)}
                                            className={`py-3 rounded-xl font-black text-sm transition-all border-2 flex flex-col items-center gap-0.5
                                              ${selected
                                                ? `${opt.color} text-white border-transparent shadow-md scale-[1.03]`
                                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                              }`}
                                          >
                                            <span className="text-[15px]">{opt.label}</span>
                                            <span className={`text-[10px] font-bold ${selected ? "text-white/80" : "text-slate-400"}`}>{COST_LABELS[opt.key]}</span>
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Credit info */}
                                    <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl ${canAfford ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                                      <Zap className="w-4 h-4 shrink-0" />
                                      {canAfford ? `${cost} credits will be deducted (${credits} available)` : `Need ${cost} credits — you have ${credits}`}
                                    </div>

                                    {creditError && (
                                      <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold">
                                        <Zap className="w-4 h-4 shrink-0" /> {creditError}
                                      </div>
                                    )}

                                    <button type="submit" disabled={loading || !canAfford}
                                      className="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-[15px] transition-all shadow-xl flex items-center justify-center gap-3"
                                    >
                                      {loading
                                        ? <><Loader2 className="w-5 h-5 animate-spin text-blue-400" /><span className="animate-pulse">AI Upscaling...</span></>
                                        : <><Wand2 className="w-5 h-5 text-blue-400" />Upscale to {selectedQuality} <span className="text-sm opacity-60">({cost} cr)</span></>
                                      }
                                    </button>
                                  </form>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Long video notice */}
                    {!meta.isShort && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="font-semibold">Video is longer than 30s — AI upscaling not available.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Before / After result ── */}
            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto mt-8">
                  <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl mb-5 text-emerald-700 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    {`✨ Upscaled to ${result.quality}! ${UPSCALE_COSTS[result.quality as UpscaleQuality]} credits deducted.`}
                  </div>
                  {result.thumbnail && (
                    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                        <ArrowLeftRight className="w-5 h-5 text-slate-600" />
                        <h3 className="font-black text-slate-800">Before / After Comparison</h3>
                        <span className="ml-auto text-xs text-slate-400 font-medium">Drag the slider</span>
                      </div>
                      <div ref={sliderRef} className="relative select-none cursor-ew-resize aspect-video overflow-hidden"
                        onMouseMove={handleSliderMove} onMouseDown={() => setDragging(true)}
                        onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
                        onTouchMove={handleSliderMove} onTouchStart={() => setDragging(true)} onTouchEnd={() => setDragging(false)}
                      >
                        {result.upscaledThumbnail
                          ? <img src={result.upscaledThumbnail} alt="after" className="absolute inset-0 w-full h-full object-cover" />
                          : <img src={result.thumbnail} alt="after" className="absolute inset-0 w-full h-full object-cover" style={{ filter: QUALITY_FILTERS[result.quality] || QUALITY_FILTERS.HD }} />
                        }
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                          <img src={result.thumbnail} alt="before" className="w-full h-full object-cover"
                            style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none", filter: QUALITY_FILTERS.original }} />
                        </div>
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none" style={{ left: `${sliderPos}%` }}>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200 flex items-center justify-center">
                            <ArrowLeftRight className="w-5 h-5 text-slate-600" />
                          </div>
                        </div>
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-black rounded-lg">ORIGINAL</div>
                        <div className={`absolute top-3 right-3 px-2.5 py-1 backdrop-blur-md text-white text-[11px] font-black rounded-lg ${result.upscaledThumbnail ? "bg-blue-600/90" : "bg-violet-600/80"}`}>
                          {result.upscaledThumbnail ? `✨ AI ${result.quality}` : `${result.quality} (Sim)`}
                        </div>
                      </div>
                      <div className="p-5 border-t border-slate-100">
                        <button type="button" onClick={() => triggerDownload(result.upscaledThumbnail || result.thumbnail)}
                          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                          <Download className="w-5 h-5" /> Download {result.quality} Enhanced Video
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!meta && !fetching && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-14 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-5">Supported Platforms</p>
                <div className="flex justify-center gap-10 opacity-40">
                  <Youtube className="w-6 h-6" /><Instagram className="w-6 h-6" /><Facebook className="w-6 h-6" />
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
