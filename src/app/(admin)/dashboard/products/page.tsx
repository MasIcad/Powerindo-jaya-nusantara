'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Produk') // Mengatur tab aktif
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Hapus produk ini dari katalog?")) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) {
        setProducts(products.filter(p => p.id !== id))
        alert("Berhasil dihapus!")
      }
    }
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* HEADER DARI FOTO SEBELUMNYA */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-black text-brand-dark italic mb-2 uppercase">Visitec Control Center</h1>
          <p className="text-slate-500">Kelola konten, produk, dan performa digital perusahaan.</p>
        </div>
        
        {/* TOMBOL NAVIGASI (TABS) */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          {['Insights', 'Produk', 'Gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === tab ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'Insights' && '📊 '}
              {tab === 'Produk' && '📦 '}
              {tab === 'Gallery' && '🖼️ '}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KONTEN BERDASARKAN TAB */}
      {activeTab === 'Produk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* KOLOM KIRI: TAMBAH PRODUK */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">Tambah Produk</h2>
            {/* Form tambah produk Anda tetap di sini */}
          </div>

          {/* KOLOM KANAN: LIST PRODUK + TOMBOL HAPUS */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Katalog Produk Saat Ini</h2>
            <div className="grid gap-4">
              {products.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-5">
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                    <div>
                      <h3 className="font-bold text-xl text-brand-dark">{item.name}</h3>
                      <p className="text-brand-primary font-black text-lg">Rp {item.price?.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-50 text-red-500 px-5 py-2.5 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                  >
                    HAPUS
                  </button>
                </div>
              ))}
              {loading && <p className="animate-pulse text-slate-400">Menarik data dari server...</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Insights' && <div className="p-20 text-center text-slate-400">Statistik akan muncul di sini.</div>}
      {activeTab === 'Gallery' && <div className="p-20 text-center text-slate-400">Manajemen Gallery akan muncul di sini.</div>}
    </div>
  )
}