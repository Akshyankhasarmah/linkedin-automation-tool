import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Database, 
  Target,
  Linkedin,
  Clock,
  Briefcase
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Control" },
    { path: "/automation", icon: Target, label: "Deploy" },
    { path: "/reports", icon: Database, label: "Library" },
    { path: "/jobs", icon: Briefcase, label: "Targets" },
    { path: "/scheduler", icon: Clock, label: "Timing" },
    { path: "/preferences", icon: Settings, label: "Kernel" },
  ];

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-16 md:w-20 lg:w-24 border-r border-white/5 flex flex-col items-center py-6 md:py-8 gap-8 md:gap-12 bg-[#050505] z-50 overflow-y-auto no-scrollbar">
      <Link to="/dashboard" className="group">
        <div className="h-8 w-8 md:h-10 md:w-10 bg-[#0077b5] rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,119,181,0.3)] group-hover:scale-110 transition-all">
          <Linkedin className="h-5 w-5 md:h-6 md:w-6 text-white fill-white/10" />
        </div>
      </Link>
      
      <div className="flex-1 flex flex-col gap-6 md:gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className="relative group flex flex-col items-center gap-1"
            >
              <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all ${
                isActive 
                  ? "bg-white/10 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                  : "text-gray-600 hover:text-gray-300 hover:bg-white/5"
              }`}>
                <item.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter transition-all ${
                isActive ? "text-[#0077b5]" : "text-gray-700 group-hover:text-gray-500"
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-nav-pill"
                  className="absolute -right-[8px] md:-right-[12px] top-1/2 -translate-y-1/2 w-1 h-6 md:h-8 bg-[#0077b5] rounded-l-full shadow-[0_0_15px_rgba(0,119,181,0.5)]" 
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6 pb-4 mt-auto">
         <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/10 overflow-hidden group-hover:border-[#0077b5] transition-all">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || "User"}`} 
                alt="Avatar" 
                className="h-full w-full object-cover" 
              />
            </div>
            <span className="text-[8px] md:text-[9px] font-black text-gray-700 group-hover:text-gray-500 truncate w-12 md:w-16 text-center">
              {user?.displayName?.split(' ')[0] || "ROOT"}
            </span>
         </div>
         <button 
           onClick={() => logout()}
           className="p-2.5 md:p-3 rounded-xl md:rounded-2xl text-gray-700 hover:text-red-500 hover:bg-red-500/5 transition-all"
         >
           <LogOut className="h-5 w-5 md:h-6 md:w-6" />
         </button>
      </div>
    </nav>
  );
}
