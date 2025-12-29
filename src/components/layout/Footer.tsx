import { Mail, MapPin, Phone, Linkedin, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  // Data Sosial Media
  const socialLinks = [
    { 
      Icon: Facebook, 
      href: "https://www.facebook.com/Powerindoo/" 
    },
    { 
      // Ikon TikTok Kustom (karena tidak ada di Lucide dasar)
      Icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ), 
      href: "https://www.tiktok.com/@powerindojayanusantara?_r=1&_t=ZS-92d6L5GgFIi" 
    },
    // Anda bisa menambahkan Instagram/Linkedin di sini jika diperlukan nanti
  ];

  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-20">
          
          {/* Kolom 1: Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter italic">
              POWERINDO<span className="text-brand-primary">JAYA NUSANTARA</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Leading the digital frontier with robust infrastructure and innovative enterprise solutions.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              {['Home', 'About', 'Katalog', 'Insight', 'Contact'].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Contact Info */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm">Contact Us</h4>
            <ul className="space-y-6 text-slate-400 text-sm">
              <li className="flex gap-4">
                <MapPin className="text-brand-primary shrink-0" size={20} />
                <span>Kawasan Industri Terpadu, Indonesia</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-brand-primary shrink-0" size={20} />
                <div className="flex flex-col">
                  <span>+6281252505111</span>
                  <span>+6282245616400</span>
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

          {/* Kolom 4: Newsletter */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm">Stay Updated</h4>
            <p className="text-slate-400 mb-6 text-sm">Subscribe to our monthly corporate insights.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="bg-white/5 border border-white/10 px-5 py-3 rounded-full text-sm focus:outline-none focus:border-brand-primary" 
              />
              <button className="bg-brand-primary text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-all text-sm">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-slate-500 text-xs sm:text-sm">
          <p>© 2025 PT Powerindo Jaya Nusantara. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}