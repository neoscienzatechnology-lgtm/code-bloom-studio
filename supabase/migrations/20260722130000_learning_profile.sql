-- Perfil de aprendizagem na nuvem (#revisao-lote9).
--
-- O objetivo, o nível de experiência e a meta diária escolhidos no onboarding
-- viviam só no localStorage: trocar de celular (ou limpar os dados do site)
-- devolvia o aluno ao padrão "frontend / 10 min" silenciosamente, mesmo com o
-- XP e a ofensiva preservados — uma inconsistência difícil de entender.
--
-- Estas colunas guardam o perfil junto do resto da conta. O app funciona com
-- ou sem a migration aplicada: sem ela, o sync falha em silêncio e tudo segue
-- local (ver src/hooks/useLearningProfile.ts).

alter table public.profiles
  add column if not exists learning_goal text,
  add column if not exists learning_experience text,
  add column if not exists daily_goal integer,
  add column if not exists learning_profile_at timestamptz;

comment on column public.profiles.learning_goal is 'Objetivo escolhido no onboarding (frontend, backend, python-ai...)';
comment on column public.profiles.learning_experience is 'Nível declarado: new | basic | intermediate';
comment on column public.profiles.daily_goal is 'Meta diária em minutos (5, 10, 15 ou 25)';
comment on column public.profiles.learning_profile_at is 'Quando o perfil foi definido — usado para decidir qual versão vence';
