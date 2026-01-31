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
      "relative border border-dashed border-foreground p-4 sm:p-6 bg-background transition-colors hover:bg-muted/30",
      variant === "danger" && "border-danger"
    )}>
      {/* Corner Accent - Design Signature */}
      <div className="absolute top-0 right-0 w-1 h-1 bg-foreground" />
      
      {/* Danger glow effect for ITC at risk */}
      {variant === "danger" && (
        <div className="absolute inset-0 bg-danger/5 animate-pulse pointer-events-none" />
      )}
      
      <div className="relative flex items-start justify-between">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          // {label}
        </div>
        {icon && (
          <div className={cn(
            "flex items-center gap-2",
            variant === "danger" && "text-danger"
          )}>
            {variant === "danger" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-danger opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-danger" />
              </span>
            )}
            {icon}
          </div>
        )}
      </div>
      
      <div className={cn(
        "relative mt-3 sm:mt-4 font-mono text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
        variant === "danger" && "text-danger",
        variant === "success" && "text-success"
      )}>
        {value}
      </div>

      <div className="relative mt-3 sm:mt-4 border-t border-dotted border-foreground/20 pt-3">
        <div className={cn(
          "text-[10px] font-mono",
          variant === "danger" && "text-danger font-bold",
          variant === "success" && "text-success",
          variant === "default" && "text-muted-foreground"
        )}>
          {variant === "danger" && "⚠ REQUIRES IMMEDIATE ATTENTION"}
          {variant === "success" && "✓ VERIFIED SAFE"}
          {variant === "default" && "○ PENDING REVIEW"}
        </div>
      </div>
    </div>
  );
}
