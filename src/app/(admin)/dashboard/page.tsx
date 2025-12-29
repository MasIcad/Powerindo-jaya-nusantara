'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Package, Image as ImageIcon, Loader2, 
  Trash2, LayoutDashboard, FileText, UploadCloud, Save, X
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'insight' | 'products' | 'gallery'>('insight');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [posts, setPosts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  
  // Form States
  const [prodForm, setProdForm] = useState({ name: '', desc: '', price: '', file: null as File | null });
  const [postForm, setPostForm] = useState({ title: '', content: '', files: [] as File[] });
  const [gallForm, setGallForm] = useState({ title: '', file: null as File | null });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: gallData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    
    if (postsData) setPosts(postsData);
    if (prodData) setProducts(prodData);
    if (gallData) setGallery(gallData);
  }

  // --- HELPER: UPLOAD KE STORAGE ---
  const uploadToStorage = async (file: File, folder: string) => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('visitec-assets').upload(filePath, file);
    if (error) throw error;
    return supabase.storage.from('visitec-assets').getPublicUrl(filePath).data.publicUrl;
  };

  // --- HANDLER: PUBLISH ARTIKEL (MULTIPLE PHOTOS) ---
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      if (postForm.files.length > 0) {
        for (const file of postForm.files) {
          const url = await uploadToStorage(file, 'blog');
          imageUrls.push(url);
        }
      }
      
      await supabase.from('posts').insert([{ 
        title: postForm.title, 
        content: { body: postForm.content, gallery: imageUrls },
        image_url: imageUrls[0] || '',
        slug: postForm.title.toLowerCase().replace(/ /g, '-')
      }]);

      alert('Artikel Berhasil Dipublish!');
      setPostForm({ title: '', content: '', files: [] });
      fetchData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  // --- HANDLER: TAMBAH PRODUK ---
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

  // --- HANDLER: TAMBAH GALLERY ---
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gallForm.file) return alert('Pilih foto gallery!');
    setLoading(true);
    try {
      const url = await uploadToStorage(gallForm.file, 'gallery');
      await supabase.from('gallery').insert([{ title: gallForm.title, image_url: url }]);
      alert('Berhasil ditambahkan ke Gallery!');
      setGallForm({ title: '', file: null });
      fetchData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 bg-slate-50 min-h-screen">
      {/* HEADER NAVIGASI TABS */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark italic uppercase tracking-tighter">Powerindo Jaya Nusantara Control Center</h1>
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

      {/* 1. TAB INSIGHTS: TULIS ARTIKEL */}
      {activeTab === 'insight' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-4xl shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"><FileText className="text-brand-primary" /> Tulis Artikel Baru</h2>
              <form onSubmit={handleAddPost} className="space-y-6">
                <input type="text" placeholder="Judul Artikel" required className="w-full p-5 bg-slate-50 rounded-2xl outline-none text-xl font-bold" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} />
                <textarea placeholder="Mulai menulis konten di sini..." required className="w-full p-5 bg-slate-50 rounded-2xl outline-none h-80 resize-none" value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} />
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input type="file" id="postImgs" multiple hidden onChange={e => setPostForm({...postForm, files: [...postForm.files, ...Array.from(e.target.files || [])]})} />
                    <label htmlFor="postImgs" className="flex-1 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer font-bold text-slate-400">📸 Pilih Banyak Foto Galeri Artikel</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {postForm.files.map((file, idx) => (
                      <div key={idx} className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setPostForm({...postForm, files: postForm.files.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <button disabled={loading} className="w-full py-5 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer">{loading ? <Loader2 className="animate-spin" /> : <Save />} Publish Artikel</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-bold text-brand-dark uppercase tracking-wider text-sm">Artikel Terbaru</h3>
            {posts.map(post => (
              <div key={post.id} className="p-4 bg-white rounded-2xl border flex items-center justify-between gap-4 group hover:border-brand-primary transition-all shadow-sm">
                <div className="flex items-center gap-4 overflow-hidden">
                  <img src={post.image_url} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <p className="font-bold text-xs truncate">{post.title}</p>
                </div>
                {/* Tombol Delete Insight */}
                <button 
                  onClick={async () => { if(confirm('Hapus artikel ini?')) { await supabase.from('posts').delete().eq('id', post.id); fetchData(); } }}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TAB PRODUK */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100 sticky top-32">
              <h2 className="text-2xl font-bold mb-8">Tambah Produk</h2>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <input type="text" placeholder="Nama Produk" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                <input type="number" placeholder="Harga" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                <textarea placeholder="Deskripsi..." required className="w-full p-4 bg-slate-50 rounded-2xl outline-none h-32" value={prodForm.desc} onChange={e => setProdForm({...prodForm, desc: e.target.value})} />
                <input type="file" id="prodFile" hidden onChange={e => setProdForm({...prodForm, file: e.target.files?.[0] || null})} />
                <label htmlFor="prodFile" className="block p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer text-slate-400 font-bold">{prodForm.file ? prodForm.file.name : "+ Upload Gambar"}</label>
                <button disabled={loading} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex justify-center items-center gap-2 cursor-pointer">{loading ? <Loader2 className="animate-spin" /> : <Plus />} Publish Produk</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {products.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-3xl border flex justify-between items-center shadow-sm">
                <div className="flex gap-5 items-center"><img src={p.image_url} className="w-20 h-20 rounded-2xl object-cover" /><div><h4 className="font-bold text-lg">{p.name}</h4><p className="text-brand-primary font-black">Rp {Number(p.price).toLocaleString('id-ID')}</p></div></div>
                <button onClick={async () => { if(confirm('Hapus?')) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl"><Trash2 size={22} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB GALLERY */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold mb-8">Add to Gallery</h2>
              <form onSubmit={handleAddGallery} className="space-y-6">
                <input type="text" placeholder="Judul Proyek" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={gallForm.title} onChange={e => setGallForm({...gallForm, title: e.target.value})} />
                <div className="border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center">
                  <input type="file" id="gallFile" hidden onChange={e => setGallForm({...gallForm, file: e.target.files?.[0] || null})} />
                  <label htmlFor="gallFile" className="cursor-pointer flex flex-col items-center gap-3 text-slate-400 font-bold">
                    <ImageIcon size={40} /> {gallForm.file ? gallForm.file.name : "Pilih Foto Pekerjaan"}
                  </label>
                </div>
                <button disabled={loading} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg cursor-pointer">{loading ? <Loader2 className="animate-spin" /> : "Upload ke Gallery"}</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map(item => (
              <div key={item.id} className="aspect-square rounded-3xl overflow-hidden border relative group shadow-sm">
                <img src={item.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4 gap-4">
                  <p className="text-white text-xs font-bold text-center">{item.title}</p>
                  {/* Tombol Delete Gallery */}
                  <button 
                    onClick={async () => { if(confirm('Hapus foto ini dari gallery?')) { await supabase.from('gallery').delete().eq('id', item.id); fetchData(); } }}
                    className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}