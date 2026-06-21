import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { CFOChatWidget } from "@/components/dashboard/CFOChatWidget";
import { ScanReceiptModal } from "@/components/dashboard/ScanReceiptModal";
import type { ComplianceRecord } from "@/lib/services/compliance-service";

interface DashboardLayoutProps {
  children: ReactNode;
  onScanClick?: () => void;
  isScanModalOpen?: boolean;
  onCloseScanModal?: () => void;
  onScanComplete?: () => void;
  onSessionAdd?: (record: ComplianceRecord) => void;
}

export function DashboardLayout({
  children,
  onScanClick,
  isScanModalOpen = false,
  onCloseScanModal,
  onScanComplete,
  onSessionAdd
}: DashboardLayoutProps) {
  const [internalScanOpen, setInternalScanOpen] = useState(false);

  // Use external state if provided, otherwise use internal
  const scanOpen = onScanClick ? isScanModalOpen : internalScanOpen;
  const handleScanClick = onScanClick || (() => setInternalScanOpen(true));
  const handleCloseScan = onCloseScanModal || (() => setInternalScanOpen(false));

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar onScanClick={handleScanClick} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav onScanClick={handleScanClick} />

      {/* CFO Chat Widget */}
      <CFOChatWidget />

      {/* Scan Receipt Modal */}
      <ScanReceiptModal
        isOpen={scanOpen}
        onClose={handleCloseScan}
        onScanComplete={onScanComplete}
        onSessionAdd={onSessionAdd}
      />
    </div>
  );
}
