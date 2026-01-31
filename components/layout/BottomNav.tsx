import { Home, ShieldCheck, Terminal, ScanLine } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  onScanClick: () => void;
}

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Shield", url: "/compliance", icon: ShieldCheck },
];

export function BottomNav({ onScanClick }: BottomNavProps) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t-2 border-foreground lg:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {/* Home */}
        <NavLink
          to="/"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            location.pathname === "/" 
              ? "text-foreground" 
              : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="font-mono text-[10px]">HOME</span>
        </NavLink>

        {/* Shield */}
        <NavLink
          to="/compliance"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            location.pathname === "/compliance" 
              ? "text-foreground" 
              : "text-muted-foreground"
          )}
        >
          <ShieldCheck className="h-5 w-5" />
          <span className="font-mono text-[10px]">SHIELD</span>
        </NavLink>

        {/* Scan - Floating Action Button */}
        <button
          onClick={onScanClick}
          className="relative -mt-8 flex items-center justify-center w-16 h-16 bg-foreground text-background border-2 border-foreground hover:bg-background hover:text-foreground transition-colors"
        >
          <ScanLine className="h-7 w-7" />
          {/* Pulse ring */}
          <span className="absolute inset-0 border-2 border-foreground animate-ping opacity-20" />
        </button>

        {/* Chat */}
        <NavLink
          to="/chat"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            location.pathname === "/chat" 
              ? "text-foreground" 
              : "text-muted-foreground"
          )}
        >
          <Terminal className="h-5 w-5" />
          <span className="font-mono text-[10px]">CHAT</span>
        </NavLink>

        {/* Placeholder for balance */}
        <div className="w-12" />
      </div>
    </nav>
  );
}
