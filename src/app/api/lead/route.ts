import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!process.env.ZAPIER_WEBHOOK_URL) {
            console.error('ZAPIER_WEBHOOK_URL is not defined');
            return NextResponse.json({ error: 'Webhook URL missing' }, { status: 500 });
        }

        // Forward the lead data to Zapier
        const zapResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!zapResponse.ok) {
            const errorText = await zapResponse.text();
            console.error('Zapier webhook failed:', errorText);
            return NextResponse.json({ error: 'Failed to notify Zapier' }, { status: 502 });
        }

        return NextResponse.json({ message: 'Lead captured successfully' });
    } catch (error) {
        console.error('Lead API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
