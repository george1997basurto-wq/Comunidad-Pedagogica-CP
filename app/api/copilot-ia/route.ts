import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const historial = Array.isArray(payload.historial) ? payload.historial : [];

    if (historial.length === 0) {
      return NextResponse.json({ recomendacion: 'No hay historial suficiente. Recolecta al menos 3 sesiones para una recomendación.' });
    }

    const avgAtencion = Math.round(historial.reduce((s: number, h: any) => s + (h.nivel_atencion || 0), 0) / historial.length);
    const avgEstres = Math.round(historial.reduce((s: number, h: any) => s + (h.nivel_estres || 0), 0) / historial.length);
    const avgEfectividad = Math.round(historial.reduce((s: number, h: any) => s + (h.efectividad || 0), 0) / historial.length);

    let recomendacion = 'Mantener actividades actuales.';
    if (avgAtencion < 50 && avgEstres > 40) {
      recomendacion = 'Reducir la carga de estímulos; proponer juegos de atención corta y pausas activas entre sesiones.';
    } else if (avgAtencion < 50) {
      recomendacion = 'Incrementar actividades de motivación con recompensas y tareas graduales para mejorar la atención.';
    } else if (avgEstres > 60) {
      recomendacion = 'Priorizar actividades de regulación emocional y técnicas de respiración antes de la sesión de juego.';
    } else if (avgEfectividad < 50) {
      recomendacion = 'Revisar la adaptación del material: ajustar dificultad para mejorar efectividad.';
    }

    const motivo = `Promedios — Atención: ${avgAtencion}, Estrés: ${avgEstres}, Efectividad: ${avgEfectividad}`;

    return NextResponse.json({ recomendacion, motivo });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
