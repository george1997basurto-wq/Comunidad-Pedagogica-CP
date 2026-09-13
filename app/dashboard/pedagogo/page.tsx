'use client';

import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

type Tab = 'alumnos' | 'materiales' | 'mensajeria' | 'perfil';

export default function PedagogoPage() {
  const [tab, setTab] = useState<Tab>('alumnos');
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [herramientas, setHerramientas] = useState<any[]>([]);
  const [prestamos, setPrestamos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: a } = await supabaseClient.from('alumnos').select('*').limit(50);
      setAlumnos(a ?? []);
      const { data: h } = await supabaseClient.from('herramientas').select('*').limit(50);
      setHerramientas(h ?? []);
      const { data: p } = await supabaseClient.from('prestamos_herramientas').select('*').limit(50);
      setPrestamos(p ?? []);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <nav className="flex gap-2">
        <button onClick={() => setTab('alumnos')} className={`px-3 py-2 rounded ${tab==='alumnos' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Mis Alumnos</button>
        <button onClick={() => setTab('materiales')} className={`px-3 py-2 rounded ${tab==='materiales' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Préstamo de Materiales Didácticos y Recursos Pedagógicos</button>
        <button onClick={() => setTab('mensajeria')} className={`px-3 py-2 rounded ${tab==='mensajeria' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Mensajería</button>
        <button onClick={() => setTab('perfil')} className={`px-3 py-2 rounded ${tab==='perfil' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Mi Perfil & Reseñas</button>
      </nav>

      {tab === 'alumnos' && (
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Mis Alumnos</h3>
          <ul className="divide-y">
            {alumnos.map((a) => (
              <li key={a.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{a.nombre}</div>
                  <div className="text-xs text-slate-500">{a.enfoque_desarrollo ?? 'Sin enfoque registrado'}</div>
                </div>
                <div>
                  <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">Ver expediente</button>
                </div>
              </li>
            ))}
            {alumnos.length === 0 && <li className="py-3 text-slate-500">Sin alumnos aún</li>}
          </ul>

          <div className="mt-6">
            <h4 className="font-semibold">Registrar sesión de juego</h4>
            <p className="text-xs text-slate-500">Formulario rápido para añadir registro de juego (atención/estrés/efectividad)</p>
            <form className="mt-3 space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Registro creado (simulado)'); }}>
              <select className="w-full p-2 border rounded">
                <option>Seleccionar alumno</option>
                {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
              <input placeholder="Nombre del juego" className="w-full p-2 border rounded" />
              <div className="flex gap-2">
                <input placeholder="Atención (0-100)" className="p-2 border rounded w-1/3" />
                <input placeholder="Estrés (0-100)" className="p-2 border rounded w-1/3" />
                <input placeholder="Efectividad (0-100)" className="p-2 border rounded w-1/3" />
              </div>
              <textarea placeholder="Observaciones" className="w-full p-2 border rounded" />
              <button className="bg-indigo-700 text-white px-4 py-2 rounded">Agregar</button>
            </form>
          </div>
        </section>
      )}

      {tab === 'materiales' && (
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Préstamo de Materiales Didácticos y Recursos Pedagógicos</h3>
          <p className="text-sm text-slate-500 mb-4">
            Sección dedicada al intercambio temporal de guías de estudio, juegos físicos y herramientas de enseñanza entre docentes. 
            Aquí se gestiona el préstamo con un tiempo límite de devolución (no es un préstamo monetario).
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Mi Biblioteca de Recursos</h4>
              <ul className="divide-y">
                {herramientas.map(h => (
                  <li key={h.id} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{h.titulo}</div>
                      <div className="text-xs text-slate-500">{h.descripcion}</div>
                    </div>
                    <div className="text-xs">{h.es_premium ? 'Premium' : 'Standard'}</div>
                  </li>
                ))}
                {herramientas.length === 0 && <li className="py-2 text-slate-500">No hay recursos en tu biblioteca</li>}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Préstamos Recibidos (temporal)</h4>
              <ul className="divide-y">
                {prestamos.map(p => (
                  <li key={p.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Recurso: {p.herramienta_id}</div>
                        <div className="text-xs text-slate-500">Prestamista: {p.prestamista_id}</div>
                      </div>
                      <div className="text-right">
                        <Countdown fechaExpiracion={p.fecha_expiracion} estado={p.estado} />
                      </div>
                    </div>
                  </li>
                ))}
                {prestamos.length === 0 && <li className="py-3 text-slate-500">No hay préstamos temporales</li>}
              </ul>
            </div>
          </div>
        </section>
      )}

      {tab === 'mensajeria' && (
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Mensajería Directa</h3>
          <p className="text-sm text-slate-500 mb-3">Chat simple entre pedagogos (MVP: mensajes en memoria o tabla dedicada).</p>
          <SimpleChat />
        </section>
      )}

      {tab === 'perfil' && (
        <section className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Mi Perfil & Reseñas</h3>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">4.8 ★</div>
            <div className="text-sm text-slate-600">Promedio de reseñas aprobadas</div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Comentarios</h4>
            <ul className="divide-y">
              <li className="py-2">
                <div className="font-medium">Padre: María</div>
                <div className="text-xs text-slate-500">"Excelente seguimiento y recomendaciones útiles."</div>
              </li>
              <li className="py-2">
                <div className="font-medium">Padre: José</div>
                <div className="text-xs text-slate-500">"Muy profesional y atento."</div>
              </li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function Countdown({ fechaExpiracion, estado }: { fechaExpiracion: string; estado: string }) {
  const [now, setNow] = useState(() => new Date().getTime());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!fechaExpiracion) return <div className="text-sm text-slate-500">Sin fecha</div>;
  const end = new Date(fechaExpiracion).getTime();
  const diff = Math.max(0, end - now);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const expired = diff === 0 || estado === 'expirado';

  return (
    <div className={`text-sm ${expired ? 'text-red-500' : 'text-green-600'}`}>
      {expired ? 'Expirado' : `${hours}h ${minutes}m ${seconds}s`}
    </div>
  );
}

function SimpleChat() {
  const [messages, setMessages] = useState<{ id: string; from: string; text: string }[]>([]);
  const [text, setText] = useState('');

  function send() {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: String(Date.now()), from: 'Yo', text }]);
    setText('');
  }

  return (
    <div>
      <div className="h-48 overflow-auto border rounded p-3 mb-3 bg-slate-50">
        {messages.map(m => (
          <div key={m.id} className="mb-2">
            <div className="text-xs text-slate-500">{m.from}</div>
            <div className="bg-white p-2 rounded">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={send} className="bg-indigo-700 text-white px-4 rounded">Enviar</button>
      </div>
    </div>
  );
}
