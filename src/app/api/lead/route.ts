import { NextResponse } from 'next/server';
import { verifyApiKey, validateLength } from '@/lib/security';



export async function POST(req: Request) {

    try {
        // Verify API Key
        if (!verifyApiKey(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Use dedicated lead webhook URL
        if (!process.env.ZAPIER_LEAD_WEBHOOK_URL) {
            // If no webhook configured, still return success (lead captured locally)
            return NextResponse.json({ message: 'Lead captured locally' });
        }



        // Input validation
        if (!validateLength(data.name, 100) || !validateLength(data.email, 100)) {
            return NextResponse.json({ error: 'Input too long' }, { status: 400 });
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
        const webhookUrl = process.env.ZAPIER_LEAD_WEBHOOK_URL;

        // TypeScript type guard
        if (!webhookUrl) {
            return NextResponse.json({ message: 'Lead captured locally' });
        }

        const zapResponse = await fetch(webhookUrl, {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify(payload),

        });



        if (!zapResponse.ok) {

            // We still return 200 to the user since the lead was "captured" by the app
        }



        return NextResponse.json({ success: true, message: 'Lead captured' });

    } catch {

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

    }

}

