"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldCheck, AlertTriangle, CheckCircle } from "lucide-react";

export default function CompliancePage() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          // COMPLIANCE
                </div>
                <h1 className="mt-1 font-mono text-2xl font-bold">
                    COMPLIANCE SHIELD
                </h1>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                    REAL-TIME GST COMPLIANCE MONITORING
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 border-2 border-dashed border-green-200 bg-green-50/50">
                    <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span className="font-mono text-sm font-bold text-green-900">GSTIN STATUS</span>
                    </div>
                    <div className="font-mono text-xs text-green-700 font-medium">
                        Active and Valid
                    </div>
                </div>

                <div className="p-6 border-2 border-dashed border-yellow-200 bg-yellow-50/50">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="font-mono text-sm font-bold text-yellow-900">PENDING ACTIONS</span>
                    </div>
                    <div className="font-mono text-xs text-yellow-700 font-medium">
                        3 Invoices require review
                    </div>
                </div>

                <div className="p-6 border-2 border-dashed border-black/10 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-5 w-5 text-black" />
                        <span className="font-mono text-sm font-bold text-black">LAST FILING</span>
                    </div>
                    <div className="font-mono text-xs text-zinc-500">
                        GSTR-3B Filed on time
                    </div>
                </div>
            </div>

            <div className="p-4 border border-border bg-card">
                <div className="text-center py-10 font-mono text-muted-foreground">
          // COMPLIANCE DATA VISUALIZATION PLACEHOLDER
                </div>
            </div>
        </DashboardLayout>
    );
}
