import type { ComplianceRecord, ComplianceStats } from '@/lib/services/compliance-service';

/**
 * Pure stats helper — no database imports, so it is safe to use from both
 * server routes and client components. Keeps the dashboard totals consistent
 * whether records come from Neon, the baked fallback, or in-session scans.
 */
export function computeStats(records: ComplianceRecord[]): ComplianceStats {
    return records.reduce(
        (acc, curr) => {
            const amount = Number(curr.amount) || 0;
            acc.total_outstanding += amount;
            if (curr.status === 'Failed') {
                acc.itc_at_risk += amount;
            } else if (curr.status === 'Safe') {
                acc.safe_to_pay += amount;
            }
            return acc;
        },
        { total_outstanding: 0, itc_at_risk: 0, safe_to_pay: 0 },
    );
}
