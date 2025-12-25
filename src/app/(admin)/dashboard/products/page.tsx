'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  BarChart3, FileText, Eye, Plus, Package, 
  Image as ImageIcon, Loader2, Trash2, LayoutDashboard 
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'insight' | 'products' | 'gallery'>('insight');
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [posts, setPosts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // Form State
  const [prodForm, setProdForm] = useState({ name: '', desc: '', price: '', file: null as File | null });
  const [gallForm, setGallForm] = useState({ title: '', file: null as File | null });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: postsData } = await supabase.from('posts').select('*').order('views', { ascending: false });
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (postsData) setPosts(postsData);
    if (prodData) setProducts(prodData);
  }

  // --- LOGIKA UPLOAD & SIMPAN ---
  const uploadToStorage = async (file: File, folder: string) => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('visitec-assets').upload(filePath, file);
    if (error) throw error;
    return supabase.storage.from('visitec-assets').getPublicUrl(filePath).data.publicUrl;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.file) return alert('Pilih gambar produk!');
    setLoading(true);
    try {
      const url = await uploadToStorage(prodForm.file, 'products');
      await supabase.from('products').insert([{ 
        name: prodForm.name, description: prodForm.desc, 
        price: parseFloat(prodForm.price), image_url: url 
      }]);
      alert('Produk Berhasil Ditambahkan!');
      setProdForm({ name: '', desc: '', price: '', file: null });
      fetchData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  // --- PERHITUNGAN STATS ---
  const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark italic uppercase tracking-tighter">Visitec Control Center</h1>
          <p className="text-slate-500 mt-2">Kelola konten, produk, dan performa digital perusahaan.</p>
        </div>
        <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          {[
            { id: 'insight', label: 'Insights', icon: LayoutDashboard },
            { id: 'products', label: 'Produk', icon: Package },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. TAB INSIGHTS (Statistik & Tabel Artikel) */}
      {activeTab === 'insight' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={FileText} label="Total Artikel" value={posts.length} color="blue" />
            <StatCard icon={Eye} label="Total Views" value={totalViews.toLocaleString()} color="green" />
            <StatCard icon={Package} label="Produk Aktif" value={products.length} color="purple" />
          </div>

          <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-xl text-brand-dark">Performa Artikel</h3>
              <a href="/write" className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                <Plus size={16} /> Tulis Baru
              </a>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-8 py-4">Judul</th>
                  <th className="px-8 py-4">Tanggal</th>
                  <th className="px-8 py-4 text-center">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-brand-dark">{post.title}</td>
                    <td className="px-8 py-5 text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-8 py-5 text-center">
                      <span className="bg-blue-50 text-brand-primary px-4 py-1 rounded-full text-xs font-bold">{post.views} Views</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TAB PRODUK (Form & Preview) */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100 sticky top-32">
              <h2 className="text-2xl font-bold mb-8 text-brand-dark">Tambah Produk</h2>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <input type="text" placeholder="Nama Produk" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                <input type="number" placeholder="Harga (IDR)" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                <textarea placeholder="Deskripsi Singkat" className="w-full p-4 bg-slate-50 rounded-2xl outline-none h-32" onChange={e => setProdForm({...prodForm, desc: e.target.value})} />
                <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center">
                  <input type="file" id="file" hidden onChange={e => setProdForm({...prodForm, file: e.target.files?.[0] || null})} />
                  <label htmlFor="file" className="cursor-pointer text-sm font-bold text-slate-400">
                    {prodForm.file ? prodForm.file.name : "+ Upload Gambar Produk"}
                  </label>
                </div>
                <button disabled={loading} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <Plus />} Publish Produk
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-xl font-bold text-brand-dark">Katalog Produk Saat Ini</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {products.map(p => (
                 <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-4 items-center">
                   <img src={p.image_url} className="w-20 h-20 rounded-2xl object-cover" />
                   <div>
                     <h4 className="font-bold text-brand-dark">{p.name}</h4>
                     <p className="text-brand-primary font-black text-sm">Rp {p.price.toLocaleString()}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* 3. TAB GALLERY (Form & Preview) */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100 sticky top-32">
              <h2 className="text-2xl font-bold mb-8 text-brand-dark">Update Gallery</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!gallForm.file) return alert('Pilih foto!');
                setLoading(true);
                try {
                  const url = await uploadToStorage(gallForm.file, 'gallery');
                  await supabase.from('gallery').insert([{ title: gallForm.title, image_url: url }]);
                  alert('Foto Berhasil Ditambahkan ke Gallery!');
                  setGallForm({ title: '', file: null });
                  fetchData();
                } catch (err: any) { alert(err.message); }
                finally { setLoading(false); }
              }} className="space-y-5">
                <input 
                  type="text" placeholder="Judul/Keterangan Foto" required 
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                  onChange={e => setGallForm({...gallForm, title: e.target.value})} 
                />
                <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center">
                  <input type="file" id="gallFile" hidden onChange={e => setGallForm({...gallForm, file: e.target.files?.[0] || null})} />
                  <label htmlFor="gallFile" className="cursor-pointer text-sm font-bold text-slate-400">
                    {gallForm.file ? gallForm.file.name : "+ Pilih Foto Pekerjaan"}
                  </label>
                </div>
                <button disabled={loading} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <Plus />} Tambah ke Gallery
                </button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-brand-dark">Preview Gallery</h3>
            <div className="columns-2 gap-4 space-y-4">
              {/* Mapping data gallery di sini (jangan lupa fetch data gallery di useEffect) */}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


// Komponen Card Kecil untuk Stats
function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600"
  };
  return (
    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon size={28} />
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{label}</p>
      <h2 className="text-4xl font-black text-brand-dark mt-2 tracking-tighter">{value}</h2>
    </div>
  );
}
