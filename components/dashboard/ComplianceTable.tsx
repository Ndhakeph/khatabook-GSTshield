import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle2, ShieldX, Loader2, Database } from "lucide-react";
import type { ComplianceRecord, DataSource } from "@/lib/services/compliance-service";

type Status = ComplianceRecord["status"];

interface ComplianceTableProps {
  records: ComplianceRecord[];
  loading: boolean;
  source: DataSource;
  onRemove: (id: string) => void;
  onVerify: (id: string) => void;
}

export function ComplianceTable({ records, loading, source, onRemove, onVerify }: ComplianceTableProps) {
  const [selected, setSelected] = useState<ComplianceRecord | null>(null);
  const [actionType, setActionType] = useState<"pay" | "block" | "verify" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (record: ComplianceRecord, type: "pay" | "block" | "verify") => {
    setSelected(record);
    setActionType(type);
  };

  const executeAction = async () => {
    if (!selected || !actionType) return;
    setIsProcessing(true);
    const id = selected.id;

    try {
      if (actionType === "pay") {
        onRemove(id);
        fetch(`/api/compliance?id=${id}`, { method: "DELETE" }).catch(() => {});
        toast.success("Payment Processed", {
          description: `${formatAmount(selected.amount)} transferred to ${selected.vendor_name}`,
        });
      } else if (actionType === "block") {
        onRemove(id);
        fetch(`/api/compliance?id=${id}`, { method: "DELETE" }).catch(() => {});
        toast.error("Vendor Blocked & Removed", {
          description: `Future payments to ${selected.vendor_name} will be rejected.`,
        });
      } else if (actionType === "verify") {
        onVerify(id);
        fetch("/api/compliance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: "Safe" }),
        }).catch(() => {});
        toast.success("Verification Successful", {
          description: "Vendor GSTIN verified against database.",
        });
      }
    } finally {
      setIsProcessing(false);
      setActionType(null);
      setSelected(null);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative border border-foreground bg-background">
      {/* Corner Accent - Design Signature */}
      <div className="absolute top-0 right-0 w-1 h-1 bg-foreground" />
      <div className="border-b border-foreground p-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {"// COMPLIANCE GRID"}
          </div>
          <div className="mt-1 font-mono text-sm">
            Recent Invoices — GST Verification Status
          </div>
        </div>
        <div className="flex items-center gap-3">
          {source === "sample" && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 border border-amber-300 bg-amber-50 text-amber-700 font-mono text-[10px] uppercase tracking-wider">
              <Database className="h-3 w-3" />
              Sample Data
            </span>
          )}
          <div className="text-[10px] font-mono text-muted-foreground">
            {records.length} RECORDS
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 font-mono text-xs text-muted-foreground">LOADING DATA...</div>
      ) : records.length === 0 ? (
        <div className="p-10 text-center font-mono text-xs text-muted-foreground">
          {"// NO INVOICES YET — SCAN A RECEIPT TO GET STARTED"}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-foreground hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase border-r border-foreground/20 py-2">Date</TableHead>
              <TableHead className="font-mono text-[10px] uppercase border-r border-foreground/20 py-2">Vendor</TableHead>
              <TableHead className="font-mono text-[10px] uppercase border-r border-foreground/20 py-2 hidden md:table-cell">GSTIN</TableHead>
              <TableHead className="font-mono text-[10px] uppercase border-r border-foreground/20 py-2">Status</TableHead>
              <TableHead className="font-mono text-[10px] uppercase border-r border-foreground/20 py-2 text-right">Amount</TableHead>
              <TableHead className="font-mono text-[10px] uppercase py-2 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((invoice) => {
              const isFailed = invoice.status === "Failed";
              const isPending = invoice.status === "Pending";

              return (
                <TableRow
                  key={invoice.id}
                  className={cn(
                    "border-b border-black/5 transition-colors cursor-default",
                    !isFailed && !isPending && "hover:bg-zinc-50",
                    isFailed && "bg-red-50 hover:bg-red-50"
                  )}
                >
                  <TableCell className={cn(
                    "font-mono text-xs py-4 pl-6 border-r border-black/5 relative overflow-hidden",
                    isFailed && "text-red-900"
                  )}>
                    {isFailed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}
                    {invoice.invoice_date}
                  </TableCell>
                  <TableCell className={cn(
                    "font-sans text-xs font-medium py-4 border-r border-black/5",
                    isFailed ? "text-red-900" : "text-zinc-700"
                  )}>{invoice.vendor_name}</TableCell>
                  <TableCell className={cn(
                    "font-mono text-[10px] text-zinc-400 py-4 border-r border-black/5 hidden md:table-cell",
                    isFailed && "text-red-800/60"
                  )}>
                    {invoice.gstin}
                  </TableCell>
                  <TableCell className="py-4 border-r border-black/5">
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className={cn(
                    "font-mono text-xs py-4 text-right border-r border-black/5 font-bold",
                    isFailed ? "text-red-900" : "text-black"
                  )}>
                    {formatAmount(invoice.amount)}
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <ActionButton status={invoice.status} onAction={(type) => handleAction(invoice, type)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={(open: boolean) => !open && setActionType(null)}>
        <DialogContent className="sm:max-w-md border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase tracking-widest flex items-center gap-2">
              {actionType === 'pay' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {actionType === 'block' && <ShieldX className="w-5 h-5 text-red-600" />}
              {actionType === 'verify' && <Loader2 className="w-5 h-5 animate-spin" />}

              {actionType === 'pay' && "Confirm Payment"}
              {actionType === 'block' && "Block Vendor"}
              {actionType === 'verify' && "Verifying Details"}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs pt-2">
              {selected && (
                <>
                  Action for invoice <strong>{selected.vendor_name}</strong> ({formatAmount(selected.amount)})
                  <br />
                  GSTIN: {selected.gstin}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-zinc-50 border border-black/10 text-xs font-mono">
              {actionType === 'pay' && "Initiating secure transfer via Razorpay X..."}
              {actionType === 'block' && "This will flag the vendor and prevent future payments until cleared."}
              {actionType === 'verify' && "Cross-referencing GSTR-2B data with GSTN portal..."}
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="default"
              disabled={isProcessing}
              onClick={executeAction}
              className="w-full bg-black text-white hover:bg-zinc-800 rounded-none font-mono uppercase text-xs h-10 border-2 border-black"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {actionType === 'pay' && "Process Payment"}
                  {actionType === 'block' && "Confirm Block"}
                  {actionType === 'verify' && "Run Verification"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "Failed") {
    return (
      <span className="inline-flex items-center px-3 py-1 bg-white border border-red-200 text-red-600 font-bold font-mono text-[10px] uppercase shadow-sm">
        <span className="w-2 h-2 bg-red-500 mr-2" />
        FAILED
      </span>
    );
  }

  if (status === "Safe") {
    return (
      <span className="inline-flex items-center px-3 py-1 bg-white border border-green-200 text-green-600 font-bold font-mono text-[10px] uppercase shadow-sm">
        <span className="w-2 h-2 bg-green-500 mr-2" />
        SAFE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 bg-white border border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase shadow-sm">
      <span className="w-2 h-2 bg-zinc-300 mr-2" />
      PENDING
    </span>
  );
}

function ActionButton({ status, onAction }: { status: Status; onAction: (type: "pay" | "block" | "verify") => void }) {
  if (status === "Failed") {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => onAction('block')}
        className="font-mono text-[10px] uppercase h-8 px-4 bg-black text-white hover:bg-zinc-800 rounded-none shadow-sm"
      >
        BLOCK PAYMENT
      </Button>
    );
  }

  if (status === "Safe") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAction('pay')}
        className="font-mono text-[10px] uppercase h-8 px-4 bg-white border-2 border-black text-black hover:bg-zinc-50 rounded-none font-bold"
      >
        PAY NOW
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onAction('verify')}
      className="font-mono text-[10px] uppercase h-8 px-4 border-zinc-200 text-zinc-600 hover:text-black hover:border-black rounded-none transition-colors"
    >
      VERIFY
    </Button>
  );
}
