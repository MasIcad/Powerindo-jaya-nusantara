'use client'

export default function Navbar() {
  return (
    <nav 
      // Variabel ini tetap diatur oleh AnnouncementBar.tsx
      style={{ top: 'var(--announcement-height, 0px)' }}
      className="sticky z-50 border-b bg-white/70 backdrop-blur-md transition-all duration-300"
    >
      {/* - h-16 ditingkatkan ke h-20 (80px) agar lebih lega 
          - px-6 tetap untuk margin samping
      */}
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        
        {/* Bagian Brand: Logo + Teks */}
        <a href="/" className="flex items-center gap-4 group">
          <img 
            src="/Logo2.png" 
            alt="Logo Powerindo Jaya Nusantara" 
            // Ukuran logo ditingkatkan dari h-10 ke h-12
            className="h-16 w-auto object-contain mix-blend-multiply" 
          />
          {/* Ukuran teks ditingkatkan dari text-xl ke text-2xl */}
          <span className="text-2xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors tracking-tight">
            Powerindo Jaya Nusantara
          </span>
        </a>

        {/* Navigasi Link */}
        {/* - gap-8 ditingkatkan ke gap-10 agar jarak antar menu lebih luas
            - text-sm ditingkatkan ke text-base (ukuran standar yang lebih enak dibaca)
        */}
        <div className="hidden md:flex gap-10 text-base font-semibold text-brand-dark">
          <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
          <a href="/products" className="hover:text-brand-primary transition-colors">Catalog</a>
          <a href="/blog" className="hover:text-brand-primary transition-colors">Insights</a>
          <a href="/gallery" className="hover:text-brand-primary transition-colors">Gallery</a>
          <a href="/contact" className="hover:text-brand-primary transition-colors">Contact Us</a>
        </div>
      </div>
    </nav>
  );
}