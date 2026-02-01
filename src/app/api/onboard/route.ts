import { NextResponse } from 'next/server';
import { createSalesperson } from '@/lib/airtable';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!data.name || !data.email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const recordId = await createSalesperson({
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            jobTitle: data.jobTitle || '',
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

        // Optional: Forward to Zapier for admin notification
        if (process.env.ZAPIER_WEBHOOK_URL) {
            fetch(process.env.ZAPIER_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'new_onboarding',
                    recordId,
                    ...data
                }),
            }).catch(err => console.error('Zapier notification failed', err));
        }

        return NextResponse.json({
            success: true,
            recordId,
            slug: data.name.toLowerCase().replace(/\s+/g, '-')
        });
    } catch (error) {
        console.error('Onboarding API Error:', error);
        return NextResponse.json({ error: 'Failed to process onboarding' }, { status: 500 });
    }
}
