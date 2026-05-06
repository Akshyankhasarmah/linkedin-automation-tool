import React, { useState, useEffect } from "react";
import { Play, Pause, Clock, Calendar as CalendarIcon, Zap } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export function Scheduler() {
  const { user } = useAuth();
  const [active, setActive] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    if (!user) return;
    
    const fetchPrefs = async () => {
      const docRef = doc(db, "preferences", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setActive(data.automationActive || false);
        setStartTime(data.startTime || "09:00");
        setDuration(data.duration || 60);
      }
    };
    
    fetchPrefs();
  }, [user]);

  const updateSchedule = async (newStartTime: string, newDuration: number) => {
    if (!user) return;
    setStartTime(newStartTime);
    setDuration(newDuration);
    
    try {
      await setDoc(doc(db, "preferences", user.uid), {
        startTime: newStartTime,
        duration: newDuration
      }, { merge: true });
    } catch (err) {
      console.error("Update schedule failed:", err);
    }
  };

  const toggleAutomation = async () => {
    if (!user) return;
    const newState = !active;
    setActive(newState);
    
    try {
      await setDoc(doc(db, "preferences", user.uid), {
        automationActive: newState
      }, { merge: true });
    } catch (err) {
      console.error("Toggle automation failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Automation Engine</h1>
          <p className="text-gray-400 font-mono text-sm">Status: {active ? "RUNNING_TASK_QUEUED" : "IDLE_SYSTEM_READY"}</p>
        </div>
        <button
          onClick={toggleAutomation}
          className={`group flex items-center gap-3 rounded-full px-8 py-4 font-bold shadow-2xl transition-all ${
            active 
            ? "bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500/20" 
            : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {active ? (
            <>
              <Pause className="h-6 w-6" /> Stop Engine
            </>
          ) : (
            <>
              <Play className="h-6 w-6 fill-current" /> Start Engine
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <GlassCard gradient>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-blue-400 h-6 w-6" />
            <h3 className="text-xl font-bold text-white">Daily Schedule</h3>
          </div>
          <div className="space-y-4">
             <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Start Time</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => updateSchedule(e.target.value, duration)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
             </div>
             <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Session Duration (Mins)</label>
                <select 
                   value={duration} 
                   onChange={(e) => updateSchedule(startTime, Number(e.target.value))}
                   className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                   <option value={30}>30 Minutes</option>
                   <option value={60}>1 Hour</option>
                   <option value={120}>2 Hours</option>
                   <option value={240}>4 Hours</option>
                </select>
             </div>
          </div>
        </GlassCard>

        <GlassCard className="border-cyan-500/20">
           <div className="flex items-center gap-3 mb-6">
             <Zap className="text-cyan-400 h-6 w-6" />
             <h3 className="text-xl font-bold text-white">Engine Mode</h3>
           </div>
           <div className="space-y-3">
              {[
                { name: "Stealth Mode", desc: "Maximum human-like variance, slower processing." },
                { name: "Aggressive", desc: "Faster scrolling, higher extraction rate (Moderate Risk)." },
                { name: "Scheduled-Hybrid", desc: "Runs only at optimal peak hours." }
              ].map((mode, i) => (
                <div key={mode.name} className={`p-3 rounded-xl border transition-all cursor-pointer ${i === 0 ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                   <p className="text-sm font-bold text-white">{mode.name}</p>
                   <p className="text-xs text-gray-500">{mode.desc}</p>
                </div>
              ))}
           </div>
        </GlassCard>
      </div>

      <GlassCard className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
         <div className="flex items-center gap-4">
            <CalendarIcon className="h-10 w-10 text-blue-400" />
            <div>
               <h4 className="text-lg font-bold text-white">Smart Auto-Stop</h4>
               <p className="text-sm text-gray-400">The engine automatically pauses if LinkedIn detects non-standard headers or if the extraction limit is reached.</p>
            </div>
         </div>
      </GlassCard>
    </div>
  );
}
