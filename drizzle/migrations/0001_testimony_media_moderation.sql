ALTER TABLE public.testimonies DROP CONSTRAINT IF EXISTS testimonies_status_check;
ALTER TABLE public.testimonies DROP CONSTRAINT IF EXISTS testimonies_check;
ALTER TABLE public.testimonies DROP CONSTRAINT IF EXISTS testimonies_story_check;

ALTER TABLE public.testimonies
  ADD COLUMN IF NOT EXISTS testimony TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS consent_to_publish BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.testimonies ALTER COLUMN story SET DEFAULT '';

UPDATE public.testimonies SET testimony = story, consent_to_publish = consent, submitted_at = created_at WHERE testimony IS NULL;
UPDATE public.testimonies SET status = 'approved' WHERE status = 'published';

ALTER TABLE public.testimonies ADD CONSTRAINT testimonies_status_v2_check CHECK (status IN ('pending','approved','rejected','archived'));
ALTER TABLE public.testimonies ADD CONSTRAINT testimonies_approved_published_check CHECK (status <> 'approved' OR published_at IS NOT NULL);
ALTER TABLE public.testimonies ADD CONSTRAINT testimonies_testimony_len_check CHECK (testimony IS NULL OR char_length(testimony) <= 6000);
ALTER TABLE public.testimonies ADD CONSTRAINT testimonies_reason_len_check CHECK (rejection_reason IS NULL OR char_length(rejection_reason) <= 1000);

COMMENT ON COLUMN public.testimonies.story IS 'DEPRECATED: replaced by testimony';
COMMENT ON COLUMN public.testimonies.consent IS 'DEPRECATED: replaced by consent_to_publish';
COMMENT ON COLUMN public.testimonies.video_url IS 'DEPRECATED: video evidence removed';
COMMENT ON COLUMN public.testimonies.phone IS 'DEPRECATED: phone no longer collected';

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS testimonies_touch ON public.testimonies;
CREATE TRIGGER testimonies_touch BEFORE UPDATE ON public.testimonies FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP POLICY IF EXISTS "Anyone can submit pending testimonies" ON public.testimonies;
DROP POLICY IF EXISTS "Anyone can read published testimonies" ON public.testimonies;
REVOKE INSERT ON public.testimonies FROM anon, authenticated;
REVOKE SELECT ON public.testimonies FROM anon, authenticated;
GRANT SELECT (id, full_name, location, title, testimony, story, category, published_at, image_url, audio_url) ON public.testimonies TO anon, authenticated;

CREATE POLICY "Public reads approved testimonies" ON public.testimonies FOR SELECT TO anon, authenticated
USING (status = 'approved' AND published_at IS NOT NULL);

DROP INDEX IF EXISTS public.testimonies_public_archive_idx;
CREATE INDEX IF NOT EXISTS testimonies_status_idx ON public.testimonies (status);
CREATE INDEX IF NOT EXISTS testimonies_published_idx ON public.testimonies (published_at DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS testimonies_submitted_idx ON public.testimonies (submitted_at DESC);

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.submission_attempts (
  id BIGSERIAL PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.submission_attempts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.submission_attempts_id_seq TO service_role;
ALTER TABLE public.submission_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX submission_attempts_ip_idx ON public.submission_attempts (ip_hash, created_at DESC);