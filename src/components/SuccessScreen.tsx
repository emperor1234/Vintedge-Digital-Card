'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, CheckCircle2, CreditCard, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessScreenProps {
    tier: string;
    name: string;
    slug: string;
    price: string;
}

export default function SuccessScreen({ tier, name, slug, price }: SuccessScreenProps) {
    const router = useRouter();
    const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/sales/${slug}`;

    const downloadQR = () => {
        const svg = document.getElementById('sales-qr');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `${slug}-qr-code.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <div className="max-w-md w-full glass p-10 rounded-[3.5rem] border border-accent/20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>

            <h1 className="text-3xl font-serif text-gold mb-2">Registration Success</h1>
            <p className="text-muted-foreground mb-8 text-sm">
                Welcome to the <span className="text-accent font-bold">{tier}</span> tier, {name}.
            </p>

            {/* QR Code Section */}
            <div className="bg-white p-6 rounded-3xl mb-8 inline-block shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)]">
                <QRCodeSVG
                    id="sales-qr"
                    value={cardUrl}
                    size={180}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                        src: "/logo.png", // Fallback if you have a logo
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                    }}
                />
            </div>

            <div className="flex flex-col gap-3 mb-8">
                <button
                    onClick={downloadQR}
                    className="flex items-center justify-center gap-2 text-accent text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                    <Download className="w-4 h-4" /> Download QR for Print
                </button>
                <a
                    href={cardUrl}
                    target="_blank"
                    className="flex items-center justify-center gap-2 text-white/40 text-[10px] uppercase tracking-widest hover:text-accent transition-colors"
                >
                    <ExternalLink className="w-3 h-3" /> Preview Live Link
                </a>
            </div>

            {tier !== 'Free' ? (
                <div className="bg-muted/50 p-6 rounded-2xl border border-accent/10">
                    <p className="text-xs text-foreground/80 mb-4 leading-relaxed">
                        Your card is currently in <strong className="text-gold">Draft Mode</strong>.<br />
                        Activate it instantly by completing the one-time <strong>{price}</strong> setup fee.
                    </p>
                    <a
                        href="https://buy.stripe.com/cNieVdccf4TTfRceEC97G02"
                        target="_blank"
                        className="w-full btn-gold py-4 rounded-xl flex items-center justify-center gap-3 group shadow-lg"
                    >
                        <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Pay {price} with Stripe
                    </a>
                    <p className="text-[9px] text-muted-foreground mt-4 uppercase tracking-tighter">
                        Secure checkout powered by Stripe.
                    </p>
                </div>
            ) : (
                <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10">
                    <p className="text-xs text-accent mb-0 leading-relaxed font-bold">
                        Your Profile is Live!
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                        Toggle status to "Ready" in your admin email to view.
                    </p>
                </div>
            )}

            <button
                onClick={() => router.push('/')}
                className="mt-8 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:text-accent transition-colors"
            >
                Back to Home
            </button>
        </div>
    );
}
