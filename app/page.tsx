"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ComplianceTable } from "@/components/dashboard/ComplianceTable";
import { ShieldAlert, TrendingUp, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  return (
    <DashboardLayout
      onScanClick={() => setIsScanModalOpen(true)}
      isScanModalOpen={isScanModalOpen}
      onCloseScanModal={() => setIsScanModalOpen(false)}
    >
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              // DASHBOARD
            </div>
            <h1 className="mt-1 font-mono text-2xl font-bold">
              HEADS UP DISPLAY
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              GST COMPLIANCE SHIELD FOR TRADERS & MSMEs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-[10px] text-muted-foreground">
              LAST SYNC: 2 MIN AGO
            </div>
            <Button
              onClick={() => setIsScanModalOpen(true)}
              className="font-mono text-xs gap-2"
            >
              <ScanLine className="h-4 w-4" />
              QUICK SCAN
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="TOTAL OUTSTANDING"
          value="₹1,45,000"
          variant="default"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="ITC AT RISK"
          value="₹24,000"
          variant="danger"
          icon={<ShieldAlert className="h-4 w-4" />}
        />
        <StatCard
          label="SAFE TO PAY"
          value="₹1,21,000"
          variant="success"
        />
      </div>

      {/* Compliance Table */}
      <ComplianceTable />

      {/* Quick Actions */}
      <div className="mt-8 border border-dotted border-foreground/30 p-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
          // QUICK ACTIONS
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="font-mono text-[10px]">
            EXPORT CSV
          </Button>
          <Button variant="outline" size="sm" className="font-mono text-[10px]">
            GENERATE GSTR-3B
          </Button>
          <Button variant="outline" size="sm" className="font-mono text-[10px]">
            SYNC TALLY
          </Button>
          <Button variant="outline" size="sm" className="font-mono text-[10px]">
            REFRESH ALL
          </Button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 font-mono text-[10px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>// GSTIN VALIDATION: ACTIVE</span>
          <span className="w-px h-3 bg-foreground/20" />
          <span>// ITC MATCHING: ENABLED</span>
          <span className="w-px h-3 bg-foreground/20" />
          <span>// AUTO-BLOCK: ON</span>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
