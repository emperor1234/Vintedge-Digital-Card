import { NextResponse } from 'next/server';

import { createSalesperson } from '@/lib/airtable';
import { verifyApiKey, sanitizeUrl, validateLength } from '@/lib/security';



export async function POST(req: Request) {

    try {
        // Verify API Key
        if (!verifyApiKey(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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



        // Input validation & sanitization
        if (!validateLength(name, 100) ||
            !validateLength(email, 100) ||
            !validateLength(data.phone, 50) ||
            !validateLength(data.jobTitle, 100) ||
            !validateLength(data.greetingText, 1000) ||
            !validateLength(data.qaBank, 5000)) {
            return NextResponse.json({ error: 'Input too long' }, { status: 400 });
        }

        const recordId = await createSalesperson({

            name,

            email,

            phone: data.phone || '',

            jobTitle: data.jobTitle || data.title || '',

            tier: data.tier || 'Free',

            greetingText: data.greetingText || 'Hello! How can I help you today?',

            qaBank: data.qaBank || '',

            instagramUrl: sanitizeUrl(data.instagramUrl),

            linkedinUrl: sanitizeUrl(data.linkedinUrl),

            facebookUrl: sanitizeUrl(data.facebookUrl),

            googleReviewUrl: sanitizeUrl(data.googleReviewUrl),

        });



        if (!recordId) {

            return NextResponse.json({

                error: 'Registration failed'

            }, { status: 500 });

        }



const slug = name.toLowerCase().trim().replace(/\s+/g, '-');

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const cardUrl = `${baseUrl}/sales/${slug}`;



return NextResponse.json({

            success: true,

            slug,

            cardUrl

        });

    } catch {
        return NextResponse.json({ 
            error: 'Registration failed'
        }, { status: 500 });
    }

}

