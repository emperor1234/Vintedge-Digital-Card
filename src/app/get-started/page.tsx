'use client';



import { useState } from 'react';



import { User, Mail, Phone, Briefcase, Star, Instagram, Linkedin, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

import SuccessScreen from '@/components/SuccessScreen';



const TIERS = [

    {

        id: 'Free',

        name: 'Free',

        price: '$0',

        description: 'Basic digital presence',

        features: ['Standard Contact Card', 'Basic QR Code', 'Email Support']

    },

    {

        id: 'Pro',

        name: 'Pro',

        price: '$45',

        description: 'Professional sales tool',

        features: ['Living Avatar (Video)', 'Lead Capture Form', 'Direct Social Ties', 'Priority Support']

    },

    {

        id: 'Elite',

        name: 'Elite',

        price: '$125',

        description: 'AI-Powered empire builder',

        features: ['AI Support (Chatbase)', 'Advanced Tap Analytics', 'Google Review Integration', 'Premium vCard Engine']

    }

];



export default function OnboardingPage() {

    const [step, setStep] = useState(1);

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const [submissionData, setSubmissionData] = useState<{ slug: string } | null>(null);

    const [formData, setFormData] = useState({

        name: '',

        email: '',

        phone: '',

        jobTitle: '',

        linkedinUrl: '',

        instagramUrl: '',

        facebookUrl: '',

        googleReviewUrl: '',

        greetingText: '',

        qaBank: '',

        tier: 'Free'

    });



    



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

    };



    const nextStep = () => setStep(prev => prev + 1);

    const prevStep = () => setStep(prev => prev - 1);



    const handleSubmit = async () => {

        setStatus('loading');



        try {

            const res = await fetch('/api/onboard', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },

                body: JSON.stringify(formData),

            });



            const data = await res.json();



            if (res.ok) {

                setSubmissionData({ slug: data.slug });

                setStatus('success');

            } else {

                setStatus('error');

            }

} catch {

            setStatus('error');

        }

    };



    if (status === 'success' && submissionData) {

        const selectedTier = TIERS.find(t => t.id === formData.tier);

        return (

            <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">

                <SuccessScreen

                    tier={formData.tier}

                    name={formData.name}

                    slug={submissionData.slug}

                    price={selectedTier?.price || '$0'}

                />

            </main>

        );

    }



    return (

<main className="min-h-screen py-20 px-6 bg-background relative">
            <div className="absolute inset-0 bg-gradient-radial from-accent/3 via-transparent to-transparent"></div>
            <div className={`mx-auto relative transition-all duration-500 ${step === 1 ? 'max-w-5xl' : 'max-w-2xl'}`}>

                {/* Progress Bar */}

                <div className="mb-12 flex items-center justify-between px-2 max-w-2xl mx-auto">

                    {[1, 2, 3, 4].map((s) => (

                        <div key={s} className="flex items-center gap-2">

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step >= s ? 'bg-accent border-accent text-background' : 'border-white/10 text-muted-foreground'}`}>

                                {s}

                            </div>

                            {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-accent' : 'bg-white/5'}`}></div>}

                        </div>

                    ))}

                </div>



                <div className="text-center mb-12">

                    {step === 1 && <h1 className="text-5xl font-serif text-gold">Select Your Strategy</h1>}

                    {step === 2 && <h1 className="text-4xl font-serif text-gold">The Basics</h1>}

                    {step === 3 && <h1 className="text-4xl font-serif text-gold">Social Intelligence</h1>}

                    {step === 4 && <h1 className="text-4xl font-serif text-gold">Elite Branding</h1>}

                    <p className="text-muted-foreground mt-2">Step {step} of 4</p>

                </div>



                <div className="glass p-10 rounded-[3rem] border border-accent/10 min-h-[500px] flex flex-col justify-between relative overflow-hidden">



                    {/* STEP 1: TIER SELECTION (Side-by-Side) */}

                    {step === 1 && (

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {TIERS.map((tier) => (

                                <div

                                    key={tier.id}

                                    onClick={() => setFormData(prev => ({ ...prev, tier: tier.id }))}

                                    className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer relative flex flex-col ${formData.tier === tier.id ? 'bg-accent/10 border-accent shadow-[0_0_40px_-10px_rgba(212,175,55,0.2)]' : 'bg-muted/30 border-white/5 hover:border-white/10 hover:bg-muted/40'}`}

                                >

                                    <div className="mb-6">

                                        <h3 className={`text-2xl font-serif mb-1 ${formData.tier === tier.id ? 'text-accent' : 'text-gold'}`}>{tier.name}</h3>

                                        <div className="flex items-baseline gap-1">

                                            <span className="text-3xl font-black">{tier.price}</span>

                                            <span className="text-[10px] uppercase tracking-widest opacity-40">/ Setup</span>

                                        </div>

                                    </div>



                                    <p className="text-xs text-muted-foreground mb-6 leading-relaxed h-10">{tier.description}</p>



                                    <ul className="space-y-4 mb-8 flex-1">

                                        {tier.features.map(f => (

                                            <li key={f} className="text-[11px] text-foreground/80 flex items-start gap-2 leading-tight">

                                                <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${formData.tier === tier.id ? 'text-accent' : 'text-accent/40'}`} />

                                                {f}

                                            </li>

                                        ))}

                                    </ul>



                                    <div className={`w-full py-3 rounded-xl border text-[10px] uppercase font-bold tracking-widest text-center transition-all ${formData.tier === tier.id ? 'bg-accent text-background border-accent' : 'border-accent/30 text-accent group-hover:bg-accent/5'}`}>

                                        {formData.tier === tier.id ? 'Selected' : 'Select Plan'}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}



                    {/* STEP 2: BASICS */}

                    {step === 2 && (

                        <div className="space-y-8">

                            <div className="space-y-2">

                                <label className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">

                                    <User className="w-3 h-3 text-accent" /> Full Name

                                </label>

                                <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light" />

                            </div>

                            <div className="space-y-2">

                                <label className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">

                                    <Mail className="w-3 h-3 text-accent" /> Email Address

                                </label>

                                <input name="email" value={formData.email} onChange={handleInputChange} type="email" required placeholder="john@example.com" className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light" />

                            </div>

                            <div className="grid grid-cols-2 gap-6">

                                <div className="space-y-2">

                                    <label className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">

                                        <Phone className="w-3 h-3 text-accent" /> Phone

                                    </label>

                                    <input name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+1 234..." className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light" />

                                </div>

                                <div className="space-y-2">

                                    <label className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">

                                        <Briefcase className="w-3 h-3 text-accent" /> Job Title

                                    </label>

                                    <input name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} required placeholder="Advisor" className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light" />

                                </div>

                            </div>

                        </div>

                    )}



                    {/* STEP 3: SOCIAL */}

                    {step === 3 && (

                        <div className="space-y-6">

                            <div className="space-y-2">

                                <label className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">

                                    <Linkedin className="w-3 h-3 text-accent" /> LinkedIn

                                </label>

                                <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light" />

                            </div>

                            <div className="space-y-2">

                                <label className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">

                                    <Instagram className="w-3 h-3 text-accent" /> Instagram

                                </label>

                                <input name="instagramUrl" value={formData.instagramUrl} onChange={handleInputChange} placeholder="https://instagram.com/..." className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light" />

                            </div>

                            <div className="space-y-2">

                                <label className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">

                                    <Star className="w-3 h-3 text-accent" /> Google Review Link

                                </label>

                                <input name="googleReviewUrl" value={formData.googleReviewUrl} onChange={handleInputChange} placeholder="https://g.page/r/..." className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light" />

                            </div>

                        </div>

                    )}



                    {/* STEP 4: ELITE CONTENT */}

                    {step === 4 && (

                        <div className="space-y-6">

                            <div className="space-y-2">

                                <label className="text-xs font-bold uppercase tracking-widest opacity-70">Personal Greeting</label>

                                <textarea name="greetingText" value={formData.greetingText} onChange={handleInputChange} rows={3} placeholder="Welcome! I specialize in..." className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light resize-none" />

                            </div>

                            <div className="space-y-2">

                                <label className="text-xs font-bold uppercase tracking-widest opacity-70">AI Training Data (Q&A)</label>

                                <textarea name="qaBank" value={formData.qaBank} onChange={handleInputChange} rows={5} placeholder="Describe your expertise for the chatbot..." className="w-full bg-muted/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-accent/40 transition-all font-light resize-none" />

                            </div>

                        </div>

                    )}



                    {/* CONTROLS */}

                    <div className="mt-12 flex gap-4">

                        {step > 1 && (

                            <button

                                onClick={prevStep}

                                className="p-6 rounded-2xl bg-muted/30 border border-white/5 hover:bg-muted/50 transition-all"

                            >

                                <ChevronLeft className="w-6 h-6 text-accent" />

                            </button>

                        )}

                        {step < 4 ? (

                            <button

                                onClick={nextStep}

                                disabled={step === 2 && (!formData.name || !formData.email)}

                                className="flex-1 btn-gold py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"

                            >

                                Continue <ChevronRight className="w-4 h-4" />

                            </button>

                        ) : (

                            <button

                                onClick={handleSubmit}

                                disabled={status === 'loading'}

                                className="flex-1 btn-gold py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-xl disabled:opacity-50"

                            >

                                {status === 'loading' ? 'Processing...' : 'Complete Registration'}

                            </button>

                        )}

                    </div>

                </div>

            </div>

        </main>

    );

}

