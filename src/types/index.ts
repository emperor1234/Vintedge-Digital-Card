export type Tier = 'Free' | 'Pro' | 'Elite';

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  tier: Tier;
  photoUrl: string;
  greetingVideoUrl?: string; // For Pro/Elite animated greetings
  greetingText: string;
  qaBank: string; // Used for Chatbase training
  landingPageUrl?: string;
  chatbaseBotId?: string;
  googleReviewUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  status: 'Draft' | 'Ready';
}

export interface LeadSubmission {
  name: string;
  email: string;
  phone?: string;
  salespersonId: string;
  salespersonEmail: string;
  tier: Tier;
  timestamp: string;
}
