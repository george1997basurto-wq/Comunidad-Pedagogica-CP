import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const prestamistaId = userData.user.id;

    const body = await req.json();
    const { herramienta_id, receptor_id, fecha_expiracion } = body ?? {};

    if (!herramienta_id || !receptor_id || !fecha_expiracion) {
      return NextResponse.json({ error: 'Faltan campos requeridos (herramienta_id, receptor_id, fecha_expiracion)' }, { status: 400 });
    }

    const { data: herramienta, error: hErr } = await supabaseAdmin
      .from('herramientas')
      .select('id, propietario_id')
      .eq('id', herramienta_id)
      .maybeSingle();

    if (hErr) return NextResponse.json({ error: hErr.message }, { status: 500 });
    if (!herramienta) return NextResponse.json({ error: 'Herramienta no encontrada' }, { status: 404 });
    if (herramienta.propietario_id !== prestamistaId) {
      return NextResponse.json({ error: 'No eres el propietario de la herramienta' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('prestamos_herramientas')
      .insert([{
        herramienta_id,
        prestamista_id,
        receptor_id,
        fecha_inicio: new Date().toISOString(),
        fecha_expiracion,
        estado: 'activo'
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, prestamo: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
