export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function BlogListPage() {
  // Fetch data dari Supabase
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
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
                  <span>{new Date(post.created_at).toLocaleDateString('id-ID')}</span>
                  <span>{post.views} Views</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}