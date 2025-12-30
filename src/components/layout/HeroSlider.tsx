'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920',
    title: 'POWERING THE FUTURE',
    desc: 'Solusi infrastruktur listrik terpercaya untuk mendukung pertumbuhan industri nasional.'
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920',
    title: 'INNOVATION DRIVEN',
    desc: 'Menghadirkan teknologi terbaru dengan standar keamanan dan efisiensi internasional.'
  },
  {
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1920', // Contoh: Foto trafo/listrik
    title: 'ROBUST INFRASTRUCTURE',
    desc: 'Membangun fondasi energi yang kuat dan tahan lama untuk kebutuhan masa depan.'
  },
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920', // Contoh: Foto teknologi digital
    title: 'DIGITAL TRANSFORMATION',
    desc: 'Integrasi sistem pintar untuk operasional yang lebih cerdas dan terintegrasi.'
  }
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000) // Durasi ditingkatkan ke 6 detik agar pengunjung sempat membaca
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.5, scale: 1 }} // Opacity 0.5 agar teks putih lebih menonjol
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={slides[current].image} 
            className="h-full w-full object-cover" 
            alt={`Hero Slide ${current + 1}`} 
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-center max-w-7xl mx-auto px-6">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-8 italic tracking-tighter">
                {slides[current].title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl leading-relaxed">
                {slides[current].desc}
              </p>
              <div className="flex gap-4">
                <a 
                  href="#about-section"
                  className="px-10 py-5 bg-brand-primary text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-3 cursor-pointer shadow-2xl"
                >
                  LEARN MORE <ArrowRight size={22} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Slide Indicators - Otomatis menyesuaikan jumlah foto */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              current === i ? 'w-16 bg-brand-primary' : 'w-8 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Overlay gradien gelap di bawah agar menyatu dengan section berikutnya */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent z-0 pointer-events-none" />
    </div>
  )
}