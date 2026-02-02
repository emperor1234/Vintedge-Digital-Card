import { NextResponse } from 'next/server';
import { getSalespersonBySlug } from '@/lib/airtable';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const salesperson = await getSalespersonBySlug(slug);

    if (!salesperson) {
        return new NextResponse('Not Found', { status: 404 });
    }

    // Fetch and convert photo to Base64 for the vCard
    let photoBase64 = '';
    if (salesperson.photoUrl) {
        try {
            const photoRes = await fetch(salesperson.photoUrl);
            if (photoRes.ok) {
                const buffer = await photoRes.arrayBuffer();
                photoBase64 = Buffer.from(buffer).toString('base64');
            }
        } catch (e) {
            // Silently handle photo fetch errors
        }
    }

    // Generate VCF content
    const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${salesperson.name}`,
        `ORG:Vintedge Digital`,
        `TITLE:${salesperson.jobTitle}`,
        `TEL;TYPE=CELL,VOICE:${salesperson.phone}`,
        `EMAIL;TYPE=PREF,INTERNET:${salesperson.email}`,
        `URL:${process.env.NEXT_PUBLIC_BASE_URL || ''}/sales/${slug}`,
    ];

    if (photoBase64) {
        vcard.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`);
    }

    vcard.push('END:VCARD');

    return new NextResponse(vcard.join('\r\n'), {
        headers: {
            'Content-Type': 'text/vcard',
            'Content-Disposition': `attachment; filename="${slug}.vcf"`,
        },
    });
}
