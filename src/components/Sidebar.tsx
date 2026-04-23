import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Calendar, FileText, Briefcase, Home, Shield, LogOut, Globe } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Globe, label: "Live Automation", path: "/automation" },
  { icon: Settings, label: "Preferences", path: "/preferences" },
  { icon: Calendar, label: "Scheduler", path: "/scheduler" },
  { icon: FileText, label: "Feed Reports", path: "/reports" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-black/50 backdrop-blur-md lg:block">
      <div className="flex h-full flex-col px-4 py-8">
        <div className="mb-10 flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">L-Intel</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300")} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          {user && (
            <div className="flex items-center gap-3 px-2 py-4 border-t border-white/10">
              <img src={user.photoURL || ""} alt={user.displayName || ""} className="h-10 w-10 rounded-full border border-white/20" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                <button onClick={logout} className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase font-bold tracking-widest">
                  <LogOut className="h-3 w-3" /> Logout
                </button>
              </div>
            </div>
          )}
          
          <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 border border-blue-500/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Pro Feature</p>
            <p className="mt-1 text-sm text-gray-300">Advanced AI feed filtering is active.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
