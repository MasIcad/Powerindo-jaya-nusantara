export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ArrowLeft, MessageCircle, ShieldCheck, Truck, Clock } from 'lucide-react'
import Link from 'next/link'
import Reveal from '@/components/layout/Reveal'
import ProductView from '@/components/product/ProductImage'

// Di Next.js 15, params adalah sebuah Promise
export default async function ProductDetailPage(props: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Ambil params dengan await (Wajib di Next.js 15)
  const params = await props.params;
  const productId = params.id;

  // 2. Gunakan productId untuk query ke Supabase
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (!product) return notFound();

  // Pesan WA otomatis agar admin tahu produk mana yang ditanyakan
  const waMessage = encodeURIComponent(`Halo Powerindo Jaya Nusantara, saya tertarik untuk bertanya lebih lanjut mengenai produk: ${product.name}. Mohon informasinya.`);

  return (
    <main className="bg-white min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-brand-primary mb-12 transition-colors font-bold text-sm">
            <ArrowLeft size={16} /> KEMBALI KE KATALOG
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Kiri: Gambar Produk - Sekarang mendukung Full Size */}
          <Reveal>
            <ProductView src={product.image_url} alt={product.name} />
          </Reveal>

          {/* Kanan: Detail Informasi */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <span className="bg-blue-50 text-brand-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit border border-blue-100">
                {product.category || 'General Infrastructure'}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 leading-tight uppercase italic tracking-tighter">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-brand-primary mb-8">
                Rp {product.price?.toLocaleString('id-ID')}
              </p>
              
              <div className="prose prose-slate mb-12">
                <p className="text-xl text-slate-500 leading-relaxed italic">
                  "{product.description}"
                </p>
              </div>

              {/* Fitur Tambahan PJN agar terlihat profesional */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-y border-slate-100 py-8">
                <div className="flex items-center gap-3 text-slate-600">
                  <ShieldCheck className="text-brand-primary" size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">GARANSI RESMI</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Truck className="text-brand-primary" size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">PENGIRIMAN AMAN</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="text-brand-primary" size={20} /> <span className="text-[10px] font-bold uppercase tracking-wider">SUPPORT 24/7</span>
                </div>
              </div>

              {/* Tombol Order Langsung ke WA */}
              <a 
                href={`https://wa.me/6281252505111?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white py-5 px-8 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-xl shadow-green-100 group"
              >
                <MessageCircle size={24} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                TANYA VIA WHATSAPP
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}