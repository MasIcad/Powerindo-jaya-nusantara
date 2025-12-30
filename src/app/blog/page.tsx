export const dynamic = 'force-dynamic';
// Menambahkan revalidate 0 untuk memastikan data selalu fresh
export const revalidate = 0; 

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MessageCircle, Phone, Eye, Calendar } from 'lucide-react';

export default async function BlogListPage() {
  // Fetch data dari Supabase
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-brand-dark">Latest News & Insights</h2>
        <div className="h-1 w-20 bg-brand-primary mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-52 w-full overflow-hidden">
                <img 
                  src={post.image_url || 'https://via.placeholder.com/800x450'} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-brand-primary uppercase mb-2">Corporate News</div>
                <h3 className="text-lg font-bold text-brand-dark mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-4 border-t">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-brand-primary">
                    <Eye size={12} />
                    {/* Memastikan views tampil 0 jika datanya null */}
                    {post.views || 0} Views
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <div className="fixed bottom-8 right-8 z-100 flex flex-col items-end group">
        <div className="flex flex-col gap-3 mb-4 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
          <a 
            href="https://wa.me/6281252505111" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-brand-dark px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors font-bold text-sm"
          >
            <div className="bg-green-500 p-1.5 rounded-lg text-white">
              <Phone size={14} />
            </div>
            Customer Service 1
          </a>
          <a 
            href="https://wa.me/6282245616400" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-brand-dark px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors font-bold text-sm"
          >
            <div className="bg-green-500 p-1.5 rounded-lg text-white">
              <Phone size={14} />
            </div>
            Customer Service 2
          </a>
        </div>

        <button className="bg-green-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300">
          <MessageCircle size={32} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}