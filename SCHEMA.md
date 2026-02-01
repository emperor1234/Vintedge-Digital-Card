# Airtable Schema - Automation House

To make the system work perfectly, create one table in your Airtable base named **Salespersons** with the following fields:

| Field Name | Type | Options / Description |
| :--- | :--- | :--- |
| **Salesperson Name** | Single line text | e.g. "Robin Lang" |
| **Email** | Email | Professional email address |
| **Phone** | Single line text | e.g. "+1-123-456-7890" |
| **Job Title** | Single line text | e.g. "Senior Real Estate Advisor" |
| **Tier** | Single select | "Free", "Pro", "Elite" |
| **Photo** | Attachment | High-quality headshot |
| **Greeting Text** | Long text | Personalized greeting message |
| **Q&A Bank** | Long text | Data for AI training (Elite only) |
| **Chatbase Bot ID** | Single line text | The Bot ID from Chatbase (Elite only) |
| **Greeting Video/Animation** | Attachment | Video for "Living Avatar" (Pro/Elite) - *Coming Soon* |
| **Status** | Single select | "Draft", "Ready" (Set to 'Ready' to go live) |
| **Google Review URL** | URL | Link to your Google Business reviews |
| **Instagram URL** | URL | (Optional) Link to Instagram profile |
| **LinkedIn URL** | URL | (Optional) Link to LinkedIn profile |
| **Facebook URL** | URL | (Optional) Link to Facebook profile |
| **Landing Page URL** | URL | (Optional) Link back to your profile |

## 💡 Pro Tip
The website generates the link automatically from the **Salesperson Name**. 
Example: "Robin Lang" becomes `yourdomain.com/sales/robin-lang`.
