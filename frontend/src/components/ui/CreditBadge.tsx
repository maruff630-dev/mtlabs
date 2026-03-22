"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Check, Coins } from "lucide-react";

interface Plan {
  credits: number;
  price: string;
  badge?: string;
}

const PLANS: Plan[] = [
  { credits: 2000,  price: "350 BDT" },
  { credits: 10000, price: "1,200 BDT", badge: "Popular" },
  { credits: 50000, price: "5,000 BDT", badge: "Best Value" },
];

interface CreditBadgeProps {
  credits: number;
  onBuy: (amount: number) => void;
}

export default function CreditBadge({ credits, onBuy }: CreditBadgeProps) {
  const [open, setOpen] = useState(false);
  const [bought, setBought] = useState<number | null>(null);

  const handleBuy = (plan: Plan) => {
    onBuy(plan.credits);
    setBought(plan.credits);
    setTimeout(() => {
      setBought(null);
      setOpen(false);
    }, 1800);
  };

  return (
    <>
      {/* Badge */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors group"
        title="Your credits — click to buy more"
      >
        <Zap className="w-4 h-4 text-amber-500 group-hover:animate-bounce" />
        <span className="font-black text-amber-700 text-sm tabular-nums">{credits.toLocaleString()}</span>
        <span className="hidden sm:block text-xs font-semibold text-amber-500">Credits</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-[28px] shadow-2xl border border-slate-100 w-full max-w-md pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-8 pt-8 pb-6 border-b border-amber-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">Buy Credits</h2>
                      </div>
                      <p className="text-slate-500 text-sm font-medium">Current balance: <b className="text-amber-600">{credits.toLocaleString()}</b> credits</p>
                    </div>
                    <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/70 rounded-xl transition-colors">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Plans */}
                <div className="p-6 flex flex-col gap-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.credits}
                      onClick={() => handleBuy(plan)}
                      disabled={bought !== null}
                      className={`relative w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all group overflow-hidden
                        ${bought === plan.credits
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30 hover:shadow-md"
                        }`}
                    >
                      {plan.badge && (
                        <span className="absolute top-2.5 right-14 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full">
                          {plan.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        {bought === plan.credits ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors shrink-0">
                            <Zap className="w-4 h-4 text-amber-600" />
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-black text-slate-800 text-lg">{plan.credits.toLocaleString()} Credits</div>
                          <div className="text-xs text-slate-400">
                            ৳{(parseInt(plan.price) / plan.credits * 100).toFixed(2)} per 100 cr
                          </div>
                        </div>
                      </div>
                      <span className={`font-bold text-base ${bought === plan.credits ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {bought === plan.credits ? "Added!" : plan.price}
                      </span>
                    </button>
                  ))}

                  <p className="text-center text-xs text-slate-400 mt-2 font-medium">
                    Credits are used for HD, 2K & 4K video upscaling. No expiry.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
