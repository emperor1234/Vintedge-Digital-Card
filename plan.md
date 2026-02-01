# Implementation Plan - Automation House

## 1. Project Overview
A premium digital business card system for Vintedge Digital. One Airtable record drives a high-conversion Next.js page with lead routing to HubSpot via Zapier and personalized AI via Chatbase.

## 4. Implementation Steps

### Phase 1: Environment & Setup
- [x] Initialize Next.js project
- [x] Install dependencies (`airtable`, `lucide-react`)
- [x] Configure `.env.local`

### Phase 2: Data & Logic
- [x] Create `lib/airtable.ts` for fetching salesperson data.
- [x] Implement slug generation logic.

### Phase 3: Components (Atomic Design)
- [x] `Header.tsx`: Logo (CSS-based).
- [x] `Avatar.tsx`: Round profile image.
- [x] `ContactButtons.tsx`: Call, Email, Text buttons.
- [x] `LeadForm.tsx`: Premium capture form.
- [x] `ChatbaseWidget.tsx`: Dynamic AI embed.

### Phase 4: Dynamic Pages
- [x] Implement `src/app/sales/[slug]/page.tsx`.
- [x] Add 404 handling for invalid slugs or non-ready status.
- [x] Add loading states.

### Phase 5: Lead Routing
- [x] Create `src/app/api/lead/route.ts` to forward form data to Zapier.

### Phase 6: Polish & Performance
- [x] Responsive UI audit.
- [x] Performance optimization (Inter font, Next/Image).

## 5. Deployment Checklist
1. Create Airtable base using `SCHEMA.md`.
2. Connect Zapier to `ZAPIER_WEBHOOK_URL`.
3. Set Vercel Environment Variables.
4. Deploy and tap!
