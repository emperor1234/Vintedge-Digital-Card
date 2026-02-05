# Registration Debugging Guide

## Issue: Registration Failing in Vercel

### Root Cause
The registration process requires **Airtable API credentials** to create new salesperson records. If these environment variables are missing or incorrect in Vercel, registration will fail.

---

## Required Environment Variables in Vercel

### Critical (Required for Registration to Work):

1. **`AIRTABLE_API_KEY`**
   - Get from: https://airtable.com/create/tokens
   - Create a **Personal Access Token** with the following scopes:
     - `data.records:read`
     - `data.records:write`
     - `schema.bases:read`
   - Format: `patXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

2. **`AIRTABLE_BASE_ID`**
   - Get from: Your Airtable base URL
   - Example URL: `https://airtable.com/appABCDEFGHIJKLMN/tblXXXXXXXXXXXX/...`
   - The Base ID is the part starting with `app...`: `appABCDEFGHIJKLMN`

3. **`AIRTABLE_TABLE_NAME`**
   - Default: `Salespersons`
   - This is the exact name of your table in Airtable

### Optional (But Recommended):

4. **`NEXT_PUBLIC_BASE_URL`**
   - Your Vercel deployment URL
   - Example: `https://your-app.vercel.app`

5. **`ZAPIER_WEBHOOK_URL`** (Optional - only for HubSpot automation)
   - Your Zapier webhook URL for lead capture
   - Example: `https://hooks.zapier.com/hooks/catch/XXXXXX/XXXXXX/`

6. **`CHATBASE_API_KEY`** (Optional - only for Elite tier AI chat)
   - Your Chatbase API key
   - Only needed if you're using the Elite tier features

---

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `AIRTABLE_API_KEY`
   - Value: Your actual API token
   - Environment: **Production**, **Preview**, and **Development** (check all)
5. Click **Save**
6. Repeat for all required variables

---

## How to Get Your Airtable Credentials

### Step 1: Get AIRTABLE_API_KEY

1. Go to https://airtable.com/create/tokens
2. Click **Create new token**
3. Name it: `Vintedge Digital Card`
4. Add scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. Add access to your base (select the base you're using)
6. Click **Create token**
7. **COPY THE TOKEN** (you won't be able to see it again!)

### Step 2: Get AIRTABLE_BASE_ID

1. Open your Airtable base in browser
2. Look at the URL: `https://airtable.com/appABCDEFGHIJKLMN/...`
3. Copy the part starting with `app...` (e.g., `appABCDEFGHIJKLMN`)

### Step 3: Verify Table Name

1. In your Airtable base, check the table name at the top
2. It should be exactly: **Salespersons** (case-sensitive)
3. Must have these columns:
   - `Salesperson Name` (Single line text)
   - `Email` (Email)
   - `Phone` (Phone number)
   - `Job Title` (Single line text)
   - `Tier` (Single select: Free, Pro, Elite)
   - `Greeting Text` (Long text)
   - `Q&A Bank` (Long text)
   - `Status` (Single select: Draft, Ready)
   - `Instagram URL` (URL)
   - `LinkedIn URL` (URL)
   - `Facebook URL` (URL)
   - `Google Review URL` (URL)

---

## Quick Validation Tool

### **NEW: Comprehensive Environment Validator**

We've created a visual validator that **actually tests** your environment variables by making real API calls:

**🌐 Visit: `https://your-app.vercel.app/validate-env`**

Or locally: `http://localhost:3000/validate-env`

This will show you:
- ✅ **Green** - Service is working perfectly
- ⚠️ **Yellow** - Service has warnings (optional features)
- ❌ **Red** - Service is broken (needs immediate attention)

The validator tests:
1. **Airtable** - Real connection test, permissions check, schema validation
2. **Zapier** - Webhook connectivity test (sends test payload)
3. **Chatbase** - API key format validation
4. **Next.js** - Public URL configuration

### API Endpoint (JSON Response)

For programmatic checking:
```
GET /api/validate-env
```

Returns detailed JSON with status for each service.

---

## Testing Locally

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Restart your development server:
   ```bash
   npm run dev
   ```

4. Try registering at: http://localhost:3000/get-started

5. Check the browser console and terminal for error messages

---

## Debugging Steps

### 1. Check Vercel Deployment Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on any failed function to see logs
5. Look for error messages containing "Airtable" or "configuration error"

### 2. Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to register
4. Look for errors like:
   - `Server configuration error` → Missing environment variables
   - `Registration failed` → Check the error details in console

### 3. Test API Endpoint Directly

You can test if the API is working by visiting:
```
https://your-app.vercel.app/api/test-env
```

This will show you which environment variables are configured (without revealing sensitive values).

### 4. Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Server configuration error" | Missing `AIRTABLE_API_KEY` or `AIRTABLE_BASE_ID` | Add env vars in Vercel |
| "Name and Email are required" | Form validation failed | Check form inputs |
| "Registration failed" | Airtable API error | Check API token permissions |
| Network error | CORS or connection issue | Check Vercel deployment status |

---

## After Setting Environment Variables

1. **IMPORTANT**: Redeploy your application
   - Go to Vercel Dashboard → Deployments
   - Click **Redeploy** on the latest deployment
   - OR trigger a new deployment by pushing to git

2. Wait for deployment to complete

3. Test registration again

---

## Still Not Working?

### Check Airtable API Token Permissions

1. Go to https://airtable.com/create/tokens
2. Find your token
3. Verify it has access to:
   - Your specific base
   - `data.records:read` scope
   - `data.records:write` scope

### Check Airtable Base Schema

Your table MUST have these exact field names (case-sensitive):
- `Salesperson Name`
- `Email`
- `Phone`
- `Job Title`
- `Tier`
- `Status`
- etc. (see full list above)

### Enable Debug Mode

The updated code now logs detailed errors to:
- **Server-side**: Vercel function logs
- **Client-side**: Browser console

Check both locations for specific error messages.

---

## Quick Checklist

- [ ] Created Airtable Personal Access Token
- [ ] Added `AIRTABLE_API_KEY` to Vercel env vars
- [ ] Added `AIRTABLE_BASE_ID` to Vercel env vars
- [ ] Added `AIRTABLE_TABLE_NAME` to Vercel env vars
- [ ] Set env vars for Production, Preview, AND Development
- [ ] Redeployed application in Vercel
- [ ] Verified table structure matches required schema
- [ ] Tested registration and checked browser console
- [ ] Checked Vercel function logs for errors

---

## Contact Support

If you're still experiencing issues:

1. Check Vercel function logs for the exact error
2. Check browser console for client-side errors
3. Verify your Airtable base structure matches the required schema
4. Make sure you redeployed after adding environment variables
