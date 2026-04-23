import { useState, useEffect } from "react";
import { ExternalLink, MapPin, Building2, Search, RefreshCw } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export function JobRecommendations() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryStr, setQueryStr] = useState("");

  const fetchJobs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "jobs"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsList);
    } catch (err) {
      console.error("Fetch jobs failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const handleSyncJobs = async () => {
    if (!user) return;
    setLoading(true);
    // Simulate AI Discovery phase and save to Firestore
    const mockJobs = [
      { userId: user.uid, title: "Senior AI Engineer", company: "NeuroTech", location: "Remote", description: "Scale production ML systems and lead LLM deployment.", url: "https://linkedin.com/jobs/ai1", matchScore: 98 },
      { userId: user.uid, title: "Data Scientist II", company: "InsightFlow", location: "San Francisco", description: "Optimize product features using predictive analytics.", url: "https://linkedin.com/jobs/ai2", matchScore: 94 },
    ];

    try {
      for (const job of mockJobs) {
        await addDoc(collection(db, "jobs"), job);
      }
      await fetchJobs();
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(queryStr.toLowerCase()) || 
    job.company.toLowerCase().includes(queryStr.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Job Intelligence</h1>
          <p className="text-gray-400">Highly relevant positions based on your activity and niche.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={handleSyncJobs}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-2 text-sm font-bold text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 
            Sync LinkedIn
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search matching roles..."
              className="w-full sm:w-64 rounded-full bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={queryStr}
              onChange={(e) => setQueryStr(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <GlassCard key={job.id} className="group hover:border-blue-500/30">
            <div className="mb-4 flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                98% Match
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
            <div className="mt-2 space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-gray-300 font-medium">
                <Building2 className="h-3.5 w-3.5 text-gray-500" />
                {job.company}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-400 line-clamp-3 leading-relaxed">
              {job.description}
            </p>

            <div className="mt-6">
              <a 
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600 border border-white/10"
              >
                Apply on LinkedIn <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
