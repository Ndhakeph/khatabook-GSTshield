import { NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai-service';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const limit = rateLimit(`chat:${getClientIp(req)}`);
        if (!limit.allowed) {
            return NextResponse.json({
                reply: `You've reached the demo limit of ${limit.limit} questions per hour. Please try again a little later.`,
            });
        }

        const response = await aiService.generateChatResponse(message);

        if (response.success && response.data) {
            return NextResponse.json({ reply: response.data });
        }

        // Calm, inline fallback — never a raw error to the chat surface.
        const reply = response.error === 'NO_API_KEY'
            ? 'The AI CFO assistant is offline because no FASTROUTER_API_KEY is configured. Add a key to enable live answers — your dashboard data is still fully available.'
            : "I'm having trouble reaching the AI service right now. Please try again in a moment.";

        return NextResponse.json({ reply });
    } catch {
        return NextResponse.json({
            reply: "I couldn't process that request. Please try again.",
        });
    }
}
