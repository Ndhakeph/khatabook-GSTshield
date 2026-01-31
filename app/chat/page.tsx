"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Terminal } from "lucide-react";

export default function ChatPage() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          // AI ASSISTANT
                </div>
                <h1 className="mt-1 font-mono text-2xl font-bold">
                    CFO CHAT TERMINAL
                </h1>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                    DIRECT LINE TO YOUR FINANCIAL INTELLIGENCE
                </p>
            </div>

            <div className="flex flex-col h-[600px] border border-border bg-card relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)] [background-size:20px_20px]"></div>

                <div className="flex items-center justify-between p-3 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-2 font-mono text-xs">
                        <Terminal className="h-4 w-4" />
                        <span>CFO_AI_CORE_V2.1</span>
                        <span className="text-success animate-pulse">●</span>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center text-muted-foreground">
                    <Terminal className="h-12 w-12 mb-4 opacity-20" />
                    <div className="font-mono text-sm">
                        INITIALIZING SECURE CONNECTION...
                    </div>
                    <div className="font-mono text-xs mt-2 opacity-60">
                // PLEASE USE THE WIDGET IN THE BOTTOM RIGHT FOR QUICK ACCESS
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
