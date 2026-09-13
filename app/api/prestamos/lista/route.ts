import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const uid = userData.user.id;

    const url = new URL(req.url);
    const estado = url.searchParams.get('estado');

    let query = supabase
      .from('prestamos_herramientas')
      .select('id,herramienta_id,prestamista_id,receptor_id,fecha_inicio,fecha_expiracion,estado')
      .or(`prestamista_id.eq.${uid},receptor_id.eq.${uid}`)
      .order('fecha_inicio', { ascending: false });

    if (estado) {
      query = query.eq('estado', estado);
    }

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, prestamos: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
