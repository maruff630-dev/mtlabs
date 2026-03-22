"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, ShoppingBag, Search, Filter, Star,
  Download, Tag, Code2, Palette, Zap, Layout, Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["All", "UI Kits", "Templates", "Source Code", "AI Tools", "Plugins"];

const PRODUCTS = [
  { id: 1, title: "Premium Dashboard UI Kit", desc: "Complete Next.js admin panel with light/dark modes and analytics.", price: 49, cat: "UI Kits", rating: 4.9, sales: 312, img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "SaaS Landing Page Kit", desc: "Beautiful landing page templates built with Tailwind CSS and Framer Motion.", price: 29, cat: "Templates", rating: 4.8, sales: 189, img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "REST API Starter Kit", desc: "Production-ready Express.js + TypeScript API boilerplate with auth.", price: 39, cat: "Source Code", rating: 4.7, sales: 201, img: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=600&auto=format&fit=crop" },
  { id: 4, title: "AI Chat Component Pack", desc: "Plug-and-play React AI chat UI components with streaming support.", price: 59, cat: "AI Tools", rating: 5.0, sales: 98, img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=600&auto=format&fit=crop" },
  { id: 5, title: "E-commerce Template", desc: "Full-stack Next.js e-commerce with Stripe integration and admin panel.", price: 79, cat: "Templates", rating: 4.9, sales: 156, img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop" },
  { id: 6, title: "Design System Library", desc: "100+ accessible React components with Storybook and TypeScript types.", price: 69, cat: "UI Kits", rating: 4.8, sales: 274, img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop" },
];

const CAT_ICONS: Record<string, any> = {
  "UI Kits": <Layout className="w-3.5 h-3.5" />,
  "Templates": <Palette className="w-3.5 h-3.5" />,
  "Source Code": <Code2 className="w-3.5 h-3.5" />,
  "AI Tools": <Sparkles className="w-3.5 h-3.5" />,
  "Plugins": <Zap className="w-3.5 h-3.5" />,
};

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(p =>
    (activeCategory === "All" || p.cat === activeCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold group">
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
            <span className="hidden sm:block">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-black text-slate-800">Marketplace</span>
          </div>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-500/20">
            Sell Product
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2">Digital Marketplace</h1>
          <p className="text-slate-500 text-lg">Buy and sell premium code snippets, templates, and digital assets.</p>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 inset-y-0 my-auto h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-800 font-medium focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm placeholder:text-slate-400" />
          </div>
          <button className="flex items-center gap-2 px-5 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:border-slate-300 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </motion.div>

        {/* Category pills */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}>
              {CAT_ICONS[cat] || null} {cat}
            </button>
          ))}
        </motion.div>

        {/* Products grid */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-bold text-slate-800 rounded-lg">
                  {CAT_ICONS[p.cat]} {p.cat}
                </div>
              </div>
              {/* Info */}
              <div className="p-5">
                <h3 className="text-base font-black text-slate-800 mb-1">{p.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{p.desc}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-4">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {p.rating}
                  <span>·</span>
                  <Download className="w-3.5 h-3.5" /> {p.sales} sales
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-600">${p.price}</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-blue-500/20">
                    <Tag className="w-3.5 h-3.5" /> Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 py-20 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No products found matching your search.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
