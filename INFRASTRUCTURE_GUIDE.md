# 🏗️ Vintedge Digital Card: Infrastructure & Payment Guide

This guide explains how the system is built and how to set up payments for different packages.

---

## 🏗️ 1. How the System Works (Infrastructure)

The application is built using a **Modern Cloud Architecture** to ensure it is fast, secure, and scales automatically.

### **The Core Parts:**
1.  **Frontend (The "Face"):** Built with **Next.js 16** and **React 19**. It provides a high-end, premium user experience with smooth animations.
2.  **Database (The "Brain"):** We use **Airtable** as the primary database. 
    *   *Benefit:* The buyer can easily see and edit user data (names, emails, status) without needing to know any code.
3.  **Authentication (The "Gate"):** Secure API route protection ensures that only your authorized card-creation flows can add data to your database.
4.  **Automation & CRM (The "Flow"):** Integrated with **Zapier** to send leads directly to **HubSpot**. 
    *   When a customer fills out the "Apply Now" form on a card, the data flows instantly into the salesman's CRM.
5.  **AI Assistant (The "Robot"):** Built with **Chatbase**. Elite users get a dedicated chatbot that "talks" based on the knowledge provided in their Airtable record.

### **Everything is Included:**
*   ✅ **NFC/Tap Technology:** The system is ready to be linked to physical NFC cards.
*   ✅ **Living Avatar:** Video profile support for Pro/Elite tiers.
*   ✅ **vCard (.vcf) Downloads:** When people click "Save", your contact card goes straight into their phone's contact list.
*   ✅ **AI-Powered Chat:** Elite tier includes the AI-assisted experience.
*   ✅ **Monthly/Yearly Billing:** Logic is already in the code to handle different payment intervals.

---

## 💳 2. How to Add Stripe Payments

The system is designed to use **Stripe Payment Links**. This is the easiest and most secure method.

### **Step 1: Create Products in Stripe**
1. Log into your [Stripe Dashboard](https://dashboard.stripe.com).
2. Go to **Product Catalog** -> **Add Product**.
3. Create 3 products/packages with these prices:
   *   **Standard Package:** $125.00 (One-time)
   *   **Professional Package:** $170.00 (Includes $125 card + $45 first month)
   *   **Elite AI Package:** $250.00 (Includes $125 card + $125 first month)

### **Step 2: Create Payment Links**
1. For each product, click **Create Payment Link**.
2. **Standard:** Copy the link (e.g., `https://buy.stripe.com/abc...`)
3. **Professional:** Copy the link.
4. **Elite:** Copy the link.

### **Step 3: Add Links to the Website**
You need to add these links to your Environment Variables (usually in the **Vercel Dashboard** under Settings -> Environment Variables).

Add these keys:
*   `NEXT_PUBLIC_STRIPE_STANDARD_LINK` = (Your $125 link)
*   `NEXT_PUBLIC_STRIPE_PRO_LINK` = (Your $170 link)
*   `NEXT_PUBLIC_STRIPE_ELITE_LINK` = (Your $250 link)

### **What happens after they pay?**
The buyer simply goes to **Airtable**, finds the user's name, and changes their "Status" from **Draft** to **Ready**. This instantly makes their card "Live" and tells the system that the customer is paid and active!

---
© 2026 Vintedge Digital | Premium Sales Technology
