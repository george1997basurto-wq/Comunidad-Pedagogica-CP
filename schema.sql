-- Supabase / PostgreSQL schema for "Comunidad Pedagógica CP — Plataforma de gestión y red familiar"
-- Crea tipos y tablas requeridas por el MVP.
-- Ejecutar en Supabase SQL editor o migraciones.

-- Roles enums
CREATE TYPE IF NOT EXISTS rol_usuario AS ENUM ('pedagogo', 'padre');
CREATE TYPE IF NOT EXISTS estado_prestamo AS ENUM ('activo', 'expirado');

-- Usuarios (enlazado con auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo text NOT NULL,
  cedula text,
  rol rol_usuario NOT NULL,
  estrellas_promedio numeric(2,1) NOT NULL DEFAULT 5.0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Alumnos
CREATE TABLE IF NOT EXISTS public.alumnos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedagogo_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  edad integer,
  pin_acceso_padre text UNIQUE NOT NULL,
  enfoque_desarrollo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sesiones / Juegos
CREATE TABLE IF NOT EXISTS public.sesiones_juegos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id uuid NOT NULL REFERENCES public.alumnos(id) ON DELETE CASCADE,
  nombre_juego text NOT NULL,
  nivel_atencion integer CHECK (nivel_atencion BETWEEN 0 AND 100) DEFAULT 0,
  nivel_estres integer CHECK (nivel_estres BETWEEN 0 AND 100) DEFAULT 0,
  efectividad integer CHECK (efectividad BETWEEN 0 AND 100) DEFAULT 0,
  observaciones text,
  fecha timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Herramientas
CREATE TABLE IF NOT EXISTS public.herramientas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  propietario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descripcion text,
  es_premium boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Prestamos de herramientas
CREATE TABLE IF NOT EXISTS public.prestamos_herramientas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  herramienta_id uuid NOT NULL REFERENCES public.herramientas(id) ON DELETE CASCADE,
  prestamista_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  receptor_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  fecha_inicio timestamptz NOT NULL DEFAULT now(),
  fecha_expiracion timestamptz NOT NULL,
  estado estado_prestamo NOT NULL DEFAULT 'activo',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reseñas de padres
CREATE TABLE IF NOT EXISTS public.resenas_padres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedagogo_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  padre_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  calificacion integer NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario text,
  fecha timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices importantes
CREATE INDEX IF NOT EXISTS idx_alumnos_pin ON public.alumnos (pin_acceso_padre);
CREATE INDEX IF NOT EXISTS idx_prestamos_estado_expiracion ON public.prestamos_herramientas (estado, fecha_expiracion);

-- Nota: auth.users debe existir (gestionado por Supabase Auth).
