import React from 'react';
import Link from 'next/link';

export default function PedagogoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Dashboard — Pedagogo</h2>
        <div className="space-x-2">
          <Link href="/login" className="text-sm text-slate-600">Salir</Link>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
