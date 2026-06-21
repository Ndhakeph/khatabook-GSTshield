import { NextResponse } from 'next/server';
import { complianceService, computeStats } from '@/lib/services/compliance-service';

export async function GET() {
    try {
        const { records, source } = await complianceService.getComplianceRecords();
        const stats = computeStats(records);

        return NextResponse.json({ records, stats, source });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const res = await complianceService.addComplianceRecord(body);

        if (!res.success) {
            // 503 signals the client to keep the record in its in-session list.
            return NextResponse.json({ error: res.error }, { status: 503 });
        }

        return NextResponse.json(res.data);
    } catch {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const res = await complianceService.updateComplianceRecord(id, updates);
        if (!res.success) return NextResponse.json({ error: res.error }, { status: 503 });

        return NextResponse.json(res.data);
    } catch {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const res = await complianceService.deleteComplianceRecord(id);
        if (!res.success) return NextResponse.json({ error: res.error }, { status: 503 });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}
