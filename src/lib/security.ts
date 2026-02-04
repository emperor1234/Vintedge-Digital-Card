/**
 * Security utilities for Vintedge Digital Card
 */

/**
 * Validates that a string is a valid URL and uses a safe protocol.
 * Prevents javascript: XSS attacks.
 */
export function isValidUrl(url: string | undefined): boolean {
  if (!url) return true; // Optional fields are valid if empty

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validates and sanitizes a URL. Returns empty string if invalid.
 */
export function sanitizeUrl(url: string | undefined): string {
  if (!url) return '';
  return isValidUrl(url) ? url : '';
}

/**
 * Simple API Key verification.
 */
export function verifyApiKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key');
  const secretKey = process.env.API_SECRET_KEY;
  const publicKey = process.env.NEXT_PUBLIC_API_KEY;

  // If no keys are configured, we allow it (for local dev)
  if (!secretKey && !publicKey) return true;

  return (secretKey && apiKey === secretKey) || (publicKey && apiKey === publicKey) || false;
}

/**
 * Validates length of input to prevent DoS/overflow.
 */
export function validateLength(str: string | undefined, maxLength: number): boolean {
  if (!str) return true;
  return str.length <= maxLength;
}
