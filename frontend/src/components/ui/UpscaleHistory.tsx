"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History, Zap, Trash2, Youtube, Instagram, Facebook, Globe, Clock, ExternalLink } from "lucide-react";
import type { UpscaleHistoryItem } from "@/hooks/useCredits";

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "YouTube": return <Youtube className="w-4 h-4 text-red-500" />;
    case "Instagram": return <Instagram className="w-4 h-4 text-pink-500" />;
    case "Facebook": return <Facebook className="w-4 h-4 text-blue-500" />;
    default: return <Globe className="w-4 h-4 text-slate-400" />;
  }
}

function qualityColor(q: string) {
  switch (q) {
    case "4K": return "bg-purple-100 text-purple-700";
    case "2K": return "bg-blue-100 text-blue-700";
    case "HD": return "bg-emerald-100 text-emerald-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface Props {
  history: UpscaleHistoryItem[];
  onClear: () => void;
  open: boolean;
  onClose: () => void;
}

export default function UpscaleHistory({ history, onClear, open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-slate-600" />
                <h2 className="font-black text-slate-800 text-xl">Upscale History</h2>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button onClick={onClear} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 font-bold text-sm transition-colors">
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
                    <History className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-semibold text-sm max-w-[200px]">
                    Your upscale history will appear here after you process a video.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {history.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt="thumb"
                            className="w-16 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center">
                            <PlatformIcon platform={item.platform} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <PlatformIcon platform={item.platform} />
                            <span className="text-[11px] font-bold text-slate-400">{item.platform}</span>
                            <span className={`ml-auto text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${qualityColor(item.quality)}`}>
                              {item.quality}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium leading-snug line-clamp-1">
                            {item.url}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                          <Zap className="w-3 h-3" /> -{item.creditsUsed} cr
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <Clock className="w-3 h-3" /> {timeAgo(item.timestamp)}
                        </span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-500 hover:underline font-medium"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
