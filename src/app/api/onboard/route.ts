import { NextResponse } from 'next/server';
import { createSalesperson } from '@/lib/airtable';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Check if environment variables are properly configured
        if (!process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY === '') {
            return NextResponse.json({
                error: 'Server configuration error'
            }, { status: 500 });
        }

        if (!process.env.AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE_ID === '') {
            return NextResponse.json({
                error: 'Server configuration error'
            }, { status: 500 });
        }

        // Normalize data (Zapier/HubSpot often send nested objects or different field names)
        const name = data.name || data.fullname || data.contact_name;
        const email = data.email || data.contact_email;

        if (!name || !email) {
            return NextResponse.json({
                error: 'Name and Email are required'
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
            return NextResponse.json({
                error: 'Registration failed'
            }, { status: 500 });
        }

        const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
        const cardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/sales/${slug}`;

        return NextResponse.json({
            success: true,
            recordId,
            slug,
            cardUrl
        });
    } catch (error) {
        return NextResponse.json({ 
            error: 'Registration failed'
        }, { status: 500 });
    }
}
