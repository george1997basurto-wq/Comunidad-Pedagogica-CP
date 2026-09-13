import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const uid = userData.user.id;

    const body = await req.json();
    const { prestamo_id } = body ?? {};

    if (!prestamo_id) return NextResponse.json({ error: 'prestamo_id requerido' }, { status: 400 });

    const { data, error } = await supabase
      .from('prestamos_herramientas')
      .update({ estado: 'expirado' })
      .eq('id', prestamo_id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Préstamo no encontrado o no autorizado' }, { status: 404 });

    return NextResponse.json({ success: true, prestamo: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
