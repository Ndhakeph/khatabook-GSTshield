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

            return (
              <TableRow
                key={invoice.id}
                className={cn(
                  "border-b border-foreground/20 hover:bg-transparent",
                  isFailed && "relative"
                )}
              >
                {/* Failed row indicator - left stripe */}
                {isFailed && (
                  <td
                    className="absolute left-0 top-0 bottom-0 w-1 bg-danger"
                    style={{ padding: 0 }}
                  />
                )}
                <TableCell className={cn(
                  "font-mono text-xs py-2 border-r border-foreground/10",
                  isFailed && "pl-4 bg-danger/5"
                )}>{invoice.date}</TableCell>
                <TableCell className={cn(
                  "font-sans text-xs py-2 border-r border-foreground/10",
                  isFailed && "bg-danger/5"
                )}>{invoice.vendor}</TableCell>
                <TableCell className={cn(
                  "font-mono text-[10px] text-muted-foreground py-2 border-r border-foreground/10 hidden md:table-cell",
                  isFailed && "bg-danger/5"
                )}>
                  {invoice.gstin}
                </TableCell>
                <TableCell className={cn(
                  "py-2 border-r border-foreground/10",
                  isFailed && "bg-danger/5"
                )}>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className={cn(
                  "font-mono text-xs py-2 text-right border-r border-foreground/10",
                  isFailed && "bg-danger/5"
                )}>
                  {formatAmount(invoice.amount)}
                </TableCell>
                <TableCell className={cn(
                  "text-right py-2",
                  isFailed && "bg-danger/5"
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
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] uppercase border",
        status === "Safe" && "border-success text-success",
        status === "Failed" && "border-danger text-danger",
        status === "Pending" && "border-foreground/50 text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5",
          status === "Safe" && "bg-success",
          status === "Failed" && "bg-danger animate-blink",
          status === "Pending" && "bg-foreground/50"
        )}
      />
      {status}
    </span>
  );
}

function ActionButton({ status }: { status: Invoice["status"] }) {
  if (status === "Failed") {
    return (
      <Button
        variant="default"
        size="sm"
        className="font-mono text-[10px] uppercase h-7 px-3"
      >
        Block Payment
      </Button>
    );
  }

  if (status === "Safe") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="font-mono text-[10px] uppercase h-7 px-3"
      >
        Pay Now
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-mono text-[10px] uppercase h-7 px-3 opacity-50"
      disabled
    >
      Verify
    </Button>
  );
}
