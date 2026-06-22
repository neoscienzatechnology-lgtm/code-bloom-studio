-- Checkup #14 — data REAL de conclusão da lição.
--
-- Hoje o app deriva a "data de conclusão" de `updated_at`, que muda a cada
-- saveCode (o autosave dispara upsert -> updated_at = now()). Em uso
-- multi-dispositivo, editar o código de uma lição antiga fazia a contagem
-- diária do freemium enxergá-la como "concluída hoje", estourando o limite.
--
-- Esta migration adiciona uma coluna dedicada `completed_at`. Depois de
-- aplicá-la, o código passa a ler/gravar `completed_at` (ver TODO #checkup-14
-- em src/hooks/useProgress.ts) em vez de `updated_at`.

alter table public.user_progress
  add column if not exists completed_at timestamptz;

-- Backfill: para o que já está concluído, usa updated_at como melhor estimativa.
update public.user_progress
  set completed_at = updated_at
  where completed = true and completed_at is null;
