import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Next.js 15+: params sekarang adalah Promise, harus di-await
export default async function BlogDetailPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  const params = await props.params;
  const slug = params.slug;

  // 1. Ambil data artikel berdasarkan slug
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) return notFound();

  // 2. Logika Update View (Increment) Menggunakan RPC
  // Memanggil fungsi SQL increment_views yang dibuat di Supabase Dashboard
  await supabase.rpc('increment_views', { post_id: post.id });

  const gallery = post.content?.gallery || [post.image_url];
  const bodyText = typeof post.content === 'object' ? post.content.body : post.content;

  return (
    <article className="bg-white min-h-screen pb-20">
      {/* Header Gambar Besar */}
      <div className="relative h-[60vh] lg:h-[75vh] w-full bg-brand-dark">
        <img 
          src={post.image_url || 'https://via.placeholder.com/1200x800'} 
          alt={post.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-20 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="bg-brand-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Corporate Insight
            </span>
            <h1 className="text-4xl lg:text-7xl font-black leading-tight mb-8 italic uppercase tracking-tighter">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-300 border-t border-white/20 pt-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-primary" />
                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-brand-primary" />
                {/* Kita tambahkan +1 secara visual agar user langsung melihat perubahannya */}
                {(post.views || 0) + 1} Pembaca
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-primary" />
                Admin Powerindo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Artikel */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-xl prose-slate max-w-none">
          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-xl">
            {bodyText}
          </div>
        </div>

        {/* Gallery Tambahan */}
        {gallery.length > 1 && (
          <div className="mt-20 pt-20 border-t border-slate-100">
            <h3 className="text-2xl font-black text-brand-dark italic uppercase tracking-tighter mb-10">Gallery Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {gallery.slice(1).map((img: string, index: number) => (
                <div key={index} className="rounded-4xl overflow-hidden border border-slate-100 shadow-2xl aspect-video group">
                  <img 
                    src={img} 
                    alt={`Gallery ${index}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombol Kembali */}
        <div className="mt-24 pt-12 border-t border-slate-100">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-3 text-brand-primary font-black uppercase tracking-widest hover:gap-5 transition-all"
          >
            <ArrowLeft size={20} /> Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    </article>
  );
}