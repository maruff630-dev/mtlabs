"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Sparkles, Wand2, Image as ImageIcon, FileText,
  Mic, Code2, MessageSquare, Zap, ArrowRight, Lock
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const TOOLS = [
  {
    id: "text",
    icon: <MessageSquare className="w-7 h-7" />,
    label: "AI Chat",
    desc: "Intelligent conversation powered by advanced language models.",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "Available",
    href: null,
  },
  {
    id: "image",
    icon: <ImageIcon className="w-7 h-7" />,
    label: "AI Image Generator",
    desc: "Generate stunning images from text prompts using DALL·E and Stable Diffusion.",
    gradient: "from-violet-500 to-pink-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    badge: "Available",
    href: null,
  },
  {
    id: "code",
    icon: <Code2 className="w-7 h-7" />,
    label: "Code Assistant",
    desc: "Review, refactor, debug, and generate code in any language.",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    badge: "Available",
    href: null,
  },
  {
    id: "doc",
    icon: <FileText className="w-7 h-7" />,
    label: "Document AI",
    desc: "Summarize, translate, and extract insights from PDFs and documents.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    badge: "Soon",
    href: null,
  },
  {
    id: "voice",
    icon: <Mic className="w-7 h-7" />,
    label: "Voice Studio",
    desc: "Text-to-speech and speech-to-text with multilingual support.",
    gradient: "from-rose-500 to-red-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    badge: "Soon",
    href: null,
  },
  {
    id: "auto",
    icon: <Zap className="w-7 h-7" />,
    label: "AI Automations",
    desc: "Build no-code AI workflows and automations for your apps.",
    gradient: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    badge: "Soon",
    href: null,
  },
];

const BADGE_STYLES: Record<string, string> = {
  "Available": "bg-emerald-100 text-emerald-700",
  "Soon": "bg-slate-100 text-slate-500",
};

export default function AIStudio() {
  const [active, setActive] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [thinking, setThinking] = useState(false);
  const [imgPrompt, setImgPrompt] = useState("");
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  const handleChat = async () => {
    if (!chatInput.trim() || thinking) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    
    // 1. Add user message
    const newMessages: { role: "user" | "assistant"; content: string }[] = [
      ...messages,
      { role: "user", content: userMsg }
    ];
    setMessages(newMessages);
    setThinking(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "AI failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      setThinking(false);
      
      // 2. Add empty assistant message to start streaming into
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.trim().startsWith("data: "));
        
        for (const line of lines) {
          const dataStr = line.replace("data: ", "").trim();
          if (dataStr === "[DONE]") continue;
          
          try {
            const data = JSON.parse(dataStr);
            const content = data.choices[0]?.delta?.content || "";
            fullContent += content;
            
            // 3. Update the last message in state
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content = fullContent;
              return updated;
            });
          } catch (e) {
            console.error("error parsing stream chunk", e);
          }
        }
      }
    } catch (err: any) {
      setThinking(false);
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message || "Failed to get response"}` }]);
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
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <span className="text-xl font-black text-slate-800">AI Studio</span>
          </div>
          <div className="p-1 bg-white rounded-full shadow-sm border border-slate-100 scale-110"><UserButton /></div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-violet-500 to-blue-600 rounded-[28px] flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-violet-500/20">
            <Wand2 className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black mb-3 text-slate-800 tracking-tight">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Studio</span>
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-500 text-lg font-medium">
            Your all-in-one AI toolkit. Generate, create, and automate with AI.
          </motion.p>
        </div>

        {/* Tool cards grid */}
        {!active && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((tool, i) => (
              <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => tool.badge === "Available" && setActive(tool.id)}
                className={`relative rounded-3xl border-2 p-6 transition-all group ${tool.badge === "Available" ? "cursor-pointer hover:shadow-xl hover:-translate-y-1" : "opacity-60 cursor-not-allowed"} ${tool.bg} ${tool.border}`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  {tool.icon}
                </div>
                {/* Badge */}
                <span className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide ${BADGE_STYLES[tool.badge]}`}>
                  {tool.badge === "Soon" && <Lock className="inline w-2.5 h-2.5 mr-1 -mt-px" />}
                  {tool.badge}
                </span>
                <h3 className="font-black text-slate-800 text-lg mb-1">{tool.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{tool.desc}</p>
                {tool.badge === "Available" && (
                  <div className={`flex items-center gap-1 text-sm font-bold bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent`}>
                    Open tool <ArrowRight className="w-4 h-4 stroke-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* AI Chat Panel */}
        <AnimatePresence>
          {active === "text" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-white" /></div>
                <span className="font-black text-slate-800">AI Chat</span>
                <button onClick={() => setActive(null)} className="ml-auto text-sm text-slate-400 hover:text-slate-700 font-semibold">← Back</button>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-6 flex flex-col gap-4">
                {messages.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                    <p className="font-semibold text-sm">Start a conversation with AI...</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                      {[0, 1, 2].map(j => <span key={j} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 p-4 flex gap-3">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleChat()}
                  placeholder="Type a message..." className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                <button onClick={handleChat} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition-colors shadow-lg shadow-blue-500/20">
                  Send
                </button>
              </div>
            </motion.div>
          )}

          {active === "image" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-white" /></div>
                <span className="font-black text-slate-800">AI Image Generator</span>
                <button onClick={() => setActive(null)} className="ml-auto text-sm text-slate-400 hover:text-slate-700 font-semibold">← Back</button>
              </div>
              <div className="p-6">
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-5 overflow-hidden">
                  {generatedImg
                    ? <img src={generatedImg} alt="generated" className="w-full h-full object-cover" />
                    : <div className="text-center text-slate-400"><ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" /><p className="text-sm font-semibold">Your generated image appears here</p></div>
                  }
                </div>
                <div className="flex gap-3">
                  <input value={imgPrompt} onChange={e => setImgPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 transition-all" />
                  <button className="px-5 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-black text-sm shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity">
                    Generate
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-3 text-center">Connect your Replicate or OpenAI API key in settings to enable generation.</p>
              </div>
            </motion.div>
          )}

          {active === "code" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Code2 className="w-5 h-5 text-white" /></div>
                <span className="font-black text-slate-800">Code Assistant</span>
                <button onClick={() => setActive(null)} className="ml-auto text-sm text-slate-400 hover:text-slate-700 font-semibold">← Back</button>
              </div>
              <div className="p-6">
                <textarea rows={6} placeholder="Paste your code here or describe what you want to build..."
                  className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-mono outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none" />
                <div className="flex gap-3 mt-3">
                  {["Review Code", "Refactor", "Debug", "Generate"].map(action => (
                    <button key={action} className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm transition-colors border border-emerald-200">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
