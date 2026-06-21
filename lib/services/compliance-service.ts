import { sql, isDatabaseConfigured } from '@/lib/db/neon';
import { DEMO_RECORDS } from '@/lib/demo-data';
import { computeStats } from '@/lib/stats';
import { ServiceResponse } from './types';

export { computeStats };

export interface ComplianceRecord {
    id: string;
    vendor_name: string;
    gstin: string;
    status: 'Safe' | 'Failed' | 'Pending';
    amount: number;
    invoice_date: string;
    taxable_value?: number;
    cgst_amount?: number;
    sgst_amount?: number;
    igst_amount?: number;
    cess_amount?: number;
    invoice_number?: string;
    place_of_supply?: string;
}

export interface ComplianceStats {
    total_outstanding: number;
    itc_at_risk: number;
    safe_to_pay: number;
}

/** Where the returned data came from. 'sample' means the baked fallback is active. */
export type DataSource = 'live' | 'sample';

export interface RecordsResult {
    records: ComplianceRecord[];
    source: DataSource;
}

export interface StatsResult {
    stats: ComplianceStats;
    source: DataSource;
}

// Reads cast invoice_date to text in SQL so the driver never hands back a
// timezone-shifted Date object.
function toNumber(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

function normalizeRow(row: Record<string, unknown>): ComplianceRecord {
    return {
        id: String(row.id),
        vendor_name: String(row.vendor_name ?? ''),
        gstin: String(row.gstin ?? ''),
        status: (row.status as ComplianceRecord['status']) ?? 'Pending',
        amount: toNumber(row.amount),
        invoice_date: String(row.invoice_date ?? ''),
        taxable_value: toNumber(row.taxable_value),
        cgst_amount: toNumber(row.cgst_amount),
        sgst_amount: toNumber(row.sgst_amount),
        igst_amount: toNumber(row.igst_amount),
        cess_amount: toNumber(row.cess_amount),
        invoice_number: row.invoice_number != null ? String(row.invoice_number) : undefined,
        place_of_supply: row.place_of_supply != null ? String(row.place_of_supply) : undefined,
    };
}

export class ComplianceService {
    /**
     * Read all records. Tries Neon first and falls back to baked sample data
     * on any error or empty result, reporting which source was used.
     */
    async getComplianceRecords(): Promise<RecordsResult> {
        if (!isDatabaseConfigured()) {
            return { records: DEMO_RECORDS, source: 'sample' };
        }

        try {
            const rows = await sql`
                SELECT id, vendor_name, gstin, status, amount,
                    to_char(invoice_date, 'YYYY-MM-DD') AS invoice_date,
                    taxable_value, cgst_amount, sgst_amount, igst_amount, cess_amount,
                    invoice_number, place_of_supply
                FROM compliance_records
                ORDER BY invoice_date DESC, created_at DESC
            `;

            if (!rows || rows.length === 0) {
                return { records: DEMO_RECORDS, source: 'sample' };
            }

            return { records: rows.map(normalizeRow), source: 'live' };
        } catch (error: unknown) {
            console.error('Neon read failed — serving sample data:', error);
            return { records: DEMO_RECORDS, source: 'sample' };
        }
    }

    /** Derived stats over the current records (live or sample). */
    async getStats(): Promise<StatsResult> {
        const { records, source } = await this.getComplianceRecords();
        return { stats: computeStats(records), source };
    }

    /**
     * Insert a scanned record. Returns success:false (never throws) when the
     * database is unavailable so the caller can degrade to an in-session list.
     */
    async addComplianceRecord(record: Partial<ComplianceRecord>): Promise<ServiceResponse<ComplianceRecord>> {
        if (!record.vendor_name || !record.amount) {
            return { success: false, error: 'Missing required fields' };
        }

        if (!isDatabaseConfigured()) {
            return { success: false, error: 'Database not configured' };
        }

        try {
            const rows = await sql`
                INSERT INTO compliance_records
                    (vendor_name, gstin, status, amount, invoice_date,
                     taxable_value, cgst_amount, sgst_amount, igst_amount, cess_amount,
                     invoice_number, place_of_supply)
                VALUES
                    (${record.vendor_name}, ${record.gstin ?? ''}, ${record.status ?? 'Pending'},
                     ${record.amount}, ${record.invoice_date ?? new Date().toISOString().split('T')[0]},
                     ${record.taxable_value ?? 0}, ${record.cgst_amount ?? 0}, ${record.sgst_amount ?? 0},
                     ${record.igst_amount ?? 0}, ${record.cess_amount ?? 0},
                     ${record.invoice_number ?? 'UNKNOWN'}, ${record.place_of_supply ?? 'UNKNOWN'})
                RETURNING id, vendor_name, gstin, status, amount,
                    to_char(invoice_date, 'YYYY-MM-DD') AS invoice_date,
                    taxable_value, cgst_amount, sgst_amount, igst_amount, cess_amount,
                    invoice_number, place_of_supply
            `;

            return { success: true, data: normalizeRow(rows[0]) };
        } catch (error: unknown) {
            console.error('Error adding compliance record:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            return { success: false, error: message };
        }
    }

    async updateComplianceRecord(id: string, updates: Partial<ComplianceRecord>): Promise<ServiceResponse<ComplianceRecord>> {
        if (!isDatabaseConfigured()) {
            return { success: false, error: 'Database not configured' };
        }

        try {
            const rows = await sql`
                UPDATE compliance_records SET
                    vendor_name = COALESCE(${updates.vendor_name ?? null}::text, vendor_name),
                    gstin = COALESCE(${updates.gstin ?? null}::text, gstin),
                    status = COALESCE(${updates.status ?? null}::text, status),
                    amount = COALESCE(${updates.amount ?? null}::numeric, amount),
                    invoice_date = COALESCE(${updates.invoice_date ?? null}::date, invoice_date)
                WHERE id = ${id}
                RETURNING id, vendor_name, gstin, status, amount,
                    to_char(invoice_date, 'YYYY-MM-DD') AS invoice_date,
                    taxable_value, cgst_amount, sgst_amount, igst_amount, cess_amount,
                    invoice_number, place_of_supply
            `;

            if (!rows || rows.length === 0) {
                return { success: false, error: 'Record not found' };
            }

            return { success: true, data: normalizeRow(rows[0]) };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return { success: false, error: message };
        }
    }

    async deleteComplianceRecord(id: string): Promise<ServiceResponse<boolean>> {
        if (!isDatabaseConfigured()) {
            return { success: false, error: 'Database not configured' };
        }

        try {
            await sql`DELETE FROM compliance_records WHERE id = ${id}`;
            return { success: true, data: true };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return { success: false, error: message };
        }
    }
}

export const complianceService = new ComplianceService();
