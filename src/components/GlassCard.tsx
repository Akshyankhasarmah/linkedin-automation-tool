import React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

export function GlassCard({ children, className, gradient = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.05]",
        gradient && "bg-gradient-to-br from-white/[0.08] to-transparent",
        className
      )}
      {...props}
    >
      {gradient && (
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[80px]" />
      )}
      {children}
    </motion.div>
  );
}
