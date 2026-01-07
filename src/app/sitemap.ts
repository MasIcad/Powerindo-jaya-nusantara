import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://powerindojayanusantara.com'

  // 1. Ambil semua ID produk dari Supabase untuk Sitemap Dinamis
  const { data: products } = await supabase
    .from('products')
    .select('id, created_at')

  const productEntries = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7, // Prioritas cukup tinggi untuk produk
  }))

  // 2. Daftar Halaman Statis
  const routes = [
    '',
    '/about',
    '/products',
    '/reviews',
    '/blog',
    '/gallery',
    '/contact',
  ]

  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8, // Home priority paling tinggi (1.0)
  }))

  return [...staticEntries, ...productEntries]
}