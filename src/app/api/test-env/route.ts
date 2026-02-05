import { NextResponse } from 'next/server';

/**
 * Test endpoint to verify environment variable configuration
 * This helps debug deployment issues without exposing sensitive values
 */
export async function GET() {
    const envStatus = {
        AIRTABLE_API_KEY: !!process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_API_KEY !== '' && process.env.AIRTABLE_API_KEY !== 'YOUR_AIRTABLE_API_KEY_HERE',
        AIRTABLE_BASE_ID: !!process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_BASE_ID !== '' && process.env.AIRTABLE_BASE_ID !== 'YOUR_AIRTABLE_BASE_ID_HERE',
        AIRTABLE_TABLE_NAME: process.env.AIRTABLE_TABLE_NAME || 'Salespersons',
        ZAPIER_WEBHOOK_URL: !!process.env.ZAPIER_WEBHOOK_URL && process.env.ZAPIER_WEBHOOK_URL !== '',
        CHATBASE_API_KEY: !!process.env.CHATBASE_API_KEY && process.env.CHATBASE_API_KEY !== '',
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'Not set',
        environment: process.env.NODE_ENV || 'development',
        vercel: !!process.env.VERCEL,
        timestamp: new Date().toISOString(),
    };

    const allCriticalEnvVarsSet = envStatus.AIRTABLE_API_KEY && envStatus.AIRTABLE_BASE_ID;

    return NextResponse.json({
        status: allCriticalEnvVarsSet ? 'ready' : 'configuration_required',
        message: allCriticalEnvVarsSet
            ? '✅ All critical environment variables are configured'
            : '❌ Missing required environment variables - check AIRTABLE_API_KEY and AIRTABLE_BASE_ID',
        environment: envStatus,
        instructions: !allCriticalEnvVarsSet ? {
            message: 'To fix registration, add these environment variables in Vercel:',
            required: [
                { name: 'AIRTABLE_API_KEY', description: 'Your Airtable Personal Access Token from https://airtable.com/create/tokens' },
                { name: 'AIRTABLE_BASE_ID', description: 'Your Airtable base ID (starts with "app...")' },
            ],
            optional: [
                { name: 'AIRTABLE_TABLE_NAME', description: 'Table name (default: "Salespersons")' },
                { name: 'ZAPIER_WEBHOOK_URL', description: 'Zapier webhook for HubSpot integration' },
                { name: 'CHATBASE_API_KEY', description: 'Chatbase API key for Elite tier AI chat' },
            ],
            nextSteps: [
                '1. Go to Vercel Dashboard → Settings → Environment Variables',
                '2. Add the required variables for Production, Preview, and Development',
                '3. Redeploy your application',
                '4. Visit this endpoint again to verify'
            ]
        } : undefined
    }, {
        headers: {
            'Cache-Control': 'no-store',
        }
    });
}
