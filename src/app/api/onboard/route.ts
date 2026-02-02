import { NextResponse } from 'next/server';
import { createSalesperson } from '@/lib/airtable';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Check if environment variables are properly configured
        if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === '') {
            return NextResponse.json({
                error: 'Server configuration error: Airtable API key missing',
                details: 'Please configure AIRTABLE_API_KEY in environment variables'
            }, { status: 500 });
        }

        if (!process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE_ID === '') {
            return NextResponse.json({
                error: 'Server configuration error: Airtable Base ID missing',
                details: 'Please configure AIRTABLE_BASE_ID in environment variables'
            }, { status: 500 });
        }

        // Normalize data (Zapier/HubSpot often send nested objects or different field names)
        const name = data.name || data.fullname || data.contact_name;
        const email = data.email || data.contact_email;

        if (!name || !email) {
            return NextResponse.json({
                error: 'Name and Email are required',
                received: { name, email }
            }, { status: 400 });
        }

        const recordId = await createSalesperson({
            name,
            email,
            phone: data.phone || '',
            jobTitle: data.jobTitle || data.title || '',
            tier: data.tier || 'Free',
            greetingText: data.greetingText || 'Hello! How can I help you today?',
            qaBank: data.qaBank || '',
            instagramUrl: data.instagramUrl || '',
            linkedinUrl: data.linkedinUrl || '',
            facebookUrl: data.facebookUrl || '',
            googleReviewUrl: data.googleReviewUrl || '',
        });

        if (!recordId) {
            throw new Error('Failed to create Airtable record');
        }

        const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
        const cardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/sales/${slug}`;

        // Optional: Notify Zapier that onboarding is complete (feedback loop)
        if (process.env.ZAPIER_WEBHOOK_URL && process.env.ZAPIER_WEBHOOK_URL !== '') {
            fetch(process.env.ZAPIER_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'onboarding_complete',
                    recordId,
                    slug,
                    cardUrl,
                    email
                }),
            }).catch(err => console.error('Zapier notification failed', err));
        }

        return NextResponse.json({
            success: true,
            recordId,
            slug,
            cardUrl
        });
    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to process onboarding',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
