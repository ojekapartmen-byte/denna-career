-- Timestamp helper (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Vacancies table
CREATE TABLE public.vacancies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  intro TEXT NOT NULL DEFAULT '',
  long_intro TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Full-time',
  experience TEXT NOT NULL DEFAULT '',
  reports_to TEXT NOT NULL DEFAULT '',
  salary TEXT NOT NULL DEFAULT '',
  posted_at DATE NOT NULL DEFAULT CURRENT_DATE,
  closes_at DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL DEFAULT 'Deanna Day Spa, Seminyak, Bali',
  department TEXT NOT NULL DEFAULT 'Spa',
  cover_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vacancies_status ON public.vacancies(status);
CREATE INDEX idx_vacancies_sort ON public.vacancies(sort_order);

ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

-- Public can read OPEN vacancies
CREATE POLICY "Public can view open vacancies"
ON public.vacancies FOR SELECT
USING (status = 'open');

-- Authenticated users (admins) can read all
CREATE POLICY "Authenticated can view all vacancies"
ON public.vacancies FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated can insert vacancies"
ON public.vacancies FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update vacancies"
ON public.vacancies FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can delete vacancies"
ON public.vacancies FOR DELETE
TO authenticated
USING (true);

-- Updated-at trigger
CREATE TRIGGER update_vacancies_updated_at
BEFORE UPDATE ON public.vacancies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vacancy-covers', 'vacancy-covers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view vacancy covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'vacancy-covers');

CREATE POLICY "Authenticated can upload vacancy covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vacancy-covers');

CREATE POLICY "Authenticated can update vacancy covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vacancy-covers');

CREATE POLICY "Authenticated can delete vacancy covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vacancy-covers');

-- Seed initial data
INSERT INTO public.vacancies (slug, title, intro, long_intro, type, experience, reports_to, salary, posted_at, closes_at, responsibilities, benefits, location, department, sort_order)
VALUES
('senior-therapist', 'Senior Therapist',
 'Deliver premium spa treatments and shape an unforgettable guest experience at Deanna Day Spa.',
 'As a Senior Therapist at Deanna Day Spa, you will be the cornerstone of our guest experience. You will perform premium, expert treatments, ensuring each guest receives a truly luxurious and personalized escape. We are looking for an experienced spa therapist to deliver premium treatments to our valued guests.',
 'Full-time', '5+ Years', 'Spa Manager', 'Competitive · Based on experience',
 '2025-10-01', '2025-12-31',
 ARRAY[
   'Perform a wide range of premium massage techniques (Deep Tissue, Hot Stone, Aromatherapy).',
   'Deliver advanced facial and body treatments using luxury spa products.',
   'Mentor junior therapists and uphold service excellence across the team.',
   'Maintain an immaculate, calming spa environment following strict hygiene and safety protocols.',
   'Consult with guests to understand their needs and recommend curated treatments.'
 ],
 ARRAY[
   'Premium Work Environment',
   'Professional Growth Opportunities',
   'Competitive Benefits Package',
   'Supportive Team Culture'
 ],
 'Deanna Day Spa, Seminyak, Kuta, Bali', 'Spa', 1),
('assistant', 'Spa Assistant',
 'Support daily spa operations and help create an exceptional experience for every guest.',
 'As a Spa Assistant, you will support our therapists and front-of-house team to keep daily operations running smoothly. You will help create a calm, welcoming atmosphere for every guest from the moment they arrive until they leave.',
 'Full-time', 'Entry level welcome', 'Senior Therapist', 'Competitive · Based on experience',
 '2025-10-01', '2025-12-31',
 ARRAY[
   'Prepare treatment rooms and ensure linens, products, and tools are ready before each guest.',
   'Greet and assist guests, escorting them through the spa journey.',
   'Maintain cleanliness and hygiene across all spa areas at all times.',
   'Support therapists during treatments when needed.',
   'Help with laundry, restocking, and general daily upkeep of the spa.'
 ],
 ARRAY[
   'Premium Work Environment',
   'Hands-on Training & Mentorship',
   'Competitive Benefits Package',
   'Supportive Team Culture'
 ],
 'Deanna Day Spa, Seminyak, Kuta, Bali', 'Spa', 2);
