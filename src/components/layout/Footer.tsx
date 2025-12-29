import { Mail, MapPin, Phone, Linkedin, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Kolom 1: Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter italic">
              VISI<span className="text-brand-primary">TEC</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Leading the digital frontier with robust infrastructure and innovative enterprise solutions.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-4 text-slate-400">
              {['Home', 'About Us', 'Business Units', 'Insights', 'Contact'].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Contact Info */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm">Contact Us</h4>
            <ul className="space-y-6 text-slate-400">
              <li className="flex gap-4">
                <MapPin className="text-brand-primary shrink-0" />
                <span>Kawasan Industri Terpadu, Jakarta, Indonesia</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-brand-primary shrink-0" />
                <span>+62 21 555 0123</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-brand-primary shrink-0" />
                <span>contact@powerindojayanusantara.co.id</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Newsletter */}
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-sm">Stay Updated</h4>
            <p className="text-slate-400 mb-6 text-sm">Subscribe to our monthly corporate insights.</p>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="Your Email" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full focus:outline-none focus:border-brand-primary" />
              <button className="bg-brand-primary text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-all">SUBSCRIBE</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-slate-500 text-sm">
          <p>© 2025 PT Visitec Digital Infrastruktur. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}