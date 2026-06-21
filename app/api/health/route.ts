import { NextResponse } from 'next/server';
import { sql, isDatabaseConfigured } from '@/lib/db/neon';

// Honest health check: a real query against compliance_records, not a
// keepalive. Neon auto-resumes on its own, so we don't need to poke it.
export async function GET() {
    const timestamp = new Date().toISOString();
    const service = 'gst-shield';

    if (!isDatabaseConfigured()) {
        return NextResponse.json({
            status: 'ok',
            timestamp,
            service,
            dbStatus: 'not-configured',
            mode: 'sample',
            recordCount: 0,
            error: null,
            message: 'No NEON_DATABASE_URL set — serving baked sample data.',
        });
    }

    try {
        const rows = await sql`SELECT count(*)::int AS count FROM compliance_records`;
        const recordCount = Number(rows[0]?.count ?? 0);

        return NextResponse.json({
            status: 'ok',
            timestamp,
            service,
            dbStatus: 'connected',
            mode: recordCount > 0 ? 'live' : 'sample',
            recordCount,
            error: null,
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({
            status: 'degraded',
            timestamp,
            service,
            dbStatus: 'error',
            mode: 'sample',
            recordCount: 0,
            error: message,
        });
    }
}
