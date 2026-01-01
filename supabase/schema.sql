-- 1. PEMBUATAN TABEL (MEMPERTAHANKAN SEMUA TABEL ANDA)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB,
  image_url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_name TEXT,
  comment_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  image_url TEXT,
  category TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  target_emails TEXT[] DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_experience (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  project_no INTEGER,
  project_name TEXT NOT NULL,
  company TEXT,
  field TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  rating INTEGER,
  comment TEXT,
  reply TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AKTIFKAN RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 3. PERBAIKAN POLICY (MENGHAPUS LAMA & MEMBUAT BARU DENGAN WITH CHECK)
-- Bagian ini memperbaiki error 42710 (already exists) dan error Violates Policy.

DO $$ 
BEGIN
    -- Posts
    DROP POLICY IF EXISTS "Public can view posts" ON posts;
    DROP POLICY IF EXISTS "Admins can manage posts" ON posts;
    -- Products
    DROP POLICY IF EXISTS "Public can view products" ON products;
    DROP POLICY IF EXISTS "Admins can manage products" ON products;
    -- Gallery
    DROP POLICY IF EXISTS "Public can view gallery" ON gallery;
    DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;
    -- Projects
    DROP POLICY IF EXISTS "Public can view projects" ON project_experience;
    DROP POLICY IF EXISTS "Admins can manage projects" ON project_experience;
    -- Reviews
    DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
    DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
    -- Subscribers
    DROP POLICY IF EXISTS "Enable insert for public" ON subscribers;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON subscribers;
    DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON subscribers;
    DROP POLICY IF EXISTS "Admins can manage subscribers" ON subscribers;
    -- Announcements
    DROP POLICY IF EXISTS "Public can view announcements" ON announcements;
    DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
    -- Storage
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
END $$;

-- --- MEMBUAT POLICY BARU YANG BENAR ---

-- Posts
CREATE POLICY "Public can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Admins can manage posts" ON posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Gallery
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Projects
CREATE POLICY "Public can view projects" ON project_experience FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON project_experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Reviews
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Subscribers
CREATE POLICY "Enable insert for public" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage subscribers" ON subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Announcements
CREATE POLICY "Public can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'visitec-assets');
CREATE POLICY "Admins can upload images" ON storage.objects FOR ALL TO authenticated WITH CHECK (bucket_id = 'visitec-assets');

-- 4. FUNGSI & LOGIKA TAMBAHAN (MEMPERTAHANKAN LOGIKA ANDA)
CREATE OR REPLACE FUNCTION increment_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cron Job cleanup
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE OR REPLACE FUNCTION delete_expired_announcements()
RETURNS void AS $$
BEGIN
  DELETE FROM announcements WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Unschedule dulu agar tidak error duplicate job
SELECT cron.unschedule('cleanup-expired-announcements');
SELECT cron.schedule('cleanup-expired-announcements', '0 * * * *', 'SELECT delete_expired_announcements()');