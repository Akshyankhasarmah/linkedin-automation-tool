import { useState, useEffect, useRef } from "react";
import { Play, Square, Loader2, ScrollText, CheckCircle2, AlertTriangle, Linkedin, Terminal, ShieldAlert, Lock, Clock } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { motion, AnimatePresence } from "motion/react";
import { analyzeLinkedInPost, saveLogToFirestore, MOCK_FEED, PostAnalysis } from "../services/automationService";
import { useAuth } from "../contexts/AuthContext";

export function Automation() {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [discoveredPosts, setDiscoveredPosts] = useState<PostAnalysis[]>([]);
  const [status, setStatus] = useState("Awaiting Credentials");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleConnect = () => {
    if (!credentials.email || !credentials.password) return;
    setIsConnecting(true);
    setStatus("Establishing Secure Channel...");
    
    // Simulate connection phase
    setTimeout(() => {
      setIsActive(true);
      setIsConnecting(false);
      setStatus("Agent Deployed");
      runTenSecondLoop();
    }, 2000);
  };

  const runTenSecondLoop = async () => {
    if (!user) return;
    
    addLog(`INITIALIZING: LinkedIn Headless Agent (v4.2.0-stable)`);
    addLog(`AUTH: Attempting login for ${credentials.email}...`);
    await new Promise(r => setTimeout(r, 1000));
    addLog(`SUCCESS: Session established via session_token_delta`);
    addLog(`NAV: Directing agent to https://linkedin.com/feed`);
    
    let currentSecond = 10;
    setTimeLeft(10);

    timerRef.current = setInterval(() => {
      currentSecond -= 1;
      setTimeLeft(currentSecond);
      if (currentSecond <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        finishSession();
      }
    }, 1000);

    // Automation Work Loop
    for (let i = 0; i < 5; i++) {
      if (currentSecond <= 0) break;
      
      addLog(`SCROLL: Moving viewport by 840px (natural variance toggled)`);
      await new Promise(r => setTimeout(r, 1500));
      
      addLog(`EXTRACT: Found DOM candidate [post_id_${i + 1}]`);
      const analysis = await analyzeLinkedInPost(MOCK_FEED[i % MOCK_FEED.length]);
      
      addLog(`ANALYSIS: [${analysis.type}] Relevance: ${analysis.relevance}%`);
      setDiscoveredPosts(prev => [analysis, ...prev]);
      await saveLogToFirestore(user.uid, analysis);
    }
  };

  const finishSession = () => {
    setIsActive(false);
    setStatus("Session Complete");
    addLog(`SYSTEM: Finalizing logs and closing browser instance.`);
    addLog(`REPORT: Captured ${discoveredPosts.length} professional data points.`);
  };

  const resetSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    setConsoleLogs([]);
    setDiscoveredPosts([]);
    setTimeLeft(10);
    setStatus("Awaiting Credentials");
  };

  if (!isActive && !isConnecting && discoveredPosts.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-8">
        <GlassCard className="w-full max-w-md border-[#0077b5]/20 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-[#0077b5]/10 flex items-center justify-center border border-[#0077b5]/20 mb-6">
              <Linkedin className="h-8 w-8 text-[#0077b5]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Connect LinkedIn Account</h1>
            <p className="text-sm text-gray-400 mb-8">Deploying your autonomous agent requires a session bridge. Your credentials are only used to generate an encrypted agent token.</p>
            
            <div className="w-full space-y-4">
              <div className="text-left">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-2 block">LinkedIn E-mail</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
                  <input 
                    type="email" 
                    placeholder="user@example.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0077b5] transition-all"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1 mb-2 block">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0077b5] transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleConnect}
                disabled={!credentials.email || !credentials.password}
                className="w-full rounded-xl bg-[#0077b5] py-4 font-bold text-white shadow-[0_0_15px_rgba(0,119,181,0.4)] hover:bg-[#006097] transition-all disabled:opacity-50 disabled:grayscale mt-4"
              >
                Establish Connection
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-500"}`} />
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{status}</p>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             Autonomous Session
             {isActive && (
               <span className="flex items-center gap-1 text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                 <Clock className="h-3.5 w-3.5" /> {timeLeft}s REMAINING
               </span>
             )}
          </h1>
        </div>
        
        {(!isActive && !isConnecting) && (
          <button 
            onClick={resetSession}
            className="flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 border border-white/10"
          >
            New Session
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Agent Terminal */}
        <GlassCard className="lg:col-span-3 bg-black/40 border-white/5 font-mono overflow-hidden flex flex-col p-0">
          <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-gray-500" />
              <span className="text-[11px] font-bold text-gray-500">AGENT_PROCESS_OUTPUT</span>
            </div>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500/50" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
              <div className="h-2 w-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[500px] space-y-2 bg-[#050505]">
            <AnimatePresence>
              {(isConnecting || isActive || consoleLogs.length > 0) ? consoleLogs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={i} 
                  className={`text-xs ${log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('AUTH') ? 'text-[#0077b5]' : 'text-gray-400'}`}
                >
                  <span className="mr-2 text-gray-700">|</span> {log}
                </motion.div>
              )) : (
                <div className="flex flex-col items-center justify-center h-48 opacity-20">
                   <Loader2 className="h-8 w-8 animate-spin mb-4" />
                   <p className="text-xs uppercase tracking-widest font-black">Waiting for connection...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Intelligence Stream */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">Discovered Intelligence</h2>
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {discoveredPosts.map((analysis, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-4"
                >
                  <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center border ${
                    analysis.type === 'Toxic' ? 'bg-red-500/10 border-red-500/20' : 'bg-[#0077b5]/10 border-[#0077b5]/20'
                  }`}>
                    {analysis.type === 'Toxic' ? <ShieldAlert className="h-5 w-5 text-red-500" /> : <Linkedin className="h-5 w-5 text-[#0077b5]" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white mb-1">{analysis.author}</p>
                    <p className="text-xs text-gray-500 bg-white/5 rounded px-2 py-0.5 inline-block mb-2 font-mono uppercase">
                      CAT: {analysis.type}
                    </p>
                    <p className="text-xs text-gray-400 italic">"{analysis.content}"</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {discoveredPosts.length === 0 && !isActive && !isConnecting && (
              <div className="p-8 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-30">
                 <AlertTriangle className="h-8 w-8 mb-4 text-gray-600" />
                 <p className="text-xs font-bold text-gray-500">INTELLIGENCE STREAM EMPTY</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
