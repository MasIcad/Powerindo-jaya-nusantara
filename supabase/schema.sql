-- 1. PEMBUATAN TABEL (DENGAN PENGECEKAN)
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

-- BARU: Tabel Pengumuman untuk fitur Broadcast Internal (Notifikasi)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  target_emails TEXT[] DEFAULT '{}', -- Menyimpan daftar email penerima broadcast
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AKTIFKAN RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY; -- Aktifkan RLS untuk tabel baru

-- 3. PEMBERSIHAN & PEMBUATAN POLICY
DO $$ 
BEGIN
    -- Hapus policy lama agar tidak error "already exists"
    DROP POLICY IF EXISTS "Public can view posts" ON posts;
    DROP POLICY IF EXISTS "Admins can manage posts" ON posts;
    DROP POLICY IF EXISTS "Public can view products" ON products;
    DROP POLICY IF EXISTS "Admins can manage products" ON products;
    DROP POLICY IF EXISTS "Public can view gallery" ON gallery;
    DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
    DROP POLICY IF EXISTS "Enable insert for public" ON subscribers;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON subscribers;
    DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON subscribers;

    -- BARU: Hapus policy untuk announcements
    DROP POLICY IF EXISTS "Public can view announcements" ON announcements;
    DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
END $$;

-- Buat Policy Baru
CREATE POLICY "Public can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Admins can manage posts" ON posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

-- Policy untuk Subscribers
CREATE POLICY "Enable insert for public" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for authenticated users" ON subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON subscribers FOR DELETE TO authenticated USING (true);

-- BARU: Policy untuk Announcements (Broadcasting)
-- Publik/Pengunjung bisa melihat pengumuman
CREATE POLICY "Public can view announcements" ON announcements FOR SELECT USING (true);
-- Hanya Admin yang bisa membuat/menghapus pengumuman
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL TO authenticated USING (true);

-- Policy untuk Storage
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'visitec-assets');
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'visitec-assets' AND auth.role() = 'authenticated');

-- 4. FIX UNTUK TABEL YANG SUDAH ADA
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

UPDATE posts SET views = 0 WHERE views IS NULL;

-- FUNGSI VIEW COUNTER
CREATE OR REPLACE FUNCTION increment_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tambahkan kolom tanggal kedaluwarsa
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Update Policy (Opsional, memastikan Admin tetap bisa kelola segalanya)
DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL TO authenticated USING (true);

-- 1. Aktifkan ekstensi pg_cron (untuk menjalankan tugas terjadwal)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Buat fungsi khusus untuk menghapus pengumuman yang sudah lewat waktu
CREATE OR REPLACE FUNCTION delete_expired_announcements()
RETURNS void AS $$
BEGIN
  DELETE FROM announcements
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 3. Jadwalkan tugas (Cron Job)
-- Script ini akan menjalankan fungsi di atas setiap jam (pada menit ke-0)
-- Format '0 * * * *' artinya: setiap jam sekali.
SELECT cron.schedule(
  'cleanup-expired-announcements', -- Nama tugas
  '0 * * * *',                     -- Jadwal (Cron format)
  'SELECT delete_expired_announcements()' -- Perintah yang dijalankan
);