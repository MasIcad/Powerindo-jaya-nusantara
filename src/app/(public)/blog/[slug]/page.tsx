import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Calendar, Eye, User } from 'lucide-react';
export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  // 1. Ambil data artikel berdasarkan slug
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!post) return notFound();

  // 2. Logika Update View (Insight)
  // Setiap kali halaman dibuka, kita tambah jumlah views di database
  await supabase
    .from('posts')
    .update({ views: (post.views || 0) + 1 })
    .eq('id', post.id);

  return (
    <article className="bg-white min-h-screen pb-20">
      {/* Header Gambar Besar */}
      <div className="relative h-[50vh] lg:h-[70vh] w-full">
        <img 
          src={post.image_url || 'https://via.placeholder.com/1200x800'} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-20 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="bg-brand-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
              Corporate Insight
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300 border-t border-white/20 pt-6">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} />
                {post.views + 1} Pembaca
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                Admin Powerindo Jaya Nusantara
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Artikel */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg prose-slate max-w-none">
          {/* Karena data dari Tiptap berbentuk JSON, kita bisa merender kontennya di sini */}
          {/* Untuk sementara, jika konten masih sederhana, gunakan cara ini: */}
          <div className="text-slate-700 leading-relaxed text-xl space-y-6">
            {typeof post.content === 'string' 
              ? post.content 
              : "Gunakan library parser atau render JSON Tiptap untuk hasil yang lebih kompleks."}
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-20 pt-10 border-t">
          <a href="/blog" className="text-brand-primary font-bold hover:underline flex items-center gap-2">
            ← Kembali ke Daftar Berita
          </a>
        </div>
      </div>
    </article>
  );
}