import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background soft glow effects for light mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center px-4 max-w-3xl glassmorphism p-12 rounded-3xl border border-slate-200 shadow-2xl bg-white/60">
        <div className="flex justify-center mb-8">
           <Image src="/logo.png" width={96} height={96} alt="MT Labs" className="drop-shadow-md" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 drop-shadow-sm">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MT Labs</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
          The all-in-one developer publishing platform, media toolkit, and automation system. 
          Experience true power with AI-driven video enhancement and custom workflows.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/sign-in" 
            className="flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 w-full sm:w-auto"
          >
            Sign In to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link 
            href="/sign-up" 
            className="flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 border-b-2 rounded-xl transition-all shadow-sm w-full sm:w-auto"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
