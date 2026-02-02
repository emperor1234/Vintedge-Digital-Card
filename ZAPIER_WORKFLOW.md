# Zapier & HubSpot Automation Workflow

This document outlines how to configure the bridge between HubSpot and your Vintedge Digital Card app using Zapier.

## Workflow 1: Lead Capture (Card -> HubSpot)
**Goal:** When a visitor fills out the Lead Form on a digital card, create/update a contact in HubSpot and notify the salesperson.

### 1. Trigger: Webhooks by Zapier
- **Event:** Catch Webhook
- **Webhook URL:** (Copy the one you generated in Zapier and put it in your `.env` as `ZAPIER_WEBHOOK_URL`)
- **Test:** Submit the form on a live digital card.

### 2. Action: HubSpot (Create or Update Contact)
- **Object Type:** Contact
- **Contact Search Property:** Email
- **Email:** `lead_details.email` (from webhook)
- **First Name:** `lead_details.name`
- **Phone Number:** `lead_details.phone`
- **Lead Source:** `source` (Vintedge Digital Card)

### 3. Action: HubSpot (Create Engagement/Note)
- **Engagement Type:** Note
- **Note Body:** "New lead captured from Digital Card. Contacted: {{lead_details.name}}. Salesperson assigned: {{salesperson_context.name}}."
- **Associations:** Associated with the newly created HubSpot Contact.

---

## Workflow 2: Automated Onboarding (HubSpot -> App)
**Goal:** When you add a new team member to HubSpot, automatically create their digital business card in Airtable.

### 1. Trigger: HubSpot (New Contact)
- **Filters:** Add a filter so this only runs for "Employees" or contacts with a specific "Persona" or "List membership".

### 2. Action: Webhooks by Zapier (POST)
- **URL:** `[YOUR_APP_URL]/api/onboard`
- **Payload Type:** JSON
- **Data (Map fields):**
    - `name`: HubSpot First Name + Last Name
    - `email`: HubSpot Email
    - `phone`: HubSpot Phone Number
    - `jobTitle`: HubSpot Job Title
    - `tier`: (Optional) Map a custom HubSpot field for "Free/Pro/Elite"

### 3. Action: HubSpot (Update Contact)
- **Goal:** Save the generated Digital Card URL back to HubSpot.
- **Fields:** Use the response from step 2 (`cardUrl`) to update a custom "Digital Card URL" property in HubSpot.

---

## Environment Check
Ensure your `.env.local` or Vercel Environment Variables are set:
- `ZAPIER_WEBHOOK_URL`: The URL provided by Zapier's "Catch Webhook" trigger.
- `NEXT_PUBLIC_BASE_URL`: Your site's public URL (used for card link generation).
