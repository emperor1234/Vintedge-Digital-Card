import { getSalespersonBySlug } from '@/lib/airtable';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import LeadForm from '@/components/LeadForm';
import ChatbaseWidget from '@/components/ChatbaseWidget';
import PageTracker from '@/components/PageTracker';
import SalesActions from '@/components/SalesActions';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

export default async function SalespersonPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const salesperson = await getSalespersonBySlug(slug);

    if (!salesperson) {
        notFound();
    }

    const { tier } = salesperson;

    return (
        <main className="min-h-screen flex flex-col items-center justify-start py-12 px-4 bg-background overflow-x-hidden">
            <PageTracker salespersonId={salesperson.id} slug={slug} />

            {/* Logo */}
            <div className="mb-12 opacity-80">
                <div className="text-accent font-bold text-center tracking-tighter text-2xl">
                    VINTEDGE<br />
                    <span className="text-[10px] tracking-[0.4em] uppercase opacity-70 block -mt-1">Digital</span>
                </div>
            </div>

            {/* Container Card */}
            <div className="w-full max-w-md glass rounded-[3rem] p-8 flex flex-col items-center shadow-2xl relative border-accent/10">

                {/* Profile/Living Avatar Section */}
                {(salesperson.photoUrl || (tier !== 'Free' && salesperson.greetingVideoUrl)) && (
                    <div className="relative w-48 h-48 mb-8 group">
                        <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl group-hover:bg-accent/40 transition-all duration-700"></div>
                        <div className="relative w-full h-full rounded-full border-4 border-accent/50 p-1.5 overflow-hidden bg-card">
                            {(tier === 'Pro' || tier === 'Elite') && salesperson.greetingVideoUrl ? (
                                <video
                                    src={salesperson.greetingVideoUrl}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : salesperson.photoUrl ? (
                                <Image
                                    src={salesperson.photoUrl}
                                    alt={salesperson.name}
                                    fill
                                    className="object-cover rounded-full scale-105"
                                />
                            ) : null}
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif text-gold mb-2 leading-tight">
                        {salesperson.name}
                    </h1>
                    <p className="text-muted-foreground uppercase tracking-[0.25em] text-[10px] font-bold">
                        {salesperson.jobTitle}
                    </p>
                </div>

                <SalesActions salesperson={salesperson} slug={slug} />

                {/* Greeting Text */}
                <div className="text-center mb-10 px-2">
                    <p className="text-base leading-relaxed font-light text-foreground/80 italic">
                        &ldquo;{salesperson.greetingText}&rdquo;
                    </p>
                </div>

                {/* Tier Specific: Lead Form */}
                {(tier === 'Pro' || tier === 'Elite') && (
                    <div className="w-full mb-10">
                        <LeadForm salesperson={salesperson} />
                    </div>
                )}


                {/* Elite Disclaimer */}
                {tier === 'Elite' && (
                    <div className="mt-8 text-center opacity-40">
                        <p className="text-[9px] uppercase tracking-[0.4em] font-black animate-pulse">
                            AI-Assisted Experience Enabled
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-12 opacity-20 text-[10px] uppercase tracking-[0.5em] font-bold">
                Powered by <span className="text-accent underline decoration-accent/30 underline-offset-4">Automation House</span>
            </div>

            {/* Elite Tier: Chatbase Widget */}
            {tier === 'Elite' && salesperson.chatbaseBotId && (
                <ChatbaseWidget botId={salesperson.chatbaseBotId} />
            )}
        </main>
    );
}
