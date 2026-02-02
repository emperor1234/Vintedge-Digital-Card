import Airtable from 'airtable';
import { Salesperson, Tier } from '@/types';

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID || ''
);

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Salespersons';

export async function getSalespersonBySlug(slug: string): Promise<Salesperson | null> {
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
    } catch (error) {
        console.error('Error fetching salesperson from Airtable:', error);
        return null;
    }
}

export async function createSalesperson(data: Partial<Salesperson>): Promise<string | null> {
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
    } catch (error) {
        return null;
    }
}
