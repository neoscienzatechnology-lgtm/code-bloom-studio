-- Harden Row Level Security.
-- 1) Profiles eram legíveis por todos (USING true), mas o app nunca lê o perfil
--    de outros usuários — restringe SELECT ao dono.
-- 2) Adiciona policies de DELETE por dono (defesa em profundidade + futura
--    exclusão self-service). A exclusão de conta atual é feita pelo suporte via
--    service role, que ignora RLS.

-- 1. Profiles: visibilidade restrita ao dono.
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = user_id);

-- 2. Policies de DELETE por dono.
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress;
CREATE POLICY "Users can delete their own progress"
  ON public.user_progress FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own concept mastery" ON public.user_concept_mastery;
CREATE POLICY "Users can delete their own concept mastery"
  ON public.user_concept_mastery FOR DELETE USING (auth.uid() = user_id);
