import { NextResponse } from 'next/server';
import { validateCedula } from '@/lib/utils/validateCedula';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cedula = typeof body?.cedula === 'string' ? body.cedula.trim() : '';
    const result = validateCedula(cedula);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ valid: false, reason: err?.message ?? String(err) }, { status: 500 });
  }
}
