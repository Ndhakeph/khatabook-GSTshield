
import { NextResponse } from 'next/server';
import { complianceService } from '@/lib/services/compliance-service';

export async function GET() {
    try {
        const [recordsRes, statsRes] = await Promise.all([
            complianceService.getComplianceRecords(),
            complianceService.getStats()
        ]);

        return NextResponse.json({
            records: recordsRes.data || [],
            stats: statsRes.data || { total_outstanding: 0, itc_at_risk: 0, safe_to_pay: 0 }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
