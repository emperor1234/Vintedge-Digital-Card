# Vintedge Digital Card - Automation House

A premium, AI-powered digital business card platform for elite sales teams.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env.local` and fill in your keys:
   - `AIRTABLE_API_KEY`: Your Airtable personal access token.
   - `AIRTABLE_BASE_ID`: Your Airtable base ID.
   - `ZAPIER_WEBHOOK_URL`: Your Zapier "Catch Webhook" URL.
   - `CHATBASE_API_KEY`: (Optional) For AI features.

3. **Run Locally:**
   ```bash
   npm run dev
   ```

## 🛠️ Data Structure
See [SCHEMA.md](./SCHEMA.md) for details on how to set up your Airtable base.

## 🤖 Automation (HubSpot + Zapier)
The system is designed to bridge seamlessly with HubSpot via Zapier.
- **Lead Capture:** Automatic routing of leads from cards to HubSpot.
- **Auto-Onboarding:** Create digital cards automatically when a contact is added to HubSpot.

See [ZAPIER_WORKFLOW.md](./ZAPIER_WORKFLOW.md) for full setup instructions.

## 🧪 Testing
Use the built-in workflow to test your integrations:
- Run `/test-automation` in your agent or follow the steps in `.agent/workflows/test-automation.md`.

## 📜 Deployment
Deploy to Vercel and ensure all environment variables are added to the Vercel dashboard.
