# Payment Setup Guide - Quick Fix

**Status:** Payment is working, but needs tier-specific configuration

---

## ✅ **Current Status (New Price Structure)**

Your payment system is updated to follow the **$125 Base Card** rule:
- **Standard (Free Tier):** $125 (Card only)
- **Professional:** $125 (Card) + $45 (Sub) = **$170**
- **Elite AI:** $125 (Card) + $125 (Sub) = **$250**

---

## 🚨 **Action Required: Update Your Stripe Links**

### **New Required Links:**

Please create 3 separate payment links in Stripe and add them to your environment variables:

1. **Standard Link ($125):** `NEXT_PUBLIC_STRIPE_STANDARD_LINK`
2. **Professional Link ($170):** `NEXT_PUBLIC_STRIPE_PRO_LINK`
3. **Elite AI Link ($250):** `NEXT_PUBLIC_STRIPE_ELITE_LINK`

### **Where to change?**
If you are using **Vercel**, go to:  
`Settings -> Environment Variables`  
Add/Update:
- `NEXT_PUBLIC_STRIPE_STANDARD_LINK`
- `NEXT_PUBLIC_STRIPE_PRO_LINK`
- `NEXT_PUBLIC_STRIPE_ELITE_LINK`

*If you only have one link for now, you can keep using `NEXT_PUBLIC_PAYMENT_LINK` and it will be used for all tiers.*

---


## ⚡ **Quick Test**

### Test Payment Flow:

1. **Register as Pro tier:**
   ```
   Visit: http://localhost:3001/get-started
   Select: Pro
   Complete: Registration
   ```
   Expected: See "$45" and Stripe payment button

2. **Click "Pay $45 with Stripe"**
   - Should open Stripe checkout
   - Verify the price matches ($45 for Pro)

3. **Register as Elite tier:**
   ```
   Visit: http://localhost:3001/get-started
   Select: Elite
   Complete: Registration
   ```
   Expected: See "$125" and Stripe payment button

4. **Verify Elite shows correct price**
   - Currently might show wrong price!

---

##📝 **After Payment Process (Current)**

### What Happens Now:
1. ✅ User pays via Stripe
2. ✅ Stripe processes payment
3. ✅ User gets receipt email from Stripe
4. ❌ **YOU manually update Airtable** to activate card:
   - Open Airtable
   - Find the user's record
   - Change Status from "Draft" → "Ready"
5. ✅ User's card goes live

### Manual Activation Steps:
```
1. Open Airtable base
2. Find Salesperson table
3. Locate user by email/name
4. Change Status field: Draft → Ready
5. User's card is now active at /sales/[their-slug]
```

---

## 🎯 **Summary**

| Aspect | Status | Notes |
|--------|--------|-------|
| Payment button | ✅ Working | Shows for Pro/Elite |
| Stripe integration | ✅ Working | Link is active |
| Tier-specific pricing | ⚠️ **Issue** | One link for both tiers |
| Payment processing | ✅ Working | Stripe handles it |
| Auto-activation | ❌ Manual | You update Airtable |

---

## 🚀 **Recommended Next Steps**

### Immediate:
1. [ ] Check your Stripe link price in dashboard
2. [ ] Create separate links for Pro and Elite
3. [ ] Add env vars for new links
4. [ ] Test both tier payment flows

### Optional (Future Enhancement):
- [ ] Set up Stripe webhooks
- [ ] Auto-update Airtable on payment
- [ ] Send payment confirmation emails
- [ ] Add payment dashboard/tracking

---

## 📞 **Need Help?**

I can help you:
1. ✅ **Create the tier-specific payment link integration**
2. ✅ **Set up Stripe webhooks for auto-activation**
3. ✅ **Build a payment tracking system**
4. ✅ **Add automated email notifications**

Just let me know what you need!

---

**Bottom Line:**  
✅ **Yes, payment is working!**  
⚠️ **But verify your Stripe link price and create tier-specific links if needed**
