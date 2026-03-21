import AnimatedSidePanel from "@/components/AnimatedSidePanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden">
      <AnimatedSidePanel />
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative z-10">
        {children}
      </div>
    </div>
  );
}
