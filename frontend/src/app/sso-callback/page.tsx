"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallback() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <div className="p-8 bg-white glassmorphism rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Authenticating...</h2>
        <p className="text-slate-500 mt-2">Please wait while we connect your account securely.</p>
        
        {/* The hidden Clerk component that processes the actual callback */}
        <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/" />
      </div>
    </div>
  );
}
