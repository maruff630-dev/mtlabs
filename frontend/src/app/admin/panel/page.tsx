"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Users, CheckCircle, XCircle, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminPanel() {
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
            <span className="text-xl font-black text-slate-800 tracking-tight">Admin Portal</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" /> System Administration
            </h1>
            <p className="text-slate-500">Manage users, approve applications, and monitor platform health.</p>
          </div>
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search users or apps..."
              className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Pending Developer Applications</h3>
                <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-xs">3 Pending</span>
              </div>
              <div className="divide-y divide-slate-50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black">
                        NS
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">NextGen Studios {i}</h4>
                        <p className="text-sm text-slate-500">Applied 2 hours ago • Wires & UI Kits</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Reject">
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-slate-700">Total Users</span>
                  </div>
                  <span className="font-black text-slate-800">1,248</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium text-slate-700">Verified Devs</span>
                  </div>
                  <span className="font-black text-slate-800">42</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
