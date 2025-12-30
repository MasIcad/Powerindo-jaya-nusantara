'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Package, Image as ImageIcon, Loader2, 
  Trash2, LayoutDashboard, FileText, Save, X, Tag, Pencil, RotateCcw
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'insight' | 'products' | 'gallery'>('insight');
  const [loading, setLoading] = useState(false);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  
  const categories = [
    "Trafo", "Cubicle", "ATS+LVMDP", "Capasitor Bank", 
    "Kabel - Tegangan Menengah", "Kabel - Tegangan Rendah", 
    "Genset", "Penangkal Petir", "Busduct", "Hydrant", "AC"
  ];

  // --- STATE UNTUK EDIT ---
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const [prodForm, setProdForm] = useState({ 
    name: '', 
    desc: '', 
    price: '', 
    category: '', 
    files: [] as File[],
    existingImages: [] as string[] // Simpan URL lama saat edit
  });

  const [postForm, setPostForm] = useState({ 
    title: '', 
    content: '', 
    files: [] as File[],
    existingImages: [] as string[] 
  });

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

  const uploadToStorage = async (file: File, folder: string) => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('visitec-assets').upload(filePath, file);
    if (error) throw error;
    return supabase.storage.from('visitec-assets').getPublicUrl(filePath).data.publicUrl;
  };

  // --- LOGIKA EDIT ARTIKEL ---
  const handleEditPostClick = (post: any) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      content: typeof post.content === 'object' ? post.content.body : post.content,
      files: [],
      existingImages: post.content?.gallery || [post.image_url]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrls: string[] = [...postForm.existingImages];
      
      if (postForm.files.length > 0) {
        for (const file of postForm.files) {
          const url = await uploadToStorage(file, 'blog');
          imageUrls.push(url);
        }
      }
      
      const postData = { 
        title: postForm.title, 
        content: { body: postForm.content, gallery: imageUrls },
        image_url: imageUrls[0] || '',
        slug: postForm.title.toLowerCase().replace(/ /g, '-')
      };

      if (editingPostId) {
        await supabase.from('posts').update(postData).eq('id', editingPostId);
        alert('Artikel Berhasil Diperbarui!');
      } else {
        await supabase.from('posts').insert([postData]);
        alert('Artikel Berhasil Dipublish!');
      }

      setPostForm({ title: '', content: '', files: [], existingImages: [] });
      setEditingPostId(null);
      fetchData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  // --- LOGIKA EDIT PRODUK ---
  const handleEditProdClick = (p: any) => {
    setEditingProdId(p.id);
    setProdForm({
      name: p.name,
      desc: p.description,
      price: p.price.toString(),
      category: p.category,
      files: [],
      existingImages: p.images || [p.image_url]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProdId && prodForm.files.length === 0) return alert('Pilih minimal 1 gambar produk!');
    if (!prodForm.category) return alert('Pilih kategori produk!');
    
    setLoading(true);
    try {
      let imageUrls: string[] = [...prodForm.existingImages];
      
      if (prodForm.files.length > 0) {
        const filesToUpload = prodForm.files.slice(0, 5);
        for (const file of filesToUpload) {
          const url = await uploadToStorage(file, 'products');
          imageUrls.push(url);
        }
      }

      const productData = { 
        name: prodForm.name, 
        description: prodForm.desc, 
        price: parseFloat(prodForm.price), 
        category: prodForm.category,
        image_url: imageUrls[0], 
        images: imageUrls        
      };

      if (editingProdId) {
        await supabase.from('products').update(productData).eq('id', editingProdId);
        alert('Produk Berhasil Diperbarui!');
      } else {
        await supabase.from('products').insert([productData]);
        alert('Produk Berhasil Ditambahkan!');
      }

      setProdForm({ name: '', desc: '', price: '', category: '', files: [], existingImages: [] });
      setEditingProdId(null);
      fetchData();
    } catch (err: any) { alert("Gagal: " + err.message); }
    finally { setLoading(false); }
  };

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

      {/* 1. TAB INSIGHTS */}
      {activeTab === 'insight' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-4xl shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <FileText className="text-brand-primary" /> 
                {editingPostId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h2>
              <form onSubmit={handleAddPost} className="space-y-6">
                <input type="text" placeholder="Judul Artikel" required className="w-full p-5 bg-slate-50 rounded-2xl outline-none text-xl font-bold" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} />
                <textarea placeholder="Mulai menulis konten di sini..." required className="w-full p-5 bg-slate-50 rounded-2xl outline-none h-80 resize-none" value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} />
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input type="file" id="postImgs" multiple hidden onChange={e => setPostForm({...postForm, files: [...postForm.files, ...Array.from(e.target.files || [])]})} />
                    <label htmlFor="postImgs" className="flex-1 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer font-bold text-slate-400">
                      📸 Tambah Foto Galeri (Opsional jika edit)
                    </label>
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
                <div className="flex gap-3">
                    {editingPostId && (
                        <button type="button" onClick={() => { setEditingPostId(null); setPostForm({title:'', content:'', files:[], existingImages:[]})}} className="flex-1 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2"><RotateCcw size={18}/> Batal</button>
                    )}
                    <button disabled={loading} className="flex-2 py-5 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                        {loading ? <Loader2 className="animate-spin" /> : editingPostId ? <Save /> : <Plus />} 
                        {editingPostId ? 'Perbarui Artikel' : 'Publish Artikel'}
                    </button>
                </div>
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
                 <div className="flex gap-1">
                    <button onClick={() => handleEditPostClick(post)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><Pencil size={18} /></button>
                    <button onClick={async () => { if(confirm('Hapus artikel ini?')) { await supabase.from('posts').delete().eq('id', post.id); fetchData(); } }} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors shrink-0"><Trash2 size={18} /></button>
                 </div>
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
              <h2 className="text-2xl font-bold mb-8">{editingProdId ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <input type="text" placeholder="Nama Produk" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                
                <select required className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-slate-600 cursor-pointer" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                  <option value="" disabled>Pilih Kategori Produk</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <input type="number" placeholder="Harga" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                <textarea placeholder="Deskripsi..." required className="w-full p-4 bg-slate-50 rounded-2xl outline-none h-32" value={prodForm.desc} onChange={e => setProdForm({...prodForm, desc: e.target.value})} />
                
                <input type="file" id="prodFile" multiple hidden onChange={e => setProdForm({...prodForm, files: Array.from(e.target.files || [])})} />
                <label htmlFor="prodFile" className="block p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center cursor-pointer text-slate-400 font-bold">
                   {prodForm.files.length > 0 ? `${prodForm.files.length} Foto Baru Terpilih` : editingProdId ? "+ Ganti/Tambah Foto" : "+ Upload Gambar (Maks 5)"}
                </label>

                <div className="flex flex-col gap-2">
                    <button disabled={loading} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex justify-center items-center gap-2 cursor-pointer">
                        {loading ? <Loader2 className="animate-spin" /> : editingProdId ? <Save size={18}/> : <Plus />} 
                        {editingProdId ? 'Update Produk' : 'Publish Produk'}
                    </button>
                    {editingProdId && (
                        <button type="button" onClick={() => { setEditingProdId(null); setProdForm({name:'', desc:'', price:'', category:'', files:[], existingImages:[]})}} className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl flex justify-center items-center gap-2"><RotateCcw size={18}/> Batal</button>
                    )}
                </div>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
             <h3 className="font-bold text-brand-dark uppercase tracking-wider text-sm mb-4">Daftar Inventori</h3>
             {products.map(p => (
               <div key={p.id} className="bg-white p-5 rounded-3xl border flex justify-between items-center shadow-sm group">
                 <div className="flex gap-5 items-center">
                   <img src={p.image_url} className="w-20 h-20 rounded-2xl object-cover" />
                   <div>
                     <span className="bg-blue-50 text-brand-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tighter"><Tag size={10} className="inline mr-1"/>{p.category || 'N/A'}</span>
                     <h4 className="font-bold text-lg text-brand-dark mt-1">{p.name}</h4>
                     <p className="text-brand-primary font-black">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleEditProdClick(p)} className="p-4 text-blue-500 hover:bg-blue-50 rounded-2xl transition-colors"><Pencil size={22} /></button>
                    <button onClick={async () => { if(confirm('Hapus produk ini?')) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition-colors"><Trash2 size={22} /></button>
                 </div>
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
                   <button onClick={async () => { if(confirm('Hapus foto ini dari gallery?')) { await supabase.from('gallery').delete().eq('id', item.id); fetchData(); } }} className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-xl"><Trash2 size={20} /></button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}