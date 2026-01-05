'use client' 

import { Mail, MapPin, Phone, Facebook, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const socialLinks = [
    { 
      Icon: Facebook, 
      href: "https://www.facebook.com/Powerindoo/" 
    },
    { 
      Icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ), 
      href: "https://www.tiktok.com/@powerindojayanusantara?_r=1&_t=ZS-92d6L5GgFIi" 
    },
  ];

  return (
    <footer className="bg-brand-dark text-white pt-20 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-20">
          
          {/* Column 1: Brand Intro */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter italic">
              POWERINDO<span className="text-[#2DC653]">JAYA NUSANTARA</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Leading the digital frontier with robust infrastructure and innovative enterprise solutions for a better industrial future.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors text-white"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm text-brand-primary">Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><Link href="/" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /> Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /> About Us</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /> Products</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /> News</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" /> Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm text-brand-primary">Contact Us</h4>
            <ul className="space-y-6 text-slate-400 text-sm">
              <li className="flex gap-4">
                <MapPin className="text-brand-primary shrink-0" size={20} />
                <span className="leading-relaxed">Kawasan Industri Terpadu, <br/>Jawa Timur, Indonesia</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-brand-primary shrink-0" size={20} />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold">+62 812 5250 5111</span>
                  <span>+62 822 4561 6400</span>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="text-brand-primary shrink-0" size={20} />
                <span className="break-all leading-tight">
                  powerindo1230@gmail.com
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Support / CTA (Replacement for Subscribe) */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <h4 className="font-bold mb-4 uppercase tracking-widest text-sm text-brand-primary">Official Support</h4>
            <p className="text-slate-400 mb-6 text-xs leading-relaxed">
              Butuh konsultasi teknis atau penawaran harga cepat? Hubungi tim ahli kami sekarang.
            </p>
            <a 
              href="https://wa.me/6281252505111" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#2DC653] hover:bg-[#1A7431] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-900/20 text-[10px] tracking-widest uppercase w-full"
            >
              <MessageCircle size={18} fill="currentColor" />
              Chat WhatsApp
            </a>
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Office Hours:</p>
              <p className="text-[10px] text-slate-400">Senin - Sabtu: 08.00 - 17.00 WIB</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-slate-500 text-xs sm:text-sm">
          <p>© 2026 PT Powerindo Jaya Nusantara. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/legal" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}