'use client'

import { useState } from 'react'
import { loginAction } from './action'
import { Lock, Mail, Loader2, Zap } from 'lucide-react'
import Image from 'next/image'
import { logoutAction } from './action'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Memanggil Server Action yang sudah Anda buat
    const res = await loginAction(email, password)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // Jika sukses, redirect ditangani oleh Server Action
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      
      {/* --- BAGIAN KIRI: BRANDING IMAGE (Hidden di Mobile) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-dark items-center justify-center overflow-hidden">
        {/* GANTI '/images/login-bg.jpg' dengan path foto industrial Anda yang keren */}
        {/* Placeholder background jika belum ada gambar */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473042904451-00171c69419d?q=80&w=1475&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
        
        {/* Overlay Gradient agar teks terbaca jelas */}
        <div className="absolute inset-0 bg-linear-to-br from-brand-dark/90 to-brand-primary/80 z-10"></div>
        
        <div className="relative z-20 p-12 text-white flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            {/* Ikon Brand (Opsional, bisa diganti logo PJN) */}
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <Zap className="text-brand-primary h-8 w-8" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
              Powerindo <br/> Jaya Nusantara
            </h2>
          </div>
          
          <div className="max-w-md">
            <h3 className="text-4xl font-bold mb-4 leading-tight">
              Control Center & <span className="text-brand-primary">Management System.</span>
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Akses aman untuk mengelola proyek, inventori, dan data operasional perusahaan.
            </p>
          </div>

          <div className="text-sm text-slate-400 font-medium">
            © {new Date().getFullYear()} PT. Powerindo Jaya Nusantara. All rights reserved.
          </div>
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-450px w-full">
          <div className="text-center lg:text-left mb-10">
            {/* Logo untuk tampilan mobile (muncul saat layar kecil) */}
            <div className="lg:hidden flex justify-center mb-6">
                <div className="p-3 bg-brand-primary/10 rounded-2xl">
                  <Zap className="text-brand-primary h-10 w-10" fill="currentColor" />
                </div>
            </div>
            <h1 className="text-4xl font-black text-brand-dark mb-3 tracking-tight">Selamat Datang.</h1>
            <p className="text-slate-500 text-lg">Silakan masuk dengan akun administrator Anda.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-dark ml-1 uppercase tracking-wider">Email Perusahaan</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@powerindo.co.id"
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-brand-dark shadow-sm shadow-slate-100/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-dark ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all font-medium text-brand-dark shadow-sm shadow-slate-100/50"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-linear-to-r from-brand-dark to-brand-primary text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center mt-8"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" /> Memproses...
                </div>
              ) : (
                'Masuk ke Control Center'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}