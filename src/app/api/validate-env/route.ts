import { NextResponse } from 'next/server';
import Airtable from 'airtable';

/**
 * Comprehensive environment variable validator
 * Tests actual connectivity and permissions, not just presence
 */
export async function GET() {
    const results = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        isVercel: !!process.env.VERCEL,
        overall_status: 'checking',
        services: {} as Record<string, any>
    };

    // Test 1: Airtable Configuration & Connectivity
    results.services.airtable = await testAirtable();

    // Test 2: Zapier Webhook
    results.services.zapier = await testZapier();

    // Test 3: Chatbase API
    results.services.chatbase = await testChatbase();

    // Test 4: Next.js Public URL
    results.services.nextjs = testNextPublicUrl();

    // Determine overall status
    const criticalServicesWorking = results.services.airtable.status === 'valid';
    const hasErrors = Object.values(results.services).some((s: any) => s.status === 'error');
    const hasWarnings = Object.values(results.services).some((s: any) => s.status === 'warning');

    if (!criticalServicesWorking) {
        results.overall_status = 'critical_failure';
    } else if (hasErrors) {
        results.overall_status = 'partial_failure';
    } else if (hasWarnings) {
        results.overall_status = 'working_with_warnings';
    } else {
        results.overall_status = 'all_systems_operational';
    }

    return NextResponse.json(results, {
        status: criticalServicesWorking ? 200 : 500,
        headers: {
            'Cache-Control': 'no-store',
        }
    });
}

/**
 * Test Airtable connection and permissions
 */
async function testAirtable() {
    const result = {
        service: 'Airtable',
        status: 'not_configured',
        message: '',
        details: {} as Record<string, any>
    };

    // Check if credentials are set
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Salespersons';

    result.details.hasApiKey = !!apiKey && apiKey !== '' && !apiKey.includes('YOUR_');
    result.details.hasBaseId = !!baseId && baseId !== '' && !baseId.includes('YOUR_');
    result.details.tableName = tableName;

    if (!result.details.hasApiKey || !result.details.hasBaseId) {
        result.status = 'error';
        result.message = 'Missing API key or Base ID';
        result.details.fix = 'Add AIRTABLE_API_KEY and AIRTABLE_BASE_ID to environment variables';
        return result;
    }

    // Test actual connection
    try {
        const base = new Airtable({ apiKey }).base(baseId);

        // Try to read records (tests both connection and read permission)
        const records = await base(tableName)
            .select({ maxRecords: 1 })
            .firstPage();

        result.details.connectionSuccessful = true;
        result.details.canRead = true;
        result.details.recordCount = records.length;

        // Try to verify the table schema
        if (records.length > 0) {
            const firstRecord = records[0];
            const fields = firstRecord.fields;
            const requiredFields = ['Salesperson Name', 'Email', 'Tier', 'Status'];
            const missingFields = requiredFields.filter(f => !(f in fields));

            result.details.schemaValid = missingFields.length === 0;
            if (missingFields.length > 0) {
                result.details.missingFields = missingFields;
                result.status = 'warning';
                result.message = `Connected but missing fields: ${missingFields.join(', ')}`;
                return result;
            }
        }

        // Test write permission (dry run - we'll check if we can create)
        // Note: We won't actually create a record, but we can infer from permissions
        result.details.assumeCanWrite = true; // We'll know for sure when user tries to register

        result.status = 'valid';
        result.message = '✅ Connected successfully with read permissions';

    } catch (error) {
        result.status = 'error';
        result.details.connectionSuccessful = false;

        if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase();

            if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid api key')) {
                result.message = '❌ Invalid API key';
                result.details.fix = 'Check that your AIRTABLE_API_KEY is correct and has not expired';
            } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                result.message = '❌ Base or table not found';
                result.details.fix = 'Verify AIRTABLE_BASE_ID and AIRTABLE_TABLE_NAME are correct';
            } else if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
                result.message = '❌ Permission denied';
                result.details.fix = 'Edit your token at https://airtable.com/create/tokens and add access to this base';
            } else {
                result.message = `❌ Connection failed: ${error.message}`;
                result.details.error = error.message;
            }
        }
    }

    return result;
}

/**
 * Test Zapier webhook configuration
 */
async function testZapier() {
    const result = {
        service: 'Zapier',
        status: 'not_configured',
        message: '',
        details: {} as Record<string, any>
    };

    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

    result.details.hasWebhookUrl = !!webhookUrl && webhookUrl !== '';

    if (!result.details.hasWebhookUrl) {
        result.status = 'optional';
        result.message = '⚠️ Not configured (optional - for HubSpot integration)';
        return result;
    }

    // Validate URL format
    try {
        const url = new URL(webhookUrl);
        result.details.urlValid = url.protocol === 'https:' && url.hostname.includes('zapier.com');

        if (!result.details.urlValid) {
            result.status = 'warning';
            result.message = '⚠️ URL doesn\'t look like a Zapier webhook';
            return result;
        }

        // Test webhook with a test payload
        const testPayload = {
            test: true,
            event_type: 'validation_test',
            timestamp: new Date().toISOString(),
            source: 'env_validator'
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload),
        });

        result.details.responseStatus = response.status;
        result.details.webhookResponded = response.ok;

        if (response.ok) {
            result.status = 'valid';
            result.message = '✅ Webhook responded successfully (test event sent)';
        } else {
            result.status = 'warning';
            result.message = `⚠️ Webhook returned status ${response.status}`;
        }

    } catch (error) {
        result.status = 'error';
        result.message = '❌ Failed to reach webhook';
        if (error instanceof Error) {
            result.details.error = error.message;
        }
    }

    return result;
}

/**
 * Test Chatbase API configuration
 */
async function testChatbase() {
    const result = {
        service: 'Chatbase',
        status: 'not_configured',
        message: '',
        details: {} as Record<string, any>
    };

    const apiKey = process.env.CHATBASE_API_KEY;

    result.details.hasApiKey = !!apiKey && apiKey !== '';

    if (!result.details.hasApiKey) {
        result.status = 'optional';
        result.message = '⚠️ Not configured (optional - for Elite tier AI chat)';
        return result;
    }

    // Chatbase API validation would require actual API call
    // For now, we just verify the format
    result.details.keyFormatValid = apiKey.length > 10; // Basic validation

    if (!result.details.keyFormatValid) {
        result.status = 'warning';
        result.message = '⚠️ API key looks invalid (too short)';
        return result;
    }

    result.status = 'valid';
    result.message = '✅ API key present (actual validation happens during chat usage)';

    return result;
}

/**
 * Test Next.js public URL configuration
 */
function testNextPublicUrl() {
    const result = {
        service: 'Next.js Public URL',
        status: 'not_configured',
        message: '',
        details: {} as Record<string, any>
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    result.details.hasBaseUrl = !!baseUrl && baseUrl !== '';
    result.details.value = baseUrl || 'Not set';

    if (!baseUrl) {
        result.status = 'warning';
        result.message = '⚠️ Not set (will use default, but should be set for production)';
        result.details.fix = 'Set NEXT_PUBLIC_BASE_URL to your Vercel domain (e.g., https://your-app.vercel.app)';
        return result;
    }

    try {
        const url = new URL(baseUrl);
        result.details.urlValid = url.protocol === 'https:' || url.protocol === 'http:';

        if (result.details.urlValid) {
            result.status = 'valid';
            result.message = `✅ Set to: ${baseUrl}`;
        } else {
            result.status = 'warning';
            result.message = '⚠️ Invalid URL format';
        }
    } catch {
        result.status = 'error';
        result.message = '❌ Invalid URL format';
    }

    return result;
}
