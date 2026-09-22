import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-blue-500/30">
      
      {/* Background gradients for a sci-fi feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      <Dashboard />
    </main>
  );
}
