'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Katalog', href: '/products' },
    { name: 'Review', href: '/reviews' },
    { name: 'Insights', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact Us', href: '/contact' },
  ]

  return (
    <nav 
      style={{ top: 'var(--announcement-height, 0px)' }}
      className="sticky z-50 border-b bg-white/70 backdrop-blur-md transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo Section */}
        <a href="/" className="flex items-center gap-4 group shrink-0">
          <img 
            src="/Logo2.png" 
            alt="Logo PJN" 
            className="h-12 w-auto object-contain mix-blend-multiply" 
          />
          <span className="text-xl md:text-2xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors tracking-tight">
            Powerindo Jaya Nusantara
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 text-base font-semibold text-brand-dark">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-brand-primary transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden p-2 text-brand-dark hover:bg-slate-100 rounded-xl transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-bold text-brand-dark hover:text-brand-primary flex justify-between items-center group"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  <div className="w-2 h-2 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}