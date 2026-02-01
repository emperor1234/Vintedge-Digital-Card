import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!process.env.ZAPIER_WEBHOOK_URL) {
            return NextResponse.json({ message: 'Internal tracking only' });
        }

        // Forward to Zapier (could be a different webhook for analytics, but we'll use same for now)
        fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: 'scan',
                ...data
            }),
        }).catch(err => console.error('Zapier forward failed', err));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
    }
}
