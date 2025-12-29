export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Bagian Brand: Logo + Teks */}
        <a href="/" className="flex items-center gap-3 group">
          {/* Gambar Logo */}
          <img 
            src="my-corp-blog/Asset/Logo.jpeg" 
            alt="Logo Powerindo Jaya Nusantara" 
            className="h-10 w-auto object-contain" // Mengatur tinggi agar proporsional di navbar
          />
          <span className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
            Powerindo Jaya Nusantara
          </span>
        </a>

        {/* Navigasi Link */}
        <div className="flex gap-6 text-sm font-medium">
          <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
          <a href="/products" className="hover:text-brand-primary transition-colors">Katalog</a>
          <a href="/blog" className="hover:text-brand-primary transition-colors">Insights</a>
        </div>
      </div>
    </nav>
  );
}