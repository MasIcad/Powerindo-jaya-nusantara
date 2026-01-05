# Powerindo Jaya Nusantara - Official Corporate Website

Website profil perusahaan resmi **Powerindo Jaya Nusantara** yang dibangun menggunakan arsitektur modern untuk performa tinggi, SEO optimal, dan kemudahan pengelolaan konten.

## 🚀 Tech Stack

* **Framework**: Next.js 15 (App Router).
* **Database & Backend**: Supabase (PostgreSQL, Auth, & Storage).
* **Styling**: Tailwind CSS untuk desain responsif.
* **Automation**: n8n untuk alur kerja otomatisasi data.
* **Deployment**: Vercel (Hobby Plan). 

---

## 📄 Penjelasan Halaman (Public Pages)

### 🏠 Home (Beranda)
Halaman utama yang memberikan ringkasan profil perusahaan, nilai utama (Core Values), serta cuplikan produk unggulan dan ulasan terbaru dari pelanggan.

### 🏢 About (Tentang Kami)
Berisi sejarah perusahaan, visi dan misi Powerindo Jaya Nusantara, serta legalitas dan sertifikasi yang menjamin kualitas layanan perusahaan.

### ⚡ Products (Katalog Produk)
* **Katalog Utama**: Menampilkan seluruh daftar produk trafo yang tersedia. Data ditarik secara dinamis dari tabel `products` di Supabase.
* **Detail Produk**: Halaman dinamis berdasarkan ID produk. Menggunakan *Server-Side Rendering* (SSR) untuk memastikan informasi teknis produk terindeks dengan baik oleh Google.

### 💬 Reviews (Testimoni)
Sistem ulasan interaktif di mana pelanggan dapat memberikan masukan. Data ini tersimpan di Supabase dan ditampilkan kembali setelah melalui proses moderasi.

### 📝 Blog
Halaman edukasi dan berita terbaru seputar industri kelistrikan dan pemeliharaan trafo untuk membangun otoritas perusahaan di mata mesin pencari (SEO).

### 🖼️ Gallery
Portofolio visual yang menampilkan dokumentasi proyek-proyek yang telah diselesaikan, pengiriman produk, dan aktivitas operasional perusahaan.

### 📞 Contact (Kontak)
Berisi informasi alamat kantor, peta interaktif, nomor WhatsApp, serta formulir kontak yang terintegrasi dengan sistem notifikasi.

---

## 🛠️ Konfigurasi & Instalasi

### 1. Environment Variables
Buat file `.env.local` dan isi dengan kredensial dari dashboard Supabase klien:
```env
NEXT_PUBLIC_SUPABASE_URL=[https://cmpzhwjolqcayonoarnw.supabase.co](https://cmpzhwjolqcayonoarnw.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (masukkan anon public key)