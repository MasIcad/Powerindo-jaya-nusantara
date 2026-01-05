export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';
import FloatingContact from '@/components/layout/FloatingContact';

export default async function BlogListPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl font-black text-brand-dark italic uppercase tracking-tighter">Latest News & Insights</h2>
        <div className="h-1.5 w-24 bg-brand-primary mt-4 mx-auto md:mx-0"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
              <div className="relative h-60 w-full overflow-hidden">
                <img 
                  src={post.image_url || 'https://via.placeholder.com/800x450'} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Corporate News
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col grow">
                <h3 className="text-xl font-bold text-brand-dark mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-auto pt-6 border-t border-slate-50">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-primary" />
                    {new Date(post.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <span className="flex items-center gap-2 text-brand-primary">
                    <Eye size={14} />
                    {post.views || 0} Views
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <FloatingContact />
    </div>
  );
}