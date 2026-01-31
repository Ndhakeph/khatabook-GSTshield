import { useState } from "react";
import { Terminal, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CFOChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "> SYSTEM INITIALIZED" },
    { role: "ai", text: "> CFO-AI v2.3.1 READY" },
    { role: "ai", text: "> Ask me anything about your finances, taxes, or compliance..." },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages((prev) => [
      ...prev,
      { role: "user", text: message },
      { role: "ai", text: `> Processing query: "${message}"...` },
      { role: "ai", text: "> Based on your Q3 data, I recommend reviewing your ITC claims for the Swiggy invoices." },
    ]);
    setMessage("");
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Toggle Button - Hidden on mobile (use bottom nav instead) */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 border-2 border-foreground bg-background transition-all hover:bg-foreground hover:text-background hidden lg:block",
          isOpen && "lg:hidden"
        )}
      >
        <Terminal className="h-5 w-5" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          // Base styles
          "fixed z-50 border-2 border-foreground bg-background transform transition-all duration-300",
          // Desktop positioning
          "lg:bottom-6 lg:right-6 lg:w-96",
          // Mobile: full screen when open
          "inset-0 lg:inset-auto",
          // Visibility states
          isOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full lg:translate-y-8 opacity-0 pointer-events-none",
          // Minimized state (desktop only)
          isMinimized && "lg:h-auto"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-foreground bg-foreground text-background">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Terminal className="h-4 w-4" />
            <span>CFO_TERMINAL</span>
            <span className="text-success animate-blink">●</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Minimize button - desktop only */}
            <button 
              onClick={toggleMinimize} 
              className="hover:opacity-70 hidden lg:block"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
            <button onClick={handleClose} className="hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        <div className={cn(
          "transition-all duration-300",
          isMinimized ? "h-0 overflow-hidden" : "h-auto"
        )}>
          {/* Messages */}
          <div className={cn(
            "overflow-y-auto p-4 space-y-2 font-mono text-xs bg-background",
            // Full height on mobile, fixed height on desktop
            "h-[calc(100vh-120px)] lg:h-64"
          )}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "leading-relaxed",
                  msg.role === "user" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {msg.role === "user" ? `$ ${msg.text}` : msg.text}
              </div>
            ))}
            <div className="flex items-center gap-1 text-success">
              <span>{">"}</span>
              <span className="w-2 h-4 bg-success animate-cursor" />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-foreground p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">$</span>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your taxes..."
                className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/50"
              />
              <button
                onClick={handleSend}
                className="p-2 border border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
}
