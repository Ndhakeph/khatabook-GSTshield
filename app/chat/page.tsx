"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
        { role: "ai", text: "> SYSTEM INITIALIZED" },
        { role: "ai", text: "> CFO_AI_CORE_V2.1 CONNECTED" },
        { role: "ai", text: "> WAITING FOR INPUT..." },
    ]);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;

        const userMessage = message;
        setMessage("");

        setMessages((prev) => [
            ...prev,
            { role: "user", text: userMessage },
        ]);

        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await res.json();

            if (data.reply) {
                setMessages((prev) => [
                    ...prev,
                    { role: "ai", text: data.reply },
                ]);
            } else {
                throw new Error(data.error || "Failed to get response");
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: "> ERROR: CONNECTION FAILURE. RETRYING..." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

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

            <div className="flex flex-col h-[600px] border-2 border-black bg-black relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle,_#333_1px,_transparent_1px)] [background-size:20px_20px]"></div>

                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                        <Terminal className="h-4 w-4" />
                        <span>CFO_AI_CORE_V2.1</span>
                        <span className="text-green-500 animate-pulse">●</span>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                            <Terminal className="h-12 w-12 mb-4 opacity-20" />
                            <div className="font-mono text-sm">
                                INITIALIZING SECURE CONNECTION...
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className={cn(
                                "leading-relaxed break-words max-w-3xl",
                                msg.role === "user" ? "text-white font-bold" : "text-zinc-500"
                            )}>
                                <span className="opacity-50 mr-2">{msg.role === "user" ? "> " : "# "}</span>
                                {msg.text}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="text-success animate-pulse">
                            <span className="opacity-50 mr-2"># </span>
                            PROCESSING...
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-success text-lg">{">"}</span>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            autoFocus
                            placeholder="ENTER COMMAND OR QUERY..."
                            className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-zinc-600 text-white"
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
