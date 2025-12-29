// 1. Tetap memaksa data selalu diperbarui
export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase' 
import Reveal from '@/components/layout/Reveal'
import { MessageCircle, Phone, Tag } from 'lucide-react' 
import Link from 'next/link'

// Definisikan tipe data
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const selectedCategory = searchParams.category;

  // List Kategori sesuai permintaan
  const categories = [
    "Trafo", "Cubicle", "ATS+LVMDP", "Capasitor Bank", 
    "Kabel - Tegangan Menengah", "Kabel - Tegangan Rendah", 
    "Genset", "Penangkal Petir", "Busduct", "Hydrant", "AC"
  ];

  // Logic Query: Jika ada kategori terpilih, filter berdasarkan kategori tersebut
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  
  if (selectedCategory) {
    query = query.eq('category', selectedCategory);
  }

  const { data: products } = await query;

  return (
    <section className="py-32 px-6 bg-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16">
            <h1 className="text-5xl font-black text-brand-dark italic mb-4 uppercase tracking-tighter">OUR PRODUCTS</h1>
            <p className="text-slate-500">Menyediakan infrastruktur elektrikal dan digital terbaik untuk kebutuhan industri Anda.</p>
        </div>

        {/* --- FILTER KATEGORI DENGAN HIGHLIGHT BIRU --- */}
        <div className="flex flex-wrap gap-3 mb-16">
          <Link 
            href="/products"
            className={`px-8 py-3 rounded-full border-2 text-xs font-bold tracking-widest transition-all duration-300 shadow-sm ${
              !selectedCategory 
              ? 'bg-brand-primary text-white border-brand-primary shadow-blue-200 shadow-lg' 
              : 'bg-white text-slate-400 border-slate-100 hover:border-brand-primary hover:text-brand-primary'
            }`}
          >
            SEMUA PRODUK
          </Link>
          
          {categories.map((cat) => (
            <Link 
              key={cat}
              href={`/products?category=${cat}`}
              className={`px-8 py-3 rounded-full border-2 text-xs font-bold tracking-widest transition-all duration-300 shadow-sm ${
                selectedCategory === cat 
                ? 'bg-brand-primary text-white border-brand-primary shadow-blue-200 shadow-lg' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              {cat.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* --- GRID PRODUK --- */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((item: Product) => ( 
              <Reveal key={item.id}>
                <div className="group border border-slate-100 rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl transition-all bg-white">
                  <div className="h-72 overflow-hidden relative">
                    {/* Badge Kategori di atas foto */}
                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-slate-100">
                        <Tag size={12} className="text-brand-primary" />
                        <span className="text-[10px] font-black text-brand-dark uppercase tracking-wider">{item.category || 'General'}</span>
                    </div>
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2 text-brand-dark">{item.name}</h3>
                    <p className="text-slate-500 mb-6 line-clamp-2 text-sm leading-relaxed">{item.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <span className="text-xl font-black text-brand-primary">
                        Rp {item.price?.toLocaleString('id-ID')}
                      </span>
                      <button className="text-xs font-bold tracking-widest border-b-2 border-brand-dark hover:text-brand-primary hover:border-brand-primary transition-all">
                        DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">Belum ada produk untuk kategori "{selectedCategory}"</p>
          </div>
        )}
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

        <button className="bg-green-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none">
          <MessageCircle size={32} fill="currentColor" />
        </button>
      </div>
    </section>
  )
}