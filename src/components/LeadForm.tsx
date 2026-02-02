'use client';

import { useState } from 'react';
import { Salesperson } from '../types';

interface LeadFormProps {
    salesperson: Salesperson;
}

export default function LeadForm({ salesperson }: LeadFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            salespersonId: salesperson.id,
            salespersonName: salesperson.name,
            salespersonEmail: salesperson.email,
            tier: salesperson.tier,
            timestamp: new Date().toISOString(),
        };

        try {
            const res = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center p-8 bg-muted rounded-2xl border border-accent/20">
                <h3 className="text-2xl font-bold text-accent mb-2">Thank You!</h3>
                <p className="text-muted-foreground">Your request has been sent to {salesperson.name}.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-muted-foreground">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-accent/10 focus:border-accent/50 outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-muted-foreground">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-accent/10 focus:border-accent/50 outline-none transition-all"
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1 text-muted-foreground">
                    Phone Number (Optional)
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone"
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-accent/10 focus:border-accent/50 outline-none transition-all"
                />
            </div>
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-gold py-4 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-50"
            >
                {status === 'loading' ? 'Sending...' : 'Apply Now'}
            </button>
            {status === 'error' && (
                <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}
        </form>
    );
}
