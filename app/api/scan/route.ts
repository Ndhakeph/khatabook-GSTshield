import { NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai-service';

export const runtime = 'nodejs'; // Increase limit if needed, though default is usually fine for simple JSON

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { image, mimeType } = body;

        if (!image) {
            return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
        }

        // Image comes as base64 string
        const result = await aiService.analyzeReceipt(image, mimeType);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ data: result.data });

    } catch (error: any) {
        console.error("Scan API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
