// 1. Tetap memaksa data selalu diperbarui
export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase' 
import Reveal from '@/components/layout/Reveal'
import { MessageCircle, Phone, Tag, PackageSearch, Search } from 'lucide-react' 
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

// PERBAIKAN UTAMA: searchParams sekarang harus di-await (Next.js 15+)
export default async function ProductsPage(props: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  // Menunggu (await) searchParams sebelum digunakan
  const searchParams = await props.searchParams;
  const selectedCategory = searchParams.category;
  const searchQuery = searchParams.q;

  // List Kategori
  const categories = [
    "Trafo", "Cubicle", "ATS+LVMDP", "Capasitor Bank", 
    "Kabel - Tegangan Menengah", "Kabel - Tegangan Rendah", 
    "Genset", "Penangkal Petir", "Busduct", "Hydrant", "AC"
  ];

  // Logic Query: Membangun query dasar
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  
  // Jika ada kategori terpilih, tambahkan filter .eq
  if (selectedCategory && selectedCategory.trim() !== "") {
    query = query.eq('category', selectedCategory);
  }

  // FITUR BARU: Jika ada keyword pencarian, tambahkan filter .ilike (case-insensitive search)
  if (searchQuery && searchQuery.trim() !== "") {
    // Mencari di kolom 'name' yang mengandung kata kunci
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data: products } = await query;

  return (
    <section className="py-32 px-6 bg-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
                <h1 className="text-5xl font-black text-brand-dark italic mb-4 uppercase tracking-tighter">OUR PRODUCTS</h1>
                <p className="text-slate-500 max-w-xl">Menyediakan infrastruktur elektrikal dan digital terbaik untuk kebutuhan industri Anda.</p>
            </div>

            {/* --- SEARCH BAR --- */}
            <form action="/products" method="GET" className="relative w-full md:w-96 group">
                <input 
                    type="text" 
                    name="q" 
                    defaultValue={searchQuery}
                    placeholder="Cari trafo, kabel, atau genset..." 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-full outline-none focus:border-brand-primary focus:bg-white transition-all font-medium text-brand-dark"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors" size={20} />
                {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
            </form>
        </div>

        {/* --- FILTER KATEGORI --- */}
        <div className="flex flex-wrap gap-3 mb-16">
          <Link 
            href="/products"
            className={`px-8 py-3 rounded-full border-2 text-[10px] font-black tracking-widest transition-all duration-300 shadow-sm ${
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
              href={`/products?category=${encodeURIComponent(cat)}${searchQuery ? `&q=${searchQuery}` : ''}`}
              className={`px-8 py-3 rounded-full border-2 text-[10px] font-black tracking-widest transition-all duration-300 shadow-sm ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {products.map((item: Product) => ( 
              <Reveal key={item.id}>
                {/* h-full flex flex-col memastikan semua kartu memiliki tinggi yang sama dalam satu baris grid */}
                <div className="group border border-slate-100 rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl transition-all bg-white h-full flex flex-col">
                  <div className="h-72 overflow-hidden relative shrink-0">
                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-slate-100">
                        <Tag size={12} className="text-brand-primary" />
                        <span className="text-[10px] font-black text-brand-dark uppercase tracking-wider">{item.category || 'General'}</span>
                    </div>
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  {/* flex-grow mendorong footer (harga & detail) ke posisi paling bawah yang seragam */}
                  <div className="p-8 flex flex-col grow">
                    {/* line-clamp-1 menjaga judul tidak merusak layout jika terlalu panjang */}
                    <h3 className="text-2xl font-bold mb-3 text-brand-dark line-clamp-1">{item.name}</h3>
                    
                    {/* FITUR READ MORE: line-clamp-3 membatasi deskripsi hanya 3 baris */}
                    <p className="text-slate-500 mb-6 line-clamp-3 text-sm leading-relaxed grow">
                      {item.description}
                    </p>

                    {/* mt-auto memastikan row ini sejajar di semua kartu dalam satu baris */}
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50 mt-auto">
                      <span className="text-xl font-black text-brand-primary">
                        Rp {item.price?.toLocaleString('id-ID')}
                      </span>
                      <Link 
                        href={`/products/${item.id}`} 
                        className="text-xs font-bold tracking-widest border-b-2 border-brand-dark hover:text-brand-primary hover:border-brand-primary transition-all pb-1"
                      >
                        DETAILS
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
            <PackageSearch size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-400 font-medium italic">
                {searchQuery 
                    ? `Produk "${searchQuery}" tidak ditemukan` 
                    : `Tidak ada produk untuk kategori "${selectedCategory}"`}
            </p>
            <Link href="/products" className="mt-4 text-brand-primary font-bold text-sm hover:underline">Lihat Semua Produk</Link>
          </div>
        )}
      </div>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <div className="fixed bottom-8 right-8 z-100 flex flex-col items-end group">
        <div className="flex flex-col gap-3 mb-4 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
          <a href="https://wa.me/6281252505111" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-dark px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors font-bold text-sm">
            <div className="bg-green-500 p-1.5 rounded-lg text-white"><Phone size={14} /></div>
            Customer Service 1
          </a>
          <a href="https://wa.me/6282245616400" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-dark px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors font-bold text-sm">
            <div className="bg-green-500 p-1.5 rounded-lg text-white"><Phone size={14} /></div>
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