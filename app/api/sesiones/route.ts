import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const userId = userData.user.id;

    const body = await req.json();
    const {
      alumno_id,
      nombre_juego,
      nivel_atencion = 0,
      nivel_estres = 0,
      efectividad = 0,
      observaciones = null,
      fecha = new Date().toISOString()
    } = body;

    if (!alumno_id || !nombre_juego) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { data: usuario, error: uErr } = await supabaseAdmin
      .from('usuarios')
      .select('id, rol')
      .eq('id', userId)
      .maybeSingle();

    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
    if (!usuario || usuario.rol !== 'pedagogo') {
      return NextResponse.json({ error: 'Acceso restringido: solo pedagogos' }, { status: 403 });
    }

    const { data: alumno, error: aErr } = await supabaseAdmin
      .from('alumnos')
      .select('id, pedagogo_id')
      .eq('id', alumno_id)
      .maybeSingle();

    if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });
    if (!alumno) return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 });
    if (alumno.pedagogo_id !== userId) {
      return NextResponse.json({ error: 'No puedes registrar sesiones para un alumno que no es tuyo' }, { status: 403 });
    }

    const { data, error: insertErr } = await supabaseAdmin
      .from('sesiones_juegos')
      .insert([{
        alumno_id,
        nombre_juego,
        nivel_atencion,
        nivel_estres,
        efectividad,
        observaciones,
        fecha
      }])
      .select()
      .single();

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    return NextResponse.json({ success: true, session: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
