import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/login/', // Melarang Google mengindeks halaman dashboard admin Anda
    },
    sitemap: 'https://powerindojayanusantara.com/sitemap.xml',
  }
}