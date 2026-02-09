'use client';

import { Phone, MessageSquare, Mail, UserPlus, Instagram, Linkedin, Facebook, Star } from 'lucide-react';
import { Salesperson } from '@/types';

interface SalesActionsProps {
    salesperson: Salesperson;
    slug: string;
}

export default function SalesActions({ salesperson, slug }: SalesActionsProps) {
    const track = (event: string) => {
        fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            },
            body: JSON.stringify({ salespersonId: salesperson.id, event })
        }).catch(() => {});
    };

    return (
        <>
            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <a
                    href={`tel:${salesperson.phone}`}
                    onClick={() => track('click_call')}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                >
                    <Phone className="w-5 h-5 text-accent" />
                    <span className="text-xs uppercase font-bold tracking-widest">Call</span>
                </a>
                <a
                    href={`sms:${salesperson.phone}`}
                    onClick={() => track('click_text')}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                >
                    <MessageSquare className="w-5 h-5 text-accent" />
                    <span className="text-xs uppercase font-bold tracking-widest">Text</span>
                </a>
                <a
                    href={`mailto:${salesperson.email}`}
                    onClick={() => track('click_email')}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                >
                    <Mail className="w-5 h-5 text-accent" />
                    <span className="text-xs uppercase font-bold tracking-widest">Email</span>
                </a>
                <a
                    href={`/api/vcf/${slug}`}
                    onClick={() => track('click_save')}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted transition-all group"
                >
                    <UserPlus className="w-5 h-5 text-accent" />
                    <span className="text-xs uppercase font-bold tracking-widest">Save</span>
                </a>
            </div>

            {/* Social Media & Reviews */}
            {(salesperson.tier === 'Pro' || salesperson.tier === 'Elite') && (
                <div className="w-full flex flex-col gap-6">
                    <div className="flex justify-center gap-6">
                        {salesperson.instagramUrl && (
                            <a
                                href={salesperson.instagramUrl}
                                target="_blank"
                                onClick={() => track('click_instagram')}
                                className="p-3 bg-muted/30 rounded-full hover:text-accent transition-colors"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        )}
                        {salesperson.linkedinUrl && (
                            <a
                                href={salesperson.linkedinUrl}
                                target="_blank"
                                onClick={() => track('click_linkedin')}
                                className="p-3 bg-muted/30 rounded-full hover:text-accent transition-colors"
                            >
                                <Linkedin className="w-6 h-6" />
                            </a>
                        )}
                        {salesperson.facebookUrl && (
                            <a
                                href={salesperson.facebookUrl}
                                target="_blank"
                                onClick={() => track('click_facebook')}
                                className="p-3 bg-muted/30 rounded-full hover:text-accent transition-colors"
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                        )}
                    </div>

                    {salesperson.googleReviewUrl && (
                        <a
                            href={salesperson.googleReviewUrl}
                            target="_blank"
                            onClick={() => track('click_google_review')}
                            className="flex items-center justify-center gap-3 p-4 rounded-full border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all group"
                        >
                            <Star className="w-5 h-5 text-accent fill-accent" />
                            <span className="text-xs uppercase font-bold tracking-[0.2em] text-accent">Review Me on Google</span>
                        </a>
                    )}
                </div>
            )}
        </>
    );
}
