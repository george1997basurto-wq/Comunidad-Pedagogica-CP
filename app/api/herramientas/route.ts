import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const userId = userData.user.id;

    const body = await req.json();
    const { titulo, descripcion = null, es_premium = false } = body ?? {};

    if (!titulo || typeof titulo !== 'string') {
      return NextResponse.json({ error: 'titulo es requerido' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('herramientas')
      .insert([{
        propietario_id: userId,
        titulo,
        descripcion,
        es_premium
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, herramienta: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
