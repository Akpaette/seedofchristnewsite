CREATE TABLE public.testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 200 AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone TEXT CHECK (phone IS NULL OR char_length(phone) <= 40),
  location TEXT CHECK (location IS NULL OR char_length(location) <= 120),
  title TEXT NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 160),
  story TEXT NOT NULL CHECK (char_length(btrim(story)) BETWEEN 20 AND 6000),
  category TEXT CHECK (category IS NULL OR category IN ('Healing', 'Deliverance', 'Salvation', 'Answered Prayer', 'Provision', 'Restoration', 'Family', 'Career / Business', 'Other')),
  consent BOOLEAN NOT NULL CHECK (consent = true),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  image_url TEXT,
  video_url TEXT,
  CHECK (status NOT IN ('approved', 'published') OR published_at IS NOT NULL)
);

GRANT INSERT (full_name, email, phone, location, title, story, category, consent) ON public.testimonies TO anon, authenticated;
GRANT SELECT (id, full_name, location, title, story, category, published_at, image_url, video_url) ON public.testimonies TO anon, authenticated;
GRANT ALL ON public.testimonies TO service_role;

ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit pending testimonies"
ON public.testimonies
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending' AND published_at IS NULL AND consent = true);

CREATE POLICY "Anyone can read published testimonies"
ON public.testimonies
FOR SELECT
TO anon, authenticated
USING (status = 'published' AND published_at IS NOT NULL);

CREATE INDEX testimonies_public_archive_idx
ON public.testimonies (published_at DESC)
WHERE status = 'published';

COMMENT ON TABLE public.testimonies IS 'Moderated testimony submissions. Public submissions default to pending; only published rows are publicly readable.';
COMMENT ON COLUMN public.testimonies.email IS 'Private moderation contact; never include in public projections.';
COMMENT ON COLUMN public.testimonies.phone IS 'Optional private moderation contact; never include in public projections.';