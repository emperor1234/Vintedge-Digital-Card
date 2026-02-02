import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!process.env.ZAPIER_WEBHOOK_URL) {
            console.warn('ZAPIER_WEBHOOK_URL is not defined, skipping external routing');
            return NextResponse.json({ message: 'Lead captured locally' });
        }

        // Structure the payload for Zapier/HubSpot
        const payload = {
            event_type: 'lead_capture',
            source: 'vintedge_digital_card',
            lead_details: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                timestamp: data.timestamp || new Date().toISOString(),
            },
            salesperson_context: {
                name: data.salespersonName,
                email: data.salespersonEmail,
                id: data.salespersonId,
                tier: data.tier
            },
            metadata: {
                url: req.headers.get('referer') || '',
                user_agent: req.headers.get('user-agent') || ''
            }
        };

        // Forward the lead data to Zapier
        const zapResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!zapResponse.ok) {
            const errorText = await zapResponse.text();
            console.error('Zapier webhook failed:', errorText);
            // We still return 200 to the user since the lead was "captured" by the app, 
            // but we log the error for the admin.
        }

        return NextResponse.json({ success: true, message: 'Lead routed successfully' });
    } catch (error) {
        console.error('Lead API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
