"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Users, CheckCircle, XCircle, Search, Bell, Package,
  Code2, LogOut, BanIcon, UserCheck, Send, ChevronRight, X, Menu,
  Sparkles, AlertTriangle, Eye, Clock, Trash2
} from "lucide-react";
import Image from "next/image";

const ADMIN_SESSION_KEY = "mtlabs_admin_session";

// ---------- Simulated persistent data via localStorage ----------
const DATA_KEY = "mtlabs_admin_data";

interface User {
  id: string;
  name: string;
  email: string;
  joined: string;
  status: "active" | "blocked";
  role: "user" | "developer";
  credits: number;
}

interface DeveloperApplication {
  id: string;
  name: string;
  email: string;
  appName: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
}

interface ProductApp {
  id: string;
  developerName: string;
  appName: string;
  category: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  type: "info" | "warning" | "update";
}

interface AdminData {
  users: User[];
  developerApps: DeveloperApplication[];
  productApps: ProductApp[];
  broadcasts: BroadcastMessage[];
}

const DEFAULT_DATA: AdminData = {
  users: [
    { id: "1", name: "Maruf Hasan", email: "promaruf007@gmail.com", joined: "2026-03-20", status: "active", role: "user", credits: 1000 },
    { id: "2", name: "Rafiq Ahmed",  email: "rafiq@gmail.com",        joined: "2026-03-18", status: "active", role: "developer", credits: 5000 },
    { id: "3", name: "Tamim Islam",  email: "tamim@gmail.com",        joined: "2026-03-15", status: "blocked", role: "user", credits: 200 },
    { id: "4", name: "Nadia Khanom", email: "nadia@gmail.com",        joined: "2026-03-10", status: "active", role: "user", credits: 800 },
  ],
  developerApps: [
    { id: "1", name: "Sabbir Rahman", email: "sabbir@gmail.com", appName: "PayKit SDK",   description: "A mobile payment SDK for developers",         status: "pending",  appliedAt: "2026-03-22" },
    { id: "2", name: "Lina Akter",    email: "lina@gmail.com",   appName: "UI Components", description: "Premium React UI library with 50+ components", status: "pending",  appliedAt: "2026-03-21" },
    { id: "3", name: "Karim Hossain", email: "karim@gmail.com",  appName: "BotBuilder",   description: "No-code Telegram bot builder",                 status: "approved", appliedAt: "2026-03-19" },
  ],
  productApps: [
    { id: "1", developerName: "Rafiq Ahmed", appName: "DataSync Pro",   category: "SaaS Tool",    description: "Real-time database sync tool",   status: "pending",  submittedAt: "2026-03-22" },
    { id: "2", developerName: "Karim Hossain", appName: "BotBuilder v1", category: "Automation",  description: "Telegram bot automation platform", status: "pending",  submittedAt: "2026-03-21" },
    { id: "3", developerName: "Rafiq Ahmed", appName: "StatsBoard",      category: "Analytics",   description: "Real-time analytics dashboard",  status: "approved", submittedAt: "2026-03-18" },
  ],
  broadcasts: [
    { id: "1", title: "Welcome to MT Labs!",    message: "Thank you for joining our platform. Enjoy 1000 free credits!", sentAt: "2026-03-20", type: "info" },
    { id: "2", title: "Maintenance Notice",     message: "Scheduled maintenance on March 25, 2-4 AM BST.",               sentAt: "2026-03-21", type: "warning" },
  ],
};

function loadData(): AdminData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const stored = localStorage.getItem(DATA_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DATA;
  } catch { return DEFAULT_DATA; }
}

function saveData(data: AdminData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }
}

// ---------- Sub-components ----------
const TABS = [
  { key: "users",      label: "User Management", icon: Users },
  { key: "developers", label: "Developer Approvals", icon: Code2 },
  { key: "products",   label: "Product & Apps", icon: Package },
  { key: "broadcast",  label: "Broadcast", icon: Bell },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active:   "bg-emerald-100 text-emerald-700",
    blocked:  "bg-red-100 text-red-700",
    pending:  "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-slate-100 text-slate-500",
    developer:"bg-violet-100 text-violet-700",
  };
  return map[status] || "bg-slate-100 text-slate-600";
}

// ==============================
export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState<AdminData>(DEFAULT_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Broadcast compose state
  const [bcTitle, setBcTitle] = useState("");
  const [bcMessage, setBcMessage] = useState("");
  const [bcType, setBcType] = useState<"info" | "warning" | "update">("info");
  const [bcSent, setBcSent] = useState(false);

  // Session guard
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem(ADMIN_SESSION_KEY) !== "true") {
        router.replace("/admin/login");
      } else {
        setData(loadData());
      }
    }
  }, [router]);

  const persist = (d: AdminData) => { setData(d); saveData(d); };

  // User management
  const toggleUserBlock = (userId: string) => {
    const updated = { ...data, users: data.users.map(u => u.id === userId ? { ...u, status: u.status === "blocked" ? "active" : "blocked" } as User : u) };
    persist(updated);
  };

  // Developer approvals
  const handleDevApp = (id: string, action: "approved" | "rejected") => {
    const updated = { ...data, developerApps: data.developerApps.map(a => a.id === id ? { ...a, status: action } : a) };
    persist(updated);
  };

  // Product approvals
  const handleProdApp = (id: string, action: "approved" | "rejected") => {
    const updated = { ...data, productApps: data.productApps.map(a => a.id === id ? { ...a, status: action } : a) };
    persist(updated);
  };

  // Broadcast send
  const sendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const newBc: BroadcastMessage = {
      id: crypto.randomUUID(),
      title: bcTitle,
      message: bcMessage,
      type: bcType,
      sentAt: new Date().toISOString().split("T")[0],
    };
    const updated = { ...data, broadcasts: [newBc, ...data.broadcasts] };
    persist(updated);
    setBcTitle(""); setBcMessage(""); setBcSent(true);
    setTimeout(() => setBcSent(false), 2500);
  };

  const deleteBroadcast = (id: string) => {
    persist({ ...data, broadcasts: data.broadcasts.filter(b => b.id !== id) });
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin/login");
  };

  // Filtered users
  const filteredUsers = data.users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingDevs = data.developerApps.filter(a => a.status === "pending").length;
  const pendingProds = data.productApps.filter(a => a.status === "pending").length;

  // ---- Render ----
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mr-3 shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-base leading-none tracking-tight">MT Labs</p>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-0.5">Admin Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {TABS.map((tab) => {
            const pending = tab.key === "developers" ? pendingDevs : tab.key === "products" ? pendingProds : 0;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === tab.key ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <tab.icon className="w-5 h-5 shrink-0" />
                <span>{tab.label}</span>
                {pending > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center">
                    {pending}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-slate-800">Super Admin</span>
              <span className="text-[10px] text-slate-400 font-medium">admin@gmail.com</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black text-xs shrink-0">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* ============ USER MANAGEMENT ============ */}
              {activeTab === "users" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <Users className="w-7 h-7 text-blue-600" /> User Management
                      </h1>
                      <p className="text-slate-500 text-sm mt-1">{data.users.length} total registered users</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                      {data.users.filter(u => u.status === "active").length} Active
                    </span>
                  </div>

                  <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">User</th>
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Role</th>
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Credits</th>
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Joined</th>
                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                                    {user.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                                    <p className="text-xs text-slate-400">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge(user.role)}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-slate-700 text-sm">{user.credits.toLocaleString()}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs text-slate-400 font-medium">{user.joined}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge(user.status)}`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => toggleUserBlock(user.id)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ml-auto ${user.status === "blocked"
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-red-50 text-red-600 hover:bg-red-100"
                                  }`}
                                >
                                  {user.status === "blocked" ? <><UserCheck className="w-4 h-4" /> Unblock</> : <><BanIcon className="w-4 h-4" /> Block</>}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ DEVELOPER APPROVALS ============ */}
              {activeTab === "developers" && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <Code2 className="w-7 h-7 text-violet-600" /> Developer Approvals
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{pendingDevs} pending applications</p>
                  </div>

                  <div className="space-y-4">
                    {data.developerApps.map((app) => (
                      <div key={app.id} className="bg-white rounded-[20px] border border-slate-200 p-6 flex flex-col sm:flex-row gap-4 sm:items-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 font-black text-lg shrink-0">
                          {app.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-slate-800">{app.name}</h3>
                            <span className="text-slate-400 text-xs">{app.email}</span>
                          </div>
                          <p className="font-black text-slate-700 text-sm">{app.appName}</p>
                          <p className="text-slate-500 text-xs mt-1">{app.description}</p>
                          <p className="text-slate-400 text-[10px] mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Applied: {app.appliedAt}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge(app.status)}`}>
                            {app.status}
                          </span>
                          {app.status === "pending" && (
                            <>
                              <button onClick={() => handleDevApp(app.id, "approved")} className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleDevApp(app.id, "rejected")} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============ PRODUCT & APPS ============ */}
              {activeTab === "products" && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <Package className="w-7 h-7 text-emerald-600" /> Product & Apps Approval
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{pendingProds} products awaiting review</p>
                  </div>

                  <div className="space-y-4">
                    {data.productApps.map((app) => (
                      <div key={app.id} className="bg-white rounded-[20px] border border-slate-200 p-6 flex flex-col sm:flex-row gap-4 sm:items-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-lg shrink-0">
                          {app.appName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-slate-800">{app.appName}</h3>
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-full">{app.category}</span>
                          </div>
                          <p className="text-slate-500 text-xs">{app.description}</p>
                          <p className="text-slate-400 text-[10px] mt-2 flex items-center gap-1"><Code2 className="w-3 h-3" /> By: {app.developerName} · Submitted: {app.submittedAt}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge(app.status)}`}>
                            {app.status}
                          </span>
                          {app.status === "pending" && (
                            <>
                              <button onClick={() => handleProdApp(app.id, "approved")} className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleProdApp(app.id, "rejected")} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============ BROADCAST ============ */}
              {activeTab === "broadcast" && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <Bell className="w-7 h-7 text-blue-600" /> Broadcast Message
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Send announcements to all platform users</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Compose */}
                    <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
                      <h2 className="font-black text-slate-800 text-lg mb-5 flex items-center gap-2"><Send className="w-5 h-5 text-blue-500" /> Compose Broadcast</h2>
                      <form onSubmit={sendBroadcast} className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Type</label>
                          <div className="flex gap-2">
                            {(["info", "warning", "update"] as const).map((t) => (
                              <button key={t} type="button" onClick={() => setBcType(t)}
                                className={`px-4 py-2 rounded-xl text-xs font-black capitalize transition-all border ${bcType === t ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Title</label>
                          <input
                            type="text"
                            value={bcTitle}
                            onChange={(e) => setBcTitle(e.target.value)}
                            placeholder="Broadcast title..."
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Message</label>
                          <textarea
                            value={bcMessage}
                            onChange={(e) => setBcMessage(e.target.value)}
                            placeholder="Write your broadcast message..."
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium resize-none"
                          />
                        </div>
                        <button type="submit" disabled={bcSent}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${bcSent ? "bg-emerald-500 text-white" : "bg-slate-900 hover:bg-black text-white"}`}>
                          {bcSent ? (<><CheckCircle className="w-5 h-5" /> Sent Successfully!</>) : (<><Send className="w-4 h-4" /> Send Broadcast</>)}
                        </button>
                      </form>
                    </div>

                    {/* History */}
                    <div>
                      <h2 className="font-black text-slate-800 text-lg mb-5 flex items-center gap-2"><Clock className="w-5 h-5 text-slate-600" /> Sent Broadcasts</h2>
                      <div className="space-y-3">
                        {data.broadcasts.map((bc) => (
                          <div key={bc.id} className={`bg-white rounded-2xl border p-4 ${bc.type === "warning" ? "border-amber-200 bg-amber-50/30" : bc.type === "update" ? "border-blue-200 bg-blue-50/30" : "border-slate-200"}`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${bc.type === "warning" ? "bg-amber-100 text-amber-700" : bc.type === "update" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                                  {bc.type}
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm">{bc.title}</h4>
                              </div>
                              <button onClick={() => deleteBroadcast(bc.id)} className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mb-2 leading-relaxed">{bc.message}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {bc.sentAt}</p>
                          </div>
                        ))}
                        {data.broadcasts.length === 0 && (
                          <p className="text-slate-400 text-sm text-center py-10">No broadcasts sent yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
