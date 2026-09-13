export type RolUsuario = 'pedagogo' | 'padre';
export type EstadoPrestamo = 'activo' | 'expirado';

export interface Usuario {
  id: string;
  nombre_completo: string;
  cedula?: string | null;
  rol: RolUsuario;
  estrellas_promedio: number;
  created_at: string;
}

export interface Alumno {
  id: string;
  pedagogo_id: string;
  nombre: string;
  edad?: number | null;
  pin_acceso_padre: string;
  enfoque_desarrollo?: string | null;
  created_at: string;
}

export interface SesionJuego {
  id: string;
  alumno_id: string;
  nombre_juego: string;
  nivel_atencion: number;
  nivel_estres: number;
  efectividad: number;
  observaciones?: string | null;
  fecha: string;
}
