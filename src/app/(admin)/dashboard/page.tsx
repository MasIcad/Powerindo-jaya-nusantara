'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Hapus produk ini dari katalog?")
    if (confirmDelete) {
      // Menghapus berdasarkan ID dari tabel products
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) {
        setProducts(products.filter(p => p.id !== id))
        alert("Berhasil dihapus!")
      }
    }
  }

  return (
    <div className="p-8">
      {/* ... bagian header dan form tambah ... */}
      
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold mb-6 text-brand-dark">Katalog Produk Saat Ini</h2>
        <div className="grid gap-4">
          {products.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-brand-dark">{item.name}</h3>
                  <p className="text-brand-primary font-black">Rp {item.price?.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* TOMBOL HAPUS HARUS DITULIS DI SINI AGAR TAMPIL */}
              <button 
                onClick={() => handleDelete(item.id)}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
              >
                HAPUS
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}