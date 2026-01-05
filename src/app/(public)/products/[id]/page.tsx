export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ArrowLeft, MessageCircle, ShieldCheck, Truck, PackageCheck, Info } from 'lucide-react'
import Link from 'next/link'
import Reveal from '@/components/layout/Reveal'
import ProductView from '@/components/product/ProductImage'

export default async function ProductDetailPage(props: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Ambil params dengan await
  const params = await props.params;
  const productId = params.id;

  // 2. Query ke Supabase
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (!product) return notFound();

  // Pesan WA otomatis
  const waMessage = encodeURIComponent(`Halo Powerindo Jaya Nusantara, saya tertarik untuk meminta penawaran harga terbaik untuk produk: ${product.name}. Mohon informasinya.`);

  return (
    <main className="bg-white min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-brand-primary mb-12 transition-colors font-bold text-sm">
            <ArrowLeft size={16} /> KEMBALI KE KATALOG
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Kiri: Gambar Produk */}
          <Reveal>
            <ProductView 
              images={product.images || [product.image_url]} 
              alt={product.name} 
            />
          </Reveal>

          {/* Kanan: Detail Informasi */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <span className="bg-blue-50 text-brand-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit border border-blue-100">
                {product.category || 'General Infrastructure'}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 leading-tight uppercase italic tracking-tighter">
                {product.name}
              </h1>
              
              {/* --- PENGGANTI HARGA --- */}
              <div className="bg-slate-50 border-l-4 border-brand-primary p-6 mb-10 rounded-r-2xl">
                <div className="flex items-center gap-2 text-brand-primary mb-3">
                  <Info size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Price Information</span>
                </div>
                <p className="text-2xl md:text-3xl font-black text-brand-dark italic uppercase tracking-tight leading-none">
                  Hubungi Kami Untuk Penawaran Terbaik
                </p>
              </div>
              
              {/* --- PERBAIKAN DESKRIPSI: Menggunakan whitespace-pre-wrap agar Enter berfungsi --- */}
              <div className="prose prose-slate mb-12 max-w-none">
                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap border-l-4 border-slate-100 pl-6">
                  {product.description}
                </div>
              </div>

              {/* Fitur Utama */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-y border-slate-100 py-8">
                <div className="flex items-center gap-3 text-slate-600">
                  <ShieldCheck className="text-brand-primary" size={20} /> 
                  <span className="text-[10px] font-bold uppercase tracking-wider">GARANSI RESMI</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Truck className="text-brand-primary" size={20} /> 
                  <span className="text-[10px] font-bold uppercase tracking-wider">PENGIRIMAN AMAN</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <PackageCheck className="text-brand-primary" size={20} /> 
                  <span className="text-[10px] font-bold uppercase tracking-wider">100% ORIGINAL</span>
                </div>
              </div>

              {/* Tombol Utama */}
              <a 
                href={`https://wa.me/6281252505111?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-primary text-white py-6 px-8 rounded-2xl font-black italic tracking-widest flex items-center justify-center gap-4 hover:bg-brand-dark transition-all shadow-2xl shadow-blue-200 group uppercase w-full"
              >
                <MessageCircle size={24} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                Dapatkan Penawaran Harga
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}