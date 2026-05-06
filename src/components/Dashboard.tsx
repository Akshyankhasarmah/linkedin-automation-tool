import { useState, useEffect } from "react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { 
  Users, Target, ShieldAlert, Globe, 
  Activity, Zap, Terminal, ExternalLink
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export function Dashboard() {
  const { user } = useAuth();
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          setSystemStatus(data);
        }
      } catch (err) {
        console.error("Status fetch failed");
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const data = [
    { name: "Mon", posts: 124, relevance: 88 },
    { name: "Tue", posts: 156, relevance: 92 },
    { name: "Wed", posts: 98, relevance: 85 },
    { name: "Thu", posts: 210, relevance: 94 },
    { name: "Fri", posts: 180, relevance: 90 },
    { name: "Sat", posts: 84, relevance: 82 },
    { name: "Sun", posts: 112, relevance: 87 },
  ];

  return (
    <div className="p-8 space-y-8 grid-technical min-h-screen">
      {/* Header instrumentation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="h-1.5 w-1.5 rounded-full bg-[#0077b5] animate-pulse" />
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Intelligence Feed : {user?.displayName || "Agent_Root"}</p>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">MISSION CONTROL</h1>
        </div>
        
        <div className="flex items-center gap-4">
           {systemStatus && (
             <div className="bg-white/[0.02] border border-white/5 px-6 py-2 flex items-center gap-6 rounded-2xl backdrop-blur-xl">
                <div className="text-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Uptime</p>
                   <p className="text-xs font-mono text-[#0077b5]">{Math.floor(systemStatus.uptime / 60)}m {Math.floor(systemStatus.uptime % 60)}s</p>
                </div>
                <div className="h-8 w-[1px] bg-white/5" />
                <div className="text-center">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Database</p>
                   <p className="text-xs font-mono text-emerald-500">{systemStatus.db_type === "SQLite 3.x" ? "SQL_ALIVE" : "CLOUD_SYNC"}</p>
                </div>
             </div>
           )}
           <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <Terminal className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Neural Hits", val: "2,841", change: "+12%", icon: Zap, color: "text-yellow-500" },
          { label: "Active Nodes", val: "12", change: "STABLE", icon: Globe, color: "text-[#0077b5]" },
          { label: "Intelligence %", val: "94.2", change: "+2.1%", icon: Target, color: "text-emerald-500" },
          { label: "Noise Filtered", val: "18.4K", change: "-5%", icon: ShieldAlert, color: "text-red-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.01] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-gray-600">{stat.change}</span>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black tracking-tighter">{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Distribution */}
        <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 p-8 rounded-[2rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black italic">EXTRACTION_ANALYTICS</h3>
              <p className="text-xs text-gray-500 font-mono">Source: LinkedIn_Feed_v4_Relay</p>
            </div>
            <div className="flex gap-2">
               <span className="h-2 w-2 rounded-full bg-[#0077b5]" />
               <span className="h-2 w-2 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077b5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0077b5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="#0077b5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPosts)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="space-y-6">
           <div className="bg-[#0077b5]/5 border border-[#0077b5]/20 p-8 rounded-[2rem]">
              <Activity className="h-8 w-8 text-[#0077b5] mb-6" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Relational Bridge</h3>
              <div className="space-y-4 font-mono text-[10px]">
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">ENGINE_VERSION</span>
                    <span className="text-white">v4.2.0-STABLE</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">RELATIONAL_DB</span>
                    <span className="text-emerald-500">SQLITE_ACTIVE</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">CLOUD_SYNC</span>
                    <span className="text-emerald-500">FIREBASE_OK</span>
                 </div>
              </div>
              <button 
                onClick={() => window.open("/DEPLOYMENT.md")}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                 <ExternalLink className="h-3 w-3" /> System Specs
              </button>
           </div>

           <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem]">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 underline decoration-[#0077b5] decoration-2 underline-offset-8">Discovery Stream</h3>
              <div className="space-y-4">
                 {[
                   { user: "Jane Tech", action: "Neural Match", time: "2m ago" },
                   { user: "Startup Hub", action: "Job Extracted", time: "14m ago" },
                   { user: "HR Global", action: "Hiring Signal", time: "1h ago" },
                 ].map((log, i) => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#0077b5]/50 transition-all">
                        <Users className="h-3.5 w-3.5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold text-white truncate">{log.user}</p>
                         <p className="text-[10px] text-gray-600 font-medium uppercase tracking-tight">{log.action}</p>
                      </div>
                      <span className="text-[10px] font-mono text-gray-700">{log.time}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
