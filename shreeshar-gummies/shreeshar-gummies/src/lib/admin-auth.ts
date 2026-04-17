import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'shreeshar_admin';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function createAdminSession(): string {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const payload = JSON.stringify({ iat: Date.now(), exp: Date.now() + MAX_AGE * 1000 });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = sign(encoded, secret);
  return `${encoded}.${sig}`;
}

export function verifyAdminSession(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return false;
  const expectedSig = sign(encoded, secret);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function setAdminCookie() {
  const token = createAdminSession();
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME };
