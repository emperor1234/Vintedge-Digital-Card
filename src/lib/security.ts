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

  // In production, keys MUST be set. In dev, we allow bypass if no keys are set.
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  if (!secretKey && !publicKey) {
    return !isProd;
  }

  return (!!secretKey && apiKey === secretKey) || (!!publicKey && apiKey === publicKey);
}

/**
 * Validates length of input to prevent DoS/overflow.
 */
export function validateLength(str: string | undefined, maxLength: number): boolean {
  if (!str) return true;
  return str.length <= maxLength;
}
