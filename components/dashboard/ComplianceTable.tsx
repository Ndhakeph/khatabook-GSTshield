import { useState, useEffect } from "react";
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

interface Invoice {
  id: string;
  date: string;
  vendor: string;
  gstin: string;
  status: "Safe" | "Failed" | "Pending";
  amount: number;
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    date: "2024-01-15",
    vendor: "Zomato Media Pvt Ltd",
    gstin: "27AABCU9603R1ZM",
    status: "Safe",
    amount: 15000,
  },
  {
    id: "INV-002",
    date: "2024-01-14",
    vendor: "Swiggy Technologies",
    gstin: "29AADCS0472N1Z5",
    status: "Failed",
    amount: 24000,
  },
  {
    id: "INV-003",
    date: "2024-01-13",
    vendor: "Freshworks Inc",
    gstin: "33AABCF1234H1ZK",
    status: "Safe",
    amount: 8500,
  },
  {
    id: "INV-004",
    date: "2024-01-12",
    vendor: "Razorpay Software",
    gstin: "29AAGCR4375J1ZU",
    status: "Pending",
    amount: 32000,
  },
  {
    id: "INV-005",
    date: "2024-01-11",
    vendor: "Phonepe Digital",
    gstin: "29AALCP1234M1ZD",
    status: "Safe",
    amount: 12500,
  },
  {
    id: "INV-006",
    date: "2024-01-10",
    vendor: "Paytm Payments Bank",
    gstin: "09AAICP5678A1Z2",
    status: "Failed",
    amount: 18000,
  },
  {
    id: "INV-007",
    date: "2024-01-09",
    vendor: "Instamojo Technologies",
    gstin: "29AABCI9876K1ZN",
    status: "Safe",
    amount: 5600,
  },
];

export function ComplianceTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/compliance');
        const data = await res.json();

        if (data.records) {
          // Map DB response to frontend interface
          const mapped: Invoice[] = data.records.map((r: any) => ({
            id: r.id,
            date: r.invoice_date,
            vendor: r.vendor_name,
            gstin: r.gstin,
            status: r.status,
            amount: r.amount
          }));
          setInvoices(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch compliance data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="p-4 font-mono text-xs">LOADING DATA...</div>;
  }

  return (
    <div className="relative border border-foreground bg-background">
      {/* Corner Accent - Design Signature */}
      <div className="absolute top-0 right-0 w-1 h-1 bg-foreground" />
      <div className="border-b border-foreground p-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            // COMPLIANCE GRID
          </div>
          <div className="mt-1 font-mono text-sm">
            Recent Invoices — GST Verification Status
          </div>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          {invoices.length} RECORDS
        </div>
      </div>

      {/* Table */}
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
          {invoices.map((invoice) => {
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
                  // Red Stripe for Failed
                  isFailed && "text-red-900"
                )}>
                  {isFailed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}
                  {invoice.date}
                </TableCell>
                <TableCell className={cn(
                  "font-sans text-xs font-medium py-4 border-r border-black/5",
                  isFailed ? "text-red-900" : "text-zinc-700"
                )}>{invoice.vendor}</TableCell>
                <TableCell className={cn(
                  "font-mono text-[10px] text-zinc-400 py-4 border-r border-black/5 hidden md:table-cell",
                  isFailed && "text-red-800/60"
                )}>
                  {invoice.gstin}
                </TableCell>
                <TableCell className={cn(
                  "py-4 border-r border-black/5"
                )}>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className={cn(
                  "font-mono text-xs py-4 text-right border-r border-black/5 font-bold",
                  isFailed ? "text-red-900" : "text-black"
                )}>
                  {formatAmount(invoice.amount)}
                </TableCell>
                <TableCell className={cn(
                  "text-right py-4 pr-6"
                )}>
                  <ActionButton status={invoice.status} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: Invoice["status"] }) {
  if (status === "Failed") {
    return (
      <span className="inline-flex items-center px-3 py-1 bg-white border border-red-200 text-red-600 font-bold font-mono text-[10px] uppercase shadow-sm">
        <span className="w-2 h-2 bg-red-500 mr-2" />
        FAILED
      </span>
    )
  }

  if (status === "Safe") {
    return (
      <span className="inline-flex items-center px-3 py-1 bg-white border border-green-200 text-green-600 font-bold font-mono text-[10px] uppercase shadow-sm">
        <span className="w-2 h-2 bg-green-500 mr-2" />
        SAFE
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-3 py-1 bg-white border border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase shadow-sm">
      <span className="w-2 h-2 bg-zinc-300 mr-2" />
      PENDING
    </span>
  );
}

function ActionButton({ status }: { status: Invoice["status"] }) {
  if (status === "Failed") {
    return (
      <Button
        variant="default"
        size="sm"
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
      className="font-mono text-[10px] uppercase h-8 px-4 border-zinc-200 text-zinc-400 rounded-none"
      disabled
    >
      VERIFY
    </Button>
  );
}
