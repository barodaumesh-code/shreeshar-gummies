import { NextRequest, NextResponse } from 'next/server';
import { setAdminCookie, clearAdminCookie } from '@/lib/admin-auth';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD not configured on the server' },
      { status: 500 }
    );
  }

  // timing-safe compare
  const a = Buffer.from(String(password || ''));
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
