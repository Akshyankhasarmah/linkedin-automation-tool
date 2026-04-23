import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Zap, Target, Search, ShieldCheck, LogIn, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { useAuth } from "../contexts/AuthContext";

export function Home() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const handleLinkedInLogin = async () => {
    setError(null);
    if (user) {
      navigate('/dashboard');
    } else {
      try {
        await signIn(); // Using Google as proxy for LinkedIn in this demo environment
        navigate('/dashboard');
      } catch (err: any) {
        if (err.code === 'auth/popup-closed-by-user') {
          setError("Login window was closed. Please try again.");
        } else if (err.code === 'auth/popup-blocked') {
          setError("Popup was blocked by your browser. Please allow popups for this site.");
        } else {
          setError("LinkedIn login failed. Please check your connection.");
        }
        console.error("LinkedIn login simulation failed:", err);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans">
      {/* LinkedIn Blue Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0077b5]/20 to-transparent pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-32 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
             <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <Linkedin className="h-12 w-12 text-[#0077b5] fill-[#0077b5]/10" />
             </div>
          </div>
          
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
            Intel-LinkedIn <br />
            <span className="text-[#0077b5]">Autonomous Agent</span>
          </h1>
          
          <p className="mt-8 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The bridge between scrolling and growing. Automatically analyze your feed, extract high-value job leads, and filter out the noise—all powered by decentralized intelligence.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative group">
              <button
                onClick={handleLinkedInLogin}
                className="flex items-center gap-3 rounded-xl bg-[#0077b5] px-10 py-5 text-lg font-bold text-white shadow-[0_0_20px_rgba(0,119,181,0.4)] hover:bg-[#006097] transition-all transform hover:scale-105 active:scale-95"
              >
                Sign in with LinkedIn
                <ArrowRight className="h-5 w-5" />
              </button>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 left-0 right-0 text-red-400 text-sm font-medium"
                >
                  {error}
                </motion.p>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Join 12,000+ professionals using AI automation.
            </p>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <GlassCard className="text-left border-[#0077b5]/20">
            <Zap className="h-10 w-10 text-[#0077b5] mb-4" />
            <h3 className="text-xl font-bold text-white">Smart Extraction</h3>
            <p className="text-gray-400 text-sm mt-2">Automatically identifies hidden job openings and networking opportunities in your feed while you're offline.</p>
          </GlassCard>
          
          <GlassCard className="text-left border-purple-500/20">
            <ShieldCheck className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-white">Feed Sanitization</h3>
            <p className="text-gray-400 text-sm mt-2">Our AI agent detects toxic culture or low-relevance content and moves it to a silent report folder.</p>
          </GlassCard>

          <GlassCard className="text-left border-emerald-500/20">
            <Target className="h-10 w-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-white">Niche Mastery</h3>
            <p className="text-gray-400 text-sm mt-2">The report generates custom career strategy insights based specifically on your professional domain.</p>
          </GlassCard>
        </div>
      </div>

      <footer className="absolute bottom-8 w-full text-center py-4 px-6 border-t border-white/5">
        <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">
          © 2026 L-Intel Intelligence Systems • Autonomous Career Assistant
        </p>
      </footer>
    </div>
  );
}
