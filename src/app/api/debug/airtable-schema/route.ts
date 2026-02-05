import { NextResponse } from 'next/server';
import Airtable from 'airtable';

/**
 * Debug endpoint to show actual Airtable table schema
 */
export async function GET() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Salespersons';

    if (!apiKey || !baseId) {
        return NextResponse.json({ error: 'Airtable not configured' }, { status: 500 });
    }

    try {
        const base = new Airtable({ apiKey }).base(baseId);

        // Get first record to see the schema
        const records = await base(tableName)
            .select({ maxRecords: 1 })
            .firstPage();

        if (records.length === 0) {
            return NextResponse.json({
                message: 'No records found in table',
                suggestion: 'Add at least one record to see the schema'
            });
        }

        const firstRecord = records[0];
        const fieldNames = Object.keys(firstRecord.fields);
        const fieldValues = firstRecord.fields;

        return NextResponse.json({
            tableName,
            recordId: firstRecord.id,
            fieldNames,
            sampleData: fieldValues,
            requiredMappings: {
                'Salesperson Name': fieldNames.find(f => f.toLowerCase().includes('name')) || 'NOT FOUND',
                'Email': fieldNames.find(f => f.toLowerCase().includes('email')) || 'NOT FOUND',
                'Phone': fieldNames.find(f => f.toLowerCase().includes('phone')) || 'NOT FOUND',
                'Job Title': fieldNames.find(f => f.toLowerCase().includes('job') || f.toLowerCase().includes('title')) || 'NOT FOUND',
                'Tier': fieldNames.find(f => f.toLowerCase().includes('tier')) || 'NOT FOUND',
                'Status': fieldNames.find(f => f.toLowerCase().includes('status')) || 'NOT FOUND',
            }
        });

    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
