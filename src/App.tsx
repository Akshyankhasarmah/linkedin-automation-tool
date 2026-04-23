import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard";
import { Preferences } from "./components/Preferences";
import { Scheduler } from "./components/Scheduler";
import { FeedReports } from "./components/FeedReports";
import { JobRecommendations } from "./components/JobRecommendations";
import { Automation } from "./components/Automation";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Loading Auth...</div>;
  if (!user) return <Navigate to="/" />;
  
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 lg:pl-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Internal Application Routes - Protected */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/preferences" element={<PrivateRoute><Layout><Preferences /></Layout></PrivateRoute>} />
          <Route path="/scheduler" element={<PrivateRoute><Layout><Scheduler /></Layout></PrivateRoute>} />
          <Route path="/automation" element={<PrivateRoute><Layout><Automation /></Layout></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Layout><FeedReports /></Layout></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><Layout><JobRecommendations /></Layout></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
