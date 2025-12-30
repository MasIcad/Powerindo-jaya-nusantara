'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    title: 'POWERING THE FUTURE',
    desc: 'Solusi infrastruktur digital terdepan untuk kemajuan industri global.'
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
    title: 'INNOVATION DRIVEN',
    desc: 'Menghadirkan teknologi terbaru dengan standar keamanan internasional.'
  }
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={slides[current].image} className="h-full w-full object-cover" alt="Hero" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-center max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6 italic tracking-tighter">
                {slides[current].title}
              </h1>
              <p className="text-xl text-slate-300 mb-10 max-w-xl leading-relaxed">
                {slides[current].desc}
              </p>
              <div className="flex gap-4">
                {/* PERBAIKAN DI SINI: Mengubah button menjadi tag <a> dengan href ke id about-section */}
                <a 
                  href="#about-section"
                  className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
                >
                  LEARN MORE <ArrowRight size={20} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <div 
            key={i}
            className={`h-1 transition-all duration-500 ${current === i ? 'w-12 bg-brand-primary' : 'w-6 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  )
}