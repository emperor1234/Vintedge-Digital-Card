import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        airtableApiKey: process.env.AIRTABLE_API_KEY ? 'Set' : 'Missing',
        airtableBaseId: process.env.AIRTABLE_BASE_ID ? 'Set' : 'Missing',
        tableName: process.env.AIRTABLE_TABLE_NAME || 'Salespersons',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'Missing'
    });
}
