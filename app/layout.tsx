import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comunidad Pedagógica CP — Plataforma de gestión y red familiar',
  description: 'Plataforma web privada e independiente para Licenciados en Pedagogía — Gestión de expedientes, seguimiento y portal para padres',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 font-sans text-slate-800">
        <header className="bg-indigo-700 text-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Comunidad Pedagógica CP</h1>
            <nav className="text-sm">
              <span className="mr-4">Plataforma de gestión y red familiar</span>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
