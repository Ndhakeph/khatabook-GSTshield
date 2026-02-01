import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function GET() {
    let dbStatus = 'unknown';
    let errorMsg = null;

    try {
        // Attempt to verify connection by checking auth configuration
        const { error } = await supabase.auth.getSession();
        if (error) {
            dbStatus = 'error';
            errorMsg = error.message;
        } else {
            dbStatus = 'connected';
        }
    } catch (e: any) {
        dbStatus = 'failure';
        errorMsg = e.message;
    }

    return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'khatabook-ai-backend',
        dbStatus,
        error: errorMsg
    });
}
