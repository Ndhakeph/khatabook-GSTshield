import { NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai-service';
import { validateGstin } from '@/lib/gstin';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { image, mimeType } = body;

        if (!image) {
            return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
        }

        const limit = rateLimit(`scan:${getClientIp(req)}`);
        if (!limit.allowed) {
            return NextResponse.json({
                friendly: `Demo scan limit reached (${limit.limit} per hour). Please try again a little later.`,
            });
        }

        const result = await aiService.analyzeReceipt(image, mimeType);

        if (!result.success || !result.data) {
            const friendly = result.error === 'NO_API_KEY'
                ? 'Receipt scanning is offline because no FASTROUTER_API_KEY is configured. Add a key to enable live OCR.'
                : 'Could not read this receipt clearly. Please try a sharper, well-lit image.';
            return NextResponse.json({ friendly });
        }

        // Deterministic GSTIN validator runs on top of the AI extraction and
        // is authoritative for the verdict — the model's own guess is ignored.
        const extracted = result.data;
        const validation = validateGstin(extracted.gstin as string | undefined);

        const data = {
            ...extracted,
            status: validation.valid ? 'Safe' : 'Failed',
        };

        return NextResponse.json({ data, validation });
    } catch (error: unknown) {
        console.error('Scan API Error:', error);
        return NextResponse.json({
            friendly: 'Something went wrong while scanning. Please try again.',
        });
    }
}
