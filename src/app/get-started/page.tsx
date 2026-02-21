'use client';



import { useState } from 'react';



<<<<<<< HEAD
import { User, Mail, Phone, Briefcase, Star, Instagram, Linkedin, CheckCircle2, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
=======
import { User, Mail, Phone, Briefcase, Star, Instagram, Linkedin, CheckCircle2, ChevronRight, ChevronLeft, Upload, X } from 'lucide-react';
>>>>>>> 83d5290c5f3f7edaea5189d65dcb1f6e6f7edf5d

import SuccessScreen from '@/components/SuccessScreen';



const BASE_CARD_PRICE = 125;

const TIERS = [
    {
        id: 'Free',
        name: 'Standard',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'The foundation of your digital presence.',
        features: ['Digital Business Card', 'Standard QR Code', 'Email Support']
    },
    {
        id: 'Pro',
        name: 'Professional',
        monthlyPrice: 45,
        yearlyPrice: 450,
        description: 'Advanced tools for active sales pros.',
        features: ['Living Avatar (Video)', 'Lead Capture Form', 'Direct Social Ties', 'Priority Support']
    },
    {
        id: 'Elite',
        name: 'Elite AI',
        monthlyPrice: 125,
        yearlyPrice: 1250,
        description: 'Full AI automation and 24/7 engagement.',
        features: ['AI Assistant (Chatbase)', 'Advanced Tap Analytics', 'Google Review Integration', 'Premium vCard Engine']
    }
];




export default function OnboardingPage() {

    const [step, setStep] = useState(1);
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [submissionData, setSubmissionData] = useState<{ slug: string } | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string>('');

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

        photoUrl: '',

        greetingVideoUrl: '',

        tier: 'Free'

    });

    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);







    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

<<<<<<< HEAD
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
            setStatus('error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('File too large. Maximum size is 5MB.');
            setStatus('error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to S3
        setPhotoUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
=======
        setUploadingPhoto(true);
        
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
>>>>>>> 83d5290c5f3f7edaea5189d65dcb1f6e6f7edf5d
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, photoUrl: data.url }));
<<<<<<< HEAD
                setErrorMessage('');
                setStatus('idle');
            } else {
                setErrorMessage(data.error || 'Upload failed. Please try again or use a URL instead.');
                setStatus('error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setErrorMessage('Upload failed. Please try again or use a URL instead.');
            setStatus('error');
        } finally {
            setPhotoUploading(false);
        }
    };

=======
                setPhotoPreview(data.url);
            } else {
                setErrorMessage(data.error || 'Failed to upload image');
            }
        } catch (error) {
            setErrorMessage('Failed to upload image');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const clearPhoto = () => {
        setFormData(prev => ({ ...prev, photoUrl: '' }));
        setPhotoPreview('');
    };

>>>>>>> 83d5290c5f3f7edaea5189d65dcb1f6e6f7edf5d


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
                setErrorMessage(data.error || 'Registration failed. Please check your details and try again.');
                if (data.details) {
                    console.error('Server error details:', data.details);
                }
                setStatus('error');
            }

        } catch (error) {
            console.error('Network error:', error);
            setErrorMessage('Network error. Please check your connection and try again.');
            setStatus('error');
        }

    };



    if (status === 'success' && submissionData) {
        return (


            <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">

                <SuccessScreen
                    tier={formData.tier}
                    name={formData.name}
                    slug={submissionData.slug}
                    price={formData.tier === 'Free' ? `$${BASE_CARD_PRICE}` : `$${BASE_CARD_PRICE + (billingInterval === 'monthly' ? (TIERS.find(t => t.id === formData.tier)?.monthlyPrice || 0) : (TIERS.find(t => t.id === formData.tier)?.yearlyPrice || 0))}`}
                    interval={billingInterval}
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
                        <div className="space-y-12">
                            {/* Billing Toggle */}
                            <div className="flex justify-center mb-8">
                                <div className="bg-muted/50 p-1 rounded-2xl border border-white/5 flex items-center relative w-[360px] max-w-full">
                                    <button
                                        onClick={() => setBillingInterval('monthly')}
                                        className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all relative z-10 ${billingInterval === 'monthly' ? 'text-background' : 'text-muted-foreground'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingInterval('yearly')}
                                        className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all relative z-10 ${billingInterval === 'yearly' ? 'text-background' : 'text-muted-foreground'}`}
                                    >
                                        Yearly <span className="text-[10px] opacity-70 ml-1">(2 Months Free)</span>
                                    </button>
                                    <div
                                        className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-accent rounded-xl transition-all duration-300 ${billingInterval === 'yearly' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {TIERS.map((tier) => (
                                    <div
                                        key={tier.id}
                                        onClick={() => setFormData(prev => ({ ...prev, tier: tier.id }))}
                                        className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer relative flex flex-col ${formData.tier === tier.id ? 'bg-accent/10 border-accent shadow-[0_0_40px_-10px_rgba(212,175,55,0.2)]' : 'bg-muted/30 border-white/5 hover:border-white/10 hover:bg-muted/40'}`}
                                    >
                                        <div className="mb-6">
                                            <h3 className={`text-2xl font-serif mb-1 ${formData.tier === tier.id ? 'text-accent' : 'text-gold'}`}>{tier.name}</h3>
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-black">
                                                        ${billingInterval === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-widest opacity-40">/ {billingInterval}</span>
                                                </div>
                                                <div className="text-[10px] text-accent font-bold mt-1">
                                                    + ${BASE_CARD_PRICE} Card Setup
                                                </div>
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

                            <div className="text-center bg-accent/5 p-4 rounded-2xl border border-accent/10">
                                <p className="text-xs text-muted-foreground">
                                    Total due today: <span className="text-accent font-bold">
                                        ${BASE_CARD_PRICE + (billingInterval === 'monthly' ? (TIERS.find(t => t.id === formData.tier)?.monthlyPrice || 0) : (TIERS.find(t => t.id === formData.tier)?.yearlyPrice || 0))}
                                    </span>
                                </p>
                            </div>
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

                            <div className="pt-6 border-t border-white/5">

                                <label className="text-sm font-serif text-accent flex items-center gap-2 mb-3">

                                    <User className="w-4 h-4" /> 1. Profile Image (Optional)

                                </label>

                                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
<<<<<<< HEAD
                                    {/* File Upload Button */}
                                    <div className="mb-4">
                                        <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent/10 hover:bg-accent/20 border border-accent/30 border-dashed rounded-xl cursor-pointer transition-all">
                                            <Upload className="w-4 h-4 text-accent" />
                                            <span className="text-sm text-accent">
                                                {photoUploading ? 'Uploading...' : 'Click to upload photo'}
=======
                                    <div className="flex gap-3 mb-4">
                                        <label className="flex-1 cursor-pointer bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all">
                                            <Upload className="w-4 h-4 text-accent" />
                                            <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                                {uploadingPhoto ? 'Uploading...' : 'Upload Image'}
>>>>>>> 83d5290c5f3f7edaea5189d65dcb1f6e6f7edf5d
                                            </span>
                                            <input 
                                                type="file" 
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                onChange={handlePhotoUpload}
<<<<<<< HEAD
                                                disabled={photoUploading}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-[10px] text-muted-foreground text-center mt-2">Max 5MB. JPEG, PNG, WebP, or GIF</p>
                                    </div>
                                    
                                    {/* Preview */}
                                    {(photoPreview || formData.photoUrl) && (
                                        <div className="mb-4 flex justify-center">
                                            <img 
                                                src={formData.photoUrl || photoPreview || ''} 
                                                alt="Preview" 
                                                className="w-24 h-24 object-cover rounded-full border-2 border-accent/30"
=======
                                                disabled={uploadingPhoto}
                                                className="hidden"
                                            />
                                        </label>
                                        {formData.photoUrl && (
                                            <button
                                                type="button"
                                                onClick={clearPhoto}
                                                className="px-4 py-3 rounded-xl bg-muted/50 border border-white/5 hover:bg-muted transition-all"
                                            >
                                                <X className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {photoPreview && (
                                        <div className="mb-4 relative w-24 h-24 mx-auto">
                                            <img 
                                                src={photoPreview} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover rounded-xl border-2 border-accent/30"
>>>>>>> 83d5290c5f3f7edaea5189d65dcb1f6e6f7edf5d
                                            />
                                        </div>
                                    )}

<<<<<<< HEAD
                                    <div className="relative flex items-center my-4">
                                        <div className="flex-1 h-px bg-accent/20"></div>
                                        <span className="px-3 text-xs text-muted-foreground">OR</span>
                                        <div className="flex-1 h-px bg-accent/20"></div>
                                    </div>

                                    <p className="text-[11px] text-muted-foreground mb-4">
                                        Paste a direct link to your photo instead.
=======
                                    <p className="text-[11px] text-muted-foreground mb-4">
                                        Or paste a direct image link below.
                                        Don&apos;t have one yet? Upload your photo using the button above.
>>>>>>> 83d5290c5f3f7edaea5189d65dcb1f6e6f7edf5d
                                    </p>
                                    <input name="photoUrl" value={formData.photoUrl} onChange={handleInputChange} placeholder="Paste direct image link (e.g. https://.../photo.jpg)" className="w-full bg-background/50 border border-accent/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-all text-sm mb-2" />
                                    <p className="text-[10px] text-muted-foreground italic">Important: Ensure the link ends in .jpg, .png, or .webp</p>
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

                            {(formData.tier === 'Pro' || formData.tier === 'Elite') && (
                                <div className="pt-6 border-t border-white/5">
                                    <label className="text-sm font-serif text-accent flex items-center gap-2 mb-3">
                                        ✨ 2. Intro Video / Living Avatar (Optional)
                                    </label>
                                    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                                        <input name="greetingVideoUrl" value={formData.greetingVideoUrl} onChange={handleInputChange} placeholder="Paste direct MP4 link (e.g. https://.../video.mp4)" className="w-full bg-background/50 border border-accent/10 rounded-xl px-6 py-4 outline-none focus:border-accent transition-all text-sm mb-2" />
                                        <p className="text-[11px] text-muted-foreground">Tip: A short 5-10 second greeting video works best!</p>
                                    </div>
                                </div>
                            )}

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

                    {/* Error Display */}
                    {status === 'error' && errorMessage && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                        </div>
                    )}

                </div>

            </div>

        </main>

    );

}

