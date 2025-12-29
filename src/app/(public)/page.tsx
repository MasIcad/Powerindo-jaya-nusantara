// 1. Tetap memaksa data selalu diperbarui
export const dynamic = 'force-dynamic'

// Perbaikan path import sesuai struktur folder
import { supabase } from '@/lib/supabase' 
import HeroSlider from '@/components/layout/HeroSlider'
import Reveal from '@/components/layout/Reveal'
import { MessageCircle, Phone } from 'lucide-react' // Import icon tambahan

export default async function HomePage() {
  // 2. Fetch data Gallery
  const { data: galleryItems } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <main className="bg-white relative">
      <HeroSlider />

      {/* Section About Overview */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl" />
                <h2 className="text-sm font-bold text-brand-primary uppercase tracking-[0.4em] mb-8">
                  About Powerindo Jaya Nusantara
                </h2>
                <p className="text-4xl md:text-6xl font-light text-brand-dark leading-[1.1]">
                  Leading the way in <span className="font-bold">Digital Transformation</span> and Infrastructure.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-slate-600 leading-relaxed">
                  Kami bukan sekadar penyedia layanan teknologi. Powerindo Jaya Nusantara adalah mitra strategis yang membantu perusahaan besar mengintegrasikan solusi digital paling mutakhir.
                </p>
                <div className="pt-6">
                  <button className="text-brand-dark font-bold border-b-2 border-brand-primary pb-2 hover:text-brand-primary transition-all">
                    OUR HISTORY →
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section Expertise - UPDATE: Deskripsi spesifik untuk tiap layanan */}
      <section className="bg-slate-50 py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-sm font-bold text-brand-primary uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                  Integrated Solutions for High-Scale Enterprise.
                </h3>
              </div>
              <button className="px-8 py-4 border-2 border-brand-dark text-brand-dark font-bold rounded-full hover:bg-brand-dark hover:text-white transition-all">
                VIEW ALL SERVICES
              </button>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Mechanical Electrical Contractor', 
                icon: '01',
                desc: 'Layanan instalasi, pemeliharaan, dan integrasi sistem mekanikal elektrikal skala industri yang presisi, aman, dan memenuhi standar internasional.'
              },
              { 
                title: 'Supplier', 
                icon: '02',
                desc: 'Penyedia komponen elektrikal dan infrastruktur digital berkualitas tinggi dari brand ternama untuk menjamin keandalan operasional bisnis Anda.'
              },
              { 
                title: 'Distributor', 
                icon: '03',
                desc: 'Distributor resmi perangkat teknologi dan sistem otomasi terintegrasi yang memastikan rantai pasok dan distribusi proyek Anda berjalan tanpa hambatan.'
              }
            ].map((item, i) => (
              <Reveal key={i}>
                <div className="group relative bg-white p-12 rounded-4xl border border-slate-200 transition-all duration-500 hover:-translate-y-4">
                  <div className="absolute inset-0 bg-brand-dark scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 rounded-4xl z-0" />
                  <div className="relative z-10">
                    <div className="text-4xl font-black text-slate-100 group-hover:text-white/10 transition-colors mb-8">
                      {item.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-brand-dark group-hover:text-white mb-4 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-[0.4em] mb-4">Gallery</h2>
          <h3 className="text-4xl font-bold italic uppercase tracking-tighter">Our Work In Action</h3>
        </div>
        
        <div className="flex gap-6 overflow-x-auto px-6 md:px-[calc((100vw-1280px)/2)] scrollbar-hide snap-x snap-mandatory pb-10">
          {galleryItems && galleryItems.length > 0 ? (
            galleryItems.map((item) => (
              <div 
                key={item.id} 
                className="shrink-0 w-[85vw] md:w-112.5 snap-center"
              >
                <Reveal>
                  <div className="group relative aspect-4/3 overflow-hidden rounded-3xl border border-white/10">
                    <img 
                      src={item.image_url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={item.title || "Powerindo Jaya Nusantara Project"} 
                    />
                    <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center">
                       <p className="font-bold text-lg uppercase tracking-widest">{item.title}</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))
          ) : (
            <div className="w-full px-6 italic text-slate-500">No gallery items yet.</div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-slate-500 mt-4 tracking-widest">SCROLL TO EXPLORE →</p>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-8 right-8 z-100 flex flex-col items-end group">
        <div className="flex flex-col gap-3 mb-4 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
          <a 
            href="https://wa.me/6281252505111" 
            target="_blank" 
            className="bg-white text-brand-dark px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors font-bold text-sm"
          >
            <div className="bg-green-500 p-1.5 rounded-lg text-white">
              <Phone size={14} />
            </div>
            Customer Service 1
          </a>
          <a 
            href="https://wa.me/6282245616400" 
            target="_blank" 
            className="bg-white text-brand-dark px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors font-bold text-sm"
          >
            <div className="bg-green-500 p-1.5 rounded-lg text-white">
              <Phone size={14} />
            </div>
            Customer Service 2
          </a>
        </div>

        <button className="bg-green-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300">
          <MessageCircle size={32} fill="currentColor" />
        </button>
      </div>
    </main>
  );
}