import React, { useState, useEffect } from "react";
import { Check, Save } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

const domains = ["Data Science", "Software Engineering", "Marketing", "UI/UX Design", "Product Management"];
const possibleInterests = ["AI", "Blockchain", "SaaS", "B2B", "Machine Learning", "Remote Work", "Mental Health", "Web3"];

export function Preferences() {
  const { user } = useAuth();
  const [domain, setDomain] = useState("Data Science");
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (!user) return;
    
    const fetchPrefs = async () => {
      const docRef = doc(db, "preferences", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDomain(data.domain || "Data Science");
        setInterests(data.interests || []);
      }
    };
    
    fetchPrefs();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setStatus("saving");
    
    try {
      await setDoc(doc(db, "preferences", user.uid), {
        userId: user.uid,
        domain,
        interests,
        automationActive: false, // Default or preserve existing
        startTime: "09:00",
        duration: 60
      }, { merge: true });
      
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("Save failed:", err);
      setStatus("idle");
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Automation Preferences</h1>
        <p className="text-gray-400">Tailor the AI analyzer to your professional niche.</p>
      </div>

      <GlassCard>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Primary Domain</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {domains.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all border ${
                    domain === d 
                    ? "bg-blue-600 border-blue-500 text-white" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Interests & Keywords</label>
            <div className="flex flex-wrap gap-2">
              {possibleInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all border ${
                    interests.includes(interest)
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                    : "bg-white/5 border-white/10 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  {interest}
                  {interests.includes(interest) && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500 italic">
              These keywords prioritize content in your feed analysis and job matching algorithms.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={status === "saving"}
              className={`flex items-center gap-2 rounded-full px-8 py-3 font-bold transition-all ${
                status === "saved" 
                ? "bg-emerald-600 text-white" 
                : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              <Save className="h-5 w-5" />
              {status === "saving" ? "Saving..." : status === "saved" ? "Preferences Saved" : "Save Preferences"}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
