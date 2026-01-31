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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="p-4 border border-border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-5 w-5 text-success" />
                        <span className="font-mono text-sm font-bold">GSTIN STATUS</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                        Active and Valid
                    </div>
                </div>

                <div className="p-4 border border-border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <span className="font-mono text-sm font-bold">PENDING ACTIONS</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                        3 Invoices require review
                    </div>
                </div>

                <div className="p-4 border border-border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-mono text-sm font-bold">LAST FILING</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
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
