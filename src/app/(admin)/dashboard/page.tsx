'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' //

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Hapus produk ini dari katalog?")
    if (confirmDelete) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id) //

      if (error) {
        alert("Gagal menghapus: " + error.message)
      } else {
        setProducts(products.filter(p => p.id !== id))
        alert("Produk berhasil dihapus!")
      }
    }
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-black text-brand-dark italic mb-2">VISITEC CONTROL CENTER</h1>
      <p className="text-slate-500 mb-10">Kelola konten, produk, dan performa digital perusahaan.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Kolom Kiri: Form Tambah Produk */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
           <h2 className="text-2xl font-bold mb-6">Tambah Produk</h2>
           {/* Masukkan Form Anda di Sini */}
        </div>

        {/* Kolom Kanan: List Produk (DI SINI TOMBOL HAPUSNYA) */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Katalog Produk Saat Ini</h2>
          
          <div className="grid gap-4">
            {products.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-brand-dark">{item.name}</h3>
                    <p className="text-brand-primary font-black">Rp {item.price?.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {/* TOMBOL HAPUS ADA DI SINI */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                >
                  HAPUS
                </button>
              </div>
            ))}
            
            {loading && <p className="text-slate-400">Memuat data...</p>}
            {!loading && products.length === 0 && <p className="text-slate-400 italic">Belum ada produk di katalog.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}