-- Persist per-user concept mastery snapshots.
CREATE TABLE public.user_concept_mastery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concept_id TEXT NOT NULL,
  label TEXT NOT NULL,
  mastery INTEGER NOT NULL DEFAULT 0 CHECK (mastery >= 0 AND mastery <= 100),
  status TEXT NOT NULL CHECK (status IN ('strong', 'learning', 'weak', 'new')),
  total_lessons INTEGER NOT NULL DEFAULT 0,
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  in_progress_lessons INTEGER NOT NULL DEFAULT 0,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  review_course_id TEXT,
  review_lesson_id TEXT,
  review_lesson_title TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, concept_id)
);

ALTER TABLE public.user_concept_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own concept mastery"
  ON public.user_concept_mastery FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own concept mastery"
  ON public.user_concept_mastery FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own concept mastery"
  ON public.user_concept_mastery FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_concept_mastery_updated_at
  BEFORE UPDATE ON public.user_concept_mastery
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
