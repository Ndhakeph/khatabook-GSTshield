import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  variant?: "default" | "danger" | "success";
  icon?: ReactNode;
}

export function StatCard({ label, value, variant = "default", icon }: StatCardProps) {
  return (
    <div className={cn(
      "relative border-2 border-dashed p-6 transition-all",
      variant === "default" && "bg-white border-black/10",
      variant === "danger" && "bg-red-50 border-red-500",
      variant === "success" && "bg-green-50 border-green-500",
    )}>
      {/* Corner Accent for Default */}
      {variant === "default" && <div className="absolute top-0 right-0 w-1 h-1 bg-black" />}

      <div className="relative flex items-start justify-between">
        <div className={cn(
          "text-[10px] font-mono uppercase tracking-widest",
          variant === "default" && "text-zinc-400",
          variant === "danger" && "text-red-400",
          variant === "success" && "text-green-600/60"
        )}>
          // {label}
        </div>
        {icon && (
          <div className={cn(
            "flex items-center gap-2",
            variant === "danger" && "text-red-500",
            variant === "default" && "text-black"
          )}>
            {variant === "danger" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-red-600" />
              </span>
            )}
            {icon}
          </div>
        )}
      </div>

      <div className={cn(
        "relative mt-4 font-mono text-3xl sm:text-4xl font-bold tracking-tight",
        variant === "default" && "text-black",
        variant === "danger" && "text-red-600",
        variant === "success" && "text-green-500"
      )}>
        {value}
      </div>

      <div className={cn(
        "relative mt-6 border-t border-dotted pt-3",
        variant === "default" && "border-black/10",
        variant === "danger" && "border-red-200",
        variant === "success" && "border-green-200"
      )}>
        <div className={cn(
          "text-[10px] font-mono uppercase tracking-wider",
          variant === "danger" && "text-red-600 font-bold",
          variant === "success" && "text-green-600 font-bold",
          variant === "default" && "text-zinc-400"
        )}>
          {variant === "danger" && "⚠ REQUIRES IMMEDIATE ATTENTION"}
          {variant === "success" && "✓ VERIFIED SAFE"}
          {variant === "default" && "○ PENDING REVIEW"}
        </div>
      </div>
    </div>
  );
}
