"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Download, Link as LinkIcon, Loader2, Play, Clock,
  Music2, CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";

interface TikTokData {
  title: string;
  author: string;
  thumbnail: string | null;
  downloadUrl: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
}

function fmtDur(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<TikTokData | null>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetchTimer = { current: null as ReturnType<typeof setTimeout> | null };

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const fetchTikTok = async (link: string) => {
    if (!link || !link.includes("tiktok.com")) { setData(null); setError(""); return; }
    setFetching(true); setError(""); setData(null); setDownloaded(false);
    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const json = await res.json();
      if (json.error) { setError(json.error); }
      else { setData(json); }
    } catch {
      setError("Failed to fetch video. Please check the URL.");
    } finally {
      setFetching(false);
    }
  };

  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => fetchTikTok(val), 700);
  };

  const handleDownload = async () => {
    if (!data?.downloadUrl) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.downloadUrl }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${data.title.slice(0, 40).replace(/[^a-z0-9]/gi, "_")}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        setDownloaded(true);
      } else {
        window.open(data.downloadUrl, "_blank");
      }
    } catch {
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a0a2e 50%, #0d1117 100%)" }}>
      {/* Navbar */}
      <nav className="border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl bg-black/30">
        <div className="max-w-4xl mx-auto px-6 h-18 flex items-center justify-between gap-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-semibold group">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
            <span className="hidden sm:block text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-lg flex items-center gap-2">
              <Music2 className="w-5 h-5 text-pink-400" /> TikTok Downloader
            </span>
          </div>
          <div className="p-1 bg-white/10 rounded-full">
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }} className="text-center mb-10">
          <div className="w-20 h-20 rounded-[28px] mx-auto mb-5 flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #ff0050, #00f2ea)" }}>
            <Music2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            TikTok <span style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(90deg, #ff0050, #00f2ea)", backgroundClip: "text" }}>Downloader</span>
          </h1>
          <p className="text-white/50 font-medium">Download TikTok videos without watermark. Paste any TikTok link below.</p>
        </motion.div>

        {/* URL Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <LinkIcon className={`h-5 w-5 transition-colors ${url ? "text-pink-400" : "text-white/30"}`} />
            </div>
            <input
              type="url" value={url} onChange={e => handleUrlChange(e.target.value)}
              placeholder="Paste TikTok video link here..."
              className="w-full pl-14 pr-20 py-5 rounded-2xl text-base text-white font-medium placeholder:text-white/30 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "2px solid rgba(255,255,255,0.12)",
                boxShadow: url ? "0 0 0 4px rgba(255,0,80,0.12)" : "none",
                borderColor: url ? "rgba(255,0,80,0.5)" : "rgba(255,255,255,0.12)",
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
              {fetching && <Loader2 className="w-5 h-5 text-pink-400 animate-spin" />}
              {url && !fetching && (
                <button onClick={() => { setUrl(""); setData(null); setError(""); setDownloaded(false); }}
                  className="text-white/40 hover:text-white font-bold text-sm px-2 transition-colors">Clear</button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl mb-4 text-red-300 font-semibold text-sm"
              style={{ background: "rgba(255,0,80,0.1)", border: "1px solid rgba(255,0,80,0.25)" }}>
              <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Card */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }} className="rounded-[28px] overflow-hidden shadow-2xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              {/* Thumbnail */}
              <div className="relative" style={{ aspectRatio: data.width && data.height ? `${data.width}/${data.height}` : "9/16", maxHeight: "480px", overflow: "hidden" }}>
                {data.thumbnail ? (
                  <img src={data.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ff0050, #00f2ea)" }}>
                    <Music2 className="w-16 h-16 text-white/40" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%)" }} />

                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.3)" }}>
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* Duration badge */}
                {data.duration && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-bold"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
                    <Clock className="w-3 h-3" /> {fmtDur(data.duration)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Music2 className="w-4 h-4 text-pink-400" />
                  <span className="text-white/50 text-xs font-bold">@{data.author}</span>
                </div>
                <h3 className="text-white font-black text-base leading-snug line-clamp-2 mb-5">{data.title}</h3>

                {/* No-watermark badge */}
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(0,242,234,0.1)", border: "1px solid rgba(0,242,234,0.2)", color: "#00f2ea" }}>
                  <CheckCircle2 className="w-4 h-4" />
                  No watermark · HD quality
                </div>

                {/* Download button */}
                {data.downloadUrl ? (
                  <button onClick={handleDownload} disabled={downloading}
                    className="w-full py-4 font-black text-[15px] text-white rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: downloaded ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #ff0050, #ff6b35)",
                      boxShadow: "0 8px 32px rgba(255,0,80,0.3)",
                    }}
                  >
                    {downloading
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Downloading...</>
                      : downloaded
                      ? <><CheckCircle2 className="w-5 h-5" /> Downloaded!</>
                      : <><Download className="w-5 h-5" /> Download Without Watermark</>
                    }
                  </button>
                ) : (
                  <div className="w-full py-4 text-center text-white/40 font-semibold text-sm rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    Download link unavailable for this video
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guide */}
        {!data && !fetching && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-4 text-center">
            {["Copy TikTok link", "Paste it above", "Download instantly"].map((step, i) => (
              <div key={i} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-black text-sm"
                  style={{ background: "linear-gradient(135deg, #ff0050, #00f2ea)", color: "white" }}>{i + 1}</div>
                <p className="text-white/60 text-xs font-semibold">{step}</p>
              </div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
