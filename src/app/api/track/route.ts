import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!process.env.ZAPIER_WEBHOOK_URL) {
            return NextResponse.json({ message: 'Internal tracking only' });
        }

        // Structure the payload for Zapier
        const payload = {
            event_type: data.event || 'page_view', // can be 'page_view', 'click_call', 'click_save', etc.
            source: 'vintedge_digital_card',
            salesperson_id: data.salespersonId,
            timestamp: data.timestamp || new Date().toISOString(),
            tracking_details: {
                location: data.location,
                referrer: data.referrer,
                path: data.path,
                user_agent: data.userAgent || req.headers.get('user-agent')
            }
        };

        // Forward to Zapier
        fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).catch(err => console.error('Zapier forward failed', err));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking API error:', error);
        return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
    }
}
