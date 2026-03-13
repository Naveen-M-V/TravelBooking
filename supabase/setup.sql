-- =============================================================================
-- Halal Travels Club — Supabase Setup Script
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- after completing the manual step for Storage bucket creation below.
-- =============================================================================

-- =============================================================================
-- STEP 1 — Storage bucket (run in Dashboard → Storage, not SQL Editor)
-- =============================================================================
-- 1. Go to your project → Storage → New Bucket
-- 2. Name:   hero-images
-- 3. Public: YES  (toggle on so images can be served via public URL)
-- 4. Click "Save"
-- 5. Repeat for a second public bucket named: package-images
--
-- Alternatively, if you have the Supabase CLI installed:
--   supabase storage create hero-images --public
--   supabase storage create package-images --public
-- =============================================================================


-- =============================================================================
-- STEP 2 — Storage RLS policies for the hero-images bucket
-- =============================================================================

-- Allow anyone to read (view) images (needed for public URL delivery)
create policy "Public read hero-images"
  on storage.objects for select
  using ( bucket_id = 'hero-images' );

-- Allow authenticated users to upload images
create policy "Auth users can upload hero-images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'hero-images' );

-- Allow authenticated users to update (overwrite) images
create policy "Auth users can update hero-images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'hero-images' );

-- Allow authenticated users to delete images
create policy "Auth users can delete hero-images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'hero-images' );

-- Allow anyone to read package images (needed for public package cover/gallery URLs)
create policy "Public read package-images"
  on storage.objects for select
  using ( bucket_id = 'package-images' );

-- Allow authenticated users to upload package images
create policy "Auth users can upload package-images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'package-images' );

-- Allow authenticated users to update package images
create policy "Auth users can update package-images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'package-images' );

-- Allow authenticated users to delete package images
create policy "Auth users can delete package-images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'package-images' );


-- =============================================================================
-- STEP 3 — (Optional) Restrict uploads to admins only
-- Replace the INSERT/UPDATE/DELETE policies above with these if you have a
-- profiles table with a role column (role = 'admin').
-- =============================================================================

-- drop policy "Auth users can upload hero-images" on storage.objects;
-- create policy "Admins can upload hero-images"
--   on storage.objects for insert
--   to authenticated
--   with check (
--     bucket_id = 'hero-images'
--     and (select role from public.profiles where id = auth.uid()) = 'admin'
--   );

-- drop policy "Auth users can delete hero-images" on storage.objects;
-- create policy "Admins can delete hero-images"
--   on storage.objects for delete
--   to authenticated
--   using (
--     bucket_id = 'hero-images'
--     and (select role from public.profiles where id = auth.uid()) = 'admin'
--   );

-- Repeat the same drop/create pattern above for package-images if you want
-- admin-only uploads there as well.


-- =============================================================================
-- DONE — copy the credentials below into your environment variables
-- =============================================================================
-- After running this script, grab these two values from:
--   Dashboard → Settings → API
--
--   NEXT_PUBLIC_SUPABASE_URL  = https://<project-ref>.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...  (anon / public key)
--
-- Add them to:
--   • Vercel: Project → Settings → Environment Variables
--   • Local:  frontend/.env.local
--
-- NOTE:
--   The database tables already store image URLs as strings:
--   • public.hero_images.url
--   • public.packages.coverImage
--   • public.packages.images (JSON string[])
--   No additional SQL columns are required for public URL persistence.
--
-- IMPORTANT AUTH NOTE:
--   The current frontend uploads directly from the browser to Supabase Storage.
--   Those uploads will only satisfy the INSERT/UPDATE/DELETE policies above if
--   the browser has a real Supabase Auth session (auth.role() = authenticated).
--
--   This project currently uses custom app auth, not Supabase Auth, so you must
--   choose ONE of these approaches before uploads work in production:
--
--   A) Recommended: move uploads to your backend using the Supabase service role
--      key, then keep the authenticated storage policies above.
--
--   B) Simpler but less secure: create anon/public insert policies on the
--      relevant buckets so client-side uploads can succeed without Supabase Auth.
--      Only use this if you fully accept the security trade-off.
-- =============================================================================
