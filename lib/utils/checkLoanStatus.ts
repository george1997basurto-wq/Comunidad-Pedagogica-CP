import { supabaseAdmin } from '../supabase/server';

export async function checkLoanStatus(): Promise<{ updated: number } | { error: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('prestamos_herramientas')
      .update({ estado: 'expirado' })
      .lt('fecha_expiracion', new Date().toISOString())
      .eq('estado', 'activo')
      .select('id', { count: 'estimated' });

    if (error) {
      return { error: error.message };
    }

    return { updated: Array.isArray(data) ? data.length : 0 };
  } catch (err: any) {
    return { error: err.message || String(err) };
  }
}
