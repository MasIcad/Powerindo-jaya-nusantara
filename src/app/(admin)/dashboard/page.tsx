'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation'; 
import { 
  Plus, Package, Image as ImageIcon, Loader2, 
  Trash2, LayoutDashboard, FileText, Save, X, Tag, Pencil, RotateCcw, 
  Users, Mail, Check, Send, Star, MessageSquare, CheckCircle,
  Briefcase, FileUp, Hash 
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton'

export default function DashboardPage() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState<'insight' | 'products' | 'gallery' | 'subscribers' | 'reviews' | 'projects'>('insight');
  const [loading, setLoading] = useState(false);
  
  const [posts, setPosts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [projects, setProjects] = useState<any[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({ no: '', name: '', company: '', field: 'Elektrikal' });
  const [csvText, setCsvText] = useState(''); 
  
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [broadcastForm, setBroadcastForm] = useState({ subject: '', message: '', expires_at: '' });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  const categories = [
    "Trafo", "Cubicle", "ATS+LVMDP", "Capasitor Bank", 
    "Kabel - Tegangan Menengah", "Kabel - Tegangan Rendah", 
    "Genset", "Penangkal Petir", "Busduct", "Hydrant", "AC"
  ];

  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const [prodForm, setProdForm] = useState({ 
    name: '', desc: '', price: '', category: '', files: [] as File[], existingImages: [] as string[] 
  });

  const [postForm, setPostForm] = useState({ 
    title: '', content: '', files: [] as File[], existingImages: [] as string[] 
  });

  const [gallForm, setGallForm] = useState({ title: '', file: null as File | null });

  // --- FIX PADA USE EFFECT (SINKRONISASI SESI) ---
  useEffect(() => { 
    const checkAuthAndFetch = async () => {
      // Pastikan token auth terpasang di client sebelum fetch data
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          fetchData();
        }
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login'); 
      } else {
        await fetchData();
      }

      return () => subscription.unsubscribe();
    };
    
    checkAuthAndFetch();
  }, [router]);

  async function fetchData() {
    setLoading(true); 
    const { data: postsData, error: postsErr } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    const { data: prodData, error: prodErr } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: gallData, error: gallErr } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    const { data: subData, error: subErr } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
    const { data: revData, error: revErr } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    const { data: projData, error: projErr } = await supabase.from('project_experience').select('*').order('project_no', { ascending: false });
    
    console.log("Data Posts:", postsData, "Error:", postsErr);

    if (postsData) setPosts(postsData);
    if (prodData) setProducts(prodData);
    if (gallData) setGallery(gallData);
    if (subData) setSubscribers(subData);
    if (revData) setReviews(revData);
    if (projData) setProjects(projData);
    
    setLoading(false);
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pData = { 
        project_no: parseInt(projectForm.no), 
        project_name: projectForm.name, 
        company: projectForm.company, 
        field: projectForm.field 
      };

      if (editingProjectId) {
        await supabase.from('project_experience').update(pData).eq('id', editingProjectId);
        alert('Proyek Berhasil Diperbarui!');
      } else {
        await supabase.from('project_experience').insert([pData]);
        alert('Proyek Berhasil Ditambahkan!');
      }
      setProjectForm({ no: '', name: '', company: '', field: 'Elektrikal' });
      setEditingProjectId(null);
      fetchData();
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleBulkImport = async () => {
    if (!csvText) return alert("Tempelkan data CSV terlebih dahulu!");
    setLoading(true);
    try {
      const rows = csvText.trim().split('\n');
      const dataToInsert = rows.map(row => {
        const [no, name, company, field] = row.split(';');
        return {
          project_no: parseInt(no.trim()),
          project_name: name.trim(),
          company: company.trim(),
          field: field.trim()
        };
      });

      const { error } = await supabase.from('project_experience').insert(dataToInsert);
      if (error) throw error;
      
      alert(`Berhasil mengimpor ${dataToInsert.length} proyek!`);
      setCsvText('');
      fetchData();
    } catch (err: any) { alert("Gagal Impor: Pastikan format No;Nama;Client;Bidang \n" + err.message); }
    finally { setLoading(false); }
  };

  const handleApproveReview = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('reviews').update({ is_approved: !currentStatus }).eq('id', id);
    if (!error) fetchData();
  };

  const handleReplyReview = async (id: string) => {
    const { error } = await supabase.from('reviews').update({ reply: replyInput[id] }).eq('id', id);
    if (!error) {
      alert('Balasan berhasil disimpan');
      fetchData();
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Hapus review ini?')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const toggleSelect = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(e => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEmails.length === subscribers.length && subscribers.length > 0) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(subscribers.map(s => s.email));
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    try {
      const expiryDate = broadcastForm.expires_at 
        ? new Date(broadcastForm.expires_at).toISOString() 
        : null;

      const { error } = await supabase
        .from('announcements')
        .insert([{ 
          subject: broadcastForm.subject, 
          message: broadcastForm.message,
          target_emails: selectedEmails,
          expires_at: expiryDate 
        }]);

      if (error) throw error;
      alert("Broadcast Berhasil Dipublish!");
      setBroadcastForm({ subject: '', message: '', expires_at: '' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const uploadToStorage = async (file: File, folder: string) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('visitec-assets').upload(filePath, file);
    if (error) throw error;
    return supabase.storage.from('visitec-assets').getPublicUrl(filePath).data.publicUrl;
  };

  const handleEditPostClick = (post: any) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      content: typeof post.content === 'object' ? post.content.body : post.content,
      files: [],
      existingImages: post.content?.gallery || (post.image_url ? [post.image_url] : [])
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- FIX: HANDLE ADD POST DENGAN AUTHOR_ID ---
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Ambil ID Admin yang sedang login agar tidak Violates Policy
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi berakhir, silakan login ulang.");

      let imageUrls: string[] = [...postForm.existingImages];
      if (postForm.files.length > 0) {
        for (const file of postForm.files) {
          const url = await uploadToStorage(file, 'blog');
          imageUrls.push(url);
        }
      }
      if (imageUrls.length === 0) throw new Error("Artikel wajib memiliki minimal 1 foto.");
      
      const postData = { 
        title: postForm.title, 
        content: { body: postForm.content, gallery: imageUrls },
        image_url: imageUrls[0] || '',
        slug: postForm.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
        author_id: user.id // <-- TAMBAHAN: Mengirim ID Penulis
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

  const handleEditProdClick = (p: any) => {
    setEditingProdId(p.id);
    setProdForm({
      name: p.name, desc: p.description, price: p.price.toString(), category: p.category,
      files: [], existingImages: p.images || [p.image_url]
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
        for (const file of prodForm.files) {
          const url = await uploadToStorage(file, 'products');
          imageUrls.push(url);
        }
      }
      const productData = { 
        name: prodForm.name, description: prodForm.desc, price: parseFloat(prodForm.price), 
        category: prodForm.category, image_url: imageUrls[0], images: imageUrls          
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
        <div className="flex justify-between items-start w-full md:w-auto gap-6">
          <div>
            <h1 className="text-4xl font-black text-brand-dark italic uppercase tracking-tighter">Powerindo Jaya Nusantara Control Center</h1>
            <p className="text-slate-500 mt-2">Kelola konten, produk, dan performa digital perusahaan.</p>
          </div>
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="hidden md:block">
            <LogoutButton />
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {[
              { id: 'insight', label: 'Insights', icon: LayoutDashboard },
              { id: 'products', label: 'Produk', icon: Package },
              { id: 'gallery', label: 'Gallery', icon: ImageIcon },
              { id: 'projects', label: 'Projects', icon: Briefcase }, 
              { id: 'subscribers', label: 'Leads', icon: Users },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'insight' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-4xl shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <FileText className="text-brand-primary" /> {editingPostId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h2>
              <form onSubmit={handleAddPost} className="space-y-6">
                <input type="text" placeholder="Judul Artikel" required className="w-full p-5 bg-slate-50 rounded-2xl outline-none text-xl font-bold" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} />
                <textarea placeholder="Mulai menulis konten di sini..." required className="w-full p-5 bg-slate-50 rounded-2xl outline-none h-80 resize-none" value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} />
                <div className="space-y-4">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Gallery Foto Artikel</p>
                   <div className="flex flex-wrap gap-3">
                      {postForm.existingImages.map((url, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-primary/20 group">
                          <img src={url} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPostForm({...postForm, existingImages: postForm.existingImages.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                        </div>
                      ))}
                      {postForm.files.map((file, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-brand-primary">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" />
                          <button type="button" onClick={() => setPostForm({...postForm, files: postForm.files.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                        </div>
                      ))}
                      <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors text-slate-400">
                        <Plus size={24} /><span className="text-[10px] font-bold mt-1">Tambah</span>
                        <input type="file" multiple hidden onChange={e => setPostForm({...postForm, files: [...postForm.files, ...Array.from(e.target.files || [])]})} />
                      </label>
                   </div>
                </div>
                <div className="flex gap-3 pt-6">
                    {editingPostId && (
                        <button type="button" onClick={() => { setEditingPostId(null); setPostForm({title:'', content:'', files:[], existingImages:[]})}} className="flex-1 py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"><RotateCcw size={18}/> Batal</button>
                    )}
                    <button disabled={loading} className="flex-2 py-5 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-brand-primary/90 transition-all">
                        {loading ? <Loader2 className="animate-spin" /> : editingPostId ? <Save size={20} /> : <Plus />} 
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
                <div className="space-y-4">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foto Produk</p>
                   <div className="flex flex-wrap gap-2">
                      {prodForm.existingImages.map((url, i) => (
                        <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border">
                          <img src={url} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setProdForm({...prodForm, existingImages: prodForm.existingImages.filter((_, idx) => idx !== i)})} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5"><X size={10} /></button>
                        </div>
                      ))}
                      {prodForm.files.map((file, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-dashed border-brand-primary">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-70" />
                          <button type="button" onClick={() => setProdForm({...prodForm, files: prodForm.files.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><X size={10} /></button>
                        </div>
                      ))}
                      <label className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-50">
                        <Plus size={16} /><input type="file" multiple hidden onChange={e => setProdForm({...prodForm, files: [...prodForm.files, ...Array.from(e.target.files || [])]})} />
                      </label>
                   </div>
                </div>
                <div className="flex flex-col gap-2">
                    <button disabled={loading} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex justify-center items-center gap-2 cursor-pointer">
                        {loading ? <Loader2 className="animate-spin" /> : editingProdId ? <Save size={18}/> : <Plus />} {editingProdId ? 'Update Produk' : 'Publish Produk'}
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
                    {gallForm.file ? (
                      <div className="w-full aspect-video rounded-xl overflow-hidden mb-2">
                         <img src={URL.createObjectURL(gallForm.file)} className="w-full h-full object-cover" />
                      </div>
                    ) : <ImageIcon size={40} />}
                    {gallForm.file ? gallForm.file.name : "Pilih Foto Pekerjaan"}
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

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-4xl shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Hash className="text-brand-primary" /> {editingProjectId ? 'Edit Project' : 'Tambah Project'}
              </h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <input type="number" placeholder="No Urut (Contoh: 143)" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" value={projectForm.no} onChange={e => setProjectForm({...projectForm, no: e.target.value})} />
                <input type="text" placeholder="Nama Paket Pekerjaan" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} />
                <input type="text" placeholder="Nama Client/Perusahaan" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={projectForm.company} onChange={e => setProjectForm({...projectForm, company: e.target.value})} />
                <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-500" value={projectForm.field} onChange={e => setProjectForm({...projectForm, field: e.target.value})}>
                  <option value="Elektrikal">Elektrikal</option>
                  <option value="Hydrant">Hydrant</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Mekanikal">Mekanikal</option>
                </select>
                <button disabled={loading} className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : editingProjectId ? <Save size={18}/> : <Plus />} {editingProjectId ? 'Update Project' : 'Simpan Project'}
                </button>
                {editingProjectId && (
                   <button type="button" onClick={() => { setEditingProjectId(null); setProjectForm({no:'', name:'', company:'', field:'Elektrikal'})}} className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl"><RotateCcw className="inline mr-2" size={16}/>Batal Edit</button>
                )}
              </form>
            </div>

            <div className="bg-brand-dark p-8 rounded-4xl shadow-xl text-white">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-3 italic"><FileUp className="text-brand-primary" /> Bulk Import CSV</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Format: No;Nama;Client;Bidang (Gunakan Titik Koma)</p>
               <textarea 
                  placeholder="143;Pengadaan Kabel;PT. MEGA BINTANG;Elektrikal" 
                  className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs focus:border-brand-primary transition-all mb-4"
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
               />
               <button onClick={handleBulkImport} disabled={loading} className="w-full py-3 bg-white text-brand-dark font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all">
                  {loading ? 'Processing...' : 'Proses Bulk Import'}
               </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-brand-dark uppercase text-xs tracking-widest">Master Project List</h3>
                  <span className="text-[10px] font-black text-brand-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{projects.length} Total Data</span>
               </div>
               <div className="max-h-800px overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/50 sticky top-0 z-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                      <tr>
                        <th className="px-6 py-4">No</th>
                        <th className="px-6 py-4">Pekerjaan & Client</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5 font-black text-brand-primary text-xs">#{p.project_no}</td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-brand-dark text-sm leading-snug">{p.project_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{p.company} • <span className="text-brand-primary/60">{p.field}</span></p>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex gap-2 justify-center">
                                <button onClick={() => { setEditingProjectId(p.id); setProjectForm({no: p.project_no.toString(), name: p.project_name, company: p.company, field: p.field}); window.scrollTo(0,0); }} className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><Pencil size={18}/></button>
                                <button onClick={async () => { if(confirm('Hapus data proyek ini?')) { await supabase.from('project_experience').delete().eq('id', p.id); fetchData(); } }} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          <div className="bg-brand-dark p-10 rounded-4xl shadow-2xl text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-brand-primary rounded-2xl">
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Broadcast Message</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Kirim pesan ke {selectedEmails.length} orang terpilih</p>
              </div>
            </div>
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <input 
                type="text" 
                placeholder="Subjek Email (Contoh: Promo Trafo Desember)" 
                required
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-brand-primary transition-all text-white"
                value={broadcastForm.subject}
                onChange={e => setBroadcastForm({...broadcastForm, subject: e.target.value})}
              />
              <textarea 
                placeholder="Tulis pesan profesional Anda di sini..." 
                required
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none h-40 resize-none focus:border-brand-primary transition-all text-white"
                value={broadcastForm.message}
                onChange={e => setBroadcastForm({...broadcastForm, message: e.target.value})}
              />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Atur Tanggal Kedaluwarsa (Opsional)</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-brand-primary text-white"
                  value={broadcastForm.expires_at}
                  onChange={e => setBroadcastForm({...broadcastForm, expires_at: e.target.value})}
                />
              </div>
              <button 
                disabled={isBroadcasting || selectedEmails.length === 0}
                className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg flex justify-center items-center gap-3 disabled:bg-slate-700 disabled:cursor-not-allowed hover:bg-blue-600 transition-all uppercase tracking-widest text-xs"
              >
                {isBroadcasting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {isBroadcasting ? 'Mengirim...' : `Kirim ke ${selectedEmails.length} Penerima`}
              </button>
            </form>
          </div>
          <div className="bg-white p-10 rounded-4xl shadow-xl border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-brand-dark italic uppercase tracking-tighter flex items-center gap-3">
                  <Users className="text-brand-primary" /> Potential Leads
                </h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Pilih email untuk mengirim pesan spesifik</p>
              </div>
              <button onClick={toggleSelectAll} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all">
                {selectedEmails.length === subscribers.length && subscribers.length > 0 ? 'Batal Pilih Semua' : 'Pilih Semua'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscribers.map((sub) => {
                const isSelected = selectedEmails.includes(sub.email);
                return (
                  <div key={sub.id} onClick={() => toggleSelect(sub.email)} className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative group ${isSelected ? 'border-brand-primary bg-blue-50/50' : 'border-slate-50 bg-slate-50'}`}>
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-slate-200'}`}>
                      {isSelected && <Check size={14} strokeWidth={4} />}
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                      <Mail size={18} className={isSelected ? 'text-brand-primary' : 'text-slate-300'} />
                    </div>
                    <p className="font-bold text-brand-dark truncate pr-8">{sub.email}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-2">
                      Terdaftar: {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <button onClick={(e) => { e.stopPropagation(); if(confirm('Hapus email ini?')) { supabase.from('subscribers').delete().eq('id', sub.id).then(() => fetchData()); } }} className="mt-6 text-red-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={12} /> Hapus Permanen
                    </button>
                  </div>
                );
              })}
            </div>
            {subscribers.length === 0 && <div className="py-20 text-center text-slate-400 italic">Belum ada leads yang terdaftar.</div>}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-brand-dark uppercase italic tracking-tighter flex items-center gap-3">
              <MessageSquare className="text-brand-primary" /> Customer Feedback
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xl text-brand-dark">{rev.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{rev.company || 'Personal Client'}</p>
                    </div>
                    <div className="flex gap-1 bg-slate-50 p-2 rounded-xl">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic text-lg leading-relaxed">"{rev.comment}"</p>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Admin Reply</p>
                    {rev.reply ? (
                      <div className="bg-brand-dark/5 p-4 rounded-2xl border-l-4 border-brand-primary">
                        <p className="text-sm italic text-brand-dark font-medium">{rev.reply}</p>
                        <button onClick={() => setReplyInput({ ...replyInput, [rev.id]: rev.reply })} className="text-[10px] text-brand-primary font-bold mt-2 uppercase underline">Edit Balasan</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input type="text" placeholder="Tulis balasan profesional..." className="flex-1 bg-slate-50 p-3 rounded-xl text-sm outline-none focus:ring-2 ring-brand-primary/20" value={replyInput[rev.id] || ''} onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })} />
                        <button onClick={() => handleReplyReview(rev.id)} className="bg-brand-primary text-white px-4 rounded-xl hover:bg-brand-primary/90 transition-colors"><Send size={16}/></button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:w-48 flex flex-col gap-2">
                  <button onClick={() => handleApproveReview(rev.id, rev.is_approved)} className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${rev.is_approved ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-brand-primary text-white shadow-lg'}`}>
                    {rev.is_approved ? <CheckCircle size={16}/> : <Plus size={16}/>} {rev.is_approved ? 'Approved' : 'Approve'}
                  </button>
                  <button onClick={() => handleDeleteReview(rev.id)} className="w-full py-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16}/> Delete
                  </button>
                </div>
              </div>
            ))}
            {reviews.length === 0 && <div className="py-20 text-center text-slate-400 italic">Belum ada review masuk.</div>}
          </div>
        </div>
      )}
    </div>
  );
}