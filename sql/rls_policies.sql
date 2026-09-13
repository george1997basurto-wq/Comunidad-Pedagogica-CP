-- RLS policies para "Comunidad Pedagógica CP — Plataforma de gestión y red familiar"
-- Ejecutar en Supabase SQL editor después de crear las tablas del schema.sql

ALTER TABLE IF EXISTS public.herramientas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prestamos_herramientas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sesiones_juegos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resenas_padres ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alumnos ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.user_has_role(uid uuid, rol_text text)
RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = uid AND u.rol = rol_text);
$$ LANGUAGE sql STABLE;

CREATE POLICY "herramientas_select_authenticated" ON public.herramientas
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "herramientas_insert_owner_only" ON public.herramientas
  FOR INSERT
  WITH CHECK (propietario_id = auth.uid());

CREATE POLICY "herramientas_update_owner_only" ON public.herramientas
  FOR UPDATE
  USING (propietario_id = auth.uid())
  WITH CHECK (propietario_id = auth.uid());

CREATE POLICY "herramientas_delete_owner_only" ON public.herramientas
  FOR DELETE
  USING (propietario_id = auth.uid());

CREATE POLICY "prestamos_select_participants" ON public.prestamos_herramientas
  FOR SELECT
  USING (prestamista_id = auth.uid() OR receptor_id = auth.uid());

CREATE POLICY "prestamos_insert_prestamista_only" ON public.prestamos_herramientas
  FOR INSERT
  WITH CHECK (prestamista_id = auth.uid());

CREATE POLICY "prestamos_update_participants" ON public.prestamos_herramientas
  FOR UPDATE
  USING (prestamista_id = auth.uid() OR receptor_id = auth.uid())
  WITH CHECK (prestamista_id = auth.uid() OR receptor_id = auth.uid());

CREATE POLICY "prestamos_delete_prestamista" ON public.prestamos_herramientas
  FOR DELETE
  USING (prestamista_id = auth.uid());

CREATE POLICY "sesiones_select_pedagogo_or_parent" ON public.sesiones_juegos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumnos a
      WHERE a.id = alumno_id
        AND (a.pedagogo_id = auth.uid() OR a.pin_acceso_padre IN (
          SELECT pin_acceso_padre FROM public.alumnos WHERE pedagogo_id = auth.uid()
        ))
    )
  );

CREATE POLICY "sesiones_insert_pedagogo_owner" ON public.sesiones_juegos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.alumnos a WHERE a.id = alumno_id AND a.pedagogo_id = auth.uid()
    )
  );

CREATE POLICY "sesiones_update_delete_pedagogo_owner" ON public.sesiones_juegos
  FOR UPDATE, DELETE
  USING (
    EXISTS (SELECT 1 FROM public.alumnos a WHERE a.id = alumno_id AND a.pedagogo_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.alumnos a WHERE a.id = alumno_id AND a.pedagogo_id = auth.uid())
  );

CREATE POLICY "resenas_insert_padre_only" ON public.resenas_padres
  FOR INSERT
  WITH CHECK (padre_id = auth.uid());

CREATE POLICY "resenas_select_relevant" ON public.resenas_padres
  FOR SELECT
  USING (pedagogo_id = auth.uid() OR padre_id = auth.uid());

CREATE POLICY "resenas_update_delete_padre" ON public.resenas_padres
  FOR UPDATE, DELETE
  USING (padre_id = auth.uid())
  WITH CHECK (padre_id = auth.uid());

CREATE POLICY "alumnos_insert_pedagogo_only" ON public.alumnos
  FOR INSERT
  WITH CHECK (pedagogo_id = auth.uid());

CREATE POLICY "alumnos_select_owner_or_pin" ON public.alumnos
  FOR SELECT
  USING (pedagogo_id = auth.uid() OR pin_acceso_padre IS NOT NULL);

CREATE POLICY "alumnos_update_pedagogo_owner" ON public.alumnos
  FOR UPDATE
  USING (pedagogo_id = auth.uid())
  WITH CHECK (pedagogo_id = auth.uid());

CREATE POLICY "require_authenticated" ON public.herramientas
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Revisa y ajusta las políticas según tus necesidades.
