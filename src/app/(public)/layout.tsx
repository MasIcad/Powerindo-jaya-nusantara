import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar"; // Pastikan path ini benar

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans", // Harus sama dengan di globals.css
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${jakarta.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}