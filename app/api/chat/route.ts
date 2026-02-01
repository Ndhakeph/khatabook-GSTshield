import { NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai-service';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const response = await aiService.generateChatResponse(message);

        if (!response.success) {
            return NextResponse.json({ error: response.error }, { status: 500 });
        }

        return NextResponse.json({ reply: response.data });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
