import { getSalespersonBySlug } from '@/lib/airtable';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Phone, Mail, MessageSquare, UserPlus, Star, Instagram, Linkedin, Facebook } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import ChatbaseWidget from '@/components/ChatbaseWidget';
import PageTracker from '@/components/PageTracker';

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
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center rounded-full text-5xl font-bold text-accent">
                                {salesperson.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif text-gold mb-2 leading-tight">
                        {salesperson.name}
                    </h1>
                    <p className="text-muted-foreground uppercase tracking-[0.25em] text-[10px] font-bold">
                        {salesperson.jobTitle}
                    </p>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <a
                        href={`tel:${salesperson.phone}`}
                        onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_call' }) })}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                    >
                        <Phone className="w-5 h-5 text-accent" />
                        <span className="text-xs uppercase font-bold tracking-widest">Call</span>
                    </a>
                    <a
                        href={`sms:${salesperson.phone}`}
                        onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_text' }) })}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                    >
                        <MessageSquare className="w-5 h-5 text-accent" />
                        <span className="text-xs uppercase font-bold tracking-widest">Text</span>
                    </a>
                    <a
                        href={`mailto:${salesperson.email}`}
                        onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_email' }) })}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                    >
                        <Mail className="w-5 h-5 text-accent" />
                        <span className="text-xs uppercase font-bold tracking-widest">Email</span>
                    </a>
                    <a
                        href={`/api/vcf/${slug}`}
                        onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_save' }) })}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                    >
                        <UserPlus className="w-5 h-5 text-accent" />
                        <span className="text-xs uppercase font-bold tracking-widest">Save</span>
                    </a>
                </div>

                {/* Greeting Text */}
                <div className="text-center mb-10 px-2">
                    <p className="text-base leading-relaxed font-light text-foreground/80 italic">
                        "{salesperson.greetingText}"
                    </p>
                </div>

                {/* Tier Specific: Lead Form */}
                {(tier === 'Pro' || tier === 'Elite') && (
                    <div className="w-full mb-10">
                        <LeadForm salesperson={salesperson} />
                    </div>
                )}

                {/* Elite/Pro Features: Social Media & Reviews (MOVED TO BOTTOM) */}
                {(tier === 'Pro' || tier === 'Elite') && (
                    <div className="w-full flex flex-col gap-6">
                        {/* Social Tiles */}
                        <div className="flex justify-center gap-6">
                            {salesperson.instagramUrl && (
                                <a
                                    href={salesperson.instagramUrl}
                                    target="_blank"
                                    onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_instagram' }) })}
                                    className="p-3 bg-muted/30 rounded-full hover:text-accent transition-colors"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                            )}
                            {salesperson.linkedinUrl && (
                                <a
                                    href={salesperson.linkedinUrl}
                                    target="_blank"
                                    onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_linkedin' }) })}
                                    className="p-3 bg-muted/30 rounded-full hover:text-accent transition-colors"
                                >
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            )}
                            {salesperson.facebookUrl && (
                                <a
                                    href={salesperson.facebookUrl}
                                    target="_blank"
                                    onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_facebook' }) })}
                                    className="p-3 bg-muted/30 rounded-full hover:text-accent transition-colors"
                                >
                                    <Facebook className="w-6 h-6" />
                                </a>
                            )}
                        </div>

                        {/* Google Review Button */}
                        {salesperson.googleReviewUrl && (
                            <a
                                href={salesperson.googleReviewUrl}
                                target="_blank"
                                onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ salespersonId: salesperson.id, event: 'click_google_review' }) })}
                                className="flex items-center justify-center gap-3 p-4 rounded-full border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all group"
                            >
                                <Star className="w-5 h-5 text-accent fill-accent" />
                                <span className="text-xs uppercase font-bold tracking-[0.2em] text-accent">Review Me on Google</span>
                            </a>
                        )}
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
