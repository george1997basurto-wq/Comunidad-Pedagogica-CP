# Comunidad Pedagógica CP — Plataforma de gestión y red familiar (MVP)

Rápida guía para levantar el proyecto:

1. Copia los archivos al repo (Next.js App Router + TypeScript).
2. Crea en Supabase la base de datos y ejecuta `schema.sql`.
3. Aplica las políticas RLS con `sql/rls_policies.sql`.
4. Configura variables de entorno:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - CHECK_LOANS_SECRET (valor secreto para /api/check-loans)
5. Instala dependencias: `npm install`
6. Ejecuta en local: `npm run dev`
7. Despliega en Vercel (asegura variables de entorno en Vercel).

Notas:
- No se almacena ni se procesa imágenes de menores.
- checkLoanStatus() es un helper server-side para actualizar préstamos expirados (ejecutarlo periódicamente o exponerlo vía API protegida).
- Revisa las políticas RLS y ajusta según tus reglas de negocio antes de producción.
