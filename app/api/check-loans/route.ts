import { NextResponse } from 'next/server';
import { checkLoanStatus } from '@/lib/utils/checkLoanStatus';

export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-check-loans-secret') || '';
    if (!process.env.CHECK_LOANS_SECRET || secret !== process.env.CHECK_LOANS_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const result = await checkLoanStatus();
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
