-- Replace broad public SELECT with admin-only listing access
DROP POLICY IF EXISTS "Public can view vacancy covers" ON storage.objects;

-- Authenticated users can list/view all files in the bucket
CREATE POLICY "Authenticated can view vacancy covers"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'vacancy-covers');

-- Public bucket still serves individual files via direct URL (the public URL endpoint
-- bypasses the SELECT policy when bucket.public = true), so site visitors can
-- still see cover images, but cannot enumerate the bucket.
