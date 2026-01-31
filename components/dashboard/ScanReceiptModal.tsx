import { useState, useCallback, useEffect } from "react";
import { Upload, X, ScanLine, Camera, AlertTriangle, ShieldX, Ban, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ScanReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ScanState = "upload" | "processing" | "result";

const processingLogs = [
  { text: "INITIALIZING SCAN MODULE...", delay: 0 },
  { text: "EXTRACTING TEXT FROM IMAGE...", delay: 400 },
  { text: "IDENTIFYING VENDOR...", delay: 800 },
  { text: "> Found: SWIGGY TECHNOLOGIES PVT LTD", delay: 1200 },
  { text: "EXTRACTING GSTIN...", delay: 1600 },
  { text: "> Found GSTIN: 29AABCU9603R1ZM", delay: 2000 },
  { text: "PINGING GST PORTAL...", delay: 2400 },
  { text: "CHECKING RETURN FILING STATUS...", delay: 2800 },
  { text: "QUERYING GSTR-1 DATABASE...", delay: 3200 },
  { text: "QUERYING GSTR-3B DATABASE...", delay: 3600 },
  { text: "⚠ WARNING: COMPLIANCE ISSUE DETECTED", delay: 4000, isWarning: true },
  { text: "GENERATING RISK ASSESSMENT...", delay: 4400 },
  { text: "ANALYSIS COMPLETE.", delay: 4800, isComplete: true },
];

const matrixChars = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF";

function MatrixBackground() {
  const columns = 30;

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div className="relative w-full h-full flex">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center overflow-hidden"
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <span
                key={j}
                className="font-mono text-success text-xs animate-matrix"
                style={{
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${1.5 + Math.random()}s`,
                }}
              >
                {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TerminalProcessing({ onComplete }: { onComplete: () => void }) {
  const [visibleLogs, setVisibleLogs] = useState<typeof processingLogs>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    processingLogs.forEach((log, index) => {
      const timeout = setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);

        if (index === processingLogs.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, log.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="relative h-full bg-foreground overflow-hidden">
      <MatrixBackground />

      {/* Scan Line */}
      <div className="absolute left-0 right-0 h-0.5 bg-success/50 animate-scan" />

      {/* Terminal Content */}
      <div className="relative z-10 h-full p-6 overflow-auto">
        <div className="font-mono text-xs space-y-1">
          <div className="text-success/60 mb-4">
            {">"} KHATABOOK AI SCANNER v1.0.3
          </div>
          <div className="text-success/60 mb-4">
            {">"} TIMESTAMP: {new Date().toISOString()}
          </div>
          <div className="border-b border-success/30 mb-4" />

          {visibleLogs.map((log, index) => (
            <div
              key={index}
              className={cn(
                "animate-fade-in",
                log.isWarning && "text-danger font-bold",
                log.isComplete && "text-success font-bold mt-4",
                !log.isWarning && !log.isComplete && "text-success"
              )}
            >
              {log.text}
              {index === visibleLogs.length - 1 && (
                <span className="animate-blink">_</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ onClose }: { onClose: () => void }) {
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="h-full flex flex-col bg-background p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-dashed border-foreground/30">
        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            // SCANNED INVOICE
          </div>
          <h2 className="font-mono text-lg font-bold mt-1">SWIGGY TECHNOLOGIES</h2>
          <div className="font-mono text-xs text-muted-foreground mt-1">
            GSTIN: 29AABCU9603R1ZM
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-muted-foreground">{today}</div>
          <div className="font-mono text-[10px] text-muted-foreground mt-1">INV#SWG-2024-8847</div>
        </div>
      </div>

      {/* Alert Box */}
      <div className="mt-6 bg-danger p-4 border-2 border-danger">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-danger-foreground flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-mono text-sm font-bold text-danger-foreground">
              ⚠️ COMPLIANCE ALERT
            </div>
            <div className="font-mono text-xs text-danger-foreground/90 mt-1">
              Vendor has not filed GSTR-1 for 2 months. Paying this invoice puts your ITC (Input Tax Credit) at risk.
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mt-6 border border-foreground/30 p-4">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
          // RISK ASSESSMENT
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <ShieldX className="h-4 w-4 text-danger" />
            <span className="font-mono text-xs">GSTR-1: NOT FILED</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldX className="h-4 w-4 text-danger" />
            <span className="font-mono text-xs">GSTR-3B: PENDING</span>
          </div>
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-danger" />
            <span className="font-mono text-xs">ITC MATCH: FAILED</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <span className="font-mono text-xs">RISK LEVEL: HIGH</span>
          </div>
        </div>
      </div>

      {/* Financials */}
      <div className="mt-6 border border-foreground/30 p-4">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
          // INVOICE BREAKDOWN
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹20,339</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-muted-foreground">CGST (9%)</span>
            <span>₹1,831</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-muted-foreground">SGST (9%)</span>
            <span>₹1,830</span>
          </div>
          <div className="border-t border-dashed border-foreground/30 pt-2 mt-2">
            <div className="flex justify-between font-mono text-lg font-bold">
              <span>TOTAL</span>
              <span>₹24,000</span>
            </div>
          </div>
          <div className="flex justify-between font-mono text-sm mt-2">
            <span className="text-danger">ITC AT RISK</span>
            <span className="text-danger font-bold">₹3,661</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-6 space-y-3">
        <Button
          className="w-full font-mono text-xs gap-2 h-12"
          onClick={onClose}
        >
          <Ban className="h-4 w-4" />
          BLOCK PAYMENT & NOTIFY VENDOR
        </Button>
        <Button
          variant="outline"
          className="w-full font-mono text-xs gap-2 h-10 text-muted-foreground"
          onClick={onClose}
        >
          <CreditCard className="h-4 w-4" />
          IGNORE & PAY (NOT RECOMMENDED)
        </Button>
      </div>
    </div>
  );
}

export function ScanReceiptModal({ isOpen, onClose }: ScanReceiptModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("upload");

  const handleClose = useCallback(() => {
    setScanState("upload");
    onClose();
  }, [onClose]);

  const startScanning = useCallback(() => {
    setScanState("processing");
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setScanState("result");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    startScanning();
  }, [startScanning]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(() => {
    startScanning();
  }, [startScanning]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScanState("upload");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] m-4 bg-background border-2 border-foreground flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-foreground flex-shrink-0">
          <div className="flex items-center gap-3">
            <ScanLine className="h-5 w-5" />
            <div>
              <div className="font-mono text-sm font-medium">SCAN_RECEIPT</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                // AI-POWERED INVOICE EXTRACTION
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-[10px] text-muted-foreground hidden sm:block">
              STATE: {scanState.toUpperCase()}
            </div>
            <button
              onClick={handleClose}
              className="p-2 border border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {scanState === "upload" && (
            <div className="h-full p-6 flex flex-col">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "flex-1 border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-6 cursor-pointer",
                  isDragging
                    ? "border-success bg-success/5"
                    : "border-foreground/50 hover:border-foreground"
                )}
                onClick={handleFileSelect}
              >
                <Upload className={cn(
                  "h-16 w-16 transition-colors",
                  isDragging ? "text-success" : "text-muted-foreground"
                )} />
                <div className="text-center">
                  <div className="font-mono text-lg font-bold">
                    DROP RECEIPT OR CLICK TO CAPTURE
                  </div>
                  <div className="mt-2 font-mono text-xs text-muted-foreground">
                    // SUPPORTS: JPG, PNG, PDF UP TO 10MB
                  </div>
                </div>

                {/* Camera Button for Mobile */}
                <Button
                  variant="outline"
                  size="lg"
                  className="font-mono text-xs gap-2 mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect();
                  }}
                >
                  <Camera className="h-5 w-5" />
                  CAPTURE FROM CAMERA
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-4 font-mono text-[10px] text-muted-foreground text-center">
                // POWERED BY KHATABOOK AI // GST COMPLIANCE ENGINE v1.0.3
              </div>
            </div>
          )}

          {scanState === "processing" && (
            <TerminalProcessing onComplete={handleProcessingComplete} />
          )}

          {scanState === "result" && (
            <ResultCard onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}
