'use client'

import { useState } from 'react'
import { Maximize2, X } from 'lucide-react'

export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Tampilan Gambar di Halaman (Tetap Square agar rapi) */}
      <div 
        className="relative group cursor-pointer rounded-4xl overflow-hidden border border-slate-100 shadow-2xl aspect-square bg-slate-50"
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="bg-white/90 p-4 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                <Maximize2 className="text-brand-primary" size={24} />
            </div>
        </div>
      </div>

      {/* MODAL FULL SCREEN (Tanpa Crop) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
            onClick={() => setIsOpen(false)}
          >
            <X size={40} />
          </button>
          
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
          />
          
          <div className="absolute bottom-8 text-white/40 text-sm font-medium tracking-widest uppercase">
            Click anywhere to close
          </div>
        </div>
      )}
    </>
  )
}