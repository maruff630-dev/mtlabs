"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, BrainCircuit, Rocket, Zap, Sparkles, TestTubeDiagonal, Code2 } from "lucide-react";

const SENTENCES = [
  "Publish your developer tools to the world.",
  "Harness AI-driven 2K video enhancement.",
  "Automate your workflow with smart webhooks.",
  "Create custom Telegram bots instantly.",
  "Manage everything from one single dashboard.",
  "Experience premium integrations via MT Labs.",
  "Unleash the power of serverless execution.",
  "Sell digital products effortlessly.",
  "Seamless Clerk Authentication baked in.",
  "Fastest UI built with Next.js 15 and Tailwind V4.",
  "Unlock premium PDF editing and AI content tools.",
  "Join a community of elite creators and developers.",
  "Your personal automation mastermind.",
  "Design, develop, deploy - all in MT Labs.",
  "Scale your ideas without infrastructural limits.",
  "Access advanced media processing APIs.",
  "Transform text into high-quality PDFs instantly.",
  "The ecosystem designed for modern builders.",
  "Integrate Stripe payments in one click.",
  "Welcome to the future of developer platforms."
];

const ICONS = [Beaker, BrainCircuit, Rocket, Zap, Sparkles, TestTubeDiagonal, Code2];

export default function AnimatedSidePanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SENTENCES.length);
    }, 4500); // Change sentence every 4.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div suppressHydrationWarning className="hidden lg:flex w-1/2 relative bg-indigo-600 shadow-2xl items-center justify-center overflow-hidden">
      {/* Top Left Logo */}
      <div suppressHydrationWarning className="absolute top-10 left-10 z-30 flex items-center gap-4">
         <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-2xl">
           <Beaker className="w-8 h-8 text-white" />
         </div>
         <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl">MT Labs</h1>
      </div>

      {/* Dynamic Background Gradient shifting */}
      <motion.div 
        animate={{
          background: [
            "linear-gradient(120deg, #4f46e5 0%, #3b82f6 100%)",
            "linear-gradient(120deg, #3b82f6 0%, #0ea5e9 100%)",
            "linear-gradient(120deg, #4f46e5 0%, #2563eb 100%)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0"
      />
      
      {/* Floating Glassmorphism Icons */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {ICONS.map((Icon, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
            suppressHydrationWarning
            style={{
              top: `${15 + (i * 25) % 70}%`,
              left: `${10 + (i * 30) % 80}%`,
              opacity: 0.6
            }}
          >
            <Icon className="w-8 h-8 text-white/80" />
          </motion.div>
        ))}
      </div>

      {/* Auto Typing Text Content */}
      <div className="relative z-20 w-full max-w-lg px-12">
        <div className="h-[120px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl sm:text-5xl font-bold text-white leading-tight drop-shadow-lg"
            >
              {SENTENCES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <div className="mt-12 flex gap-2">
           {SENTENCES.slice(0, 5).map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1.5 rounded-full transition-all duration-500 ${idx === index % 5 ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} 
             />
           ))}
        </div>
      </div>
    </div>
  );
}
