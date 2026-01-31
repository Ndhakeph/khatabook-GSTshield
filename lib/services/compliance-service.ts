import { supabase } from '@/lib/db/supabase';
import { ServiceResponse } from './types';

export interface ComplianceRecord {
    id: string;
    vendor_name: string;
    gstin: string;
    status: 'Safe' | 'Failed' | 'Pending';
    amount: number;
    invoice_date: string;
}

export interface ComplianceStats {
    total_outstanding: number;
    itc_at_risk: number;
    safe_to_pay: number;
}

export class ComplianceService {

    async getComplianceRecords(): Promise<ServiceResponse<ComplianceRecord[]>> {
        try {
            const { data, error } = await supabase
                .from('compliance_records')
                .select('*')
                .order('invoice_date', { ascending: false });

            if (error) throw error;

            return { success: true, data: data as ComplianceRecord[] };
        } catch (error: any) {
            console.error('Error fetching compliance records:', error);
            return { success: false, error: error.message };
        }
    }

    async getStats(): Promise<ServiceResponse<ComplianceStats>> {
        try {
            const { data, error } = await supabase
                .from('compliance_records')
                .select('status, amount');

            if (error) throw error;

            const records = data || [];

            const stats = records.reduce((acc, curr) => {
                const amount = Number(curr.amount);
                acc.total_outstanding += amount;

                if (curr.status === 'Failed') {
                    acc.itc_at_risk += amount;
                } else if (curr.status === 'Safe') {
                    acc.safe_to_pay += amount;
                }

                return acc;
            }, { total_outstanding: 0, itc_at_risk: 0, safe_to_pay: 0 });

            return { success: true, data: stats };

        } catch (error: any) {
            console.error('Error fetching stats:', error);
            return { success: false, error: error.message };
        }
    }
}

export const complianceService = new ComplianceService();
