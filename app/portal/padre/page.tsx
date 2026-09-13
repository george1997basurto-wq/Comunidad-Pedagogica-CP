'use client';

import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function PortalPadrePage() {
  const searchParams = useSearchParams();
  const pin = searchParams.get('pin') ?? '';
  const [alumno, setAlumno] = useState<any | null>(null);
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    async function fetchAlumno() {
      if (!pin) return;
      const { data } = await supabaseClient.from('alumnos').select('*').eq('pin_acceso_padre', pin).maybeSingle();
      setAlumno(data ?? null);
    }
    fetchAlumno();
  }, [pin]);

  async function enviarResena(e: React.FormEvent) {
    e.preventDefault();
    if (!alumno) return alert('Alumno no encontrado.');
    alert(`Reseña enviada: ${calificacion} estrellas - "${comentario}" (simulado)`);
    setComentario('');
    setCalificacion(5);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Portal para Padres — Vista de Progreso</h2>

      {!alumno && <div className="bg-white p-6 rounded shadow">No se encontró alumno con ese PIN.</div>}

      {alumno && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{alumno.nombre}</div>
                <div className="text-xs text-slate-500">Edad: {alumno.edad}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Metric title="Atención (prom.)" value="72%" />
              <Metric title="Estrés (prom.)" value="18%" />
              <Metric title="Efectividad (prom.)" value="64%" />
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold">Dejar valoración para el pedagogo</h4>
            <form onSubmit={enviarResena} className="mt-3 space-y-3">
              <div>
                <label className="text-sm">Estrellas</label>
                <select value={calificacion} onChange={(e) => setCalificacion(Number(e.target.value))} className="block mt-1 p-2 border rounded">
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Testimonio</label>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <button className="bg-indigo-700 text-white px-4 py-2 rounded">Enviar valoración</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-slate-50 p-3 rounded">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
