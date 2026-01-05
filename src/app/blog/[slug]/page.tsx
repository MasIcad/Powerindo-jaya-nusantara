import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BlogGallery from '../BlogGallery'; // Import komponen client tadi

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  const params = await props.params;
  const slug = params.slug;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) return notFound();

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
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-20 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="bg-brand-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block shadow-lg">
              Corporate Insight
            </span>
            <h1 className="text-4xl lg:text-7xl font-black leading-tight mb-8 italic uppercase tracking-tighter">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-300 border-t border-white/10 pt-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-primary" />
                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-brand-primary" />
                {(post.views || 0) + 1} Pembaca
              </div>
              <div className="flex items-center gap-2 border-l border-white/20 pl-6 md:flex">
                <User size={18} className="text-brand-primary" />
                Admin Powerindo
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-xl prose-slate max-w-none">
          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-xl font-medium">
            {bodyText}
          </div>
        </div>

        {/* --- KOMPONEN GALERI DENGAN FITUR FULL SCREEN --- */}
        {gallery.length > 0 && (
          <BlogGallery images={gallery} />
        )}

        {/* Tombol Kembali */}
        <div className="mt-24 pt-12 border-t border-slate-100">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-4 text-brand-primary font-black uppercase tracking-widest hover:gap-6 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    </article>
  );
}