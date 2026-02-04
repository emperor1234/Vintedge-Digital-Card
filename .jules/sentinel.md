## 2025-05-22 - [Security Hardening & XSS Prevention]
**Vulnerability:** Publicly accessible API endpoints for data creation and potential XSS via unsanitized social media URLs.
**Learning:** Manual implementation of security headers across multiple API routes is error-prone and hard to maintain. Moving them to `next.config.ts` ensures global coverage. Also, even with modern frameworks, user-provided URLs must be strictly validated against allowed protocols (http/https) to prevent `javascript:` injection.
**Prevention:** Use a centralized security configuration for headers. Implement a shared security utility for all API input validation and authentication.
