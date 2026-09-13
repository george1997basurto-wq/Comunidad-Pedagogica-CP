'use client';

import React, { useState } from 'react';
import { supabaseClient } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'pedagogo' | 'padre'>('pedagogo');
  const [cedula, setCedula] = useState('');
  const [pinPadre, setPinPadre] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }

    if (rol === 'pedagogo') {
      router.push('/dashboard/pedagogo');
    } else {
      router.push(`/portal/padre?pin=${encodeURIComponent(pinPadre)}`);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-indigo-900">Ingreso — Comunidad Pedagógica CP</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">¿Eres Docente o Padre de Familia?</label>
          <div className="mt-2 flex space-x-2">
            <button type="button" onClick={() => setRol('pedagogo')} className={`px-3 py-1 rounded ${rol==='pedagogo' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Docente</button>
            <button type="button" onClick={() => setRol('padre')} className={`px-3 py-1 rounded ${rol==='padre' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Padre</button>
          </div>
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label className="text-sm">Contraseña</label>
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        {rol === 'pedagogo' ? (
          <div>
            <label className="text-sm">Cédula (solo para pedagogos)</label>
            <input value={cedula} onChange={e => setCedula(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
        ) : (
          <div>
            <label className="text-sm">PIN del hijo</label>
            <input value={pinPadre} onChange={e => setPinPadre(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
        )}

        <button disabled={loading} type="submit" className="w-full bg-indigo-700 text-white py-2 rounded">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
