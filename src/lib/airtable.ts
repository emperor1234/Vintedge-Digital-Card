import Airtable from 'airtable';

import { Salesperson, Tier } from '@/types';



// Initialize Airtable with fallback handling

const base = process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID 
    ? new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID)
    : null;

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Salespersons';

// Fallback demo data
const DEMO_SALESPERSON: Salesperson = {
    id: 'demo',
    name: 'Demo User',
    email: 'demo@vintedge.digital',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Sales Professional',
    tier: 'Pro',
    photoUrl: '',
    greetingText: 'Hello! I\'m excited to connect with you and explore how we can work together.',
    qaBank: 'I specialize in digital sales solutions and helping businesses grow.',
    instagramUrl: 'https://instagram.com/demo',
    linkedinUrl: 'https://linkedin.com/in/demo',
    facebookUrl: '',
    googleReviewUrl: 'https://g.page/r/demo',
    status: 'Ready'
};



export async function getSalespersonBySlug(slug: string): Promise<Salesperson | null> {
    // Return demo data if Airtable is not configured or for demo requests
    if (!base || slug === 'test-user' || slug === 'demo') {
        return DEMO_SALESPERSON;
    }

    try {
        // Slugs are generated from the name: "Robin Lang" -> "robin-lang"
        // We search for a name that when slugified matches the input slug
        const records = await base(TABLE_NAME)
            .select({
                filterByFormula: `AND({Status} = 'Ready')`,
            })
            .all();



        const record = records.find((r) => {
            const name = r.get('Salesperson Name') as string;
            if (!name) return false;
            const recordSlug = name.toLowerCase().replace(/\s+/g, '-');
            return recordSlug === slug || r.id === slug;
        });



        if (!record) return null;



        return {
            id: record.id,
            name: record.get('Salesperson Name') as string,
            email: record.get('Email') as string,
            phone: (record.get('Phone') as string) || '',
            jobTitle: (record.get('Job Title') as string) || '',
            tier: (record.get('Tier') as Tier) || 'Free',
            photoUrl: (record.get('Photo') as unknown as { url: string }[])?.[0]?.url || '',
            greetingVideoUrl: (record.get('Greeting Video/Animation') as unknown as { url: string }[])?.[0]?.url,
            greetingText: (record.get('Greeting Text') as string) || '',
            qaBank: (record.get('Q&A Bank') as string) || '',
            landingPageUrl: record.get('Landing Page URL') as string,
            chatbaseBotId: record.get('Chatbase Bot ID') as string,
            googleReviewUrl: record.get('Google Review URL') as string,
            instagramUrl: record.get('Instagram URL') as string,
            linkedinUrl: record.get('LinkedIn URL') as string,
            facebookUrl: record.get('Facebook URL') as string,
            status: record.get('Status') as 'Draft' | 'Ready',
        };
    } catch {
        return DEMO_SALESPERSON; // Fallback to demo
    }
}



export async function createSalesperson(data: Partial<Salesperson>): Promise<string | null> {
    // Return demo response if Airtable is not configured
    if (!base) {
        return `demo_${Date.now()}`;
    }

    try {
        const record = await base(TABLE_NAME).create([
            {
                fields: {
                    'Salesperson Name': data.name,
                    'Email': data.email,
                    'Phone': data.phone,
                    'Job Title': data.jobTitle,
                    'Tier': data.tier || 'Free',
                    'Greeting Text': data.greetingText,
                    'Q&A Bank': data.qaBank,
                    'Status': 'Draft',
                    'Instagram URL': data.instagramUrl,
                    'LinkedIn URL': data.linkedinUrl,
                    'Facebook URL': data.facebookUrl,
                    'Google Review URL': data.googleReviewUrl,
                },
            },
        ]);
        return record[0].id;
    } catch {
        return null;
    }
}