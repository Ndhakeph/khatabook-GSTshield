import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  ScanLine, 
  Terminal,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  url?: string;
  icon: typeof LayoutDashboard;
  action?: string;
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Compliance Shield", url: "/compliance", icon: ShieldCheck },
  { title: "Scan Receipt", icon: ScanLine, action: "scan" },
  { title: "CFO Chat", url: "/chat", icon: Terminal },
];

interface SidebarProps {
  onScanClick?: () => void;
}

export function Sidebar({ onScanClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleItemClick = (item: MenuItem) => {
    setIsOpen(false);
    if (item.action === "scan" && onScanClick) {
      onScanClick();
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 border border-foreground bg-background lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-1 font-mono text-lg font-bold text-sidebar-foreground">
              <span>KHATABOOK</span>
              <span className="px-1.5 py-0.5 bg-danger text-danger-foreground text-xs">
                AI
              </span>
            </div>
            <div className="mt-2 text-xs text-sidebar-foreground/60 font-mono">
              v1.0.3 // BETA
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-widest mb-4">
              // NAVIGATION
            </div>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = item.url ? location.pathname === item.url : false;
                
                // Render as button for action items
                if (item.action) {
                  return (
                    <li key={item.title}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 font-mono text-sm transition-colors border",
                          "text-sidebar-foreground/80 border-transparent hover:border-sidebar-foreground/30 hover:bg-sidebar-accent"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    </li>
                  );
                }
                
                // Render as NavLink for regular items
                return (
                  <li key={item.title}>
                    <NavLink
                      to={item.url!}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 font-mono text-sm transition-colors border",
                        isActive
                          ? "bg-sidebar-foreground text-sidebar border-sidebar-foreground"
                          : "text-sidebar-foreground/80 border-transparent hover:border-sidebar-foreground/30 hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {isActive && (
                        <span className="ml-auto text-[10px]">{"<-"}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer - System Status */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-[10px] font-mono text-sidebar-foreground/40 leading-relaxed space-y-1">
              <div className="flex items-center justify-between">
                <span>SERVER:</span>
                <span className="text-sidebar-foreground/60">IND-PUNE-01</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LATENCY:</span>
                <span className="text-success">24ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GSTN API:</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success animate-pulse" />
                  <span className="text-success">CONNECTED</span>
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-sidebar-border/50 pt-2 mt-2">
                <span>BUILD:</span>
                <span className="text-sidebar-foreground/60">v1.0.4-rc</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
