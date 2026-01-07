import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";

// Konfigurasi Font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans", 
});

// Konfigurasi SEO & Metadata Powerindo Jaya Nusantara
export const metadata: Metadata = {
  title: "Powerindo Jaya Nusantara - Kontraktor & Distributor Alat Listrik",
  description: "Spesialis Mechanical Electrical Contractor, perakitan trafo, dan distributor resmi Schneider di Indonesia.",
  // Metadata keywords bisa tetap ada, tapi jangan terlalu berharap banyak di sini
  keywords: ["Mechanical Electrical", "Schneider Indonesia", "Trafo Trafindo"], 
  openGraph: {
    title: "Powerindo Jaya Nusantara | Kontraktor Listrik Terpercaya",
    description: "Solusi infrastruktur listrik dan mekanikal terpadu standar internasional.",
    url: "https://powerindojayanusantara.com/", 
    siteName: "Powerindo Jaya Nusantara",
    images: [
      {
        url: "https://powerindojayanusantara.com/Logo2.png", // Gunakan URL absolut
        width: 1200, // Ukuran standar OG
        height: 630,
        alt: "Logo Powerindo Jaya Nusantara",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Fungsi RootLayout Tunggal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${jakarta.className} antialiased`}>
        <SmoothScroll>
          <Navbar />
          <main>
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </SmoothScroll>

        {/* Integrasi Google Analytics */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}