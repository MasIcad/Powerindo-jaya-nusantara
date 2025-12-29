import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans", 
});

// TAMBAHKAN KODE METADATA INI
export const metadata: Metadata = {
  title: "Powerindo Jaya Nusantara - Produk Lengap, Harga Terbaik",
  description: "Kami perusahaan mechanical Electrical, yang memproduksi, merakit, distributor dan jasa engineering peralatan listrik",
  keywords: ["Powerindojayanusantara", "Teknologi", "Mechanical", "Electrical", "Contractor", "Supplier", "Distributor" ],
  authors: [{ name: "Powerindo Jaya Nusantara Team" }],
  openGraph: {
    title: "Powerino Jaya Nusantara",
    description: "Kami perusahaan mechanical Electrical, yang memproduksi, merakit, distributor dan jasa engineering peralatan listrik",
    url: "https://visitec.vercel.app", // Ganti dengan domain asli jika sudah ada
    siteName: "Powerindo Jaya Nusantara",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${jakarta.className} antialiased`}>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}