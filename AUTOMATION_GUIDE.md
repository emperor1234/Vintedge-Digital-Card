# Step-by-Step Automation Guide: HubSpot & Zapier

This guide provides the exact sequence of steps required to connect your Vintedge Digital Card application with HubSpot via Zapier.

---

## Part 1: HubSpot Preparation
Before touching Zapier, ensure HubSpot has the correct fields to receive and send data.

### 1. Create Custom Contact Properties
In HubSpot, go to **Settings > Objects > Properties** and create the following:
- **Digital Card URL** (Type: URL) - To store the link to the business card.
- **Lead Source Detail** (Type: Single-line text) - Set to "Vintedge Digital Card".
- **Member Tier** (Type: Dropdown) - Options: "Free", "Pro", "Elite".

### 2. Identify Salesperson Emails
Ensure every salesperson in your team is added as a Contact or User in HubSpot with an email that matches their **Airtable** record email.

---

## Part 2: Workflow 1 - Lead Capture (Card → HubSpot)
**Goal:** When a user fills out the "Apply Now" form on a card, they are added to HubSpot.

### Step 1: Zapier Trigger
1. Create a new Zap and name it "Vintedge: Lead Capture to HubSpot".
2. Search for **"Webhooks by Zapier"**.
3. Choose Event: **"Catch Webhook"**.
4. Click **Continue** until you get a **Webhook URL**.
5. **CRITICAL:** Copy this URL and add it to your `.env.local` or Vercel Environment Variables as `ZAPIER_WEBHOOK_URL`.
6. Submit a test lead on your digital card to "Send" data to Zapier.
7. Click **"Test Trigger"** in Zapier to verify the data (you should see name, email, phone).

### Step 2: HubSpot Action (Search/Create Contact)
1. Add a step: Search for **"HubSpot"**.
2. Choose Event: **"Find Contact"**.
3. Search by: **Email**.
4. In **"Contact Email"**, select the email field from the Zapier Webhook data.
5. Check the box: **"Create HubSpot Contact if it doesn’t exist yet?"**.
6. Map the fields:
   - **First Name:** Use `lead_details.name` from Webhook.
   - **Phone Number:** Use `lead_details.phone` from Webhook.
   - **Lead Source:** Hardcode to "Digital Card".

### Step 3: HubSpot Action (Create Note/Task)
1. Add another HubSpot step: **"Create Engagement"**.
2. Type: **Note**.
3. Body: "Lead captured from Digital Card. Assigned to salesperson: [Salesperson Name from Webhook]".
4. Associate it with the Contact found in Step 2.

---

## Part 3: Workflow 2 - Auto-Onboarding (HubSpot → App)
**Goal:** When you add an employee to HubSpot, their card is automatically created in Airtable.

### Step 1: HubSpot Trigger
1. Create a Zap named "Vintedge: New Member Onboarding".
2. Trigger: **"New Contact in HubSpot"**.
3. (Optional) Add a **Filter** step: Only continue if "Persona" or a custom field is set to "Salesperson".

### Step 2: Zapier Action (POST to App)
1. Add step: **"Webhooks by Zapier"**.
2. Choose Event: **"POST"**.
3. **URL:** `[YOUR_APP_URL]/api/onboard` (e.g., `https://my-card-app.vercel.app/api/onboard`).
4. **Payload Type:** JSON.
5. **Data:**
   - `name`: HubSpot Full Name.
   - `email`: HubSpot Email.
   - `jobTitle`: HubSpot Job Title.
   - `phone`: HubSpot Phone Number.
   - `tier`: (Optional) HubSpot Member Tier.
6. **Headers:** Set `Content-Type` to `application/json`.
7. Click **Test & Continue**. This will create a "Draft" record in your Airtable.

### Step 3: HubSpot Action (Update Contact)
1. Add step: **"HubSpot"**.
2. Choose Event: **"Update Contact"**.
3. **Object ID:** Use the HubSpot ID from the Trigger.
4. **Digital Card URL:** Use the `cardUrl` returned from the Webhook in Step 2.

---

## Part 4: Testing & Verification
Once both Zaps are **On**:

1. **Test Registration:** Add a contact in HubSpot. Wait 1 minute. Check if an Airtable record appeared. Check if the Contact in HubSpot now has a "Digital Card URL".
2. **Test Lead:** Visit that new Digital Card URL. Fill out the form. Check HubSpot to see if the lead was created and a note was added.
