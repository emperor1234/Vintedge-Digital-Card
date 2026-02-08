'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, CheckCircle2, CreditCard, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessScreenProps {
    tier: string;
    name: string;
    slug: string;
    price: string;
    interval?: 'monthly' | 'yearly';
}

const VERIFICATION_STEPS = [
    { title: '1. Scan or Tap', text: 'Scan the QR above or tap your NFC card to open your link.' },
    { title: '2. Verify Detail', text: 'Check your avatar, greeting, and social links are correct.' },
    { title: '3. Test Conversion', text: 'Fill out your own lead form to verify CRM/Email delivery.' },
    { title: '4. Save Identity', text: 'Save your own contact to phone to test the vCard file.' }
];

export default function SuccessScreen({ tier, name, slug, price, interval }: SuccessScreenProps) {
    const router = useRouter();

    const getBaseUrl = () => {
        if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
        if (typeof window !== 'undefined') return window.location.origin;
        return 'http://localhost:3000';
    };

    const cardUrl = `${getBaseUrl()}/sales/${slug}`;

    // Tier-specific payment links with fallback to global link
    const getPaymentLink = () => {
        if (tier === 'Free') return process.env.NEXT_PUBLIC_STRIPE_STANDARD_LINK || process.env.NEXT_PUBLIC_PAYMENT_LINK || "https://buy.stripe.com/cNieVdccf4TTfRceEC97G02";
        if (tier === 'Pro') return process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || process.env.NEXT_PUBLIC_PAYMENT_LINK || "https://buy.stripe.com/cNieVdccf4TTfRceEC97G02";
        if (tier === 'Elite') return process.env.NEXT_PUBLIC_STRIPE_ELITE_LINK || process.env.NEXT_PUBLIC_PAYMENT_LINK || "https://buy.stripe.com/cNieVdccf4TTfRceEC97G02";
        return process.env.NEXT_PUBLIC_PAYMENT_LINK || "https://buy.stripe.com/cNieVdccf4TTfRceEC97G02";
    };

    const paymentLink = getPaymentLink();

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
        <div className="max-w-2xl w-full flex flex-col md:flex-row gap-8 items-start animate-in fade-in zoom-in duration-500">
            {/* Left Column: QR & Link */}
            <div className="md:w-1/2 glass p-10 rounded-[3.5rem] border border-accent/20 text-center sticky top-10">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>

                <h1 className="text-3xl font-serif text-gold mb-2">Success!</h1>
                <p className="text-muted-foreground mb-8 text-xs uppercase tracking-widest font-bold">
                    Profile Created for {name}
                </p>

                <div className="bg-white p-6 rounded-3xl mb-8 inline-block shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)]">
                    <QRCodeSVG id="sales-qr" value={cardUrl} size={160} level="H" includeMargin={false} />
                </div>

                <div className="flex flex-col gap-3 mb-4">
                    <button onClick={downloadQR} className="flex items-center justify-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
                        <Download className="w-4 h-4" /> Download QR
                    </button>
                    <a href={cardUrl} target="_blank" className="flex items-center justify-center gap-2 text-white/40 text-[10px] uppercase tracking-widest hover:text-accent transition-colors">
                        <ExternalLink className="w-3 h-3" /> Preview Live Card
                    </a>
                </div>
            </div>

            {/* Right Column: Payment & Verification */}
            <div className="md:w-1/2 space-y-6">
                {/* Payment Section */}
                <div className="glass p-8 rounded-[2.5rem] border border-accent/30 bg-accent/5">
                    <h3 className="text-xl font-serif text-gold mb-4">Finalize Activation</h3>
                    <p className="text-xs text-foreground/80 mb-6 leading-relaxed">
                        To activate your <strong>{tier}</strong> plan and ship your physical card, please complete the <span className="text-accent font-bold">{price}</span> payment via Vintedge Digital Card Payments.
                        {interval && <span className="block mt-1 text-[10px] opacity-60">(Includes Card + {interval} subscription)</span>}
                    </p>

                    <a
                        href={paymentLink}
                        target="_blank"
                        className="w-full btn-gold py-4 rounded-xl flex items-center justify-center gap-3 group shadow-xl"
                    >
                        <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="uppercase tracking-widest font-bold text-sm">Pay {price} Now</span>
                    </a>

                    <p className="text-[9px] text-muted-foreground mt-4 text-center uppercase tracking-tighter opacity-50">
                        Secure activation powered by Stripe
                    </p>
                </div>

                {/* Verification Section */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-lg font-serif text-gold mb-4">How to Verify</h3>
                    <div className="space-y-4">
                        {VERIFICATION_STEPS.map((step, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="text-accent font-black text-xs mt-1 opacity-50">{i + 1}</div>
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-foreground">{step.title}</div>
                                    <div className="text-[10px] text-muted-foreground leading-relaxed">{step.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="w-full text-center text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:text-accent transition-colors py-4"
                >
                    Return Home
                </button>
            </div>
        </div>
    );
}

