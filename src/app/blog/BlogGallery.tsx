'use client'

import { useState } from 'react'
import { X, Maximize2 } from 'lucide-react'

export default function BlogGallery({ images }: { images: string[] }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <div className="mt-20 pt-20 border-t border-slate-100">
      <h3 className="text-3xl font-black text-brand-dark italic uppercase tracking-tighter mb-10">
        Dokumentasi Terkait
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="rounded-3xl overflow-hidden border border-slate-100 shadow-xl aspect-video group bg-slate-50 cursor-pointer relative"
            onClick={() => setSelectedImg(img)}
          >
            <img 
              src={img} 
              alt={`Documentation ${index}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            {/* Overlay Hover */}
            <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30">
                  <Maximize2 size={24} />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FULL SCREEN --- */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          {/* Tombol Close */}
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-all hover:rotate-90 duration-300 z-110"
            onClick={() => setSelectedImg(null)}
          >
            <X size={48} />
          </button>

          {/* Gambar Full Size */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImg} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-500" 
              alt="Full Size Documentation" 
              onClick={(e) => e.stopPropagation()} // Stop closing when clicking the image
            />
          </div>
          
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em] mt-8">
            Powerindo Jaya Nusantara Documentation
          </p>
        </div>
      )}
    </div>
  );
}