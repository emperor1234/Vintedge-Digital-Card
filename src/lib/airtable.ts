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
                // Removed Status filter - show all cards (Draft and Ready)
                maxRecords: 100,
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
        // Build fields object only with fields that exist in Airtable
        // Some fields might not exist in all table configurations
        const tier = data.tier || 'Free';
        const fields: Record<string, any> = {
            'Salesperson Name': data.name,
            'Email': data.email,
            'Tier': tier,
            // Free tier = Ready (active immediately), Pro/Elite = Draft (requires payment)
            'Status': tier === 'Free' ? 'Ready' : 'Draft',
        };

        // Add optional fields only if they're provided and not empty
        if (data.phone && data.phone.trim()) fields['Phone'] = data.phone;
        if (data.jobTitle && data.jobTitle.trim()) fields['Job Title'] = data.jobTitle;
        if (data.greetingText && data.greetingText.trim()) fields['Greeting Text'] = data.greetingText;
        if (data.qaBank && data.qaBank.trim()) fields['Q&A Bank'] = data.qaBank;
        if (data.instagramUrl && data.instagramUrl.trim()) fields['Instagram URL'] = data.instagramUrl;
        if (data.linkedinUrl && data.linkedinUrl.trim()) fields['LinkedIn URL'] = data.linkedinUrl;
        if (data.facebookUrl && data.facebookUrl.trim()) fields['Facebook URL'] = data.facebookUrl;
        if (data.googleReviewUrl && data.googleReviewUrl.trim()) fields['Google Review URL'] = data.googleReviewUrl;

        // Attachment fields for Photo and Video
        if (data.photoUrl && data.photoUrl.trim()) {
            fields['Photo'] = [{ url: data.photoUrl.trim() }];
        }
        if (data.greetingVideoUrl && data.greetingVideoUrl.trim()) {
            fields['Greeting Video/Animation'] = [{ url: data.greetingVideoUrl.trim() }];
        }

        const record = await base(TABLE_NAME).create([{ fields }]);
        return record[0].id;
    } catch (error) {
        console.error('Airtable creation error:', error);
        console.error('Attempted to create with data:', {
            name: data.name,
            email: data.email,
            tier: data.tier
        });

        // If it's a field error, log which fields were attempted
        if (error instanceof Error && error.message.includes('UNKNOWN_FIELD_NAME')) {
            console.error('Field mapping error - your Airtable table might be missing some fields');
            console.error('Make sure your table has these fields: Salesperson Name, Email, Tier, Status');
            console.error('Optional fields: Phone, Job Title, Greeting Text, Q&A Bank, Instagram URL, LinkedIn URL, Facebook URL, Google Review URL');
        }

        return null;
    }
}