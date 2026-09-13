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
    const { pedagogo_id, calificacion, comentario = null } = body;

    if (!pedagogo_id || typeof calificacion !== 'number') {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    if (calificacion < 1 || calificacion > 5) {
      return NextResponse.json({ error: 'Calificación debe estar entre 1 y 5' }, { status: 400 });
    }

    const { data: usuario, error: uErr } = await supabaseAdmin
      .from('usuarios')
      .select('id, rol')
      .eq('id', userId)
      .maybeSingle();

    if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
    if (!usuario || usuario.rol !== 'padre') {
      return NextResponse.json({ error: 'Acceso restringido: solo padres pueden dejar reseñas' }, { status: 403 });
    }

    const { data: pedagogo, error: pErr } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('id', pedagogo_id)
      .maybeSingle();
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
    if (!pedagogo) return NextResponse.json({ error: 'Pedagogo no encontrado' }, { status: 404 });

    const { data, error: insertErr } = await supabaseAdmin
      .from('resenas_padres')
      .insert([{
        pedagogo_id,
        padre_id: userId,
        calificacion,
        comentario,
        fecha: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    return NextResponse.json({ success: true, resena: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
