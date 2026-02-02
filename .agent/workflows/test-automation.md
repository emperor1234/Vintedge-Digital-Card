---
description: how to test the zapier and hubspot automation
---

### 🧪 Automated Workflow Testing

Use these steps to verify your HubSpot-Zapier-App integration without needing to wait for a real lead.

#### 1. Test Lead Capture (Outgoing)
This simulates a user submitting their information on a digital card.

// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/lead" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{
    "name": "Test Lead",
    "email": "test-lead@example.com",
    "phone": "555-0199",
    "salespersonName": "Robin Lang",
    "salespersonEmail": "robin@example.com",
    "salespersonId": "recABC123",
    "tier": "Elite"
  }'
```

#### 2. Test Onboarding (Incoming)
This simulates Zapier sending data from HubSpot to your app to create a card.

// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/onboard" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{
    "name": "Alex Smith",
    "email": "alex.smith@example.com",
    "jobTitle": "Investment Advisor",
    "phone": "555-0200",
    "tier": "Pro"
  }'
```

---

### 🚩 Troubleshooting
- **404 Error:** Ensure your local server is running (`npm run dev`).
- **Webhook Failed:** Ensure `ZAPIER_WEBHOOK_URL` is correctly set in your `.env.local` file.
- **Airtable Error:** Check `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are valid.
